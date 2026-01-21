# Quiz Builder

A simple full-stack quiz builder application.

Users can create quizzes with different question types and view them in a list or detail page.

---

## Tech Stack

### Frontend

- Next.js
- React
- TypeScript

### Backend

- NestJS
- TypeScript
- Prisma ORM

### Database

- PostgreSQL (via Docker)

---

## Project Structure

```md
quiz-builder/
├── backend/ # NestJS API + Prisma
├── frontend/ # Next.js app
└── README.md
```

---

## Prerequisites

Make sure you have installed:

- **Node.js** 18+
- **Docker Desktop**

---

## 1. Database Setup (PostgreSQL)

### Start PostgreSQL using Docker

Run once:

```bash
docker run --name qb-postgres \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=quiz_builder \
  -p 5432:5432 \
  -d postgres:16
```

If the container already exists:

```bash
docker start qb-postgres
```

Verify:

```bash
docker ps
```

## 2. Backend Setup (NestJS)

Install dependencies

```bash
cd backend
npm install
```

Environment variables

Create backend/.env:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/quiz_builder?schema=public"
PORT=3001
```

Run database migrations

```bash
npx prisma migrate dev --name init
```

(Optional) Open Prisma Studio:

```bash
npx prisma studio
```

Start backend server

```bash
npm run start:dev
```

Backend will run on:

```bash
http://localhost:3001
```

Test:

```bash
curl http://localhost:3001/quizzes
```

## 3. Frontend Setup (Next.js)

Install dependencies

```bash
cd frontend
npm install
```

Environment variables
Create frontend/.env.local:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

Important: restart the dev server after changing env variables.

Start frontend

```bash
npm run dev
```

Frontend runs on:

```bash
http://localhost:3000
```

## 4. Application Pages

Create quiz
http://localhost:3000/create

Quiz list
http://localhost:3000/quizzes

Quiz details
http://localhost:3000/quizzes/:id

## 5. Creating Sample Quizzes

Option A: Using the UI

1. Go to /create
2. Enter quiz title
3. Add questions (boolean, input, checkbox)
4. Click Create quiz

Option B: Using curl

```bash
curl -X POST http://localhost:3001/quizzes \
  -H "Content-Type: application/json" \
  -d '{"title":"Sample Quiz","questions":[{"type":"boolean","text":"2+2=4?","correctBoolean":true}]}'

```

| Method | Endpoint       | Description      |
| ------ | -------------- | ---------------- |
| POST   | `/quizzes`     | Create a quiz    |
| GET    | `/quizzes`     | List quizzes     |
| GET    | `/quizzes/:id` | Get quiz details |
| DELETE | `/quizzes/:id` | Delete quiz      |
