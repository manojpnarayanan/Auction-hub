# /backend/Dockerfile
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy the rest of the application code
COPY . .

# Expose port (needs to match env)
EXPOSE 3000

# Start server using tsx directly
CMD ["npx", "tsx", "server.ts"]
