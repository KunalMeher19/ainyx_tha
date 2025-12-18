# App Graph Builder

A responsive "App Graph Builder" UI built with React, ReactFlow, and Zustand.

## Features

- **Responsive Layout**: Three-pane layout (Sidebar, Canvas, Inspector) that adapts to mobile devices with a drawer menu.
- **Graph Visualization**: Interactive graph with custom service nodes, powered by ReactFlow.
- **Node Inspector**: Edit service configuration and runtime metrics in real-time.
- **State Management**:
    - **Local UI**: Zustand for global selection and panel states.
    - **Draft Graph**: ReactFlow internal state synchronized with local React state for immediate interactions.
    - **Server Data**: TanStack Query for fetching and caching graph data.
- **Mock API**: Full MSW (Mock Service Worker) integration to simulate backend latency and data retrieval.

## Validation Checklist

- [x] **Layout**: Top bar, left rail, right panel, dotted canvas.
- [x] **Responsive**: Right panel becomes a slide-over drawer on small screens.
- [x] **ReactFlow Basics**: 3+ nodes, drag, select, delete, zoom/pan.
- [x] **Inspector UI**: Tabs (Config/Runtime), synced Slider/Input, status pill.
- [x] **Data Fetching**: Mock APIs for `/apps` and `/graph` using TanStack Query.
- [x] **State Management**: Scalable Zustand store + safe local component state.
- [x] **Quality**: Strict TypeScript, ESLint, and modular architecture.

## Key Decisions

- **ReactFlow State**: Kept local to `GraphCanvas` to ensure smooth 60fps dragging and interactions without checking strict strictness of global stores. We only sync selection state globally.
- **Zustand Usage**: Restricted to "Application Level" state (Selected App ID, Panel Open/Closed) rather than low-level graph coordinates.
- **MSW for Mocking**: Chosen over simple `setTimeout` to provide a realistic network layer that intercepts actual `fetch` requests, making the transition to a real backend seamless.
- **Optimism**: Edits in the Inspector update the local graph state immediately for a snappy feel (Optimistic UI).

## Setup Instructions

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Run Development Server**
   ```bash
   npm run dev
   ```
   Open [http://localhost:5173](http://localhost:5173).

3. **Run Checks**
   ```bash
   npm run typecheck
   npm run lint
   ```

## Folder Structure

```
src/
├── components/
│   ├── canvas/       # Graph-related components (Nodes, Canvas)
│   ├── layout/       # App shell (Sidebar, Topbar)
│   └── ui/           # Reusable shadcn/ui primitives
├── features/
│   └── inspector/    # Right panel feature logic
├── mocks/            # MSW handlers and browser setup
├── store/            # Zustand global store
└── lib/              # Utilities
```
