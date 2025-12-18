import { Handle, Position, type NodeProps } from '@xyflow/react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Server, Database, Cloud } from 'lucide-react'
import { cn } from '@/lib/utils'

export function ServiceNode({ data, selected }: NodeProps) {
    const label = (data.label as string) || 'Service'
    let Icon = Server
    if (label.toLowerCase().includes('db') || label.toLowerCase().includes('postgres') || label.toLowerCase().includes('redis')) Icon = Database
    if (label.toLowerCase().includes('gateway') || label.toLowerCase().includes('api')) Icon = Cloud

    const status = (data.status as string) || 'unknown'
    const isHealthy = status === 'healthy'

    return (
        <Card className={cn(
            "min-w-[200px] border-2 transition-all shadow-sm",
            selected ? "border-primary ring-2 ring-primary/20 shadow-xl" : "border-border",
            !isHealthy && "border-destructive/60 bg-destructive/5"
        )}>
            <div className={cn("px-3 py-2 border-b flex items-center justify-between", isHealthy ? "bg-muted/40" : "bg-destructive/10")}>
                <div className="flex items-center gap-2 font-semibold text-sm">
                    <Icon className="h-4 w-4 text-muted-foreground" />
                    {String(label)}
                </div>
                <div className={cn("h-2 w-2 rounded-full animate-pulse", isHealthy ? "bg-green-500" : "bg-red-500")} />
            </div>
            <div className="p-3 text-xs space-y-2 bg-card">
                <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Status</span>
                    <Badge variant={isHealthy ? 'outline' : 'destructive'} className="text-[10px] h-5 px-1.5 uppercase tracking-wide">
                        {status}
                    </Badge>
                </div>
                <div className="flex justify-between items-center border-t pt-2 mt-2">
                    <span className="text-muted-foreground">CPU Usage</span>
                    <span className={cn("font-mono font-medium", (data.cpu as number) > 80 ? "text-destructive" : "")}>
                        {data.cpu as number}%
                    </span>
                </div>
            </div>

            <Handle type="target" position={Position.Top} className="!w-3 !h-3 !bg-muted-foreground/50 !border-2 !border-background hover:!bg-primary transition-colors" />
            <Handle type="source" position={Position.Bottom} className="!w-3 !h-3 !bg-muted-foreground/50 !border-2 !border-background hover:!bg-primary transition-colors" />
        </Card>
    )
}
