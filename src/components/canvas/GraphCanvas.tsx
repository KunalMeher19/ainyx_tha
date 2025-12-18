import { useCallback, useEffect } from 'react'
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
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import { useQuery } from '@tanstack/react-query'
import { ServiceNode } from './ServiceNode'
import { DatabaseNode } from './DatabaseNode'
import { useAppStore } from '@/store/useAppStore'
import { Loader2, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'

const nodeTypes = {
    service: ServiceNode,
    database: DatabaseNode,
}

export function GraphCanvas() {
    const selectedAppId = useAppStore((state) => state.selectedAppId)
    const selectNode = useAppStore((state) => state.selectNode)
    const selectedNodeId = useAppStore((state) => state.selectedNodeId)
    const { fitView, screenToFlowPosition } = useReactFlow()

    const [nodes, setNodes, onNodesChange] = useNodesState([])
    const [edges, setEdges, onEdgesChange] = useEdgesState([])

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

    // Sync Data
    useEffect(() => {
        if (data) {
            setNodes(data.nodes || [])
            setEdges(data.edges || [])
        }
    }, [data, setNodes, setEdges])

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
        }

        window.addEventListener('keydown', handleKeyDown)
        return () => window.removeEventListener('keydown', handleKeyDown)
    }, [fitView, selectNode, selectedNodeId])

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

    const handleAddNode = () => {
        // Get viewport center position
        const centerX = window.innerWidth / 2
        const centerY = window.innerHeight / 2
        const position = screenToFlowPosition({ x: centerX, y: centerY })

        // Create new node with unique ID
        const newNodeId = `node-${Date.now()}`
        const newNode: Node = {
            id: newNodeId,
            type: 'service',
            position,
            data: {
                label: 'New Service',
                status: 'healthy' as const,
                cpu: 10,
                memory: 512,
                nodeType: 'service'
            }
        }

        setNodes((nds) => [...nds, newNode as never])
        selectNode(newNodeId) // Auto-select the new node
    }

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
                nodeTypes={nodeTypes}
                fitView
                deleteKeyCode={['Backspace', 'Delete']}
                className="bg-muted/5"
            >
                <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
                <Controls
                    className="!bg-card/95 !backdrop-blur-sm !border !border-border !shadow-lg [&>button]:!bg-background [&>button]:!border-border [&>button]:!text-foreground [&>button:hover]:!bg-muted"
                />

                {/* Add Node Button */}
                <div className="absolute bottom-4 left-4 z-10">
                    <Button
                        onClick={handleAddNode}
                        className="h-10 gap-2 bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg"
                    >
                        <Plus className="h-4 w-4" />
                        <span className="hidden sm:inline">Add Node</span>
                    </Button>
                </div>

                {/* Keyboard Shortcuts Hint */}
                <div className="absolute top-4 left-4 z-10 bg-card/80 backdrop-blur-sm border border-border rounded-lg px-2.5 py-1.5 text-[10px] text-muted-foreground shadow-md hidden md:block">
                    <div className="font-semibold text-foreground mb-0.5">Shortcuts:</div>
                    <div className="space-y-0.5">
                        <div><kbd className="px-1 py-0.5 bg-muted rounded text-[9px] font-mono">F</kbd> Fit View</div>
                        <div><kbd className="px-1 py-0.5 bg-muted rounded text-[9px] font-mono">I</kbd> <kbd className="px-1 py-0.5 bg-muted rounded text-[9px] font-mono">Esc</kbd> Close Inspector</div>
                    </div>
                </div>
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
