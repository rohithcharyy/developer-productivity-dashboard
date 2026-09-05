import { useState, useEffect } from "react";
import Dashboard from "./pages/Dashboard";
import Analytics from "./pages/Analytics";
import Projects from "./pages/Projects";
import Tasks from "./pages/Tasks";
import Calendar from "./pages/Calendar";
import Settings from "./pages/Settings";

import { projects, tasks } from "./data/dashboardData";

import { getProjects, getTasks } from "./api/api";
function App() {
   useEffect(() => {
  const loadData = async () => {
    try {
      setLoading(true);

      const [projectsData, tasksData] = await Promise.all([
    getProjects(),
    getTasks()
]);

const formattedTasks = tasksData.map((task) => {
    const project = projectsData.find(
        (project) => project.id === task.projectId
    );

    return {
        ...task,
        project: project ? project.name : "Unknown Project",
        status: task.status === "Completed" ? "Done" : task.status
    };
});

setProjectList(projectsData);
setTaskList(formattedTasks);
      setError(null);
    } catch (error) {
      console.error("API Error:", error);
      setError("Failed to load data from the server.");
    } finally {
      setLoading(false);
    }
  };

  loadData();
}, []);
  const [currentPage, setCurrentPage] = useState("dashboard");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [taskList, setTaskList] = useState(tasks);
  const [projectList, setProjectList] = useState(projects);

  if (loading) {
  return <div>Loading DevDash...</div>;
}

if (error) {
  return <div>{error}</div>;
}

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