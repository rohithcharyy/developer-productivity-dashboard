# Developer Productivity Dashboard

A web-based productivity dashboard designed to help developers manage projects, tasks, priorities, progress, and productivity insights.

This project is being developed incrementally as part of my **DevOps learning journey**, with each week focusing on a different stage of the application development and deployment process.

---

# Week 1 – Frontend Development

**Focus:** React Frontend & User Interface Development

Week 1 focused on designing and developing the frontend of the Developer Productivity Dashboard using React.

## Work Completed

* Set up the React project using Vite
* Created the initial dashboard layout
* Built a responsive navigation system
* Created a sidebar for workspace navigation
* Implemented project cards
* Implemented task cards
* Added statistics cards for productivity information
* Created project and task management interfaces
* Added **New Project** functionality
* Added **New Task** functionality
* Implemented dynamic task and project updates
* Added search functionality
* Added task filtering by:

  * Status
  * Priority
  * Project
* Implemented loading state
* Implemented empty state
* Implemented error state
* Added Analytics page
* Added Calendar page
* Added Settings page
* Improved responsive design and overall UI
* Organized the application into reusable React components

## Frontend Structure

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
```

## Week 1 Outcome

The first week resulted in a **fully functional React frontend** with responsive UI, reusable components, project and task management, filtering, search, and multiple dashboard pages.

---

# Week 2 – Backend & API Integration

**Focus:** Express.js Backend, REST APIs & Frontend-Backend Integration

Week 2 focused on building the backend foundation of the Developer Productivity Dashboard and connecting it with the React frontend.

## Work Completed

### Backend Development

* Set up an **Express.js backend**
* Created a structured backend architecture
* Implemented REST API routes
* Created controllers for:

  * Users
  * Projects
  * Tasks
* Added JSON request and response handling
* Implemented project management APIs
* Implemented task management APIs
* Implemented user management APIs

### API Testing

* Tested REST APIs using **Thunder Client**
* Verified API request and response handling
* Debugged API-related issues
* Tested frontend-backend communication

### Frontend Integration

* Connected the React frontend with the Express backend
* Integrated project APIs with the frontend
* Integrated task APIs with the frontend
* Implemented project and task management through the backend
* Tested and debugged frontend-backend communication

## Backend Structure

```text
backend/
├── app.js
├── server.js
│
├── controllers/
│   ├── projectController.js
│   ├── taskController.js
│   └── userController.js
│
└── routes/
    ├── projectRoutes.js
    ├── taskRoutes.js
    └── userRoutes.js
```

## REST API Endpoints

### Users API

| Method | Endpoint         | Description    |
| ------ | ---------------- | -------------- |
| GET    | `/api/users`     | Get all users  |
| GET    | `/api/users/:id` | Get user by ID |
| POST   | `/api/users`     | Create a user  |

### Projects API

| Method | Endpoint            | Description       |
| ------ | ------------------- | ----------------- |
| GET    | `/api/projects`     | Get all projects  |
| GET    | `/api/projects/:id` | Get project by ID |
| POST   | `/api/projects`     | Create a project  |

### Tasks API

| Method | Endpoint                | Description        |
| ------ | ----------------------- | ------------------ |
| GET    | `/api/tasks`            | Get all tasks      |
| GET    | `/api/tasks/:id`        | Get task by ID     |
| POST   | `/api/tasks`            | Create a task      |
| PATCH  | `/api/tasks/:id/status` | Update task status |

## Technologies Used

### Frontend

* React
* Vite
* JavaScript

### Backend

* Node.js
* Express.js
* REST APIs

### Development & Testing

* Thunder Client
* Git
* GitHub

## Week 2 Outcome

The project now has a **working Express.js backend with REST APIs and frontend-backend integration**.

The React application can communicate with the Express backend to perform project and task-related operations, establishing the backend foundation for the next stages of the DevOps learning journey.

