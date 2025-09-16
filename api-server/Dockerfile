# ----- Estágio 1: Build -----
FROM node:18-alpine AS builder
WORKDIR /app
COPY package.json ./
COPY package-lock.json ./
RUN npm install
COPY . .
RUN npm run build

# ----- Estágio 2: Production -----
FROM node:18-alpine
WORKDIR /app
COPY package.json ./
COPY package-lock.json ./
RUN npm install --omit=dev
COPY --from=builder /app/dist ./dist

# A linha EXPOSE foi removida daqui. O docker-compose vai cuidar disso.

CMD ["node", "dist/server.js"]