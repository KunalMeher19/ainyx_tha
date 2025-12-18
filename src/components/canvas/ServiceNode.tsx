import { memo } from 'react'
import { Handle, Position, type NodeProps } from '@xyflow/react'
import { Card, CardHeader, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Cpu, Server, Database, Globe, CheckCircle2, AlertTriangle, XCircle, Activity } from 'lucide-react'
import { cn } from '@/lib/utils'

// Define the Node Data type
type ServiceNodeData = {
    label: string
    status: 'healthy' | 'degraded' | 'down'
    cpu: number
    memory: number
    [key: string]: unknown
}

const statusConfig = {
    healthy: {
        label: 'Healthy',
        color: 'bg-emerald-500/15 text-emerald-500 hover:bg-emerald-500/25 border-emerald-500/20',
        icon: CheckCircle2
    },
    degraded: {
        label: 'Degraded',
        color: 'bg-amber-500/15 text-amber-500 hover:bg-amber-500/25 border-amber-500/20',
        icon: AlertTriangle
    },
    down: {
        label: 'Down',
        color: 'bg-red-500/15 text-red-500 hover:bg-red-500/25 border-red-500/20',
        icon: XCircle
    }
}

export const ServiceNode = memo(({ data, selected }: NodeProps) => {
    // Cast data safely
    const nodeData = data as ServiceNodeData
    const status = nodeData.status || 'healthy'
    const { label: statusLabel, color, icon: StatusIcon } = statusConfig[status] || statusConfig.healthy

    // Icon Selection
    let ServiceIcon = Server
    const type = (nodeData.nodeType as string) || ''
    const lowerLabel = nodeData.label.toLowerCase()

    if (type === 'db' || lowerLabel.includes('db') || lowerLabel.includes('postgres') || lowerLabel.includes('redis') || lowerLabel.includes('mongo')) {
        ServiceIcon = Database
    } else if (lowerLabel.includes('api') || lowerLabel.includes('gateway')) {
        ServiceIcon = Globe
    }

    return (
        <Card className={cn(
            "w-[280px] shadow-lg border border-border bg-card transition-all duration-200",
            selected ? "ring-2 ring-primary border-primary shadow-xl" : "hover:border-primary/50 hover:shadow-xl"
        )}>
            {/* Handles */}
            <Handle type="target" position={Position.Top} className="!w-3 !h-3 !border-2 !border-background !bg-muted-foreground" />
            <Handle type="source" position={Position.Bottom} className="!w-3 !h-3 !border-2 !border-background !bg-muted-foreground" />

            <CardHeader className="pb-3 p-4">
                <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                        <ServiceIcon className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-base truncate">{nodeData.label}</h3>
                        <p className="text-xs text-muted-foreground">Service Node</p>
                    </div>
                </div>
            </CardHeader>

            <CardContent className="p-4 pt-0 space-y-3">
                {/* Status Badge */}
                <div className="flex items-center justify-between">
                    <Badge variant="outline" className={cn("px-2 py-1 gap-1.5 text-xs", color)}>
                        <StatusIcon className="h-3 w-3" />
                        {statusLabel}
                    </Badge>
                </div>

                {/* Metrics Display */}
                <div className="space-y-2 pt-2 border-t">
                    <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2 text-muted-foreground">
                            <Cpu className="h-3.5 w-3.5" />
                            <span>CPU</span>
                        </div>
                        <span className="font-mono font-semibold">{nodeData.cpu || 0}%</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2 text-muted-foreground">
                            <Activity className="h-3.5 w-3.5" />
                            <span>Memory</span>
                        </div>
                        <span className="font-mono font-semibold">{nodeData.memory || 0} MB</span>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
})

ServiceNode.displayName = 'ServiceNode'
