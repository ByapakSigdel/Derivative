# Editor

Components:
- `NodePanel` — add typed nodes (DigitalWrite, AnalogRead, Delay, If, Loop).
- `NodeCanvas` — displays nodes and edges; clear action.
- `CodePreview` — calls generate API and shows code.
- `UploadPanel` — posts to upload API; decoupled from implementation.

State:
- `store/editorStore.ts` — nodes/edges, add/clear, persisted to localStorage.
