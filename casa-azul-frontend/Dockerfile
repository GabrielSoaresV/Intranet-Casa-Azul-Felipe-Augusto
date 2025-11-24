FROM node:20 AS build
WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# ---- SERVIDOR NGX-LITE (leve, simples)
FROM node:20
WORKDIR /app

# Instala um servidor leve de arquivos estáticos
RUN npm install -g http-server

COPY --from=build /app/dist/ dist/

EXPOSE 4200

CMD ["http-server", "dist", "-p", "4200", "-a", "0.0.0.0"]
