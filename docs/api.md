# API

## POST `/api/auth/login`
- Body: `{ id: string, password: string }`
- Response: `{ ok: boolean, user?: { id, email }, error?: string }`

## POST `/api/auth/register`
- Disabled — returns 405.

## POST `/api/arduino/generate`
- Body: `{ graph: Graph }`
- Response: `{ code: string }`
- Deterministic code generation.

## POST `/api/arduino/upload`
- Body: `{ code?: string, port?: string, board?: string }`
- Response: `{ ok: boolean, message?: string }`
- Currently mocked; integration TODOs in uploader docs.
