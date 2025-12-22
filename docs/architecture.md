# Architecture

- Next.js App Router with strict TypeScript.
- React components remain presentation-only; business logic lives in `lib/`.
- State via Zustand stores in `store/`, persisted to localStorage where useful.
- Authentication is cookie-based; Supabase provides ID/password verification, with a static backdoor.
- API handlers in `app/api/*` expose generation/upload endpoints and login.
- Graph schema and validator ensure deterministic codegen and safe edges.

## Modules
- UI: `components/ui/*`
- Auth: `lib/auth/*` + `middleware.ts`
- Editor: `components/editor/*` and `store/editorStore.ts`
- Graph: `lib/graph/schema.ts`, `lib/graph/validator.ts`
- Arduino: `lib/arduino/codeGenerator.ts`, `lib/arduino/uploader.ts`
- Utilities: `utils/constants.ts`, `utils/helpers.ts`
