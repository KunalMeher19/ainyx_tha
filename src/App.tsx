import { ReactFlowProvider } from '@xyflow/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Sidebar } from '@/components/layout/Sidebar'
import { InspectorPanel } from '@/features/inspector/InspectorPanel'
import { GraphCanvas } from '@/components/canvas/GraphCanvas'
import { Button } from '@/components/ui/button'
import { Share2, Moon, X, PanelRightOpen } from 'lucide-react'
import { useAppStore } from '@/store/useAppStore'
import { cn } from '@/lib/utils'

const queryClient = new QueryClient()

function MainLayout() {
  const { isMobilePanelOpen, toggleMobilePanel } = useAppStore()

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background text-foreground font-sans selection:bg-primary/20">
      {/* Left Rail */}
      <aside className="hidden md:block z-30">
        <Sidebar />
      </aside>

      {/* Main Content (Canvas) */}
      <main className="relative flex flex-1 overflow-hidden">
        {/* Top Right Actions (Floating) */}
        <div className="absolute top-4 right-4 z-40 flex items-center gap-2">
          {/* Mobile Panel Toggle */}
          <Button
            variant="outline"
            size="icon"
            className="md:hidden h-9 w-9 bg-card border-border shadow-sm"
            onClick={() => toggleMobilePanel(!isMobilePanelOpen)}
          >
            <PanelRightOpen className="h-4 w-4" />
          </Button>
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

      {/* Right Panel - Desktop */}
      <aside className="hidden md:flex w-[360px] border-l border-border bg-card/50 backdrop-blur-sm z-30">
        <InspectorPanel />
      </aside>

      {/* Right Panel - Mobile Drawer */}
      {isMobilePanelOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/50 z-40 md:hidden animate-in fade-in"
            onClick={() => toggleMobilePanel(false)}
          />
          {/* Drawer */}
          <aside className={cn(
            "fixed right-0 top-0 bottom-0 w-[85vw] max-w-[360px] bg-card border-l border-border z-50 md:hidden",
            "animate-in slide-in-from-right duration-300"
          )}>
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="font-semibold">Panel</h2>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => toggleMobilePanel(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <InspectorPanel />
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
