# UIUX 3-Day Lead Capture App

This repository contains the full stack application for the UIUX 3-Day Masterclass
lead capture flow. The project includes a frontend landing page and a backend API.

This README explains **how to work on this repo**, not the business context.

---

## Project Structure

- `frontend/`  
  React (Vite) application for the landing page and lead form

- `backend/`  
  Node.js + Express API using MySQL (Sequelize)

---

## How to Run Locally

### Backend

```bash
cd backend
npm install
npm run dev
```

```

```

Frontend
cd frontend
npm install
npm run dev

```

```

Branching Rules (Important)

This repository follows a feature-branch workflow.

Main branches:

- main – production-ready code
- develop – active development branch

You should never commit directly to main or develop.

```

```

How to Start Work

Make sure you are on develop

- git checkout develop
- git pull

```

```

Create a feature branch for your task

- git checkout -b feature/short-description

Examples:

feature/lead-form-validation

feature/api-create-lead

feature/ui-schedule-section

```

```

Making Changes

Commit regularly on your feature branch

Keep commits small and meaningful

Make sure the app runs locally before opening a PR

```

```

Opening a Pull Request (PR)

When your work is ready:
Push your branch

- git push origin feature/your-branch-name

Open a Pull Request:

From: feature/\*

To: develop

In the PR description, include:

What you changed
What was added or fixed
Anything the reviewer should know

```

```

After Review

Address any feedback
Once approved, the PR will be merged into develop
Delete your feature branch after merge
