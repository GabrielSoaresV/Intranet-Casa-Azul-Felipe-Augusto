FROM node:20 AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 4200

CMD ["bash", "-c", "npm install -g @angular/cli && ng serve --host 0.0.0.0 --port 4200 --open"]
