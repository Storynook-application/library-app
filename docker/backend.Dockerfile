FROM node:16-alpine

WORKDIR /app

COPY backend/package.json backend/package-lock.json ./
RUN npm install

COPY backend/ ./
RUN npm run build

EXPOSE 5000

CMD ["npm", "start"]