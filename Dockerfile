# Build stage
FROM oven/bun:1 AS builder

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json bun.lockb ./

# Install dependencies
RUN bun install --frozen-lockfile
RUN bun install --frozen-lockfile

# Copy source code
COPY . .

# Add build arguments for environment variables
ARG PORT
ARG VITE_CLIENT_ID
ARG VITE_AUTHORITY
ARG VITE_REDIRECT_URI
ARG VITE_API_BASE_URL
ARG VITE_VOS_ADMINISTRATOR_GROUP_ID
ARG VITE_VOS_VOICE_ENGINEER_GROUP_ID
ARG VITE_VOS_VENDOR_GROUP_ID
ARG VITE_VOS_READ_ONLY_GROUP_ID

# Set environment variables for build
ENV PORT=$PORT \
    VITE_CLIENT_ID=$VITE_CLIENT_ID \
    VITE_AUTHORITY=$VITE_AUTHORITY \
    VITE_REDIRECT_URI=$VITE_REDIRECT_URI \
    VITE_API_BASE_URL=$VITE_API_BASE_URL \
    VITE_VOS_ADMINISTRATOR_GROUP_ID=$VITE_VOS_ADMINISTRATOR_GROUP_ID \
    VITE_VOS_VOICE_ENGINEER_GROUP_ID=$VITE_VOS_VOICE_ENGINEER_GROUP_ID \
    VITE_VOS_VENDOR_GROUP_ID=$VITE_VOS_VENDOR_GROUP_ID \
    VITE_VOS_READ_ONLY_GROUP_ID=$VITE_VOS_READ_ONLY_GROUP_ID

# Build the application
RUN bun run build 

# Production stage
FROM nginx:1.25.4-alpine

# Add non-root user and set up permissions
RUN adduser -D -u 1001 appuser && \
    chown -R appuser:appuser /var/cache/nginx && \
    chown -R appuser:appuser /var/log/nginx && \
    chown -R appuser:appuser /etc/nginx/conf.d && \
    mkdir -p /var/run && \
    chown -R appuser:appuser /var/run && \
    touch /var/run/nginx.pid && \
    chown -R appuser:appuser /var/run/nginx.pid

# Copy nginx configuration
COPY deployement/nginx.conf /etc/nginx/nginx.conf
COPY deployement/default.conf /etc/nginx/conf.d/default.conf

# Copy build files from builder stage
COPY --from=builder --chown=appuser:appuser /app/build/ /usr/share/nginx/html/

# Use non-root user
USER 1001

# Expose port
EXPOSE $PORT

# Health check
HEALTHCHECK --interval=30s --timeout=3s \
    CMD wget --quiet --tries=1 --spider http://localhost:$PORT/health || exit 1

# Start nginx
CMD ["nginx", "-g", "daemon off;"]