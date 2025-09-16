# ----- Estágio 1: Build -----
# Usamos a mesma imagem base leve do Node.js
FROM node:18-alpine AS builder

# Define o diretório de trabalho
WORKDIR /app

# Copia os arquivos de dependência e as instala
COPY package.json ./
COPY package-lock.json ./
# Usaremos 'npm ci' que é otimizado para ambientes de CI/CD e usa o package-lock.json
RUN npm ci

# Copia o resto do código fonte
COPY . .

# Compila o TypeScript para JavaScript
RUN npm run build


# ----- Estágio 2: Production -----
# Começa com uma imagem limpa
FROM node:18-alpine

WORKDIR /app

# Copia os arquivos de dependência
COPY package.json ./

# Instala apenas as dependências de produção
RUN npm install --omit=dev

# Copia o código JavaScript compilado do estágio 'builder'
COPY --from=builder /app/dist ./dist

# Comando para iniciar o worker quando o container rodar
CMD ["node", "dist/worker.js"]