# Use official golang image as builder
FROM golang:1.23.2-alpine AS builder

# Install build dependencies
RUN apk add --no-cache git gcc musl-dev

# Set working directory
WORKDIR /app

# Copy go mod files
COPY go.mod go.sum ./

# Download dependencies
RUN go mod download

# Copy source code
COPY . .

# Build the application
RUN go build -o stiller-server ./cmd/serve

# Final stage - minimal runtime image
FROM alpine:latest

# Install runtime dependencies
RUN apk add --no-cache ca-certificates tzdata

# Create app user
RUN addgroup -g 1000 appuser && \
    adduser -D -u 1000 -G appuser appuser

# Set working directory
WORKDIR /app

# Copy binary from builder
COPY --from=builder /app/stiller-server .

# Copy config file
COPY config.go .

# Create directories for volumes
RUN mkdir -p /app/static /app/db && \
    chown -R appuser:appuser /app

# Switch to non-root user
USER appuser

# Expose port (default 6969, can be configured via .env)
EXPOSE 6969

# Run the application
CMD ["./stiller-server"]
