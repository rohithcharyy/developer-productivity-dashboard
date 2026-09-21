import { useEffect, useState } from "react";

import ProjectCard from "../components/dashboard/ProjectCard";
import Navbar from "../components/layout/Navbar";
import Sidebar from "../components/layout/Sidebar";
import StatsCard from "../components/dashboard/StatsCard";
import TaskCard from "../components/dashboard/TaskCard";
import TaskFilters from "../components/dashboard/TaskFilters";

import LoadingState from "../components/common/LoadingState";
import EmptyState from "../components/common/EmptyState";
import ErrorState from "../components/common/ErrorState";

function Dashboard({
  currentPage,
  onNavigate,
  taskList,
  projectList,
  userProfile,
  searchQuery,
  setSearchQuery,
  accounts,
  onSwitchAccount,
  onLogout,
  darkMode,
  setDarkMode,
}) {
  const [statusFilter, setStatusFilter] = useState("All");
  const [priorityFilter, setPriorityFilter] = useState("All");
  const [projectFilter, setProjectFilter] = useState("All");

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [currentTime, setCurrentTime] = useState(new Date());

  // =========================================================
  // LOADING
  // =========================================================

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 700);

    return () => clearTimeout(timer);
  }, []);

  // =========================================================
  // UPDATE CURRENT TIME
  // =========================================================

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  // =========================================================
  // GREETING
  // =========================================================

  const hour = currentTime.getHours();

  let greeting;

  if (hour < 12) {
    greeting = "Good morning";
  } else if (hour < 17) {
    greeting = "Good afternoon";
  } else if (hour < 21) {
    greeting = "Good evening";
  } else {
    greeting = "Good night";
  }

  // =========================================================
  // DATE
  // =========================================================

  const formattedDate = currentTime.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  // =========================================================
  // STATISTICS
  // =========================================================

  const totalProjects = projectList.length;

  const totalTasks = taskList.length;

  const completedTasks = taskList.filter(
    (task) => task.status === "Done"
  ).length;

  const inProgressTasks = taskList.filter(
    (task) => task.status === "In Progress"
  ).length;

  // =========================================================
  // RETRY
  // =========================================================

  const handleRetry = () => {
    setError(null);
  };

  // =========================================================
  // FILTER PROJECTS
  // =========================================================

  const filteredProjects = projectList.filter((project) =>
    project.name
      ?.toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

  // =========================================================
  // FILTER TASKS
  // =========================================================

  const filteredTasks = taskList.filter((task) => {
    const taskTitle = task.title?.toLowerCase() || "";
    const taskProject = task.project?.toLowerCase() || "";
    const search = searchQuery.toLowerCase();

    const matchesSearch =
      taskTitle.includes(search) ||
      taskProject.includes(search);

    const matchesStatus =
      statusFilter === "All" ||
      task.status === statusFilter;

    const matchesPriority =
      priorityFilter === "All" ||
      task.priority === priorityFilter;

    const matchesProject =
      projectFilter === "All" ||
      task.project === projectFilter;

    return (
      matchesSearch &&
      matchesStatus &&
      matchesPriority &&
      matchesProject
    );
  });

  // =========================================================
  // SHARED LAYOUT
  // =========================================================

  const renderLayout = (content) => (
    <div className="h-screen overflow-hidden bg-slate-50 dark:bg-slate-900">
      <Navbar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        showSearch={true}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
      />

      <div className="flex h-[calc(100vh-4rem)]">
        <Sidebar
          currentPage={currentPage}
          onNavigate={onNavigate}
          userProfile={userProfile}
          onLogout={onLogout}
          accounts={accounts}
          onSwitchAccount={onSwitchAccount}
        />

        <main className="min-w-0 flex-1 overflow-y-auto">
          {content}
        </main>
      </div>
    </div>
  );

  // =========================================================
  // LOADING STATE
  // =========================================================

  if (isLoading) {
    return renderLayout(
      <LoadingState message="Loading your workspace..." />
    );
  }

  // =========================================================
  // ERROR STATE
  // =========================================================

  if (error) {
    return renderLayout(
      <div className="p-4 sm:p-6 lg:p-8">
        <ErrorState
          message={error}
          onRetry={handleRetry}
        />
      </div>
    );
  }

  // =========================================================
  // MAIN DASHBOARD
  // =========================================================

  return renderLayout(
    <div className="mx-auto max-w-7xl p-4 sm:p-6 lg:p-8">

      {/* =====================================================
          WELCOME HERO
      ===================================================== */}

      <section className="mb-8">
        <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white px-6 py-7 shadow-sm dark:border-slate-700 dark:bg-slate-800 sm:px-8 sm:py-8">

          {/* Subtle background decoration */}
          <div className="pointer-events-none absolute -right-20 -top-20 h-48 w-48 rounded-full bg-blue-50 blur-3xl dark:bg-blue-500/10" />

          <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">

            <div>
              {/* Date */}
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />

                <p className="text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                  {formattedDate}
                </p>
              </div>

              {/* Greeting */}
              <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
                {greeting},{" "}
                {userProfile?.name || "Rohith"} 👋
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 dark:text-slate-400 sm:text-base">
                Here's what's happening with your projects today.
              </p>
            </div>

            {/* Workspace summary */}
            <div className="flex w-fit items-center gap-4 rounded-xl border border-slate-200 bg-slate-50 px-5 py-4 dark:border-slate-700 dark:bg-slate-700/40">

              <div>
                <p className="text-xs font-medium text-slate-400 dark:text-slate-500">
                  Workspace
                </p>

                <p className="mt-1 text-sm font-semibold text-slate-900 dark:text-white">
                  {totalProjects}{" "}
                  {totalProjects === 1 ? "project" : "projects"}
                </p>
              </div>

            </div>

          </div>
        </div>
      </section>

      {/* =====================================================
          WORKSPACE OVERVIEW
      ===================================================== */}

      <section>
        <div className="mb-4">
          <h2 className="text-xl font-semibold tracking-tight text-slate-900 dark:text-white">
            Workspace overview
          </h2>

          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            A quick look at your current workload.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

          <StatsCard
            title="Total Projects"
            value={totalProjects}
            icon="📁"
            description="Projects you're working on"
          />

          <StatsCard
            title="Total Tasks"
            value={totalTasks}
            icon="✓"
            description="Tasks across all projects"
          />

          <StatsCard
            title="Completed"
            value={completedTasks}
            icon="✅"
            description="Tasks completed successfully"
          />

          <StatsCard
            title="In Progress"
            value={inProgressTasks}
            icon="⚡"
            description="Tasks currently in progress"
          />

        </div>
      </section>

      {/* =====================================================
          ACTIVE PROJECTS
      ===================================================== */}

      <section className="mt-10">

        <div className="mb-5 flex items-end justify-between gap-4">

          <div>
            <h2 className="text-xl font-semibold tracking-tight text-slate-900 dark:text-white">
              Active Projects
            </h2>

            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Track the progress of your current projects.
            </p>
          </div>

          <span className="shrink-0 text-sm font-medium text-slate-400 dark:text-slate-500">
            {filteredProjects.length}{" "}
            {filteredProjects.length === 1
              ? "project"
              : "projects"}
          </span>

        </div>

        {filteredProjects.length > 0 ? (
          <div className="grid gap-5 lg:grid-cols-2">

            {filteredProjects.map((project) => (
              <ProjectCard
                key={project.id || project._id}
                name={project.name}
                description={project.description}
                progress={project.progress}
                tasksCompleted={project.tasksCompleted}
                totalTasks={project.totalTasks}
              />
            ))}

          </div>
        ) : (
          <EmptyState
            icon="📁"
            title="No projects found"
            message="Try searching for a different project."
          />
        )}

      </section>

      {/* =====================================================
          UPCOMING TASKS
      ===================================================== */}

      <section className="mt-10">

        <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">

          <div>
            <h2 className="text-xl font-semibold tracking-tight text-slate-900 dark:text-white">
              Upcoming Tasks
            </h2>

            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Stay on top of your most important tasks.
            </p>
          </div>

          <span className="text-sm font-medium text-slate-400 dark:text-slate-500">
            {filteredTasks.length}{" "}
            {filteredTasks.length === 1
              ? "task"
              : "tasks"}
          </span>

        </div>

        {/* Filters */}

        <div className="mb-5">
          <TaskFilters
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            priorityFilter={priorityFilter}
            setPriorityFilter={setPriorityFilter}
            projectFilter={projectFilter}
            setProjectFilter={setProjectFilter}
            projects={projectList}
          />
        </div>

        {/* Tasks */}

        {filteredTasks.length > 0 ? (
          <div className="grid gap-5 pb-10 lg:grid-cols-2">

            {filteredTasks.map((task) => (
              <TaskCard
                key={task.id || task._id}
                title={task.title}
                project={task.project}
                status={task.status}
                priority={task.priority}
                dueDate={task.dueDate}
              />
            ))}

          </div>
        ) : (
          <EmptyState
            icon="📋"
            title="No tasks found"
            message="Try changing your search or filters."
          />
        )}

      </section>

    </div>
  );
}

export default Dashboard;