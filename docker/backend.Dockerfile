FROM node:18-alpine

# 1. Add build dependencies for native modules like bcrypt
RUN apk add --no-cache python3 make g++

# 2. Create app directory
WORKDIR /app

# 3. Copy ONLY package files first
COPY backend/package*.json ./

# 4. Install Node modules (including bcrypt) *inside* the container
RUN npm install

# 5. Copy the rest of your backend code
COPY backend/ ./

# 6. Build (if you have a TS build step)
RUN npm run build

EXPOSE 5000
CMD ["npm", "start"]
