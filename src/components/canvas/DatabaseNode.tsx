import { memo, useCallback } from 'react'
import { Handle, Position, type NodeProps, useReactFlow } from '@xyflow/react'
import { Card, CardHeader, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Slider } from '@/components/ui/slider'
import { Input } from '@/components/ui/input'
import { Database, HardDrive, Globe, CheckCircle2, AlertTriangle, XCircle, Settings } from 'lucide-react'
import { cn } from '@/lib/utils'

// Define the Node Data type
type DatabaseNodeData = {
    label: string
    status: 'healthy' | 'degraded' | 'down'
    cpu: number
    memory: number
    disk?: number
    region?: string
    nodeType?: string
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

export const DatabaseNode = memo(({ id, data, selected }: NodeProps) => {
    const { setNodes } = useReactFlow()
    const nodeData = data as DatabaseNodeData
    const status = nodeData.status || 'healthy'
    const { label: statusLabel, color, icon: StatusIcon } = statusConfig[status] || statusConfig.healthy

    const updateData = useCallback((key: keyof DatabaseNodeData, value: unknown) => {
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
            "w-[180px] shadow-xl border bg-slate-950/95 backdrop-blur-sm transition-all duration-200",
            selected ? "ring-2 ring-blue-500 border-blue-500 shadow-2xl scale-105" : "border-slate-700 hover:border-blue-500/50"
        )}>
            {/* Handles */}
            <Handle type="target" position={Position.Top} className="!w-2.5 !h-2.5 !border-2 !border-background !bg-blue-500" />
            <Handle type="source" position={Position.Bottom} className="!w-2.5 !h-2.5 !border-2 !border-background !bg-blue-500" />

            <CardHeader className="p-3 pb-2">
                <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                        <div className="h-8 w-8 rounded-md bg-blue-500/10 flex items-center justify-center shrink-0">
                            <Database className="h-4 w-4 text-blue-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-sm truncate text-slate-100">{nodeData.label}</h3>
                        </div>
                    </div>
                    <Settings className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                </div>
                <div className="flex items-center justify-between mt-2">
                    <Badge variant="outline" className={cn("text-[10px] px-1.5 py-0.5 gap-1", color)}>
                        <StatusIcon className="h-2.5 w-2.5" />
                        {statusLabel}
                    </Badge>
                    <span className="text-[10px] text-cyan-400 font-bold tracking-wider">$0.08/HR</span>
                </div>
            </CardHeader>

            <CardContent className="p-3 pt-0">
                <Tabs defaultValue="cpu" className="w-full">
                    <TabsList className="grid w-full grid-cols-3 h-7 bg-slate-800/50 p-0.5">
                        <TabsTrigger value="cpu" className="text-[10px] h-6 px-1"><Database className="h-2.5 w-2.5" /></TabsTrigger>
                        <TabsTrigger value="storage" className="text-[10px] h-6 px-1"><HardDrive className="h-2.5 w-2.5" /></TabsTrigger>
                        <TabsTrigger value="region" className="text-[10px] h-6 px-1"><Globe className="h-2.5 w-2.5" /></TabsTrigger>
                    </TabsList>

                    {/* CPU/Load */}
                    <TabsContent value="cpu" className="mt-2 space-y-1.5">
                        <div className="flex items-center justify-between">
                            <span className="text-[10px] text-slate-400 uppercase tracking-wide">Load</span>
                            <Input
                                type="number"
                                className="w-12 h-5 text-[10px] text-right font-mono p-1 bg-slate-900 border-slate-700 text-slate-200"
                                value={nodeData.cpu || 0}
                                onChange={(e) => updateData('cpu', Number(e.target.value))}
                            />
                        </div>
                        <Slider
                            value={[nodeData.cpu || 0]}
                            max={100}
                            step={1}
                            className="cursor-pointer [&_[role=slider]]:bg-blue-500 [&_[role=slider]]:border-blue-400"
                            onValueChange={(val) => updateData('cpu', val[0])}
                        />
                        <div className="flex justify-between text-[9px] text-slate-500">
                            <span>Low</span>
                            <span>Medium</span>
                            <span>High</span>
                        </div>
                    </TabsContent>

                    {/* Storage */}
                    <TabsContent value="storage" className="mt-2 space-y-1.5">
                        <div className="flex items-center justify-between">
                            <span className="text-[10px] text-slate-400 uppercase tracking-wide">Storage</span>
                            <Input
                                type="number"
                                className="w-14 h-5 text-[10px] text-right font-mono p-1 bg-slate-900 border-slate-700 text-slate-200"
                                value={nodeData.memory || 0}
                                onChange={(e) => updateData('memory', Number(e.target.value))}
                            />
                        </div>
                        <Slider
                            value={[nodeData.memory || 0]}
                            max={10000}
                            step={100}
                            className="cursor-pointer [&_[role=slider]]:bg-blue-500 [&_[role=slider]]:border-blue-400"
                            onValueChange={(val) => updateData('memory', val[0])}
                        />
                        <div className="flex justify-between text-[9px] text-slate-500">
                            <span>0 GB</span>
                            <span>5000 GB</span>
                            <span>10000 GB</span>
                        </div>
                    </TabsContent>

                    {/* Region */}
                    <TabsContent value="region" className="mt-2">
                        <div className="flex items-center justify-center h-12 text-[10px] text-slate-400 bg-slate-900/50 rounded border border-dashed border-slate-700">
                            Region: us-east-1
                        </div>
                    </TabsContent>
                </Tabs>

                <div className="flex justify-end mt-2">
                    <span className="text-[9px] text-cyan-400 font-bold tracking-wider opacity-60">AWS RDS</span>
                </div>
            </CardContent>
        </Card>
    )
})

DatabaseNode.displayName = 'DatabaseNode'
