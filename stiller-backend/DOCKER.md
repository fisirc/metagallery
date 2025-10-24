# Docker Deployment Guide

## Prerequisites

- Docker installed
- Docker Compose installed (optional, but recommended)

## Quick Start with Docker Compose

1. **Create your environment file:**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

2. **Create required directories:**
   ```bash
   mkdir -p static db
   ```

3. **Build and run:**
   ```bash
   docker-compose up -d
   ```

4. **View logs:**
   ```bash
   docker-compose logs -f
   ```

5. **Stop the container:**
   ```bash
   docker-compose down
   ```

## Using Docker Directly

### Build the image:
```bash
docker build -t stiller-backend .
```

### Run the container:
```bash
docker run -d \
  --name stiller-backend \
  -p 6969:6969 \
  -v $(pwd)/static:/app/static \
  -v $(pwd)/db:/app/db \
  -v $(pwd)/.env:/app/.env:ro \
  stiller-backend
```

## Volume Mounts

The application uses two main directories that are mounted as volumes:

- **`./static`** - Stores uploaded files and user data
- **`./db`** - Contains the SQLite database file

These directories are persisted on the host machine, so your data survives container restarts.

## Environment Variables

Configuration is done via the `.env` file or environment variables:

| Variable | Description | Default |
|----------|-------------|---------|
| `Addr` | Server bind address | `:6969` |
| `Host` | Public host URL | `http://localhost:6969/` |
| `FilesPath` | Path to file storage | `/app/static/` |
| `DBPath` | Path to SQLite database | `/app/db/stiller.db` |
| `Secret` | JWT secret key | (required) |
| `BCryptCost` | BCrypt hashing cost | `10` |
| `Admin` | Admin username | (required) |

## Database Initialization

On first run, initialize the database:

```bash
# Copy your SQL schema into the container
docker cp db/create.sql stiller-backend:/app/db/

# Execute the schema
docker exec -it stiller-backend sqlite3 /app/db/stiller.db < /app/db/create.sql
```

Or mount the database file directly if you already have one.

## Development vs Production

### Development
Use the provided `docker-compose.yml` with volume mounts for easy development.

### Production
- Use stronger `Secret` values
- Set `Host` to your public domain
- Consider using environment variables instead of `.env` file
- Set appropriate `BCryptCost` (higher = more secure, but slower)
- Use proper SSL/TLS termination (nginx, traefik, etc.)

## Troubleshooting

### Check container logs:
```bash
docker logs stiller-backend
```

### Access container shell:
```bash
docker exec -it stiller-backend sh
```

### Check if directories are properly mounted:
```bash
docker exec stiller-backend ls -la /app/static
docker exec stiller-backend ls -la /app/db
```

### Restart the container:
```bash
docker-compose restart
# or
docker restart stiller-backend
```

## Updating the Application

1. Pull latest code
2. Rebuild the image:
   ```bash
   docker-compose build --no-cache
   ```
3. Restart the container:
   ```bash
   docker-compose up -d
   ```

Your data in `static/` and `db/` will be preserved.
