# Usar JDK para build
FROM eclipse-temurin:20-jdk-alpine AS build
WORKDIR /app

# Copiar pom.xml e baixar dependências
COPY pom.xml .
RUN mvn dependency:go-offline

# Copiar o código e construir o jar
COPY src ./src
RUN mvn clean package -DskipTests

# Runtime: imagem leve com OpenJDK
FROM eclipse-temurin:20-jre-alpine
WORKDIR /app

# Copiar jar buildado
COPY --from=build /app/target/*.jar app.jar

# Expõe a porta padrão do Spring Boot
EXPOSE 8080

# Comando padrão
ENTRYPOINT ["java","-jar","app.jar"]
