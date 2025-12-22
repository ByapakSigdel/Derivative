# Graph Schema & Validation

Types: see `types/graph.ts`.

Schema:
- Nodes: discriminated union of types with typed payloads.
- Edges: `{ from: string, to: string }`.

Validation:
- Duplicate node IDs flagged.
- Payload types enforced per node kind.
- Edges must refer to existing nodes.

Determinism:
- `utils/helpers.ts` provides `topologicalSort()`; cycles fall back to insertion order.
