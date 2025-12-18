import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useAppStore } from '@/store/useAppStore'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { Loader2, Search, ChevronRight, MoreHorizontal, Database, Box, Layers, Code2 } from 'lucide-react'

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
    const [isOpen, setIsOpen] = useState(true)

    const { data: apps, isLoading } = useQuery<App[]>({
        queryKey: ['apps'],
        queryFn: async () => {
            const res = await fetch('/api/apps')
            if (!res.ok) throw new Error('Failed to fetch apps')
            return res.json()
        }
    })

    const selectedApp = apps?.find(a => a.id === selectedAppId)

    return (
        <div className="absolute top-4 left-4 z-50 flex flex-col gap-2 w-[300px] animate-in slide-in-from-left-4 fade-in duration-500">
            {/* Header / Toggle */}
            <div className="flex items-center gap-2">
                <div className="h-10 w-10 bg-white text-black rounded-lg flex items-center justify-center shadow-lg">
                    {/* Brand Logo Placeholder */}
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-6 h-6"><path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /><path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /><path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                </div>

                <Button
                    variant="secondary"
                    className="flex-1 justify-between bg-card hover:bg-muted border border-border shadow-lg"
                    onClick={() => setIsOpen(!isOpen)}
                >
                    <span className="truncate">{selectedApp?.name || "Select Application"}</span>
                    <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
                </Button>
            </div>

            {/* Dropdown Panel */}
            {isOpen && (
                <Card className="bg-card/95 backdrop-blur-sm border-border shadow-2xl p-2 flex flex-col gap-2 overflow-hidden animate-in slide-in-from-top-2 fade-in zoom-in-95">
                    <div className="flex items-center justify-between px-2 pt-2">
                        <span className="text-sm font-semibold text-foreground">Application</span>
                    </div>

                    <div className="flex gap-2 px-2">
                        <div className="relative flex-1">
                            <Search className="absolute left-2 top-2 h-4 w-4 text-muted-foreground" />
                            <Input placeholder="Search..." className="pl-8 h-8 bg-muted/50 border-none" />
                        </div>
                        <Button size="icon" className="h-8 w-8 bg-primary text-primary-foreground hover:bg-primary/90">
                            <span className="text-lg leading-none">+</span>
                        </Button>
                    </div>

                    <div className="mt-2 flex flex-col gap-1 max-h-[400px] overflow-y-auto">
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
                                            "flex items-center gap-3 p-2 rounded-md hover:bg-muted/50 transition-colors text-left",
                                            selectedAppId === app.id ? "bg-primary/10 text-primary border border-primary/20" : "text-muted-foreground"
                                        )}
                                    >
                                        <div className={cn(
                                            "h-8 w-8 rounded-md flex items-center justify-center",
                                            selectedAppId === app.id ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                                        )}>
                                            <Icon className="h-4 w-4" />
                                        </div>
                                        <div className="flex-1 truncate text-sm font-medium">
                                            {app.name}
                                        </div>
                                        <ChevronRight className="h-4 w-4 opacity-50" />
                                    </button>
                                )
                            })
                        )}
                    </div>
                </Card>
            )}
        </div>
    )
}
