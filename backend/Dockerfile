# Dockerfile for Backend
FROM node:20-slim

# Install OpenSSL for Prisma client
RUN apt-get update && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*

WORKDIR /usr/src/app

# Copy package files and prisma schema
COPY package*.json ./
COPY prisma ./prisma/

# Install dependencies
RUN npm ci

# Copy the rest of the application
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Expose port
EXPOSE 5000

# Use docker-entrypoint script
ENTRYPOINT ["./docker-entrypoint.sh"]
