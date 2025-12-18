import { useAppStore } from '@/store/useAppStore'
import { AppSelector } from './AppSelector'
import { InspectorControls } from './InspectorControls'

export function InspectorPanel() {
    const selectedNodeId = useAppStore((state) => state.selectedNodeId)

    return (
        <div className="flex h-full flex-col w-full overflow-hidden">
            {/* Always show App Selector at the top */}
            <AppSelector />

            {/* Show Inspector Controls when a node is selected */}
            {selectedNodeId && (
                <div className="flex-1 overflow-y-auto">
                    <InspectorControls />
                </div>
            )}

            {/* Empty state when no node is selected */}
            {!selectedNodeId && (
                <div className="flex-1 flex items-center justify-center p-8 text-center">
                    <div className="space-y-2">
                        <p className="text-sm text-muted-foreground">
                            Select a node to view its details
                        </p>
                        <p className="text-xs text-muted-foreground/60">
                            Click on a node in the canvas
                        </p>
                    </div>
                </div>
            )}
        </div>
    )
}
