import { useEffect, useRef, useState } from "react";

function Navbar({
  searchQuery = "",
  setSearchQuery = () => {},
  showSearch = false,
  darkMode = false,
  setDarkMode = () => {},
}) {
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [loadingNotifications, setLoadingNotifications] = useState(false);

  const notificationRef = useRef(null);

  // =========================================================
  // LOAD NOTIFICATIONS
  // =========================================================

  const loadNotifications = async () => {
    const token = localStorage.getItem("devdash_token");

    if (!token) {
      setNotifications([]);
      return;
    }

    setLoadingNotifications(true);

    try {
      const headers = {
        Authorization: `Bearer ${token}`,
      };

      const [tasksResponse, projectsResponse] = await Promise.all([
        fetch("http://localhost:5000/api/tasks", {
          headers,
        }),
        fetch("http://localhost:5000/api/projects", {
          headers,
        }),
      ]);

      const tasksResult = await tasksResponse.json();
      const projectsResult = await projectsResponse.json();

      const tasks = tasksResult.data || [];
      const projects = projectsResult.data || [];

      const generatedNotifications = [];

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      // =====================================================
      // TASK NOTIFICATIONS
      // =====================================================

      tasks.forEach((task) => {
        if (!task.dueDate || task.status === "Done") {
          return;
        }

        const dueDate = new Date(task.dueDate);
        dueDate.setHours(0, 0, 0, 0);

        const difference = Math.ceil(
          (dueDate - today) / (1000 * 60 * 60 * 24)
        );

        if (difference < 0) {
          generatedNotifications.push({
            id: `overdue-${task._id}`,
            type: "overdue",
            title: "Overdue task",
            message: `"${task.title}" is overdue.`,
            icon: "🔴",
            page: "tasks",
            priority: 1,
          });
        } else if (difference === 0) {
          generatedNotifications.push({
            id: `today-${task._id}`,
            type: "today",
            title: "Task due today",
            message: `"${task.title}" is due today.`,
            icon: "🟠",
            page: "tasks",
            priority: 2,
          });
        } else if (difference <= 3) {
          generatedNotifications.push({
            id: `upcoming-${task._id}`,
            type: "upcoming",
            title: "Upcoming deadline",
            message: `"${task.title}" is due in ${difference} day${
              difference === 1 ? "" : "s"
            }.`,
            icon: "🟡",
            page: "tasks",
            priority: 3,
          });
        }
      });

      // =====================================================
      // PROJECT NOTIFICATIONS
      // =====================================================

      projects.forEach((project) => {
        if (project.status === "Completed") {
          return;
        }

        if (project.totalTasks > 0 && project.progress < 30) {
          generatedNotifications.push({
            id: `project-${project._id}`,
            type: "project",
            title: "Project needs attention",
            message: `${project.name} is only ${project.progress}% complete.`,
            icon: "📁",
            page: "projects",
            priority: 4,
          });
        }
      });

      generatedNotifications.sort(
        (a, b) => a.priority - b.priority
      );

      setNotifications(generatedNotifications);
    } catch (error) {
      console.error("Failed to load notifications:", error);
      setNotifications([]);
    } finally {
      setLoadingNotifications(false);
    }
  };

  // =========================================================
  // LOAD NOTIFICATIONS WHEN NAVBAR APPEARS
  // =========================================================

  useEffect(() => {
    loadNotifications();

    const interval = setInterval(loadNotifications, 60000);

    return () => clearInterval(interval);
  }, []);

  // =========================================================
  // CLOSE DROPDOWN WHEN CLICKING OUTSIDE
  // =========================================================

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target)
      ) {
        setShowNotifications(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // =========================================================
  // NOTIFICATION NAVIGATION
  // =========================================================

  const handleNotificationClick = (notification) => {
    window.dispatchEvent(
      new CustomEvent("devdash:navigate", {
        detail: notification.page,
      })
    );

    setShowNotifications(false);
  };

  return (
    <nav className="sticky top-0 z-50 select-none border-b border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800">
      <div className="flex h-16 items-center justify-between px-4 sm:px-6">

        {/* ===================================================
            LOGO
        =================================================== */}

        <div className="flex items-center gap-3">

          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-500 text-sm font-bold text-white shadow-sm">
            D
          </div>

          <div>
            <h1 className="text-lg font-bold tracking-tight text-slate-900 dark:text-white">
              DevDash
            </h1>

            <p className="hidden text-xs text-slate-500 dark:text-slate-400 sm:block">
              Productivity Workspace
            </p>
          </div>

        </div>

        {/* ===================================================
            RIGHT SIDE
        =================================================== */}

        <div className="flex items-center gap-1.5 sm:gap-2">

          {/* =================================================
              SEARCH
          ================================================= */}

          {showSearch && (
            <div className="hidden h-10 items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 transition focus-within:border-blue-300 focus-within:ring-2 focus-within:ring-blue-500/10 dark:border-slate-700 dark:bg-slate-900 md:flex">

              <span
                className="text-sm text-slate-400"
                aria-hidden="true"
              >
                🔍
              </span>

              <input
                type="text"
                value={searchQuery}
                onChange={(event) =>
                  setSearchQuery(event.target.value)
                }
                placeholder="Search..."
                className="w-32 bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400 select-text dark:text-slate-200 dark:placeholder:text-slate-500 lg:w-48"
              />

              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="flex h-5 w-5 items-center justify-center rounded-full text-xs text-slate-400 transition hover:bg-slate-200 hover:text-slate-700 dark:hover:bg-slate-700 dark:hover:text-slate-200"
                  title="Clear search"
                  aria-label="Clear search"
                >
                  ×
                </button>
              )}

            </div>
          )}

          {/* =================================================
              DARK MODE
          ================================================= */}

          <button
            type="button"
            onClick={() => setDarkMode(!darkMode)}
            className="flex h-10 w-10 items-center justify-center rounded-lg text-lg text-slate-600 transition hover:bg-slate-100 active:scale-95 dark:text-slate-300 dark:hover:bg-slate-700"
            title={
              darkMode
                ? "Switch to light mode"
                : "Switch to dark mode"
            }
            aria-label={
              darkMode
                ? "Switch to light mode"
                : "Switch to dark mode"
            }
          >
            {darkMode ? "☀️" : "🌙"}
          </button>

          {/* =================================================
              NOTIFICATIONS
          ================================================= */}

          <div
            ref={notificationRef}
            className="relative"
          >

            <button
              type="button"
              onClick={() =>
                setShowNotifications(
                  (previous) => !previous
                )
              }
              className="relative flex h-10 w-10 items-center justify-center rounded-lg text-lg text-slate-600 transition hover:bg-slate-100 active:scale-95 dark:text-slate-300 dark:hover:bg-slate-700"
              title="Notifications"
              aria-label="Notifications"
            >
              🔔

              {notifications.length > 0 && (
                <span className="absolute right-1.5 top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[9px] font-bold text-white shadow-sm">
                  {notifications.length > 9
                    ? "9+"
                    : notifications.length}
                </span>
              )}
            </button>

            {/* =================================================
                NOTIFICATION DROPDOWN
            ================================================= */}

            {showNotifications && (
              <div className="absolute right-0 top-12 z-[100] w-[calc(100vw-2rem)] max-w-80 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl dark:border-slate-700 dark:bg-slate-900">

                {/* Header */}
                <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3 dark:border-slate-700">

                  <div>
                    <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
                      Notifications
                    </h3>

                    <p className="mt-0.5 text-xs text-slate-400">
                      Workspace updates
                    </p>
                  </div>

                  {notifications.length > 0 && (
                    <span className="rounded-full bg-red-50 px-2 py-1 text-[10px] font-semibold text-red-600 dark:bg-red-950 dark:text-red-400">
                      {notifications.length} active
                    </span>
                  )}

                </div>

                {/* Notification List */}
                <div className="max-h-80 overflow-y-auto">

                  {loadingNotifications && (
                    <div className="px-4 py-8 text-center text-xs text-slate-400">
                      Checking your workspace...
                    </div>
                  )}

                  {!loadingNotifications &&
                    notifications.length === 0 && (
                      <div className="px-4 py-10 text-center">

                        <div className="mb-2 text-2xl">
                          ✅
                        </div>

                        <p className="text-sm font-medium text-slate-700 dark:text-slate-200">
                          You're all caught up
                        </p>

                        <p className="mt-1 text-xs text-slate-400">
                          No urgent workspace notifications.
                        </p>

                      </div>
                    )}

                  {!loadingNotifications &&
                    notifications.map((notification) => (
                      <button
                        key={notification.id}
                        type="button"
                        onClick={() =>
                          handleNotificationClick(notification)
                        }
                        className="flex w-full gap-3 border-b border-slate-100 px-4 py-3 text-left transition hover:bg-slate-50 active:bg-slate-100 dark:border-slate-800 dark:hover:bg-slate-800 dark:active:bg-slate-700"
                      >

                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-base dark:bg-slate-800">
                          {notification.icon}
                        </div>

                        <div className="min-w-0">

                          <p className="text-xs font-semibold text-slate-800 dark:text-slate-100">
                            {notification.title}
                          </p>

                          <p className="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400">
                            {notification.message}
                          </p>

                          <p className="mt-1 text-[10px] font-medium text-blue-500">
                            Open {notification.page}
                          </p>

                        </div>

                      </button>
                    ))}

                </div>

                {/* Refresh */}
                <div className="border-t border-slate-200 px-4 py-2 dark:border-slate-700">

                  <button
                    type="button"
                    onClick={loadNotifications}
                    className="w-full rounded-lg py-2 text-xs font-medium text-slate-500 transition hover:bg-slate-50 hover:text-blue-600 active:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-blue-400"
                  >
                    Refresh notifications
                  </button>

                </div>

              </div>
            )}

          </div>

        </div>
      </div>
    </nav>
  );
}

export default Navbar;