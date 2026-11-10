# Production Dockerfile for TidySpace AI
FROM node:22-alpine

WORKDIR /app

# Install dependencies first for optimal Docker layer caching
COPY package*.json ./
RUN npm ci

# Copy all application code
COPY . .

# Build the frontend production bundle
RUN npm run build

# Expose standard port
ENV PORT=3000
ENV NODE_ENV=production
EXPOSE 3000

# Start Express full-stack server
CMD ["npm", "run", "start"]
