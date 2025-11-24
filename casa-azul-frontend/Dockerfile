FROM node:20 AS build
WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# SSR server
FROM node:20
WORKDIR /app

COPY --from=build /app/dist /app/dist

EXPOSE 4000
CMD ["node", "dist/Intranet-Front/server/server.mjs"]
