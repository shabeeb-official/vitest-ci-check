# Stage 1: Build
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install --force
COPY . .
RUN npm run build

# Stage 2: Serve with Node
FROM node:18-alpine
WORKDIR /app

# Install a simple static file server
RUN npm install -g serve

# Copy build files from the builder stage
# NOTE: Check if your project uses 'dist' or 'build'
COPY --from=builder /app/build ./build
COPY --from=builder /app/loader.js ./build

EXPOSE 3000

# Update healthcheck to work with the Node server
HEALTHCHECK --interval=30s --timeout=3s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost:3000/ || exit 1

# Start the server on port 3000
CMD ["serve", "-s", "build", "-l", "3000"]
