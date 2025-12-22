# CI/CD Notes

- Build Docker image in CI using your registry (e.g., GHCR, ECR, GCR).
- Push on main branch or tags.
- Deploy using your preferred platform (e.g., Kubernetes, ECS, Azure Web Apps for Containers).

Minimal steps:
1. `docker build -t <registry>/arduino-visual-scripting:<tag> .`
2. `docker push <registry>/arduino-visual-scripting:<tag>`
3. Deploy rollout.

Tip: Parameterize env secrets (Supabase keys, session secret) via CI secret store.
