import type { Node, Edge, Viewport } from '@xyflow/react'

const STORAGE_PREFIX = 'ainyx_flow_'

export interface PersistedFlowData {
    nodes: Node[]
    edges: Edge[]
    viewport?: Viewport
}

// Save flow data for a specific app
export function saveFlowData(appId: string, data: PersistedFlowData): void {
    try {
        const key = `${STORAGE_PREFIX}${appId}`
        localStorage.setItem(key, JSON.stringify(data))
    } catch (error) {
        console.error('Failed to save flow data:', error)
    }
}

// Load flow data for a specific app
export function loadFlowData(appId: string): PersistedFlowData | null {
    try {
        const key = `${STORAGE_PREFIX}${appId}`
        const stored = localStorage.getItem(key)
        return stored ? JSON.parse(stored) : null
    } catch (error) {
        console.error('Failed to load flow data:', error)
        return null
    }
}

// Clear all persisted flow data
export function clearAllFlowData(): void {
    try {
        Object.keys(localStorage)
            .filter(key => key.startsWith(STORAGE_PREFIX))
            .forEach(key => localStorage.removeItem(key))
    } catch (error) {
        console.error('Failed to clear flow data:', error)
    }
}
