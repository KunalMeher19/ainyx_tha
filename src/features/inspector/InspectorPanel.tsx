import { useQuery } from '@tanstack/react-query'
import { useAppStore } from '@/store/useAppStore'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { InspectorControls } from './InspectorControls'
import { Loader2 } from 'lucide-react'

interface App {
    id: string
    name: string
    status: string
}

export function InspectorPanel() {
    const { selectedAppId, selectedNodeId, selectApp } = useAppStore()

    const { data: apps, isLoading, isError } = useQuery<App[]>({
        queryKey: ['apps'],
        queryFn: async () => {
            const res = await fetch('/api/apps')
            if (!res.ok) throw new Error('Failed to fetch apps')
            return res.json()
        }
    })

    if (selectedNodeId) {
        return <InspectorControls key={selectedNodeId} />
    }

    return (
        <div className="flex h-full flex-col gap-4 p-4">
            <div>
                <h2 className="text-lg font-semibold tracking-tight">Applications</h2>
                <p className="text-sm text-muted-foreground">Select an app to view its graph.</p>
            </div>

            {isLoading && <div className="flex justify-center p-4"><Loader2 className="animate-spin text-muted-foreground" /></div>}

            {isError && <div className="p-4 text-center text-sm text-destructive">Failed to load apps.</div>}

            <div className="flex flex-col gap-3">
                {apps?.map((app) => (
                    <Card
                        key={app.id}
                        className={cn(
                            "cursor-pointer p-4 hover:bg-muted/50 transition-all flex items-center justify-between",
                            selectedAppId === app.id && "border-primary ring-1 ring-primary"
                        )}
                        onClick={() => selectApp(app.id)}
                    >
                        <div className="flex flex-col gap-1">
                            <span className="font-semibold">{app.name}</span>
                            <span className="text-xs text-muted-foreground font-mono">{app.id}</span>
                        </div>
                        <Badge variant={app.status === 'healthy' ? 'default' : 'destructive'} className={cn(app.status === 'healthy' && "bg-emerald-500 hover:bg-emerald-600")}>
                            {app.status}
                        </Badge>
                    </Card>
                ))}
            </div>
        </div>
    )
}
