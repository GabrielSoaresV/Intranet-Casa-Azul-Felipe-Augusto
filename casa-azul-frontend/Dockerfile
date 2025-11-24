# Build Angular SSR
FROM node:20 AS build
WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build:ssr

# Runtime
FROM node:20
WORKDIR /app

COPY --from=build /app/dist/ dist/
COPY --from=build /app/node_modules node_modules/

EXPOSE 4000
CMD ["node", "dist/server/server.mjs"]
