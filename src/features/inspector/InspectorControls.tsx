import React, { useState } from 'react'
import { useAppStore } from '@/store/useAppStore'
import { useReactFlow } from '@xyflow/react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Slider } from '@/components/ui/slider'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Cpu, Activity } from 'lucide-react'
import { cn } from '@/lib/utils'

export function InspectorControls() {
    const selectedNodeId = useAppStore((state) => state.selectedNodeId)
    const selectNode = useAppStore((state) => state.selectNode)
    const activeInspectorTab = useAppStore((state) => state.activeInspectorTab)
    const setInspectorTab = useAppStore((state) => state.setInspectorTab)
    const { getNode, setNodes } = useReactFlow()
    const node = getNode(selectedNodeId!)

    const [cpu, setCpu] = useState(node ? (node.data.cpu as number || 0) : 0)
    const [label, setLabel] = useState(node ? (node.data.label as string || '') : '')
    const [memory] = useState(node ? (node.data.memory as number || 0) : 0)

    const updateNodeData = (key: string, value: unknown) => {
        if (!selectedNodeId) return
        setNodes((nds) =>
            nds.map((n) => {
                if (n.id === selectedNodeId) {
                    return { ...n, data: { ...n.data, [key]: value } }
                }
                return n
            })
        )
    }

    const handleCpuChange = (val: number[]) => {
        const v = val[0]
        setCpu(v)
        updateNodeData('cpu', v)
    }

    const handleCpuInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let v = parseInt(e.target.value)
        if (isNaN(v)) v = 0
        if (v > 100) v = 100
        setCpu(v)
        updateNodeData('cpu', v)
    }

    const handleLabelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setLabel(e.target.value)
        updateNodeData('label', e.target.value)
    }

    if (!node) return <div className="p-4 text-center text-muted-foreground">Node not found</div>

    const status = (node.data.status as string) || 'unknown'
    const isHealthy = status === 'healthy'

    return (
        <div className="flex h-full flex-col bg-background">
            <div className="flex items-center gap-2 border-b p-4 bg-muted/20">
                <Button variant="ghost" size="icon" className="-ml-2 h-8 w-8" onClick={() => selectNode(null)}>
                    <ArrowLeft className="h-4 w-4" />
                </Button>
                <div className="flex-1 font-semibold truncate">{label}</div>
                <Badge variant={isHealthy ? 'default' : 'destructive'} className={cn(isHealthy && "bg-emerald-500 hover:bg-emerald-600")}>
                    {status}
                </Badge>
            </div>

            <Tabs value={activeInspectorTab} onValueChange={setInspectorTab} className="flex-1 flex flex-col">
                <div className="px-4 pt-4 border-b pb-4">
                    <TabsList className="w-full">
                        <TabsTrigger value="config" className="flex-1">Config</TabsTrigger>
                        <TabsTrigger value="runtime" className="flex-1">Runtime</TabsTrigger>
                    </TabsList>
                </div>

                <TabsContent value="config" className="flex-1 p-4 space-y-6 animate-in slide-in-from-left-2 fade-in">
                    <div className="space-y-3">
                        <Label>Service Name</Label>
                        <Input value={label} onChange={handleLabelChange} />
                    </div>

                    <div className="space-y-3">
                        <Label>Description</Label>
                        <Input placeholder="Describe this service..." />
                    </div>

                    <div className="space-y-3">
                        <Label>Node ID</Label>
                        <div className="text-xs font-mono p-2 bg-muted rounded border">{node.id}</div>
                    </div>
                </TabsContent>

                <TabsContent value="runtime" className="flex-1 p-4 space-y-8 animate-in slide-in-from-right-2 fade-in">
                    <div className="space-y-4 rounded-lg border p-4 bg-muted/10">
                        <div className="flex items-center justify-between">
                            <Label className="flex items-center gap-2"><Cpu className="h-4 w-4" /> CPU Load</Label>
                            <div className="flex items-center gap-1">
                                <Input
                                    type="number"
                                    value={cpu}
                                    onChange={handleCpuInputChange}
                                    className="w-16 text-right h-8"
                                />
                                <span className="text-sm text-muted-foreground">%</span>
                            </div>
                        </div>
                        <Slider
                            value={[cpu]}
                            max={100}
                            step={1}
                            onValueChange={handleCpuChange}
                            className="py-2"
                        />
                    </div>

                    <div className="space-y-4 rounded-lg border p-4 bg-muted/10">
                        <div className="flex items-center justify-between">
                            <Label className="flex items-center gap-2"><Activity className="h-4 w-4" /> Memory Usage</Label>
                            <span className="text-sm font-mono">{memory} MB</span>
                        </div>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    )
}
