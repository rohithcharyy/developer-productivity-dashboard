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
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [priorityFilter, setPriorityFilter] = useState("All");
  const [projectFilter, setProjectFilter] = useState("All");

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 700);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => clearInterval(timer);
  }, []);

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

  const formattedDate = currentTime.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  const totalProjects = projectList.length;
  const totalTasks = taskList.length;

  const completedTasks = taskList.filter(
    (task) => task.status === "Done"
  ).length;

  const inProgressTasks = taskList.filter(
    (task) => task.status === "In Progress"
  ).length;

  const handleRetry = () => {
    setError(null);
  };

  const filteredProjects = projectList.filter((project) =>
    project.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredTasks = taskList.filter((task) => {
    const matchesSearch =
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.project.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === "All" || task.status === statusFilter;

    const matchesPriority =
      priorityFilter === "All" || task.priority === priorityFilter;

    const matchesProject =
      projectFilter === "All" || task.project === projectFilter;

    return (
      matchesSearch &&
      matchesStatus &&
      matchesPriority &&
      matchesProject
    );
  });

  if (isLoading) {
    return (
      <div className="h-screen overflow-hidden bg-slate-50">
        <Navbar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />

        <div className="flex h-[calc(100vh-4rem)]">
         <Sidebar
  currentPage={currentPage}
  onNavigate={onNavigate}
  userProfile={userProfile}
/>

          <main className="min-w-0 flex-1 overflow-y-auto">
            <LoadingState message="Loading your workspace..." />
          </main>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-screen overflow-hidden bg-slate-50">
        <Navbar />

        <div className="flex h-[calc(100vh-4rem)]">
          <Sidebar
  currentPage={currentPage}
  onNavigate={onNavigate}
  userProfile={userProfile}
/>

          <main className="min-w-0 flex-1 overflow-y-auto">
            <div className="p-4 sm:p-6 lg:p-8">
              <ErrorState
                message={error}
                onRetry={handleRetry}
              />
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen overflow-hidden bg-slate-50">

      <Navbar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      <div className="flex h-[calc(100vh-4rem)]">

        <Sidebar
          currentPage={currentPage}
          onNavigate={onNavigate}
          userProfile={userProfile}
        />

        <main className="min-w-0 flex-1 overflow-y-auto">

          <div className="mx-auto max-w-7xl p-4 sm:p-6 lg:p-8">

            {/* Welcome */}
            <section className="mb-8">
              <p className="text-sm font-medium text-blue-600">
                {formattedDate}
              </p>

              <div className="mt-2">
                <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                  {greeting}, {userProfile?.name || "Rohith"} 👋
                </h1>

                <p className="mt-2 text-sm text-slate-500 sm:text-base">
                  Here's what's happening with your projects today.
                </p>
              </div>
            </section>

            {/* Statistics */}
            <section>
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

            {/* Projects */}
            <section className="mt-8">

              <div className="mb-5">
                <h2 className="text-xl font-semibold text-slate-900">
                  Active Projects
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Track the progress of your current projects.
                </p>
              </div>

              {filteredProjects.length > 0 ? (
                <div className="grid gap-5 lg:grid-cols-2">
                  {filteredProjects.map((project) => (
                    <ProjectCard
                      key={project.id}
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

            {/* Tasks */}
            <section className="mt-8">

              <div className="mb-5">
                <h2 className="text-xl font-semibold text-slate-900">
                  Upcoming Tasks
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Stay on top of your most important tasks.
                </p>
              </div>

              <TaskFilters
                statusFilter={statusFilter}
                setStatusFilter={setStatusFilter}
                priorityFilter={priorityFilter}
                setPriorityFilter={setPriorityFilter}
                projectFilter={projectFilter}
                setProjectFilter={setProjectFilter}
                projects={projectList}
              />

              {filteredTasks.length > 0 ? (
                <div className="grid gap-5 pb-8 lg:grid-cols-2">

                  {filteredTasks.map((task) => (
                    <TaskCard
                      key={task.id}
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

        </main>
      </div>
    </div>
  );
}

export default Dashboard;