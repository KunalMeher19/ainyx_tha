import { useQuery } from '@tanstack/react-query'
import { useAppStore } from '@/store/useAppStore'
import { cn } from '@/lib/utils'
import { Input } from '@/components/ui/input'
import { Loader2, Search, ChevronRight, Database, Box, Layers, Code2 } from 'lucide-react'

// App interface
interface App {
    id: string
    name: string
    status: string
    icon?: string
}

// Icon mapper
const getIcon = (iconName?: string) => {
    switch (iconName) {
        case 'golang': return Code2
        case 'db': return Database
        case 'redis': return Layers
        default: return Box
    }
}

export function AppSelector() {
    const { selectedAppId, selectApp } = useAppStore()

    const { data: apps, isLoading } = useQuery<App[]>({
        queryKey: ['apps'],
        queryFn: async () => {
            const res = await fetch('/api/apps')
            if (!res.ok) throw new Error('Failed to fetch apps')
            return res.json()
        }
    })

    return (
        <div className="flex flex-col gap-3 p-4 border-b">
            <div>
                <h2 className="text-lg font-semibold tracking-tight">Applications</h2>
                <p className="text-sm text-muted-foreground">Select an app to view its graph</p>
            </div>

            <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search apps..." className="pl-8 h-9 bg-muted/50" />
            </div>

            <div className="flex flex-col gap-2 max-h-[300px] overflow-y-auto">
                {isLoading ? (
                    <div className="flex justify-center p-4"><Loader2 className="animate-spin text-muted-foreground" /></div>
                ) : (
                    apps?.map((app) => {
                        const Icon = getIcon(app.icon)
                        return (
                            <button
                                key={app.id}
                                onClick={() => selectApp(app.id)}
                                className={cn(
                                    "flex items-center gap-3 p-3 rounded-lg hover:bg-muted/70 transition-colors text-left border",
                                    selectedAppId === app.id
                                        ? "bg-primary/10 border-primary/50 text-primary"
                                        : "border-transparent text-muted-foreground"
                                )}
                            >
                                <div className={cn(
                                    "h-9 w-9 rounded-md flex items-center justify-center shrink-0",
                                    selectedAppId === app.id ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                                )}>
                                    <Icon className="h-4 w-4" />
                                </div>
                                <div className="flex-1 truncate text-sm font-medium">
                                    {app.name}
                                </div>
                                <ChevronRight className="h-4 w-4 opacity-50 shrink-0" />
                            </button>
                        )
                    })
                )}
            </div>
        </div>
    )
}
