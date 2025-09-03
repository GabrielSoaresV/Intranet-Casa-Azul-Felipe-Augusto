# ---------- Build Angular ----------
FROM node:20 AS build-angular
WORKDIR /frontend
COPY Intranet-Front/ .
RUN npm install
RUN npm run build --prod

# ---------- Build Spring Boot ----------
FROM maven:3.9.4-eclipse-temurin-17 AS build-backend
WORKDIR /backend
COPY avaliacao-backend/ .
RUN mvn clean package -DskipTests

# ---------- Final Image ----------
FROM eclipse-temurin:17-jdk-alpine
WORKDIR /app

# Copiar jar do backend
COPY --from=build-backend /backend/target/*.jar app.jar

# Copiar build do Angular para resources/public
COPY --from=build-angular /frontend/dist/Intranet-Front /app/public

# Expor porta
EXPOSE 8080

# Rodar a aplicação
ENTRYPOINT ["java", "-jar", "app.jar"]
