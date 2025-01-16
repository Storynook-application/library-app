Project Setup
Welcome to the Open-Source Library App project! This guide explains how to set up the development environment for both the frontend and backend, as well as how to run everything locally using Docker.

Table of Contents
Prerequisites
Repository Structure
Local Environment Setup (Manual)
Backend Setup
Frontend Setup
Docker Setup
Building and Running Containers
Accessing the App
Environment Variables
Common Issues & Troubleshooting
Additional Resources
1. Prerequisites
Node.js (v16.x or above)
npm (v7.x or above)
Docker (v20.x or above)
Docker Compose (v2.x or above)
Git (for cloning this repository)
We recommend using Node 16 to match our Docker containers. If you don’t already have Docker installed, download Docker Desktop from:

Docker Desktop for Windows
Docker Desktop for Mac
Docker Engine on Linux
2. Repository Structure
java
Code kopiëren
library-app/
├── backend/
│   ├── package.json
│   ├── package-lock.json
│   ├── src/
│   ├── dist/
│   ├── tsconfig.json
│   └── ...
├── frontend/
│   ├── package.json
│   ├── package-lock.json
│   ├── src/
│   ├── public/
│   └── ...
├── docker/
│   ├── backend.Dockerfile
│   ├── frontend.Dockerfile
│   ├── docker-compose.yml
│   └── ...
├── docs/
│   ├── setup.md  <-- You are here!
│   └── ...
├── .github/
│   └── workflows/
├── README.md
└── LICENSE
Key Folders

backend: Contains the Node.js/Express (TypeScript) server code.
frontend: Contains the React (TypeScript) frontend.
docker: Dockerfiles and Docker Compose setup for containerizing and running the entire application.
docs: Documentation files, like this setup.md.
3. Local Environment Setup (Manual)
If you want to run the app without Docker (helpful for debugging or active local development), follow these steps.

3.1 Backend Setup
Install Dependencies

bash
Code kopiëren
cd backend
npm install
Build & Run

Build the TypeScript code:
bash
Code kopiëren
npm run build
Start the server:
bash
Code kopiëren
npm start
The backend should be running at http://localhost:5000.
3.2 Frontend Setup
Install Dependencies

bash
Code kopiëren
cd frontend
npm install
Run in Development Mode

bash
Code kopiëren
npm start
The frontend should be running at http://localhost:3000.
Production Build (Optional)

bash
Code kopiëren
npm run build
Creates an optimized build in the build/ folder.
4. Docker Setup
If you prefer a more consistent environment or plan to deploy in containers, use Docker Compose. This will set up:

A Postgres database (running in a container).
The backend Node/Express service.
The frontend React service.
4.1 Building and Running Containers
Navigate to the docker Directory

bash
Code kopiëren
cd docker
Run Docker Compose

bash
Code kopiëren
docker compose up --build
This command builds all images and starts the services in the background.
Monitor Logs (Optional)

Keep the terminal open to see logs for each container (frontend, backend, db).
If you’d like to run in detached mode, add -d:
bash
Code kopiëren
docker compose up --build -d
Stopping Services

bash
Code kopiëren
docker compose down
Stops and removes containers, networks, etc.
4.2 Accessing the App
Frontend: http://localhost:3000
Backend: http://localhost:5000
Database (Postgres): Exposed on port 5432 (though typically only accessible by the backend container).
5. Environment Variables
We use environment variables for critical configuration details like database credentials, JWT secrets, etc. You can store them in an .env file (ensure it’s in your .gitignore to avoid committing sensitive info).

Common Variables (example):

bash
Code kopiëren
# backend/.env
PORT=5000
DATABASE_URL=postgres://user:password@db:5432/librarydb
JWT_SECRET=your_jwt_secret_key
bash
Code kopiëren
# frontend/.env
REACT_APP_API_URL=http://localhost:5000
6. Common Issues & Troubleshooting
Docker Compose Command Not Found

Ensure Docker Desktop (Windows/Mac) or Docker Engine + Docker Compose plugin (Linux) is installed and running.
Port Conflicts

If ports 3000/5000/5432 are in use, modify docker-compose.yml or your local .env to use different ports.
“Cannot Resolve Module” Error (Frontend)

Usually a file name mismatch (e.g., App.tsx vs. import path) or missing dependency. Check your logs and ensure consistent file casing.
Database Connection Errors

Verify your DATABASE_URL points to the db service defined in docker-compose.yml.
Example: postgres://user:password@db:5432/librarydb.
Permission Issues

On Linux, you may need sudo for Docker commands, or ensure your user is in the docker group.
Frontend Babel Warnings

You might see deprecation or Babel plugin warnings. Usually, these do not break the build. See logs for details.
7. Additional Resources
Docker Documentation
https://docs.docker.com/

Node.js & npm
https://nodejs.org/en/docs/

React (Create React App)
https://create-react-app.dev/docs/getting-started/

TypeScript
https://www.typescriptlang.org/docs/

Postgres
https://www.postgresql.org/docs/

That’s it! You should now have everything you need to start developing and running the Open-Source Library App project. If you run into any issues not covered here, please open an issue or reach out to the team.

Happy coding!