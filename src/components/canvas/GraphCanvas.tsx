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
import { useAppStore } from '@/store/useAppStore'
import { Loader2 } from 'lucide-react'

const nodeTypes = {
    service: ServiceNode,
}

export function GraphCanvas() {
    const { selectedAppId, selectNode } = useAppStore()
    const { fitView } = useReactFlow()

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

            if (e.key.toLowerCase() === 'f') {
                e.preventDefault()
                fitView({ duration: 400, padding: 0.2 })
            }
        }

        window.addEventListener('keydown', handleKeyDown)
        return () => window.removeEventListener('keydown', handleKeyDown)
    }, [fitView])

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
                <Controls />
                <MiniMap zoomable pannable className="!bg-background !border-border" />
            </ReactFlow>
        </div>
    )
}
