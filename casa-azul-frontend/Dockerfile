FROM node:20 AS build
WORKDIR /app

# Copia package.json e instala dependências
COPY package*.json ./
RUN npm install

# Copia todo o projeto
COPY . .

# 🔥 Angular 20 não usa "build:ssr"
RUN npm run build

FROM node:20
WORKDIR /app

# Copia dist do Angular buildado
COPY --from=build /app/dist/ dist/

# Instala dependências para rodar o SSR (Express etc)
COPY package*.json ./
RUN npm install --omit=dev

EXPOSE 4000

# Comando SSR correto
CMD ["node", "dist/server/server.mjs"]
