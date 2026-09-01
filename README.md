# Interview Prep AI 🤖

A full-stack AI interview preparation platform built with React, Node.js, Express, MongoDB and Google Gemini. Users can create role-specific practice sessions, generate interview questions with AI, save questions, pin important topics, and request deeper explanations while preparing.

## Highlights

- 🔐 JWT-based authentication with hashed passwords
- 🎯 Personalized interview sessions by role, experience, topics and difficulty
- 🤖 Gemini-powered question and answer generation
- 🧠 AI concept explanations for difficult questions
- 📌 Pin questions for revision
- 🔎 Search and filter questions and interview sessions
- ➕ Generate additional questions without creating a new session
- 📊 Dashboard with session and question activity statistics
- 👤 Profile image upload
- 📱 Responsive, modern UI with animated interactions
- 🛡️ Protected APIs with ownership checks
- ☁️ Ready for GitHub + Render deployment

## Tech Stack

**Frontend:** React 19, Vite, Tailwind CSS, React Router, Axios, Framer Motion, React Markdown, React Icons

**Backend:** Node.js, Express 5, MongoDB, Mongoose, JWT, bcryptjs, Multer

**AI:** Google Gemini API via `@google/genai`

**Deployment:** GitHub + Render

## Architecture

```text
Browser
   │
   │ REST API + JWT
   ▼
React + Vite ───────────────► Express + Node.js
                                  │       │
                                  │       ├── MongoDB Atlas
                                  │       │
                                  │       └── Gemini API
                                  │
                                  └── Protected routes
```

## Project Structure

```text
Interview-Prep/
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middlewares/
│   ├── models/
│   ├── routes/
│   ├── utils/
│   ├── package.json
│   └── server.js
│
├── frontend/
│   └── interview-prep-ai/
│       ├── public/
│       ├── src/
│       │   ├── assets/
│       │   ├── components/
│       │   ├── context/
│       │   ├── pages/
│       │   └── utils/
│       ├── package.json
│       └── vite.config.js
│
├── .gitignore
└── README.md
```

## Local Setup

### 1. Clone

```bash
git clone <your-github-repository-url>
cd Interview-Prep
```

### 2. Backend

```bash
cd backend
npm install
```

Create `backend/.env` locally:

```env
PORT=8000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_long_random_secret
GEMINI_API_KEY=your_gemini_api_key
FRONTEND_URL=http://localhost:5173
GEMINI_MODEL=gemini-2.0-flash-lite
```

Start the backend:

```bash
npm run dev
```

The API runs on `http://localhost:8000` by default.

Health check:

```text
GET /api/health
```

### 3. Frontend

Open a second terminal:

```bash
cd frontend/interview-prep-ai
npm install
```

Create `frontend/interview-prep-ai/.env` locally:

```env
VITE_API_BASE_URL=http://localhost:8000
```

Start Vite:

```bash
npm run dev
```

## Production Build

Frontend:

```bash
cd frontend/interview-prep-ai
npm run build
```

Backend:

```bash
cd backend
npm start
```

## Main API Endpoints

### Authentication

```text
POST /api/auth/register
POST /api/auth/login
GET  /api/auth/profile
POST /api/auth/upload-image
```

### Interview Sessions

```text
POST   /api/sessions/create
GET    /api/sessions/my-sessions
GET    /api/sessions/:id
DELETE /api/sessions/:id
```

### Questions

```text
POST /api/questions/add
POST /api/questions/:id/pin
POST /api/questions/:id/note
```

### AI

```text
POST /api/ai/generate-questions
POST /api/ai/generate-explanation
```

## Deployment on Render

Create two Render services from the same GitHub repository.

### Backend — Web Service

- **Root Directory:** `backend`
- **Build Command:** `npm install`
- **Start Command:** `npm start`

Add these Render environment variables:

```text
PORT=8000
MONGODB_URI=...
JWT_SECRET=...
GEMINI_API_KEY=...
FRONTEND_URL=https://your-frontend.onrender.com
```

### Frontend — Static Site

- **Root Directory:** `frontend/interview-prep-ai`
- **Build Command:** `npm install && npm run build`
- **Publish Directory:** `dist`

Add:

```text
VITE_API_BASE_URL=https://your-backend.onrender.com
```

Do not commit any `.env` file. Add environment variables through Render instead.

## Security Notes

- `.env` and `.env.*` are ignored by Git.
- Never commit MongoDB credentials, JWT secrets or Gemini keys.
- Gemini calls are performed by the backend so the AI credential is not required in the React UI.
- Protected question/session mutations verify that the authenticated user owns the resource.

## Future Enhancements

- Interview answer recording and AI scoring
- Skill-wise performance analytics
- Resume upload and resume-based interview generation
- Interview history and progress trends
- Redis caching and rate limiting
- Role-specific question banks
- Dockerized production deployment

## License

Educational and portfolio project.
