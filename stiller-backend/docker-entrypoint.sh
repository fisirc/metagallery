#!/bin/sh
# Docker startup script for stiller-backend

echo "Starting Stiller Backend..."
echo "Checking mounted directories..."

# Check if directories exist
if [ ! -d "/app/static" ]; then
    echo "ERROR: /app/static directory not mounted!"
    exit 1
fi

if [ ! -d "/app/db" ]; then
    echo "ERROR: /app/db directory not mounted!"
    exit 1
fi

# Check if .env exists
if [ ! -f "/app/.env" ]; then
    echo "WARNING: .env file not found. Using environment variables or defaults."
fi

# Display configuration (without secrets)
echo "Configuration:"
echo "  Addr: ${Addr:-:6969}"
echo "  FilesPath: ${FilesPath:-/app/static/}"
echo "  DBPath: ${DBPath:-/app/db/stiller.db}"

# Start the application
echo "Starting server..."
exec ./stiller-server
