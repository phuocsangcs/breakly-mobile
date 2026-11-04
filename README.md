<!-- Monorepo documentation overview describing Breakly mobile architecture, module responsibilities, and local workflows. -->
# Breakly Mobile (`breakly-mobile`)

> A Time-Boxed Mobile Chill Room for Mindful Micro-Breaks  
> HCMUT -- Mobile Application Development (CO3043 / CC01) -- Academic Year 2026--2027


Welcome to the **Breakly** monorepo (`breakly-mobile`). Breakly is a mind-refreshment companion app combining interactive virtual spaces, ambient sound stations, and micro-learning breaks.

## Repository Structure

```
breakly-mobile/
├── .github/
│   └── workflows/          # CI/CD workflows for frontend, backend, and deployment
├── docs/                   # Architecture and technical design documentation
├── src/
│   ├── frontend-mobile/    # Expo, React Native, TypeScript, Expo Router
│   ├── backend/            # Spring Boot, Maven, Java 21, Flyway, PostgreSQL
│   └── infra/              # Docker Compose, Caddy reverse proxy, Ansible playbooks
└── report/                 # Academic report LaTeX sources
```

## Projects Overview

### 1. Frontend Mobile (`src/frontend-mobile`)
- **Framework**: Expo SDK (React Native 0.88+, React 19)
- **Routing**: Expo Router (`src/app/` with `(auth)` and `(main)` route groups)
- **Architecture**: Feature-driven (`src/features/{auth, session, radio, news, tv, history, settings, space}`) with ViewModel hooks and repositories
- **Type Checking**: TypeScript (`npx tsc --noEmit`)

### 2. Backend Service (`src/backend`)
- **Framework**: Spring Boot (Java 21, Maven)
- **Architecture**: Package-by-feature (`com.breakly.{config, common, auth, session, preference, content}`)
- **Persistence**: PostgreSQL, Spring Data JPA, Flyway migrations (`V1__init.sql`)
- **Testing**: Testcontainers + PostgreSQL

### 3. Infrastructure (`src/infra`)
- **Containerization**: Multi-stage Dockerfile and Docker Compose (`compose.dev.yml`, `compose.prod.yml`)
- **Gateway & SSL**: Caddy reverse proxy with automatic TLS
- **Automation**: Ansible playbooks (`provision.yml`, `deploy.yml`) and roles (`docker`, `app`, `backup`)

## Quick Start

```cmd
# 1. Start PostgreSQL Database
docker compose -f src/infra/docker/compose.dev.yml up -d postgres

# 2. Run Backend (Spring Boot - Port 8080)
cd src/backend && mvnw spring-boot:run

# 3. Run Frontend (Expo)
cd src/frontend-mobile && npm start
```


