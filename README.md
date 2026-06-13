# Management Dashboard

A fullstack management dashboard with an Angular 19 frontend and a Node.js/Express backend. Includes customer management, a data dashboard with charts, and JWT-based authentication.

**Stack:** Node.js 22 · Express 4.18 · Angular 19.2 · Angular Material · Chart.js · TypeScript 5.7

---

## Prerequisites

- Node.js 18+
- npm 9+

---

## Getting Started

### 1. Install dependencies

```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

### 2. Start the backend

```bash
cd backend
npm run dev       # nodemon, auto-reloads on change
# or
npm start         # plain node
```

API runs at `http://localhost:3000`.

### 3. Start the frontend

```bash
cd frontend
npm start
```

App runs at `http://localhost:4200`.

> The frontend dev server proxies nothing — the Angular services call `http://localhost:3000/api` directly. Both servers must be running at the same time.

---

## API Documentation

Once the backend is running, the full API reference is available via Swagger at `http://localhost:3000/api-docs`.

---

## Testing

### Unit tests (Karma + Jasmine)

```bash
cd frontend
npm test
```

### End-to-end tests (Playwright)

Requires the Angular dev server to be running first.

```bash
# One-time: install Chromium browser binary
cd frontend
npx playwright install chromium

# Run e2e suite
npm run e2e

# Interactive UI mode
npx playwright test --ui

# Headed (visible browser)
npx playwright test --headed
```

Test results and failure screenshots are written to `frontend/e2e/test-results/`.

---

## Environment

The backend JWT secret is hardcoded for development. Before deploying, set it via environment variable:

```bash
JWT_SECRET=your-strong-secret node server.js
```

The CORS origin is set to `http://localhost:4200`. Update `server.js` if your frontend runs on a different port.
