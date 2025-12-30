# CI/CD Integration

The project uses GitHub Actions for Continuous Integration and Continuous Deployment.

## Workflow: `ci.yml`

The pipeline is defined in `.github/workflows/ci.yml` and consists of two main jobs:

### 1. Build and Test (`build-and-test`)
Runs on every push and pull request to `main`.
- **Environment**: Node.js 20 on Ubuntu Latest.
- **Steps**:
  - Checkout code.
  - Install dependencies (`npm ci`).
  - Run Linter (`npm run lint`).
  - Build Next.js application (`npm run build`).

### 2. Docker Build (`docker-build`)
Runs only on pushes to `main`, after `build-and-test` succeeds.
- **Steps**:
  - Set up Docker Buildx.
  - Login to GitHub Container Registry (GHCR).
  - Build the Docker image from the root `Dockerfile`.
  - Push the image to `ghcr.io/<owner>/derivative` with tags `latest` and the commit SHA.

## Secrets Configuration
For the build to succeed, ensure the following secrets are set in the GitHub Repository settings:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## Deployment
Currently, the pipeline publishes the Docker image. To deploy:
1. Pull the image from GHCR: `docker pull ghcr.io/<owner>/derivative:latest`
2. Run it on your target infrastructure (VPS, Kubernetes, etc.).

## Manual Build
To build the image locally:
```bash
docker build -t derivative:local .
```
