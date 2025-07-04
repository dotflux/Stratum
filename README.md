# Stratum

Stratum is a full-stack collaborative workspace and task management platform, featuring a robust NestJS backend and a modern React + TypeScript + Vite frontend. It supports user authentication, workspace and member management, file uploads, task tracking, and more.

![landing_page](https://github.com/dotflux/Stratum/blob/e5bd8d53f9395c05f5e9e7e86645cc1b65f2b432/landing_page.png)
---

## Table of Contents
- [Project Overview](#project-overview)
- [Architecture](#architecture)
- [Backend](#backend)
  - [Features](#backend-features)
  - [Directory Structure](#backend-directory-structure)
  - [Setup & Development](#backend-setup--development)
  - [Testing](#backend-testing)
- [Frontend](#frontend)
  - [Features](#frontend-features)
  - [Directory Structure](#frontend-directory-structure)
  - [Setup & Development](#frontend-setup--development)
- [Extending the Project](#extending-the-project)
- [License](#license)

---

## Project Overview
Stratum enables teams to collaborate in workspaces, manage members, upload and share files, create and track tasks, and handle user accounts securely. The backend is built with [NestJS](https://nestjs.com/) and MongoDB, while the frontend uses [React](https://react.dev/) with [Vite](https://vitejs.dev/) for fast development and modern UI.

---

## Architecture
- **Backend:** RESTful API using NestJS, modularized for scalability and maintainability.
- **Frontend:** SPA using React, TypeScript, and Vite, with modular components for each feature.
- **Database:** MongoDB (see backend models).

---

## Backend

### Backend Features
- User authentication (login, signup, password reset)
- Workspace creation, editing, and member management
- File upload/download and management
- Task creation, assignment, and tracking
- User profile and account management

### Backend Directory Structure
```
backend/
  src/
    controllers/      # API route controllers (login, signup, workspace, etc.)
    guards/           # Route guards (e.g., workspace parameter validation)
    logic/            # Business logic, grouped by feature
      editWorkspace/  # Workspace management (members, files, tasks, etc.)
      forgetPassword/ # Password reset logic
      home/           # Dashboard, billing, account changes
      login/          # Login logic
      signup/         # Signup logic
      ...
    models/           # Mongoose schemas (User, Workspace, Task, File, etc.)
    modules/          # NestJS modules for feature grouping
    services/         # Service classes for business logic
    main.ts           # App entry point
    app.module.ts     # Root module
```

### Backend Setup & Development
1. **Install dependencies:**
   ```bash
   cd backend
   npm install
   ```
2. **Configure environment:**
   - Set up your MongoDB connection and any required environment variables (see `src/main.ts` and modules for details).
3. **Run the server:**
   ```bash
   # Development
   npm run start:dev
   # Production
   npm run start:prod
   ```
4. **API Endpoints:**
   - See `src/controllers/` for available endpoints (login, signup, workspace, etc.).

### Backend Testing
```bash
npm run test       # Unit tests
npm run test:e2e   # End-to-end tests
npm run test:cov   # Test coverage
```

## SignUp

User can create an account to venture into Stratum.

![signup_page](https://github.com/dotflux/Stratum/blob/e5bd8d53f9395c05f5e9e7e86645cc1b65f2b432/signup.png)

---

## Frontend

### Frontend Features
- User authentication (login, signup, password reset)
- Dashboard with workspace/task overview
- Workspace management (create, edit, leave, delete)
- File upload/download UI
- Task creation, assignment, and completion
- Member management and settings
- Account and billing management

### Frontend Directory Structure
```
frontend/
  src/
    components/
      Login/            # Login UI
      SignUp/           # Signup UI
      ForgetPassword/   # Password reset UI
      Home/
        Dashboard/      # Dashboard widgets
        Workspaces/     # Workspace list/creation
        WorkspaceEdit/  # Workspace editing (files, members, tasks, settings)
        Account/        # Account management
        Billing/        # Billing UI
      ...
    assets/             # SVGs and static assets
    App.tsx             # Main app component
    main.tsx            # App entry point
    index.css           # Global styles
```

### Frontend Setup & Development
1. **Install dependencies:**
   ```bash
   cd frontend
   npm install
   ```
2. **Run the development server:**
   ```bash
   npm run dev
   ```
3. **Build for production:**
   ```bash
   npm run build
   ```
4. **Preview production build:**
   ```bash
   npm run preview
   ```

---

## Home Page

This is where dashboard,account settings,workspaces,billing and logout are

![home_page](https://github.com/dotflux/Stratum/blob/cf36dc39ddca6a0682be10ce764da659faaa5097/home_page.png)

## Workspaces

Users can create and manage workspaces

![create_workspace](https://github.com/dotflux/Stratum/blob/cf36dc39ddca6a0682be10ce764da659faaa5097/create_workspace.png)

![workspaces_page](https://github.com/dotflux/Stratum/blob/e5bd8d53f9395c05f5e9e7e86645cc1b65f2b432/workspaces.png)

## Task Management

Users can create,delete,assign tasks, see logs change settings upload or delete files and manage members (Superadmin can not be managed)

![tasks_page](https://github.com/dotflux/Stratum/blob/e5bd8d53f9395c05f5e9e7e86645cc1b65f2b432/tasks.png
)


## Billing

Limits are set to the free plan but "Strats" the currency of Stratum can be earned by doing certain quests within the app

![billing_page](https://github.com/dotflux/Stratum/blob/e5bd8d53f9395c05f5e9e7e86645cc1b65f2b432/billing.png)

## Extending the Project
- **Backend:** Add new features by creating logic, controller, service, and module files in `backend/src/`. Follow the modular structure for scalability.
- **Frontend:** Add new UI features by creating new components in `frontend/src/components/` and updating routes/UI as needed.

---

## License
This project is MIT licensed. See individual backend/frontend directories for more details.
