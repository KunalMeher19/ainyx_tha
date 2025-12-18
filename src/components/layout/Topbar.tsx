import { Button } from '@/components/ui/button'
import { PanelRightOpen } from 'lucide-react'
import { useAppStore } from '@/store/useAppStore'

export function Topbar() {
    const { toggleMobilePanel } = useAppStore()

    return (
        <div className="flex h-14 items-center justify-between border-b px-4 md:px-6 bg-background z-20">
            <div className="flex items-center gap-2 font-semibold">
                <span className="text-xl tracking-tight">AppGraph</span>
                <span className="hidden md:inline-flex rounded bg-muted px-1.5 py-0.5 text-xs text-muted-foreground">Beta</span>
            </div>
            <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" className="hidden md:inline-flex">Feedback</Button>
                <Button variant="outline" size="sm" className="hidden md:inline-flex">View Docs</Button>
                <Button size="sm" className="hidden md:inline-flex">Export</Button>

                <Button variant="outline" size="icon" className="md:hidden" onClick={() => toggleMobilePanel(true)}>
                    <PanelRightOpen className="h-4 w-4" />
                </Button>
            </div>
        </div>
    )
}
