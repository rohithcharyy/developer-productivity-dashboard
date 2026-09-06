# Developer Productivity Dashboard

A web-based productivity dashboard designed to help developers manage projects, tasks, priorities, progress, and productivity insights.

The project is being developed incrementally as part of my DevOps learning journey.

---

## Week 1 – Frontend Development

Week 1 focused on designing and developing the frontend of the Developer Productivity Dashboard using React.

### Work Completed

- Set up the React project using Vite
- Created the initial dashboard layout
- Built a responsive navigation system
- Created a sidebar for workspace navigation
- Implemented project cards
- Implemented task cards
- Added statistics cards for productivity information
- Created project and task management interfaces
- Added New Project functionality
- Added New Task functionality
- Implemented dynamic task and project updates
- Added search functionality
- Added task filtering by:
  - Status
  - Priority
  - Project
- Added loading state
- Added empty state
- Added error state
- Added Analytics page
- Added Calendar page
- Added Settings page
- Improved responsive design and UI
- Organized the application into reusable React components

### Frontend Structure

```text
src/
├── components/
│   ├── Analytics/
│   │   ├── AIInsights.jsx
│   │   ├── PriorityChart.jsx
│   │   ├── StreakCard.jsx
│   │   └── TaskStatusChart.jsx
│   │
│   ├── common/
│   │   ├── EmptyState.jsx
│   │   ├── ErrorState.jsx
│   │   └── LoadingState.jsx
│   │
│   ├── dashboard/
│   │   ├── AddProjectModal.jsx
│   │   ├── AddTaskModal.jsx
│   │   ├── ProjectCard.jsx
│   │   ├── StatsCard.jsx
│   │   ├── TaskCard.jsx
│   │   └── TaskFilters.jsx
│   │
│   └── layout/
│       ├── Navbar.jsx
│       └── Sidebar.jsx
│
├── data/
│   └── dashboardData.js
│
├── pages/
│   ├── Analytics.jsx
│   ├── Calendar.jsx
│   ├── Dashboard.jsx
│   ├── Projects.jsx
│   ├── Settings.jsx
│   └── Tasks.jsx
│
├── App.jsx
├── index.css
└── main.jsx


### Week 2 – Backend & API Integration

This week focused on building the backend foundation for the Developer Productivity Dashboard and integrating it with the React frontend.

### Work Completed

- Set up an Express.js backend
- Created a structured backend architecture
- Implemented REST API routes
- Created controllers for Users, Projects, and Tasks
- Added JSON request and response handling
- Tested APIs using Thunder Client
- Connected the React frontend with the Express backend
- Implemented project and task management functionality
- Tested and debugged frontend-backend communication

### Backend Structure

```text
backend/
├── app.js
├── server.js
├── controllers/
│   ├── projectController.js
│   ├── taskController.js
│   └── userController.js
└── routes/
    ├── projectRoutes.js
    ├── taskRoutes.js
    └── userRoutes.js

| Method | Endpoint         | Description    |
| ------ | ---------------- | -------------- |
| GET    | `/api/users`     | Get all users  |
| GET    | `/api/users/:id` | Get user by ID |
| POST   | `/api/users`     | Create a user  |


| Method | Endpoint            | Description       |
| ------ | ------------------- | ----------------- |
| GET    | `/api/projects`     | Get all projects  |
| GET    | `/api/projects/:id` | Get project by ID |
| POST   | `/api/projects`     | Create a project  |


| Method | Endpoint                | Description        |
| ------ | ----------------------- | ------------------ |
| GET    | `/api/tasks`            | Get all tasks      |
| GET    | `/api/tasks/:id`        | Get task by ID     |
| POST   | `/api/tasks`            | Create a task      |
| PATCH  | `/api/tasks/:id/status` | Update task status |


Technologies Used:

React
Vite
JavaScript
Node.js
Express.js
REST APIs
Thunder Client
Git & GitHub

Week 2 Outcome

The project now has a working Express.js backend with REST APIs and frontend-backend integration. The React application can communicate with the backend for project and task-related operations.
