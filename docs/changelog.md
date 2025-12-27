# Changelog

## [Unreleased] - 2025-12-27

### UI/UX Improvements
- **Global Visual Overhaul**: Transitioned to a "Dark Tech" aesthetic with Glassmorphism elements.
- **New Background System**:
  - Implemented `SubtleCircuitBackground` component.
  - Features abstract, high-visibility circuit traces with animated data pulses.
  - Replaced previous "Arduino PCB" and generic circuit backgrounds for a cleaner look.
  - Applied to Landing, Login, and Register pages.
- **Landing Page**:
  - Updated to use the new subtle background.
  - Navbar and content containers updated with transparent/glass styles to blend with the new background.
- **Authentication Pages**:
  - **Login**: Unified look with Landing page, using transparent containers and the shared background.
  - **Register**: Aligned with Login page styling.

### Components
- **SubtleCircuitBackground**: A reusable, optimized SVG background component using Framer Motion for performance-friendly animations.
