# Code Generation

- Input: `Graph` (typed nodes + edges).
- Pin modes inferred from node types (OUTPUT for DigitalWrite, INPUT for AnalogRead).
- Output: Arduino C++ with `setup()` and `loop()`.
- Deterministic ordering governed by topological sort.

File: `lib/arduino/codeGenerator.ts`.
