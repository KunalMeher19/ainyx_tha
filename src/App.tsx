import { ReactFlowProvider } from '@xyflow/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Sidebar } from '@/components/layout/Sidebar'
import { AppSelector } from '@/features/inspector/AppSelector'
import { InspectorControls } from '@/features/inspector/InspectorControls'
import { GraphCanvas } from '@/components/canvas/GraphCanvas'
import { Button } from '@/components/ui/button'
import { Share2, Moon, X } from 'lucide-react'
import { useAppStore } from '@/store/useAppStore'
import { cn } from '@/lib/utils'

const queryClient = new QueryClient()

function MainLayout() {
  const selectedNodeId = useAppStore((state) => state.selectedNodeId)
  const selectNode = useAppStore((state) => state.selectNode)

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background text-foreground font-sans selection:bg-primary/20">
      {/* Left Rail */}
      <aside className="hidden md:block z-30">
        <Sidebar />
      </aside>

      {/* Main Content (Canvas) */}
      <main className="relative flex flex-1 overflow-hidden">
        {/* Floating App Selector */}
        <AppSelector />

        {/* Top Right Actions (Floating) */}
        <div className="absolute top-4 right-4 z-40 flex items-center gap-2">
          <Button variant="outline" size="icon" className="h-9 w-9 bg-card border-border shadow-sm">
            <Share2 className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" className="h-9 w-9 bg-card border-border shadow-sm">
            <Moon className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" className="h-9 w-9 rounded-full overflow-hidden border-2 border-primary/20 p-0">
            <img src="https://github.com/shadcn.png" alt="User" />
          </Button>
        </div>

        <div className="flex-1 h-full relative z-0">
          <GraphCanvas />
        </div>
      </main>

      {/* Right Panel Inspector - Animated (Desktop & Mobile) */}
      {selectedNodeId && (
        <>
          {/* Backdrop for Mobile */}
          <div
            className="fixed inset-0 bg-black/50 z-40 md:hidden animate-in fade-in"
            onClick={() => selectNode(null)}
          />

          {/* Inspector Panel */}
          <aside className={cn(
            "fixed right-0 top-0 bottom-0 z-50 bg-card border-l border-border shadow-2xl",
            "w-[85vw] max-w-[360px] md:w-[380px]",
            "animate-in slide-in-from-right duration-300 fade-in"
          )}>
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b bg-muted/20">
              <h2 className="font-semibold text-sm">Node Inspector</h2>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => selectNode(null)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* Inspector Content */}
            <div className="h-[calc(100%-57px)] overflow-y-auto">
              <InspectorControls />
            </div>
          </aside>
        </>
      )}
    </div>
  )
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ReactFlowProvider>
        <MainLayout />
      </ReactFlowProvider>
    </QueryClientProvider>
  )
}
