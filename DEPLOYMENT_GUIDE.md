# Pavithra Enterprises ERP - Deployment Guide

## Prerequisites
- Java 21 JDK
- Node.js 18+ and npm
- MySQL 8.0+

## 1. Database Setup
1. Open your MySQL terminal or Workbench.
2. Create the database: `CREATE DATABASE pavithra_erp_db;`
3. The Spring Boot application will automatically generate all tables on startup (thanks to `hibernate.ddl-auto: update`).

## 2. Backend (Spring Boot) Deployment
1. Navigate to the `backend` directory.
2. Build the JAR file:
   ```bash
   ./mvnw clean package -DskipTests
   ```
3. Run the application:
   ```bash
   java -jar target/erp-0.0.1-SNAPSHOT.jar
   ```
   *The backend will start on `http://localhost:8080`.*

## 3. Frontend (React + Vite) Deployment
1. Navigate to the `frontend` directory.
2. Install dependencies (if you haven't already):
   ```bash
   npm install
   ```
3. Build the production bundle:
   ```bash
   npm run build
   ```
4. Serve the `dist` directory using a web server like Nginx, Apache, or a simple Node server:
   ```bash
   npx serve -s dist
   ```

## Production Recommendations
- **Database:** Change `hibernate.ddl-auto` to `validate` and use tools like **Flyway** or **Liquibase** for schema migrations.
- **Security:** Ensure the JWT Secret Key (`application.security.jwt.secret-key`) is injected via environment variables.
- **APIs:** Replace the mocked `NotificationService`, `OcrService`, and `AiService` implementations with real HTTP clients to Twilio, Google Vision, and OpenAI respectively.
