import { useEffect, useState } from "react";

import Dashboard from "./pages/Dashboard";
import Analytics from "./pages/Analytics";
import Projects from "./pages/Projects";
import AIAssistant from "./pages/AIAssistant";
import Tasks from "./pages/Tasks";
import Calendar from "./pages/Calendar";
import Settings from "./pages/Settings";

import { getProjects } from "./api/projectApi";
import { getTasks } from "./api/taskApi";

function App() {
  const [currentPage, setCurrentPage] = useState("dashboard");

  const [taskList, setTaskList] = useState([]);
  const [projectList, setProjectList] = useState([]);

  // Shared user profile
  const [userProfile, setUserProfile] = useState(() => {
    const savedProfile = localStorage.getItem("devdash_user_profile");

    if (savedProfile) {
      try {
        return JSON.parse(savedProfile);
      } catch (error) {
        console.error("Failed to load saved profile:", error);
      }
    }

    return {
      name: "Rohith",
      role: "Developer",
    };
  });

  // Save profile to localStorage
  useEffect(() => {
    localStorage.setItem(
      "devdash_user_profile",
      JSON.stringify(userProfile)
    );
  }, [userProfile]);

  const [isLoading, setIsLoading] = useState(true);

  // Load workspace data
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);

        const [projectsResponse, tasksResponse] = await Promise.all([
          getProjects(),
          getTasks(),
        ]);

        setProjectList(projectsResponse.data || []);
        setTaskList(tasksResponse.data || []);
      } catch (err) {
        console.error("Failed to load workspace data:", err);

        // Keep the application usable even if the backend
        // temporarily fails.
        setProjectList([]);
        setTaskList([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  // Loading screen
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="text-3xl">⏳</div>

          <h2 className="mt-3 text-lg font-semibold text-slate-900">
            Loading workspace...
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Connecting to the backend.
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Dashboard */}
      {currentPage === "dashboard" && (
        <Dashboard
          currentPage={currentPage}
          onNavigate={setCurrentPage}
          taskList={taskList}
          setTaskList={setTaskList}
          projectList={projectList}
          setProjectList={setProjectList}
          userProfile={userProfile}
        />
      )}

      {/* Analytics */}
      {currentPage === "analytics" && (
        <Analytics
          currentPage={currentPage}
          onNavigate={setCurrentPage}
          tasks={taskList}
          projects={projectList}
        />
      )}

      {/* Projects */}
      {currentPage === "projects" && (
        <Projects
          currentPage={currentPage}
          onNavigate={setCurrentPage}
          projects={projectList}
          setProjectList={setProjectList}
          userProfile={userProfile}
        />
      )}

      {/* AI Assistant */}
      {currentPage === "ai-assistant" && (
        <AIAssistant
          currentPage={currentPage}
          onNavigate={setCurrentPage}
          tasks={taskList}
          projects={projectList}
        />
      )}

      {/* Tasks */}
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

      {/* Calendar */}
      {currentPage === "calendar" && (
        <Calendar
          currentPage={currentPage}
          onNavigate={setCurrentPage}
          tasks={taskList}
        />
      )}

      {/* Settings */}
      {currentPage === "settings" && (
        <Settings
          currentPage={currentPage}
          onNavigate={setCurrentPage}
          userProfile={userProfile}
          setUserProfile={setUserProfile}
        />
      )}
    </>
  );
}

export default App;