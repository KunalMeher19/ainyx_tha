import { memo, useCallback } from 'react'
import { Handle, Position, type NodeProps, useReactFlow } from '@xyflow/react'
import { Card, CardHeader, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Slider } from '@/components/ui/slider'
import { Input } from '@/components/ui/input'
import { Cpu, Server, HardDrive, Globe, CheckCircle2, AlertTriangle, XCircle, Database, Settings } from 'lucide-react'
import { cn } from '@/lib/utils'

// Define the Node Data type
type ServiceNodeData = {
    label: string
    status: 'healthy' | 'degraded' | 'down'
    cpu: number
    memory: number
    disk?: number
    region?: string
    [key: string]: unknown
}

const statusConfig = {
    healthy: {
        label: 'Success',
        color: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
        icon: CheckCircle2
    },
    degraded: {
        label: 'Warning',
        color: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
        icon: AlertTriangle
    },
    down: {
        label: 'Error',
        color: 'bg-red-500/20 text-red-400 border-red-500/30',
        icon: XCircle
    }
}

export const ServiceNode = memo(({ id, data, selected }: NodeProps) => {
    const { setNodes } = useReactFlow()
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

    const updateData = useCallback((key: keyof ServiceNodeData, value: unknown) => {
        setNodes((nodes) =>
            nodes.map((node) => {
                if (node.id === id) {
                    return { ...node, data: { ...node.data, [key]: value } }
                }
                return node
            })
        )
    }, [id, setNodes])

    return (
        <Card className={cn(
            "w-[240px] shadow-xl border bg-card/95 backdrop-blur-sm transition-all duration-200",
            selected ? "ring-2 ring-primary border-primary shadow-2xl scale-105" : "border-border hover:border-primary/50"
        )}>
            {/* Handles */}
            <Handle type="target" position={Position.Top} className="!w-2.5 !h-2.5 !border-2 !border-background !bg-primary" />
            <Handle type="source" position={Position.Bottom} className="!w-2.5 !h-2.5 !border-2 !border-background !bg-primary" />

            <CardHeader className="p-3 pb-2">
                <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                        <div className="h-8 w-8 rounded-md bg-primary/10 flex items-center justify-center shrink-0">
                            <ServiceIcon className="h-4 w-4 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-sm truncate">{nodeData.label}</h3>
                        </div>
                    </div>
                    <Settings className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                </div>
                <div className="flex items-center justify-between mt-2">
                    <Badge variant="outline" className={cn("text-[10px] px-1.5 py-0.5 gap-1", color)}>
                        <StatusIcon className="h-2.5 w-2.5" />
                        {statusLabel}
                    </Badge>
                    <span className="text-[10px] text-orange-400 font-bold tracking-wider">$0.03/HR</span>
                </div>
            </CardHeader>

            <CardContent className="p-3 pt-0">
                <Tabs defaultValue="cpu" className="w-full">
                    <TabsList className="grid w-full grid-cols-4 h-7 bg-muted/50 p-0.5">
                        <TabsTrigger value="cpu" className="text-[10px] h-6 px-1"><Cpu className="h-2.5 w-2.5" /></TabsTrigger>
                        <TabsTrigger value="memory" className="text-[10px] h-6 px-1"><Server className="h-2.5 w-2.5" /></TabsTrigger>
                        <TabsTrigger value="disk" className="text-[10px] h-6 px-1"><HardDrive className="h-2.5 w-2.5" /></TabsTrigger>
                        <TabsTrigger value="region" className="text-[10px] h-6 px-1"><Globe className="h-2.5 w-2.5" /></TabsTrigger>
                    </TabsList>

                    {/* CPU */}
                    <TabsContent value="cpu" className="mt-2 space-y-1.5">
                        <div className="flex items-center justify-between">
                            <span className="text-[10px] text-muted-foreground uppercase tracking-wide">CPU</span>
                            <Input
                                type="number"
                                className="w-12 h-5 text-[10px] text-right font-mono p-1"
                                value={nodeData.cpu || 0}
                                onChange={(e) => updateData('cpu', Number(e.target.value))}
                            />
                        </div>
                        <Slider
                            value={[nodeData.cpu || 0]}
                            max={100}
                            step={1}
                            className="cursor-pointer"
                            onValueChange={(val) => updateData('cpu', val[0])}
                        />
                        <div className="flex justify-between text-[9px] text-muted-foreground">
                            <span>0.02</span>
                            <span>0.05 GB</span>
                            <span>10.00 GB</span>
                        </div>
                    </TabsContent>

                    {/* Memory */}
                    <TabsContent value="memory" className="mt-2 space-y-1.5">
                        <div className="flex items-center justify-between">
                            <span className="text-[10px] text-muted-foreground uppercase tracking-wide">Memory</span>
                            <Input
                                type="number"
                                className="w-14 h-5 text-[10px] text-right font-mono p-1"
                                value={nodeData.memory || 0}
                                onChange={(e) => updateData('memory', Number(e.target.value))}
                            />
                        </div>
                        <Slider
                            value={[nodeData.memory || 0]}
                            max={4096}
                            step={128}
                            className="cursor-pointer"
                            onValueChange={(val) => updateData('memory', val[0])}
                        />
                        <div className="flex justify-between text-[9px] text-muted-foreground">
                            <span>0 MB</span>
                            <span>2048 MB</span>
                            <span>4096 MB</span>
                        </div>
                    </TabsContent>

                    {/* Disk */}
                    <TabsContent value="disk" className="mt-2">
                        <div className="flex items-center justify-center h-12 text-[10px] text-muted-foreground bg-muted/20 rounded border border-dashed">
                            Disk stats unavailable
                        </div>
                    </TabsContent>

                    {/* Region */}
                    <TabsContent value="region" className="mt-2">
                        <div className="flex items-center justify-center h-12 text-[10px] text-muted-foreground bg-muted/20 rounded border border-dashed">
                            Region: us-east-1
                        </div>
                    </TabsContent>
                </Tabs>

                <div className="flex justify-end mt-2">
                    <span className="text-[9px] text-orange-400 font-bold tracking-wider opacity-60">AWS</span>
                </div>
            </CardContent>
        </Card>
    )
})

ServiceNode.displayName = 'ServiceNode'
