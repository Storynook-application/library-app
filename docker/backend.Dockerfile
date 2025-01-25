# backend/Dockerfile

FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY backend/package*.json ./

# Install dependencies
RUN npm install

# Copy tsconfig.json
COPY backend/tsconfig.json ./

# Copy backend source code
COPY backend/src ./src

# Build the backend
RUN npm run build

# Expose port
EXPOSE 5000

# Start the backend
CMD ["node", "dist/server.js"]
