import { Card } from '@/components/ui/card'
import { Keyboard } from 'lucide-react'

interface ShortcutItem {
    keys: string[]
    description: string
}

const shortcuts: ShortcutItem[] = [
    { keys: ['F'], description: 'Fit view to canvas' },
    { keys: ['P'], description: 'Toggle inspector panel' },
    { keys: ['A'], description: 'Align nodes in grid' },
    { keys: ['I', 'Escape'], description: 'Close inspector panel' },
    { keys: ['Delete', 'Backspace'], description: 'Delete selected node' },
]

export function KeyboardShortcutsCard() {
    return (
        <div className="absolute top-1/2 -translate-y-1/2 right-4 z-40 w-[280px] animate-in slide-in-from-right-4 fade-in duration-500">
            <Card className="bg-card/95 backdrop-blur-sm border-border shadow-2xl p-4 flex flex-col gap-3">
                {/* Header */}
                <div className="flex items-center gap-2 pb-2 border-b border-border/50">
                    <div className="h-8 w-8 rounded-md bg-primary/10 flex items-center justify-center shrink-0">
                        <Keyboard className="h-4 w-4 text-primary" />
                    </div>
                    <span className="text-sm font-semibold text-foreground">⌨️ Keyboard Shortcuts</span>
                </div>

                {/* Shortcuts List */}
                <div className="flex flex-col gap-2">
                    {shortcuts.map((shortcut, index) => (
                        <div key={index} className="flex items-start gap-3 group">
                            {/* Keys */}
                            <div className="flex items-center gap-1 shrink-0">
                                {shortcut.keys.map((key, keyIndex) => (
                                    <div key={keyIndex} className="flex items-center gap-1">
                                        <kbd className="px-2 py-1 text-xs font-mono bg-muted border border-border rounded shadow-sm text-foreground group-hover:bg-muted/80 transition-colors min-w-[32px] text-center">
                                            {key}
                                        </kbd>
                                        {keyIndex < shortcut.keys.length - 1 && (
                                            <span className="text-xs text-muted-foreground">or</span>
                                        )}
                                    </div>
                                ))}
                            </div>

                            {/* Description */}
                            <span className="text-xs text-muted-foreground leading-relaxed flex-1">
                                {shortcut.description}
                            </span>
                        </div>
                    ))}
                </div>
            </Card>
        </div>
    )
}
