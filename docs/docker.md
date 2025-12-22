# Docker

## Build (Production)
```bash
docker build -t arduino-visual-scripting:latest .
```

## Run
```bash
docker run --rm -p 3000:3000 \
  -e SUPABASE_URL=your-url \
  -e SUPABASE_ANON_KEY=your-key \
  -e BACKDOOR_ID=admin -e BACKDOOR_PASSWORD=admin \
  arduino-visual-scripting:latest
```

## Compose (Dev)
See `docker-compose.yml` for environment and port mapping.
