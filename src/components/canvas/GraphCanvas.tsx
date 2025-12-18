import { useCallback, useEffect, useRef } from 'react'
import {
    ReactFlow,
    Background,
    Controls,
    MiniMap,
    useNodesState,
    useEdgesState,
    addEdge,
    type Connection,
    BackgroundVariant,
    type Node,
    useReactFlow,
    type Viewport,
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import { useQuery } from '@tanstack/react-query'
import { ServiceNode } from './ServiceNode'
import { DatabaseNode } from './DatabaseNode'
import { useAppStore } from '@/store/useAppStore'
import { Loader2 } from 'lucide-react'
import { saveFlowData, loadFlowData } from '@/lib/flowPersistence'

const nodeTypes = {
    service: ServiceNode,
    database: DatabaseNode,
}

export function GraphCanvas() {
    const selectedAppId = useAppStore((state) => state.selectedAppId)
    const selectNode = useAppStore((state) => state.selectNode)
    const selectedNodeId = useAppStore((state) => state.selectedNodeId)
    const { fitView, setViewport, getViewport } = useReactFlow()

    const [nodes, setNodes, onNodesChange] = useNodesState([])
    const [edges, setEdges, onEdgesChange] = useEdgesState([])

    // Track if we've loaded data for the current app to prevent race conditions
    const loadedAppIdRef = useRef<string | null>(null)

    const { data, isLoading, isError } = useQuery({
        queryKey: ['graph', selectedAppId],
        queryFn: async () => {
            if (!selectedAppId) return { nodes: [], edges: [] }
            const res = await fetch(`/api/apps/${selectedAppId}/graph`)
            if (!res.ok) throw new Error('Failed to fetch graph')
            return res.json()
        },
        enabled: !!selectedAppId
    })

    // Load persisted data or fallback to API data
    useEffect(() => {
        if (!selectedAppId) return

        // Mark that we're transitioning and haven't loaded data yet
        loadedAppIdRef.current = null

        const persisted = loadFlowData(selectedAppId)

        // VALIDATION: Only use persisted data if it's valid and belongs to this app
        if (persisted &&
            persisted.appId === selectedAppId &&
            persisted.nodes &&
            persisted.nodes.length > 0) {

            console.log(`Loading persisted data for app: ${selectedAppId}`, persisted.nodes.length, 'nodes')

            // Load from localStorage
            setNodes(persisted.nodes as never[] || [])
            setEdges(persisted.edges as never[] || [])
            if (persisted.viewport) {
                setViewport(persisted.viewport, { duration: 0 })
            }

            // Mark as loaded
            loadedAppIdRef.current = selectedAppId
        } else if (data) {
            console.log(`Loading fresh API data for app: ${selectedAppId}`, data.nodes?.length || 0, 'nodes')

            // Fallback to API data for first time or if persisted data is invalid
            setNodes(data.nodes as never[] || [])
            setEdges(data.edges as never[] || [])

            // Mark as loaded
            loadedAppIdRef.current = selectedAppId
        }
    }, [selectedAppId, data, setNodes, setEdges, setViewport])

    // Persist nodes, edges, and viewport whenever they change
    // BUT ONLY if we've successfully loaded data for this app
    useEffect(() => {
        // CRITICAL: Don't save if we haven't loaded data yet or app doesn't match
        if (!selectedAppId || nodes.length === 0 || loadedAppIdRef.current !== selectedAppId) {
            return
        }

        const viewport = getViewport()
        saveFlowData(selectedAppId, { nodes, edges, viewport })
    }, [nodes, edges, selectedAppId, getViewport])

    // Keyboard Shortcuts
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.target as HTMLElement).tagName === 'INPUT' || (e.target as HTMLElement).tagName === 'TEXTAREA') return

            // F - Fit view
            if (e.key.toLowerCase() === 'f') {
                e.preventDefault()
                fitView({ duration: 400, padding: 0.2 })
            }

            // I or Escape - Close inspector panel if open
            if ((e.key.toLowerCase() === 'i' || e.key === 'Escape') && selectedNodeId) {
                e.preventDefault()
                selectNode(null)
            }

            // Ctrl+Shift+C - Clear cache for current app (debug feature)
            if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'c' && selectedAppId) {
                e.preventDefault()
                const key = `ainyx_flow_${selectedAppId}`
                localStorage.removeItem(key)
                console.log(`Cleared cache for app: ${selectedAppId}`)
                // Reload from API
                if (data) {
                    setNodes(data.nodes as never[] || [])
                    setEdges(data.edges as never[] || [])
                }
            }
        }

        window.addEventListener('keydown', handleKeyDown)
        return () => window.removeEventListener('keydown', handleKeyDown)
    }, [fitView, selectNode, selectedNodeId, selectedAppId, data, setNodes, setEdges])

    const onConnect = useCallback(
        (params: Connection) => setEdges((eds) => addEdge(params, eds)),
        [setEdges],
    )

    const handleNodeClick = (_: React.MouseEvent, node: Node) => {
        selectNode(node.id)
    }

    const handlePaneClick = () => {
        selectNode(null)
    }

    // Handle viewport changes (zoom, pan) to persist them
    const onMove = useCallback((_event: unknown, viewport: Viewport) => {
        if (selectedAppId) {
            saveFlowData(selectedAppId, { nodes, edges, viewport })
        }
    }, [selectedAppId, nodes, edges])

    if (!selectedAppId) {
        return <div className="flex h-full items-center justify-center text-muted-foreground bg-muted/5 border-2 border-dashed m-4 rounded-xl">
            Select an app from the sidebar to view its architecture.
        </div>
    }

    if (isLoading) {
        return <div className="flex h-full items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
    }

    if (isError) {
        return <div className="flex h-full items-center justify-center text-destructive">Failed to load graph data.</div>
    }

    return (
        <div className="h-full w-full bg-background">
            <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                onNodeClick={handleNodeClick}
                onPaneClick={handlePaneClick}
                onMove={onMove}
                nodeTypes={nodeTypes}
                fitView
                deleteKeyCode={['Backspace', 'Delete']}
                className="bg-muted/5"
            >
                <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
                <Controls
                    className="!bg-card/95 !backdrop-blur-sm !border !border-border !shadow-lg [&>button]:!bg-background [&>button]:!border-border [&>button]:!text-foreground [&>button:hover]:!bg-muted"
                />
                <MiniMap
                    zoomable
                    pannable
                    nodeStrokeColor="#8b5cf6"
                    nodeColor="#1e1e2e"
                    nodeBorderRadius={6}
                    maskColor="rgba(0, 0, 0, 0.6)"
                    className="!bg-background/95 !backdrop-blur-sm !border !border-border !shadow-lg !rounded-lg !w-[120px] !h-[100px] md:!w-[180px] md:!h-[150px] !bottom-2 !right-2 md:!bottom-4 md:!right-4 !flex !items-center !justify-center [&>svg]:!max-w-full [&>svg]:!max-h-full [&>svg]:!w-auto [&>svg]:!h-auto"
                />
            </ReactFlow>
        </div>
    )
}
