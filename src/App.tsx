import { ReactFlowProvider } from '@xyflow/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Sidebar } from '@/components/layout/Sidebar'
import { AppSelector } from '@/features/inspector/AppSelector'
import { GraphCanvas } from '@/components/canvas/GraphCanvas'
import { useAppStore } from '@/store/useAppStore'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Share2, Moon, Sun, User } from 'lucide-react'

const queryClient = new QueryClient()

function MainLayout() {
  const { isMobilePanelOpen, toggleMobilePanel } = useAppStore()

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background text-foreground font-sans selection:bg-primary/20">
      {/* Left Rail */}
      <aside className="hidden md:block z-30">
        <Sidebar />
      </aside>

      {/* Main Content */}
      <main className="relative flex flex-1 overflow-hidden">

        {/* Floating App Selector */}
        <AppSelector />

        {/* Top Right Actions (Floating) */}
        <div className="absolute top-4 right-4 z-50 flex items-center gap-2">
          <Button variant="outline" size="icon" className="h-9 w-9 bg-card border-border shadow-sm">
            <Share2 className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" className="h-9 w-9 bg-card border-border shadow-sm">
            <Moon className="h-4 w-4" />
          </Button>
          <Button variant="gradient" size="icon" className="h-9 w-9 rounded-full overflow-hidden border-2 border-primary/20 p-0">
            <img src="https://github.com/shadcn.png" alt="User" />
          </Button>
        </div>

        <div className="flex-1 h-full relative z-0">
          <GraphCanvas />
        </div>

        {/* Mobile Drawer - repurposed for "Add Node" or Details if needed later, 
              but for now keeping empty or minimal to satisfy requirement of "mobile drawer" 
              maybe showing AppSelector content if on mobile? 
              For now just keeping it hidden/clean as we moved controls to nodes. */}
      </main>
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
