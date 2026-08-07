# TrackFolio — Job Application Tracker

A full-stack MERN app for tracking job applications: sign up, log in, add applications
with a status (Wishlist → Applied → OA → Interview → Offer/Rejected), filter/search them,
and see a live stats breakdown.

## Stack
- **Backend:** Node.js, Express, MongoDB (Mongoose), JWT auth, bcrypt password hashing
- **Frontend:** React (Vite), React Router, plain fetch (no extra HTTP lib)

## Project structure
```
trackfolio/
  backend/
    models/        User.js, Application.js
    routes/         auth.js, applications.js
    middleware/     auth.js (JWT verification)
    server.js
  frontend/
    src/
      api/client.js         fetch wrapper for the backend
      context/AuthContext.jsx  stores token/user, persists to localStorage
      components/           ApplicationForm, ApplicationList, StatsCard
      pages/                Login, Register, Dashboard
      App.jsx, main.jsx, index.css
```

## Running it locally

### 1. Backend
```bash
cd backend
cp .env.example .env       # then edit MONGO_URI and JWT_SECRET
npm install
npm run dev                # starts on http://localhost:5000
```
You need a MongoDB instance — either install MongoDB locally, or use a free
MongoDB Atlas cluster and paste its connection string into `MONGO_URI`.

### 2. Frontend
```bash
cd frontend
npm install
npm run dev                # starts on http://localhost:5173
```
The Vite dev server proxies `/api/*` requests to the backend on port 5000
(see `vite.config.js`), so you don't need CORS config changes for local dev.

### 3. Try it
Open http://localhost:5173, sign up, then add a few applications.

## API reference

| Method | Route                    | Auth | Description                    |
|--------|---------------------------|------|--------------------------------|
| POST   | /api/auth/register        | No   | Create account, returns JWT    |
| POST   | /api/auth/login            | No   | Log in, returns JWT            |
| GET    | /api/applications          | Yes  | List (supports ?status=&search=) |
| GET    | /api/applications/stats    | Yes  | Counts by status               |
| POST   | /api/applications          | Yes  | Create an application          |
| PUT    | /api/applications/:id      | Yes  | Update an application          |
| DELETE | /api/applications/:id      | Yes  | Delete an application          |

All `/api/applications*` routes require an `Authorization: Bearer <token>` header.

## Deploying (for your resume link)
- **Backend:** Render or Railway (free tier), point MONGO_URI at Atlas
- **Frontend:** Vercel or Netlify, set the API base URL to your deployed backend
  (change `BASE_URL` in `src/api/client.js` or use an env var)

## What this demonstrates (for interviews)
- REST API design with proper status codes and validation
- Password hashing (bcrypt) and stateless auth (JWT)
- Protected routes on both backend (middleware) and frontend (ProtectedRoute)
- MongoDB aggregation pipeline (the `/stats` endpoint)
- React state management with Context, controlled forms, and derived UI (filters/search)

## Ideas to extend it further
- Add pagination to the applications list
- Add a "reminders" field + email notifications for follow-ups
- Add a Kanban-style board view (drag between status columns)
- Write tests (Jest + Supertest for backend, React Testing Library for frontend)
- Add role-based access if you ever want a "recruiter view"
