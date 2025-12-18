import { memo, useCallback } from 'react'
import { Handle, Position, type NodeProps, useReactFlow } from '@xyflow/react'
import { Card, CardHeader, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Slider } from '@/components/ui/slider'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Cpu, Server, HardDrive, Globe, CheckCircle2, AlertTriangle, XCircle, Settings, Database } from 'lucide-react'
import { cn } from '@/lib/utils'

// Define the Node Data type
type ServiceNodeData = {
    label: string
    status: 'healthy' | 'degraded' | 'down'
    cpu: number
    memory: number
    disk: number
    region: string
    [key: string]: unknown
}

const statusConfig = {
    healthy: {
        label: 'Success',
        color: 'bg-emerald-500/15 text-emerald-500 hover:bg-emerald-500/25 border-emerald-500/20',
        icon: CheckCircle2
    },
    degraded: {
        label: 'Warning',
        color: 'bg-amber-500/15 text-amber-500 hover:bg-amber-500/25 border-amber-500/20',
        icon: AlertTriangle
    },
    down: {
        label: 'Error',
        color: 'bg-red-500/15 text-red-500 hover:bg-red-500/25 border-red-500/20',
        icon: XCircle
    }
}

export const ServiceNode = memo(({ id, data, selected }: NodeProps) => {
    const { setNodes } = useReactFlow()
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
            "w-[340px] shadow-2xl border border-border bg-card transition-all duration-300",
            selected ? "ring-2 ring-primary border-primary" : "hover:border-primary/50"
        )}>
            {/* Handles */}
            <Handle type="target" position={Position.Top} className="!w-3 !h-3 !border-2 !border-background !bg-muted-foreground" />
            <Handle type="source" position={Position.Bottom} className="!w-3 !h-3 !border-2 !border-background !bg-muted-foreground" />

            <CardHeader className="flex flex-row items-center justify-between pb-2 p-4 space-y-0">
                <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <ServiceIcon className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                        <Input
                            className="h-7 px-2 font-semibold text-lg border-transparent hover:border-input focus:border-input bg-transparent w-[180px] p-0"
                            value={nodeData.label}
                            onChange={(e) => updateData('label', e.target.value)}
                        />
                    </div>
                </div>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground">
                    <Settings className="h-4 w-4" />
                </Button>
            </CardHeader>

            <CardContent className="p-4 pt-0 space-y-5">
                <div className="flex items-center justify-between">
                    <Badge variant="outline" className={cn("px-2 py-1 gap-1.5", color)}>
                        <StatusIcon className="h-3.5 w-3.5" />
                        {statusLabel}
                    </Badge>

                    <Badge variant="outline" className="font-mono text-xs border-primary/20 text-primary bg-primary/5">
                        $0.03/HR
                    </Badge>
                </div>

                <Tabs defaultValue="cpu" className="w-full">
                    <TabsList className="grid w-full grid-cols-4 bg-muted/50 p-1 mb-4">
                        <TabsTrigger value="cpu" className="text-xs gap-1.5 h-7 data-[state=active]:bg-background"><Cpu className="h-3 w-3" /> CPU</TabsTrigger>
                        <TabsTrigger value="memory" className="text-xs gap-1.5 h-7 data-[state=active]:bg-background"><Server className="h-3 w-3" /> Mem</TabsTrigger>
                        <TabsTrigger value="disk" className="text-xs gap-1.5 h-7 data-[state=active]:bg-background"><HardDrive className="h-3 w-3" /> Disk</TabsTrigger>
                        <TabsTrigger value="region" className="text-xs gap-1.5 h-7 data-[state=active]:bg-background"><Globe className="h-3 w-3" /> Reg</TabsTrigger>
                    </TabsList>

                    {/* CPU Content */}
                    <TabsContent value="cpu" className="space-y-4 animate-in fade-in zoom-in-95 duration-200">
                        <div className="flex items-center justify-between">
                            <Label className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Allocation</Label>
                            <span className="text-sm font-bold font-mono text-foreground">{nodeData.cpu || 0}%</span>
                        </div>
                        <div className="flex items-center gap-4">
                            <Slider
                                defaultValue={[nodeData.cpu || 0]}
                                max={100}
                                step={1}
                                className="flex-1 cursor-pointer"
                                onValueChange={(val) => updateData('cpu', val[0])}
                            />
                            <Input
                                type="number"
                                className="w-16 h-8 text-right font-mono bg-muted/50 border-transparent focus:bg-background transition-all"
                                value={nodeData.cpu || 0}
                                onChange={(e) => updateData('cpu', Number(e.target.value))}
                            />
                        </div>
                    </TabsContent>

                    {/* Memory Content */}
                    <TabsContent value="memory" className="space-y-4 animate-in fade-in zoom-in-95 duration-200">
                        <div className="flex items-center justify-between">
                            <Label className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">RAM Usage</Label>
                            <span className="text-sm font-bold font-mono text-foreground">{nodeData.memory || 0} MB</span>
                        </div>
                        <div className="flex items-center gap-4">
                            <Slider
                                defaultValue={[nodeData.memory || 0]}
                                max={4096}
                                step={128}
                                className="flex-1 cursor-pointer"
                                onValueChange={(val) => updateData('memory', val[0])}
                            />
                            <Input
                                type="number"
                                className="w-20 h-8 text-right font-mono bg-muted/50 border-transparent focus:bg-background transition-all"
                                value={nodeData.memory || 0}
                                onChange={(e) => updateData('memory', Number(e.target.value))}
                            />
                        </div>
                    </TabsContent>

                    {/* Disk Content - Placeholder behavior */}
                    <TabsContent value="disk" className="space-y-4 animate-in fade-in zoom-in-95 duration-200">
                        <div className="flex items-center justify-center h-[50px] text-xs text-muted-foreground bg-muted/20 rounded-md border border-dashed">
                            Disk stats not available
                        </div>
                    </TabsContent>

                    {/* Region Content - Placeholder behavior */}
                    <TabsContent value="region" className="space-y-4 animate-in fade-in zoom-in-95 duration-200">
                        <div className="flex items-center justify-center h-[50px] text-xs text-muted-foreground bg-muted/20 rounded-md border border-dashed">
                            Region: us-east-1
                        </div>
                    </TabsContent>
                </Tabs>

                <div className="flex justify-end pt-1">
                    <span className="text-[10px] text-orange-400 font-bold tracking-widest flex items-center gap-1 opacity-70">
                        AWS
                    </span>
                </div>
            </CardContent>
        </Card>
    )
})
