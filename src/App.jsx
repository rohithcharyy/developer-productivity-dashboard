import { useState } from "react";

import Dashboard from "./pages/Dashboard";
import Analytics from "./pages/Analytics";
import Projects from "./pages/Projects";
import Tasks from "./pages/Tasks";
import Calendar from "./pages/Calendar";
import Settings from "./pages/Settings";

import { projects, tasks } from "./data/dashboardData";

function App() {
  const [currentPage, setCurrentPage] = useState("dashboard");

  const [taskList, setTaskList] = useState(tasks);
  const [projectList, setProjectList] = useState(projects);

  return (
    <>
      {currentPage === "dashboard" && (
        <Dashboard
          currentPage={currentPage}
          onNavigate={setCurrentPage}
          taskList={taskList}
          setTaskList={setTaskList}
          projectList={projectList}
          setProjectList={setProjectList}
        />
      )}

      {currentPage === "analytics" && (
        <Analytics
          currentPage={currentPage}
          onNavigate={setCurrentPage}
          tasks={taskList}
          projects={projectList}
        />
      )}

      {currentPage === "projects" && (
        <Projects
          currentPage={currentPage}
          onNavigate={setCurrentPage}
          projects={projectList}
          setProjectList={setProjectList}
        />
      )}

      {currentPage === "tasks" && (
  <Tasks
    currentPage={currentPage}
    onNavigate={setCurrentPage}
    tasks={taskList}
    setTaskList={setTaskList}
    projects={projectList}
    setProjectList={setProjectList}
  />
)}

      {currentPage === "calendar" && (
  <Calendar
    currentPage={currentPage}
    onNavigate={setCurrentPage}
    tasks={taskList}
  />
)}

{currentPage === "settings" && (
  <Settings
    currentPage={currentPage}
    onNavigate={setCurrentPage}
  />
)}
      
    </>
  );
}

export default App;