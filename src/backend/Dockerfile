# Multi-stage Dockerfile building the Spring Boot jar with JDK 21 and running on a minimal JRE 21 alpine image.

# Build Stage
FROM maven:3.9-eclipse-temurin-21-alpine AS builder
WORKDIR /app
COPY pom.xml ./
COPY src ./src
RUN mvn -B clean package -DskipTests

# Run Stage
FROM eclipse-temurin:21-jre-alpine AS runner
WORKDIR /app
RUN addgroup -S breakly && adduser -S breakly -G breakly
USER breakly:breakly
COPY --from=builder /app/target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]

