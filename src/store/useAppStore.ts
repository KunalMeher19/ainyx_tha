import { create } from 'zustand'

interface AppState {
    selectedAppId: string | null
    selectedNodeId: string | null
    isMobilePanelOpen: boolean
    activeInspectorTab: string

    selectApp: (appId: string | null) => void
    selectNode: (nodeId: string | null) => void
    toggleMobilePanel: (isOpen: boolean) => void
    setInspectorTab: (tab: string) => void
}

export const useAppStore = create<AppState>((set) => ({
    selectedAppId: null,
    selectedNodeId: null,
    isMobilePanelOpen: false,
    activeInspectorTab: 'config',

    selectApp: (appId) => set({ selectedAppId: appId, selectedNodeId: null }),
    selectNode: (nodeId) => set({ selectedNodeId: nodeId, isMobilePanelOpen: !!nodeId }), // Auto-open on mobile if node selected? Or keep separate.
    toggleMobilePanel: (isOpen) => set({ isMobilePanelOpen: isOpen }),
    setInspectorTab: (tab) => set({ activeInspectorTab: tab }),
}))
