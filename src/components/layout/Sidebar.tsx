import { Command, LayoutGrid, Settings, Users } from 'lucide-react'

export function Sidebar() {
    return (
        <div className="flex h-full w-16 flex-col items-center border-r bg-muted/10 py-4 gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm">
                <Command className="h-5 w-5" />
            </div>
            <nav className="flex flex-col gap-2">
                <button className="flex h-10 w-10 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors">
                    <LayoutGrid className="h-5 w-5" />
                </button>
                <button className="flex h-10 w-10 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors">
                    <Users className="h-5 w-5" />
                </button>
            </nav>
            <div className="mt-auto">
                <button className="flex h-10 w-10 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors">
                    <Settings className="h-5 w-5" />
                </button>
            </div>
        </div>
    )
}
