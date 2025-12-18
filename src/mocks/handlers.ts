import { http, HttpResponse, delay } from 'msw'

const apps = [
    { id: 'app-1', name: 'SuperTokens Golang', status: 'healthy', icon: 'golang' },
    { id: 'app-2', name: 'Postgres Cluster', status: 'healthy', icon: 'db' },
    { id: 'app-3', name: 'Redis Cache', status: 'degraded', icon: 'redis' },
]

const graphs: Record<string, { nodes: unknown[]; edges: unknown[] }> = {
    'app-1': {
        nodes: [
            { id: '1', type: 'service', position: { x: 50, y: 50 }, data: { label: 'Auth Service', status: 'healthy', cpu: 12, memory: 512, nodeType: 'service' } },
            { id: '2', type: 'service', position: { x: 300, y: 150 }, data: { label: 'User API', status: 'healthy', cpu: 45, memory: 256, nodeType: 'service' } },
            { id: '3', type: 'service', position: { x: 150, y: 300 }, data: { label: 'Audit Log', status: 'degraded', cpu: 88, memory: 1024, nodeType: 'service' } },
            { id: '4', type: 'service', position: { x: 500, y: 50 }, data: { label: 'Notification', status: 'healthy', cpu: 5, memory: 128, nodeType: 'service' } },
        ],
        edges: [
            { id: 'e1-2', source: '1', target: '2', animated: true },
            { id: 'e2-3', source: '2', target: '3' },
            { id: 'e2-4', source: '2', target: '4', animated: true },
        ]
    },
    'app-2': {
        nodes: [
            { id: 'a', type: 'database', position: { x: 100, y: 100 }, data: { label: 'Primary DB', status: 'healthy', cpu: 60, memory: 4096, nodeType: 'database' } },
            { id: 'b', type: 'database', position: { x: 400, y: 100 }, data: { label: 'Replica 1', status: 'healthy', cpu: 20, memory: 2048, nodeType: 'database' } },
            { id: 'c', type: 'database', position: { x: 400, y: 300 }, data: { label: 'Replica 2', status: 'healthy', cpu: 22, memory: 2048, nodeType: 'database' } },
        ],
        edges: [
            { id: 'ea-b', source: 'a', target: 'b', animated: true },
            { id: 'ea-c', source: 'a', target: 'c', animated: true },
        ]
    },
    'app-3': {
        nodes: [
            { id: 'r1', type: 'database', position: { x: 250, y: 250 }, data: { label: 'Redis Master', status: 'degraded', cpu: 95, memory: 64, nodeType: 'database' } }
        ],
        edges: []
    }
}

export const handlers = [
    http.get('/api/apps', async () => {
        await delay(300)
        return HttpResponse.json(apps)
    }),
    http.get('/api/apps/:appId/graph', async ({ params }) => {
        await delay(500)
        const { appId } = params
        const graph = graphs[appId as string]

        if (!graph) {
            // Fallback or empty
            return HttpResponse.json({ nodes: [], edges: [] })
        }

        return HttpResponse.json(graph)
    }),
]
