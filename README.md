Developer Productivity Dashboard

A web-based productivity dashboard designed to help developers manage projects, tasks, priorities, progress, and productivity insights.

The project was developed incrementally as part of my DevOps and full-stack development learning journey.

Week 1 – Frontend Development

Week 1 focused on designing and developing the frontend of the Developer Productivity Dashboard using React.

Work Completed
Set up the React project using Vite
Created the initial dashboard layout
Built a responsive navigation system
Created a sidebar for workspace navigation
Implemented project cards
Implemented task cards
Added statistics cards
Created project and task management interfaces
Added New Project functionality
Added New Task functionality
Implemented dynamic task and project updates
Added search functionality
Added task filtering by:
Status
Priority
Project
Added loading, empty, and error states
Added Analytics page
Added Calendar page
Added Settings page
Improved responsive design and UI
Organized the application into reusable React components


Frontend Structure

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


Week 2 – Backend & API Integration

Week 2 focused on building the backend foundation and connecting the React frontend with an Express.js REST API.

Work Completed
Set up an Express.js backend
Created a structured backend architecture
Implemented REST API routes
Created controllers for Users, Projects, and Tasks
Added JSON request and response handling
Tested APIs using Thunder Client
Connected the React frontend with the Express backend
Implemented project and task management through API requests
Added project and task CRUD operations
Tested and debugged frontend-backend communication
Backend Structure
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

API Endpoints
Users
Method	Endpoint	Description
GET	/api/users	Get all users
GET	/api/users/:id	Get user by ID
POST	/api/users	Create a user
Projects
Method	Endpoint	Description
GET	/api/projects	Get all projects
GET	/api/projects/:id	Get project by ID
POST	/api/projects	Create a project
PUT	/api/projects/:id	Update a project
DELETE	/api/projects/:id	Delete a project
Tasks
Method	Endpoint	Description
GET	/api/tasks	Get all tasks
GET	/api/tasks/:id	Get task by ID
POST	/api/tasks	Create a task
PATCH	/api/tasks/:id/status	Update task status
DELETE	/api/tasks/:id	Delete a task


Week 3 – Database & AI Integration

Week 3 focused on replacing temporary frontend data handling with persistent database storage and introducing AI-powered productivity analysis.

Database Integration
Integrated MongoDB Atlas
Added Mongoose for database interaction
Created MongoDB schemas/models for:
Users
Projects
Tasks
Connected the Express backend to MongoDB Atlas
Implemented persistent project and task storage
Connected frontend project and task operations to the database
Verified that task and project updates are persisted in MongoDB
Added API-based data loading when the application starts
AI Integration
Integrated the Google Gemini API
Added a dedicated AI controller
Added AI API routes
Created an AI Productivity Coach
Added an AI Assistant page
AI analyzes workspace data from MongoDB
AI provides:
Productivity summary
Recommended focus task
Priority recommendations
Productivity risks
Recommended actions
Added structured JSON responses for AI-generated insights
Added loading, error, retry, and regenerate states for AI insights
Added handling for temporary Gemini API availability issues
AI API
GET /api/ai/insights

The endpoint retrieves projects and tasks from MongoDB and sends the workspace data to Gemini for analysis.

Application Flow
React Frontend
      │
      ▼
Frontend API Layer
      │
      ▼
Express.js Backend
      │
      ├──────────────► MongoDB Atlas
      │                    │
      │                    ├── Users
      │                    ├── Projects
      │                    └── Tasks
      │
      └──────────────► Gemini API
                           │
                           ▼
                    AI Productivity
                       Insights


Week 4 – Authentication, Security & Deployment

Week 4 focused on making the application production-ready by adding authentication, protected APIs, improving the backend, and deploying the application.

Authentication
Added user registration
Added user login
Implemented JWT-based authentication
Added authentication middleware
Protected backend routes
Added authorization headers to frontend API requests
Added login and registration pages
Added JWT token storage in the browser
Added logout functionality
Added account switching support
Added user-specific authentication flow
Authentication Flow
User
 │
 ├── Register
 │      │
 │      ▼
 │   Backend
 │      │
 │      ▼
 │   MongoDB
 │
 └── Login
        │
        ▼
     Backend
        │
        ▼
   JWT Token
        │
        ▼
 React Frontend
        │
        ▼
 Protected API Requests
Backend Improvements

The backend was cleaned up and reviewed for production deployment.

Improvements Included
Organized controllers and middleware
Added authentication middleware
Improved JWT handling
Improved MongoDB error handling
Improved API error responses
Improved AI/Gemini error handling
Added environment-variable based configuration
Removed hard-coded production secrets
Tested backend APIs before deployment
Verified MongoDB Atlas connectivity
Verified Gemini API integration
AI Error Handling

