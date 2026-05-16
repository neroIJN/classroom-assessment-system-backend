# Classroom Assessment System - Backend

This repository contains the backend API for the Classroom Assessment System. It is a TypeScript Node.js application using Express and Redis for session/auxiliary data.

## Features
- REST API for assignments, essays, feedback, results, users, and violations
- JWT authentication
- Redis integration
- Dockerfile included for containerized deployment

## Prerequisites
- Node.js 16+ (or compatible)
- npm or yarn
- Redis (if using Redis features)
- Docker (optional, for containerized runs)

## Environment variables
Create a `.env` file in the project root (the repository includes an example `.env` in some setups). Common environment variables used by the app:

- `PORT` - server listen port (default: `3000`)
- `DATABASE_URL` or DB-related vars - database connection string
- `JWT_SECRET` - secret for signing JWTs
- `REDIS_URL` - Redis connection URL
- `SMTP_*` - mail transport configuration used by `sendMail.ts`

Adjust these in your environment or `.env` before running.

## Install
From the project root (`server/`):

```bash
npm install
# or
yarn install
```

## Development
Run the app in development mode (hot-reload if configured with nodemon):

```bash
npm run dev
```

Available scripts are defined in `package.json`.

## Production / Build
To compile TypeScript and run the compiled app:

```bash
npm run build
npm start
```

## Docker
Build and run the Docker image (from the `server/` directory):

```bash
docker build -t classroom-assessment-backend .
docker run -e PORT=3000 -p 3000:3000 --env-file .env classroom-assessment-backend
```

## Project structure (key files)

- `app.ts` - Express app setup
- `server.ts` - server bootstrap (listen)
- `package.json` - npm scripts and dependencies
- `Dockerfile` - container build instructions
- `tsconfig.json` - TypeScript config
- `controllers/` - route controllers (e.g., `user.controller.ts`)
- `services/` - business logic services
- `models/` - database models and schemas
- `routes/` - route definitions
- `middleware/` - express middleware (auth, error handling, validation)
- `utils/` - helper utilities (db, jwt, mail, redis)

Refer to the code for more details; the main entry points are `app.ts` and `server.ts`.

## Running tests
If tests are added, run:

```bash
npm test
```

## Contributing
- Fork the repo, create a feature branch, open a PR with tests/docs updates.

## Troubleshooting
- Check `logs` (if configured) and the environment variables.
- Ensure Redis and database services are reachable.

## License
This project does not include a license file. Add a `LICENSE` at the project root if you wish to define terms.

---
Created to help onboard developers to the Classroom Assessment System backend.
