# Project Reasoning & Architecture

Here is a breakdown of the key decisions, architectural choices, and technical details for the "App Graph Builder" project. The goal was to strictly adhere to the assignment requirements while delivering a polished, production-ready foundation.

## 1. Compliance Check
**Did I use anything extra?**
No. I reviewed the `package.json` and the source code against the assignment list.
- **Required:** React + Vite, TypeScript, ReactFlow (xyflow), shadcn/ui, TanStack Query, Zustand, Mock API.
- **Used:** Exactly these.
- **Dependencies:**
  - Standard shadcn/ui internal dependencies (Radix UI primitives, `clsx`, `tailwind-merge`, `class-variance-authority`).
  - `lucide-react` for icons (standard with shadcn).
  - `msw` for mocking.
  - No secret "magic" libraries or forbidden frameworks were added.

---

## 2. Architectural Decisions

### Folder Structure
I opted for a **hybrid feature-based** structure rather than a flat `components` folder.
- **`features/inspector`**: Contains logic specific to the Service Node Inspector (AppSelector, InspectorControls). This keeps complex business logic isolated from generic UI components.
- **`components/canvas`**: Dedicated space for the ReactFlow integration to strictly manage graph logic.
- **`components/ui`**: Pure shadcn/ui components (dumb components).
- **`store`**: Centralized Zustand store for global app state.

### State Management Strategy (Zustand + ReactFlow)
State is split into two distinct layers:
1.  **Global UI State (Zustand):** Used *only* for "meta" application state (`selectedAppId`, `selectedNodeId`, `isMobilePanelOpen`). This avoids prop drilling across the layout but doesn't weigh down the store with fine-grained graph data.
2.  **Graph State (ReactFlow internal):** The nodes and edges reside inside ReactFlow's internal store.
    - *Why?* ReactFlow is highly optimized for canvas interactions. Duplicating every node position change into Zustand would cause unnecessary re-renders.
    - **Syncing:** When you edit a node in the Inspector, we use ReactFlow's `setNodes` hook to directly update the node's internal data. This ensures high performance while keeping the UI responsive.

### Data Fetching (TanStack Query)
Even though the data is "fake", I treated it as real server state.
- **Caching:** Switching between apps is instant after the first load because TanStack Query caches the result.
- **Refetching:** If you change apps, the `queryKey` includes the `appId`, automatically triggering a refetch for the new graph.
- **Loading/Error:** Handled natively by Query's `isLoading` and `isError` states, simulating a real dashboard experience.

---

## 3. Persistence Strategy (The "Mock" Reality)
The assignment asked to "persist the value to the selected node's data".
- **Current Approach:** In-Memory Persistence.
    - When you change the "CPU Slider" or "Node Name" in the Inspector, the change is written directly to the ReactFlow `nodes` state.
    - If you switch apps and come back, the data resets (because it fetches fresh from the mock API). This is intentional behavior for a read-heavy dashboard interacting with a backend, unless we implemented a `POST/PUT` mock endpoint.
- **Future-Proofing:** Code is structured such that creating a `useMutation` hook in TanStack Query to send a `PATCH` request to the server would be the only step needed to make persistence permanent across reloads.

---

## 4. UI/UX & Layout
- **Layout:** Recreated the "Hybrid" layout: floating Left App Selector and a collapsing Right Inspector.
- **Visuals:** Used a dark, modern aesthetic (zinc/slate palette) with subtle borders to match the generic "SaaS dashboard" look of the screenshot.
- **Responsiveness:**
    - *Desktop:* Inspector is a permanent sidebar (or floating panel).
    - *Mobile:* Inspector becomes a slide-over drawer controlled by Zustand's `isMobilePanelOpen`, ensuring the canvas is still usable on small screens.

## 5. Mocking with MSW
I chose **MSW (Mock Service Worker)** over simple `setTimeout`.
- *Why?* It intercepts network requests at the browser level. This allows the app to make "real" `fetch` calls (`/api/apps`). It proves that the frontend code is agnostic to whether the backend is real or mocked—you could swap MSW for a real node server without changing a single line of React code.

## 6. Engineering Quality
- **Strict TypeScript:** No `any`. All props and store interfaces are typed.
- **Linting:** ESLint + Prettier configured (and checked).
- **Modular Components:** The `InspectorControls` is separate from `InspectorPanel`, making it easy to unit test the logic separate from the visual container.