The AI Assistant was improved to provide useful feedback when the Gemini API is unavailable.

For example, temporary Gemini service issues such as high demand are handled and displayed to the user instead of simply showing a generic failure message.

The application also provides retry functionality.

React Frontend
      │
      ▼
AI API Request
      │
      ▼
Express Backend
      │
      ▼
Gemini API
      │
      ├── Success
      │     │
      │     ▼
      │   AI Insights
      │
      └── Error
            │
            ▼
       Error Response
            │
            ▼
       User-friendly
        UI message
Production Deployment

The application was deployed using Render.

Backend Deployment

The Express.js backend is deployed as a Render Web Service.

Backend URL
https://devdash-backend.onrender.com

The backend connects to:

MongoDB Atlas
Google Gemini API

Environment variables are configured on the deployment platform rather than being committed to GitHub.

Frontend Deployment

The React/Vite frontend is deployed separately on Render.

Frontend URL
https://devdash-frontend.onrender.com

The production frontend communicates with the deployed backend instead of the local development server.

Database

The application uses MongoDB Atlas for persistent data storage.

Stored Data
MongoDB Atlas
│
└── Cluster
    │
    ├── Users
    ├── Projects
    └── Tasks

MongoDB Atlas provides persistent storage for the application's backend.

AI Integration

The project uses Google's Gemini API through the @google/genai package.

AI Features
Workspace analysis
Productivity summary
Focus task recommendations
Priority recommendations
Risk identification
Productivity recommendations
AI Assistant interface
Error and retry handling
Workspace Data
      │
      ▼
MongoDB
      │
      ▼
Express Backend
      │
      ▼
Gemini API
      │
      ▼
AI Analysis
      │
      ▼
Structured Insights
      │
      ▼
React UI
Technologies Used
Frontend
React
Vite
JavaScript
Tailwind CSS
Backend
Node.js
Express.js
REST APIs
JWT
Database
MongoDB Atlas
Mongoose
AI
Google Gemini API
@google/genai
Development Tools
VS Code
Thunder Client
Git
GitHub
Deployment
Render
MongoDB Atlas
Project Structure
Developer Productivity Dashboard/
│
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── app.js
│   └── server.js
│
├── src/
│   ├── api/
│   ├── components/
│   ├── data/
│   ├── pages/
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
│
├── .gitignore
├── package.json
└── README.md
Current Features
Responsive dashboard
Project management
Task management
Project CRUD operations
Task CRUD operations
Task status updates
Search
Task filtering
Analytics
Productivity statistics
Calendar
Settings
User registration
User login
JWT authentication
Protected APIs
MongoDB persistence
AI Productivity Coach
AI Assistant
AI-generated productivity insights
Loading states
Empty states
Error states
Retry functionality
Production deployment
Deployment Links
Frontend

https://devdash-frontend.onrender.com

Backend

https://devdash-backend.onrender.com

GitHub Repository

https://github.com/rohithcharyy/developer-productivity-dashboard

Development Progress
Week 1
 React frontend
 Responsive dashboard
 Project management UI
 Task management UI
 Search and filtering
 Analytics
 Calendar
 Settings
Week 2
 Express.js backend
 REST API
 Project CRUD
 Task CRUD
 Frontend-backend integration
Week 3
 MongoDB Atlas
 Mongoose models
 Persistent project data
 Persistent task data
 Gemini API integration
 AI Productivity Coach
 AI Assistant
Week 4
 User registration
 User login
 JWT authentication
 Authentication middleware
 Protected APIs
 Backend cleanup
 Production configuration
 Frontend deployment
 Backend deployment
 Production testing
 AI error handling
Current Status

The Developer Productivity Dashboard is now deployed as a full-stack application.

The application follows a complete production flow:

User
 │
 ▼
React + Vite Frontend
 │
 ▼
Render
 │
 ▼
Express.js Backend
 │
 ├──────────────► MongoDB Atlas
 │
 └──────────────► Gemini API

The project progressed from a frontend dashboard in Week 1 to a deployed full-stack application with authentication, persistent database storage, REST APIs, and AI-powered productivity insights.

Project Goal

The long-term goal is to build a practical developer productivity platform that combines:

Project management
Task tracking
Productivity analytics
Persistent user data
Authentication
AI-powered productivity assistance

into a single application for developers.

Links

GitHub:
https://github.com/rohithcharyy/developer-productivity-dashboard

Live Application:
https://devdash-frontend.onrender.com

Backend API:
https://devdash-backend.onrender.com