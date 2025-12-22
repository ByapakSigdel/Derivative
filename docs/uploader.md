# Uploader Pipeline

Status: Mocked implementation.

File: `lib/arduino/uploader.ts`.

Objectives:
- Board detection via WebSerial or Arduino CLI.
- Port selection.
- Compile and upload steps.
- Console logs + error handling.

Decoupling:
- Keep all upload logic in `lib/arduino/*` for UI independence and mockability.
