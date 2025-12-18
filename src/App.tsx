import { ReactFlowProvider } from '@xyflow/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Sidebar } from '@/components/layout/Sidebar'
import { Topbar } from '@/components/layout/Topbar'
import { GraphCanvas } from '@/components/canvas/GraphCanvas'
import { InspectorPanel } from '@/features/inspector/InspectorPanel'
import { useAppStore } from '@/store/useAppStore'
import { cn } from '@/lib/utils'
import { X } from 'lucide-react'
import { Button } from '@/components/ui/button'

const queryClient = new QueryClient()

function MainLayout() {
  const { isMobilePanelOpen, toggleMobilePanel } = useAppStore()

  return (
    <div className="flex h-screen w-full flex-col overflow-hidden bg-background text-foreground">
      <Topbar />
      <div className="flex flex-1 overflow-hidden">
        <aside className="hidden md:block">
          <Sidebar />
        </aside>

        <main className="relative flex flex-1 overflow-hidden">
          <div className="flex-1 h-full relative z-0">
            <GraphCanvas />
          </div>

          <aside className={cn(
            "border-l bg-background transition-transform duration-300 ease-in-out absolute md:relative z-20 h-full right-0 w-80 shadow-xl md:shadow-none top-0",
            !isMobilePanelOpen && "translate-x-full md:translate-x-0",
            isMobilePanelOpen && "translate-x-0"
          )}>
            <div className="h-full flex flex-col">
              <div className="md:hidden flex justify-end p-2 border-b">
                <Button variant="ghost" size="icon" onClick={() => toggleMobilePanel(false)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex-1 overflow-y-auto">
                <InspectorPanel />
              </div>
            </div>
          </aside>

          {isMobilePanelOpen && (
            <div
              className="fixed inset-0 bg-black/50 z-10 md:hidden animate-in fade-in"
              onClick={() => toggleMobilePanel(false)}
            />
          )}
        </main>
      </div>
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
