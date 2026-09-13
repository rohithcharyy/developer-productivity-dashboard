# Developer Productivity Dashboard

A web-based productivity dashboard designed to help developers manage projects, tasks, priorities, progress, and productivity insights.

The project is being developed incrementally as part of my DevOps and full-stack development learning journey.

---

## Week 1 – Frontend Development

Week 1 focused on designing and developing the frontend of the Developer Productivity Dashboard using React.

### Work Completed

* Set up the React project using Vite
* Created the initial dashboard layout
* Built a responsive navigation system
* Created a sidebar for workspace navigation
* Implemented project cards
* Implemented task cards
* Added statistics cards
* Created project and task management interfaces
* Added New Project functionality
* Added New Task functionality
* Implemented dynamic task and project updates
* Added search functionality
* Added task filtering by:

  * Status
  * Priority
  * Project
* Added loading, empty, and error states
* Added Analytics page
* Added Calendar page
* Added Settings page
* Improved responsive design and UI
* Organized the application into reusable React components

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
│   ├── AIAssistant.jsx
│   ├── Analytics.jsx
│   ├── Calendar.jsx
│   ├── Dashboard.jsx
│   ├── Projects.jsx
│   ├── Settings.jsx
│   └── Tasks.jsx
│
├── api/
│   ├── api.js
│   ├── projectApi.js
│   └── taskApi.js
│
├── App.jsx
├── index.css
└── main.jsx
```

---

## Week 2 – Backend & API Integration

Week 2 focused on building the backend foundation and connecting the React frontend with an Express.js REST API.

### Work Completed

* Set up an Express.js backend
* Created a structured backend architecture
* Implemented REST API routes
* Created controllers for Users, Projects, and Tasks
* Added JSON request and response handling
* Tested APIs using Thunder Client
* Connected the React frontend with the Express backend
* Implemented project and task management through API requests
* Added project and task CRUD operations
* Tested and debugged frontend-backend communication

### Backend Structure

```text
backend/
├── app.js
├── server.js
│
├── config/
│   └── db.js
│
├── controllers/
│   ├── aiController.js
│   ├── projectController.js
│   ├── taskController.js
│   └── userController.js
│
├── models/
│   ├── Project.js
│   ├── Task.js
│   └── User.js
│
└── routes/
    ├── aiRoutes.js
    ├── projectRoutes.js
    ├── taskRoutes.js
    └── userRoutes.js
```

### API Endpoints

#### Users

| Method | Endpoint         | Description    |
| ------ | ---------------- | -------------- |
| GET    | `/api/users`     | Get all users  |
| GET    | `/api/users/:id` | Get user by ID |
| POST   | `/api/users`     | Create a user  |

#### Projects

| Method | Endpoint            | Description       |
| ------ | ------------------- | ----------------- |
| GET    | `/api/projects`     | Get all projects  |
| GET    | `/api/projects/:id` | Get project by ID |
| POST   | `/api/projects`     | Create a project  |
| PUT    | `/api/projects/:id` | Update a project  |
| DELETE | `/api/projects/:id` | Delete a project  |

#### Tasks

| Method | Endpoint                | Description        |
| ------ | ----------------------- | ------------------ |
| GET    | `/api/tasks`            | Get all tasks      |
| GET    | `/api/tasks/:id`        | Get task by ID     |
| POST   | `/api/tasks`            | Create a task      |
| PATCH  | `/api/tasks/:id/status` | Update task status |
| DELETE | `/api/tasks/:id`        | Delete a task      |

---

## Week 3 – Database & AI Integration

Week 3 focused on replacing the temporary frontend data handling with persistent database storage and introducing AI-powered productivity analysis.

### Database Integration

* Integrated MongoDB Atlas
* Added Mongoose for database interaction
* Created MongoDB schemas/models for:

  * Users
  * Projects
  * Tasks
* Connected the Express backend to MongoDB Atlas
* Implemented persistent project and task storage
* Connected frontend project and task operations to the database
* Verified that task and project updates are persisted in MongoDB
* Added API-based data loading when the application starts

### AI Integration

* Integrated the Google Gemini API
* Added a dedicated AI controller
* Added AI API routes
* Created an AI Productivity Coach
* Added an AI Assistant page
* AI analyzes workspace data from MongoDB
* AI provides:

  * Productivity summary
  * Recommended focus task
  * Priority recommendations
  * Productivity risks
  * Recommended actions
* Added structured JSON responses for AI-generated insights
* Added loading, error, retry, and regenerate states for AI insights

### AI API

```text
GET /api/ai/insights
```

The endpoint retrieves projects and tasks from MongoDB and sends the workspace data to Gemini for analysis.

### Current Application Flow

```text
React Frontend
      │
      ▼
Frontend API Layer
      │
      ▼
Express.js Backend
      │
      ├──────────────► MongoDB Atlas
      │                  │
      │                  └── Users
      │                  └── Projects
      │                  └── Tasks
      │
      └──────────────► Gemini API
                         │
                         ▼
                  AI Productivity
                      Insights
```

---

## Technologies Used

### Frontend

* React
* Vite
* JavaScript
* Tailwind CSS

### Backend

* Node.js
* Express.js
* REST APIs

### Database

* MongoDB Atlas
* Mongoose

### AI

* Google Gemini API
* `@google/genai`

### Development Tools

* VS Code
* Thunder Client
* Git
* GitHub

---

## Current Status

### Completed

* [x] React frontend
* [x] Responsive dashboard
* [x] Project management
* [x] Task management
* [x] Search and filtering
* [x] Analytics
* [x] Calendar
* [x] Settings
* [x] Express.js backend
* [x] REST API integration
* [x] MongoDB Atlas integration
* [x] Persistent project and task data
* [x] Gemini AI integration
* [x] AI Productivity Coach
* [x] AI Assistant page

### Planned

* [ ] User authentication and login
* [ ] Protected routes
* [ ] User-specific workspace data
* [ ] Improved account/profile management
* [ ] Additional AI features
* [ ] Deployment
* [ ] Further testing and bug fixing

---

## Week 3 Outcome

The project now has a full frontend-backend-database flow.

Projects and tasks created through the React application are stored persistently in MongoDB Atlas. The backend also provides an AI endpoint that analyzes the workspace data and generates productivity insights using Gemini.

Authentication and user-specific accounts are planned for the next development phase.

---

## Project Goal

The long-term goal is to build a practical developer productivity platform that combines project management, task tracking, analytics, persistent data, and AI-powered productivity assistance in a single application.

```
```
