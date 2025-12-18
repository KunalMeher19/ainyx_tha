import type { Node, Edge, Viewport } from '@xyflow/react'

const STORAGE_PREFIX = 'ainyx_flow_'

export interface PersistedFlowData {
    appId: string // Store which app this data belongs to for validation
    nodes: Node[]
    edges: Edge[]
    viewport?: Viewport
}

// Save flow data for a specific app
export function saveFlowData(appId: string, data: Omit<PersistedFlowData, 'appId'>): void {
    try {
        const key = `${STORAGE_PREFIX}${appId}`
        const dataWithAppId: PersistedFlowData = { ...data, appId }
        localStorage.setItem(key, JSON.stringify(dataWithAppId))
    } catch (error) {
        console.error('Failed to save flow data:', error)
    }
}

// Load flow data for a specific app
export function loadFlowData(appId: string): PersistedFlowData | null {
    try {
        const key = `${STORAGE_PREFIX}${appId}`
        const stored = localStorage.getItem(key)

        if (!stored) return null

        const parsed: PersistedFlowData = JSON.parse(stored)

        // VALIDATION: Ensure the persisted data matches the requested app
        if (parsed.appId !== appId) {
            console.warn(`Data mismatch: Expected appId "${appId}", found "${parsed.appId}". Clearing corrupted cache.`)
            localStorage.removeItem(key)
            return null
        }

        return parsed
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
