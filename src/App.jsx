import { useEffect, useState } from "react";

import Login from "./pages/Login";
import Register from "./pages/Register";

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
  // =========================================================
  // SAVED ACCOUNTS
  // =========================================================

  const [accounts, setAccounts] = useState(() => {
    const savedAccounts = localStorage.getItem("devdash_accounts");

    if (savedAccounts) {
      try {
        return JSON.parse(savedAccounts);
      } catch (error) {
        console.error(
          "Failed to load saved accounts:",
          error
        );
      }
    }

    const oldToken = localStorage.getItem("devdash_token");
    const oldUser = localStorage.getItem("devdash_user");

    if (oldToken && oldUser) {
      try {
        const user = JSON.parse(oldUser);

        return [
          {
            token: oldToken,
            user,
          },
        ];
      } catch (error) {
        console.error(
          "Failed to migrate existing account:",
          error
        );
      }
    }

    return [];
  });

  // =========================================================
  // ACTIVE USER
  // =========================================================

  const [userProfile, setUserProfile] = useState(() => {
    const savedUser = localStorage.getItem("devdash_user");

    if (savedUser) {
      try {
        return JSON.parse(savedUser);
      } catch (error) {
        console.error(
          "Failed to load saved user:",
          error
        );
      }
    }

    return null;
  });

  // =========================================================
  // AUTHENTICATION
  // =========================================================

  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return Boolean(
      localStorage.getItem("devdash_token")
    );
  });

  const [authPage, setAuthPage] = useState("login");

  // =========================================================
  // APPLICATION STATE
  // =========================================================

  const [currentPage, setCurrentPage] =
    useState("dashboard");

  const [taskList, setTaskList] = useState([]);
  const [projectList, setProjectList] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  // =========================================================
  // DARK MODE
  // =========================================================

  const [darkMode, setDarkMode] = useState(() => {
    return (
      localStorage.getItem("devdash_theme") === "dark"
    );
  });

  // =========================================================
  // SAVE ACCOUNTS
  // =========================================================

  useEffect(() => {
    localStorage.setItem(
      "devdash_accounts",
      JSON.stringify(accounts)
    );
  }, [accounts]);

  // =========================================================
  // SAVE ACTIVE USER
  // =========================================================

  useEffect(() => {
    if (userProfile) {
      localStorage.setItem(
        "devdash_user",
        JSON.stringify(userProfile)
      );

      setAccounts((previousAccounts) =>
        previousAccounts.map((account) =>
          String(account.user?.id) ===
          String(userProfile.id)
            ? {
                ...account,
                user: userProfile,
              }
            : account
        )
      );
    }
  }, [userProfile]);

  // =========================================================
  // APPLY DARK MODE
  // =========================================================

  useEffect(() => {
    const root = document.documentElement;

    if (darkMode) {
      root.classList.add("dark");

      localStorage.setItem(
        "devdash_theme",
        "dark"
      );
    } else {
      root.classList.remove("dark");

      localStorage.setItem(
        "devdash_theme",
        "light"
      );
    }
  }, [darkMode]);

  // =========================================================
  // NOTIFICATION NAVIGATION
  // =========================================================

  useEffect(() => {
    const handleNotificationNavigation = (event) => {
      const page = event.detail;

      if (!page) {
        return;
      }

      // Only allow valid application pages
      const validPages = [
        "dashboard",
        "analytics",
        "projects",
        "ai-assistant",
        "tasks",
        "calendar",
        "settings",
      ];

      if (validPages.includes(page)) {
        setCurrentPage(page);
      }
    };

    window.addEventListener(
      "devdash:navigate",
      handleNotificationNavigation
    );

    return () => {
      window.removeEventListener(
        "devdash:navigate",
        handleNotificationNavigation
      );
    };
  }, []);

  // =========================================================
  // ADD ANOTHER ACCOUNT
  // =========================================================

  useEffect(() => {
    const handleAddAccount = () => {
      localStorage.removeItem("devdash_token");
      localStorage.removeItem("devdash_user");

      setIsAuthenticated(false);
      setUserProfile(null);

      setTaskList([]);
      setProjectList([]);

      setSearchQuery("");

      setCurrentPage("dashboard");
      setAuthPage("login");
    };

    window.addEventListener(
      "devdash:add-account",
      handleAddAccount
    );

    return () => {
      window.removeEventListener(
        "devdash:add-account",
        handleAddAccount
      );
    };
  }, []);

  // =========================================================
  // LOGIN / REGISTER HELPER
  // =========================================================

  const handleAuthSuccess = (user) => {
    const token =
      localStorage.getItem("devdash_token");

    if (!token) {
      console.error(
        "Auth succeeded but JWT token was not found."
      );

      return;
    }

    const newAccount = {
      token,
      user,
    };

    setAccounts((previousAccounts) => {
      const existingIndex =
        previousAccounts.findIndex(
          (account) =>
            String(account.user?.id) ===
            String(user?.id)
        );

      if (existingIndex !== -1) {
        const updatedAccounts = [
          ...previousAccounts,
        ];

        updatedAccounts[existingIndex] =
          newAccount;

        return updatedAccounts;
      }

      return [
        ...previousAccounts,
        newAccount,
      ];
    });

    setUserProfile(user);
    setIsAuthenticated(true);
    setAuthPage("login");
    setCurrentPage("dashboard");
    setSearchQuery("");
  };

  const handleLogin = handleAuthSuccess;
  const handleRegister = handleAuthSuccess;

  // =========================================================
  // SWITCH ACCOUNT
  // =========================================================

  const handleSwitchAccount = (account) => {
    if (
      !account?.token ||
      !account?.user
    ) {
      return;
    }

    localStorage.setItem(
      "devdash_token",
      account.token
    );

    localStorage.setItem(
      "devdash_user",
      JSON.stringify(account.user)
    );

    setUserProfile(account.user);
    setIsAuthenticated(true);

    setTaskList([]);
    setProjectList([]);

    setCurrentPage("dashboard");
    setSearchQuery("");
  };

  // =========================================================
  // LOGOUT CURRENT ACCOUNT
  // =========================================================

  const handleLogout = () => {
    localStorage.removeItem(
      "devdash_token"
    );

    localStorage.removeItem(
      "devdash_user"
    );

    localStorage.removeItem(
      "devdash_user_profile"
    );

    setIsAuthenticated(false);
    setUserProfile(null);

    setTaskList([]);
    setProjectList([]);

    setSearchQuery("");

    setCurrentPage("dashboard");
    setAuthPage("login");
  };

  // =========================================================
  // LOAD WORKSPACE DATA
  // =========================================================

  useEffect(() => {
    if (!isAuthenticated) {
      return;
    }

    const loadData = async () => {
      try {
        const [
          projectsResponse,
          tasksResponse,
        ] = await Promise.all([
          getProjects(),
          getTasks(),
        ]);

        setProjectList(
          projectsResponse.data || []
        );

        setTaskList(
          tasksResponse.data || []
        );
      } catch (error) {
        console.error(
          "Failed to load workspace data:",
          error
        );

        setProjectList([]);
        setTaskList([]);
      }
    };

    loadData();
  }, [
    isAuthenticated,
    userProfile?.id,
  ]);

  // =========================================================
  // CLEAR SEARCH WHEN CHANGING PAGES
  // =========================================================

  useEffect(() => {
    setSearchQuery("");
  }, [currentPage]);

  // =========================================================
  // AUTHENTICATION SCREENS
  // =========================================================

  if (!isAuthenticated) {
    if (authPage === "register") {
      return (
        <Register
          onRegister={handleRegister}
          onNavigate={setAuthPage}
        />
      );
    }

    return (
      <Login
        onLogin={handleLogin}
        onNavigate={setAuthPage}
      />
    );
  }

  // =========================================================
  // COMMON PAGE PROPS
  // =========================================================

  const commonPageProps = {
    currentPage,
    onNavigate: setCurrentPage,
    userProfile,
    searchQuery,
    setSearchQuery,
    onLogout: handleLogout,
    accounts,
    onSwitchAccount: handleSwitchAccount,
  };

  // =========================================================
  // AUTHENTICATED APPLICATION
  // =========================================================

  return (
    <>
      {currentPage === "dashboard" && (
        <Dashboard
          {...commonPageProps}
          taskList={taskList}
          setTaskList={setTaskList}
          projectList={projectList}
          setProjectList={setProjectList}
          darkMode={darkMode}
          setDarkMode={setDarkMode}
        />
      )}

      {currentPage === "analytics" && (
        <Analytics
          {...commonPageProps}
          tasks={taskList}
          projects={projectList}
          darkMode={darkMode}
          setDarkMode={setDarkMode}
        />
      )}

      {currentPage === "projects" && (
        <Projects
          {...commonPageProps}
          projects={projectList}
          setProjectList={setProjectList}
          darkMode={darkMode}
          setDarkMode={setDarkMode}
        />
      )}

      {currentPage === "ai-assistant" && (
        <AIAssistant
          {...commonPageProps}
          tasks={taskList}
          projects={projectList}
          darkMode={darkMode}
          setDarkMode={setDarkMode}
        />
      )}

      {currentPage === "tasks" && (
        <Tasks
          {...commonPageProps}
          tasks={taskList}
          setTaskList={setTaskList}
          projects={projectList}
          setProjectList={setProjectList}
          darkMode={darkMode}
          setDarkMode={setDarkMode}
        />
      )}

      {currentPage === "calendar" && (
        <Calendar
          {...commonPageProps}
          tasks={taskList}
        />
      )}

      {currentPage === "settings" && (
        <Settings
          {...commonPageProps}
          setUserProfile={setUserProfile}
          darkMode={darkMode}
          setDarkMode={setDarkMode}
        />
      )}
    </>
  );
}

export default App;