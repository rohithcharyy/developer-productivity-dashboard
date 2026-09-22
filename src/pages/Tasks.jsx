import { useEffect, useMemo, useState } from "react";
import Navbar from "../components/layout/Navbar";
import Sidebar from "../components/layout/Sidebar";

import {
  getTasks,
  createTask,
  updateTaskStatus,
  deleteTask,
} from "../api/taskApi";

function Tasks({
  currentPage,
  onNavigate,
  tasks,
  setTaskList,
  projects,
  setProjectList,
  userProfile,
  searchQuery,
  setSearchQuery,
  onLogout,
  accounts,
  onSwitchAccount,
  darkMode,
  setDarkMode,
}) {
  // =========================================================
  // STATE
  // =========================================================

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    project: "",
    status: "Todo",
    priority: "Medium",
    dueDate: "",
  });

  // =========================================================
  // LOAD TASKS
  // =========================================================

  useEffect(() => {
    const loadTasks = async () => {
      try {
        setIsLoading(true);
        setError("");

        const response = await getTasks();

        setTaskList(response.data || []);
      } catch (error) {
        console.error("Failed to load tasks:", error);
        setError("Failed to load tasks.");
      } finally {
        setIsLoading(false);
      }
    };

    loadTasks();
  }, [setTaskList]);

  // =========================================================
  // SEARCH TASKS
  // =========================================================

  const filteredTasks = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    if (!query) {
      return tasks;
    }

    return tasks.filter((task) => {
      return (
        task.title?.toLowerCase().includes(query) ||
        task.project?.toLowerCase().includes(query) ||
        task.status?.toLowerCase().includes(query) ||
        task.priority?.toLowerCase().includes(query) ||
        task.dueDate?.toLowerCase().includes(query)
      );
    });
  }, [tasks, searchQuery]);

  // =========================================================
  // UPDATE PROJECT STATISTICS
  // =========================================================

  const updateProjectStats = (taskList) => {
    setProjectList((previousProjects) =>
      previousProjects.map((project) => {
        const projectTasks = taskList.filter(
          (task) => task.project === project.name
        );

        const totalTasks = projectTasks.length;

        const completedTasks = projectTasks.filter(
          (task) => task.status === "Done"
        ).length;

        const progress =
          totalTasks > 0
            ? Math.round((completedTasks / totalTasks) * 100)
            : 0;

        return {
          ...project,
          totalTasks,
          tasksCompleted: completedTasks,
          progress,
        };
      })
    );
  };

  // =========================================================
  // NEW TASK
  // =========================================================

  const handleNewTask = () => {
    setEditingTask(null);

    setFormData({
      title: "",
      project: projects.length > 0 ? projects[0].name : "",
      status: "Todo",
      priority: "Medium",
      dueDate: "",
    });

    setError("");
    setIsModalOpen(true);
  };

  // =========================================================
  // EDIT TASK
  // =========================================================

  const handleEditTask = (task) => {
    setEditingTask(task);

    setFormData({
      title: task.title || "",
      project: task.project || "",
      status: task.status || "Todo",
      priority: task.priority || "Medium",
      dueDate: task.dueDate || "",
    });

    setError("");
    setIsModalOpen(true);
  };

  // =========================================================
  // FORM CHANGE
  // =========================================================

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // =========================================================
  // SAVE TASK
  // =========================================================

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!formData.title.trim()) {
      setError("Task title is required.");
      return;
    }

    if (!formData.project) {
      setError("Please select a project.");
      return;
    }

    try {
      setError("");

      // -----------------------------------------------------
      // EDIT
      // -----------------------------------------------------

      if (editingTask) {
        const response = await updateTaskStatus(
          editingTask._id,
          formData.status
        );

        const updatedTask = {
          ...editingTask,
          ...response.data,
          title: formData.title,
          project: formData.project,
          priority: formData.priority,
          dueDate: formData.dueDate,
          status: formData.status,
        };

        const updatedTasks = tasks.map((task) =>
          task._id === editingTask._id ? updatedTask : task
        );

        setTaskList(updatedTasks);
        updateProjectStats(updatedTasks);

        setIsModalOpen(false);
        setEditingTask(null);

        return;
      }

      // -----------------------------------------------------
      // CREATE
      // -----------------------------------------------------

      const newTaskData = {
        title: formData.title,
        project: formData.project,
        status: formData.status,
        priority: formData.priority,
        dueDate: formData.dueDate,
      };

      const response = await createTask(newTaskData);

      const updatedTasks = [...tasks, response.data];

      setTaskList(updatedTasks);
      updateProjectStats(updatedTasks);

      setIsModalOpen(false);
    } catch (error) {
      console.error("Task operation failed:", error);

      setError(
        "Failed to save task. Make sure the backend is running."
      );
    }
  };

  // =========================================================
  // OPEN DELETE CONFIRMATION
  // =========================================================

  const handleDeleteTask = (task) => {
    setTaskToDelete(task);
    setIsDeleteModalOpen(true);
  };

  // =========================================================
  // CONFIRM DELETE TASK
  // =========================================================

  const confirmDeleteTask = async () => {
    if (!taskToDelete) return;

    try {
      setError("");

      await deleteTask(taskToDelete._id);

      const updatedTasks = tasks.filter(
        (task) => task._id !== taskToDelete._id
      );

      setTaskList(updatedTasks);
      updateProjectStats(updatedTasks);

      setIsDeleteModalOpen(false);
      setTaskToDelete(null);
    } catch (error) {
      console.error("Failed to delete task:", error);
      setError("Failed to delete task.");
    }
  };

  // =========================================================
  // CLOSE DELETE MODAL
  // =========================================================

  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setTaskToDelete(null);
  };

  // =========================================================
  // CLOSE EDIT / CREATE MODAL
  // =========================================================

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingTask(null);
    setError("");
  };

  // =========================================================
  // STYLES
  // =========================================================

  const statusStyles = {
    Todo: darkMode
      ? "bg-slate-800 text-slate-300 ring-1 ring-slate-700"
      : "bg-slate-100 text-slate-600 ring-1 ring-slate-200",

    "In Progress": darkMode
      ? "bg-blue-950/70 text-blue-400 ring-1 ring-blue-900"
      : "bg-blue-50 text-blue-600 ring-1 ring-blue-100",

    Done: darkMode
      ? "bg-green-950/70 text-green-400 ring-1 ring-green-900"
      : "bg-green-50 text-green-600 ring-1 ring-green-100",
  };

  const priorityStyles = {
    High: darkMode
      ? "bg-red-950/70 text-red-400 ring-1 ring-red-900"
      : "bg-red-50 text-red-600 ring-1 ring-red-100",

    Medium: darkMode
      ? "bg-yellow-950/70 text-yellow-400 ring-1 ring-yellow-900"
      : "bg-yellow-50 text-yellow-600 ring-1 ring-yellow-100",

    Low: darkMode
      ? "bg-green-950/70 text-green-400 ring-1 ring-green-900"
      : "bg-green-50 text-green-600 ring-1 ring-green-100",
  };

  // =========================================================
  // LOADING
  // =========================================================

  if (isLoading) {
    return (
      <div className="h-screen overflow-hidden bg-slate-50 dark:bg-slate-950">
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

          <main className="flex min-w-0 flex-1 items-center justify-center bg-slate-50 dark:bg-slate-950">
            <div className="text-center">
              <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-slate-200 border-t-blue-500 dark:border-slate-700 dark:border-t-blue-400" />

              <p className="mt-4 text-sm font-medium text-slate-600 dark:text-slate-300">
                Loading tasks...
              </p>

              <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">
                Preparing your workspace
              </p>
            </div>
          </main>
        </div>
      </div>
    );
  }

  // =========================================================
  // MAIN PAGE
  // =========================================================

  return (
    <div className="h-screen overflow-hidden bg-slate-50 dark:bg-slate-950">
      {/* Navbar */}
      <Navbar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        showSearch={true}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
      />

      <div className="flex h-[calc(100vh-4rem)]">
        {/* Sidebar */}
        <Sidebar
          currentPage={currentPage}
          onNavigate={onNavigate}
          userProfile={userProfile}
          onLogout={onLogout}
          accounts={accounts}
          onSwitchAccount={onSwitchAccount}
        />

        {/* Main Content */}
        <main className="min-w-0 flex-1 overflow-y-auto">
          <div className="mx-auto max-w-7xl p-4 sm:p-6 lg:p-8">
            {/* =================================================
                HEADER
            ================================================= */}

            <section className="mb-8">
              <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <div className="mb-2 inline-flex items-center rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-600 dark:bg-blue-950/50 dark:text-blue-400">
                    Workspace
                  </div>

                  <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
                    Tasks
                  </h1>

                  <p className="mt-2 max-w-xl text-sm leading-6 text-slate-500 dark:text-slate-400 sm:text-base">
                    Manage your tasks, priorities, and deadlines from one
                    place.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleNewTask}
                  className="group inline-flex w-full items-center justify-center gap-2 rounded-lg bg-blue-500 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition duration-200 hover:bg-blue-600 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500/30 active:scale-[0.98] sm:w-auto"
                >
                  <span className="text-lg leading-none transition-transform duration-200 group-hover:rotate-90">
                    +
                  </span>

                  New Task
                </button>
              </div>
            </section>

            {/* =================================================
                SEARCH INFORMATION
            ================================================= */}

            {searchQuery && (
              <div className="mb-5 flex flex-col gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm sm:flex-row sm:items-center sm:justify-between dark:border-slate-800 dark:bg-slate-900">
                <p className="text-sm text-slate-600 dark:text-slate-300">
                  Showing results for{" "}
                  <span className="font-semibold text-slate-900 dark:text-white">
                    "{searchQuery}"
                  </span>
                </p>

                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="self-start text-xs font-semibold text-blue-600 transition hover:text-blue-700 focus:outline-none dark:text-blue-400 dark:hover:text-blue-300 sm:self-auto"
                >
                  Clear search
                </button>
              </div>
            )}

            {/* =================================================
                ERROR
            ================================================= */}

            {error && (
              <div className="mb-5 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 dark:border-red-900/50 dark:bg-red-950/30">
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-red-100 text-xs font-bold text-red-600 dark:bg-red-900/50 dark:text-red-400">
                  !
                </div>

                <div>
                  <p className="text-sm font-semibold text-red-700 dark:text-red-400">
                    Something went wrong
                  </p>

                  <p className="mt-0.5 text-xs text-red-600 dark:text-red-400/80">
                    {error}
                  </p>
                </div>
              </div>
            )}

            {/* =================================================
                COUNT
            ================================================= */}

            <div className="mb-5 flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                  {filteredTasks.length}{" "}
                  {filteredTasks.length === 1 ? "task" : "tasks"}
                </p>

                <p className="mt-0.5 text-xs text-slate-400 dark:text-slate-500">
                  {searchQuery
                    ? "Matching your search"
                    : "Across your workspace"}
                </p>
              </div>
            </div>

            {/* =================================================
                TASK LIST
            ================================================= */}

            {filteredTasks.length > 0 ? (
              <div className="grid gap-5 lg:grid-cols-2">
                {filteredTasks.map((task) => (
                  <div
                    key={task._id}
                    className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-lg dark:border-slate-800 dark:bg-slate-900 dark:hover:border-slate-700 dark:hover:bg-slate-900/90"
                  >
                    {/* Header */}
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0">
                        <h2 className="truncate text-base font-semibold text-slate-900 dark:text-white">
                          {task.title}
                        </h2>

                        <div className="mt-1 flex items-center gap-2">
                          <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-slate-300 dark:bg-slate-600" />

                          <p className="truncate text-sm text-slate-500 dark:text-slate-400">
                            {task.project}
                          </p>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleEditTask(task)}
                        className="shrink-0 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 transition duration-200 hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-slate-600 dark:hover:bg-slate-800 dark:hover:text-white"
                      >
                        Edit
                      </button>
                    </div>

                    {/* Status + Priority */}
                    <div className="mt-5 flex flex-wrap gap-2">
                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                          statusStyles[task.status] ||
                          statusStyles.Todo
                        }`}
                      >
                        {task.status || "Todo"}
                      </span>

                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                          priorityStyles[task.priority] ||
                          priorityStyles.Medium
                        }`}
                      >
                        {task.priority || "Medium"} Priority
                      </span>
                    </div>

                    {/* Details */}
                    <div className="mt-5 grid grid-cols-2 gap-4 border-t border-slate-100 pt-4 dark:border-slate-800">
                      <div>
                        <p className="text-[11px] font-medium uppercase tracking-wide text-slate-400 dark:text-slate-500">
                          Due Date
                        </p>

                        <p className="mt-1 text-sm font-semibold text-slate-700 dark:text-slate-300">
                          {task.dueDate || "Not set"}
                        </p>
                      </div>

                      <div className="text-right">
                        <p className="text-[11px] font-medium uppercase tracking-wide text-slate-400 dark:text-slate-500">
                          Status
                        </p>

                        <p className="mt-1 text-sm font-semibold text-slate-700 dark:text-slate-300">
                          {task.status || "Todo"}
                        </p>
                      </div>
                    </div>

                    {/* Delete */}
                    <div className="mt-4 flex justify-end border-t border-slate-100 pt-4 dark:border-slate-800">
                      <button
                        type="button"
                        onClick={() => handleDeleteTask(task)}
                        className="text-xs font-semibold text-slate-400 transition hover:text-red-500 focus:outline-none dark:text-slate-500 dark:hover:text-red-400"
                      >
                        Delete task
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              /* =================================================
                 EMPTY STATE
              ================================================= */

              <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center shadow-sm dark:border-slate-700 dark:bg-slate-900">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-2xl dark:bg-slate-800">
                  {searchQuery ? "⌕" : "✓"}
                </div>

                <h2 className="mt-5 text-lg font-semibold text-slate-900 dark:text-white">
                  {searchQuery
                    ? "No tasks found"
                    : "No tasks yet"}
                </h2>

                <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-slate-500 dark:text-slate-400">
                  {searchQuery
                    ? "Try searching with a different keyword."
                    : "Create your first task and start organizing your work."}
                </p>

                {searchQuery ? (
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    className="mt-5 rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 focus:outline-none dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                  >
                    Clear Search
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleNewTask}
                    className="mt-5 rounded-lg bg-blue-500 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-600 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                  >
                    + Create Your First Task
                  </button>
                )}
              </div>
            )}
          </div>
        </main>
      </div>

      {/* =====================================================
          CREATE / EDIT TASK MODAL
      ===================================================== */}

      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              handleCloseModal();
            }
          }}
        >
          <div className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-700 dark:bg-slate-900">
            {/* Modal Header */}
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="mb-2 inline-flex rounded-full bg-blue-50 px-2.5 py-1 text-[11px] font-semibold text-blue-600 dark:bg-blue-950/50 dark:text-blue-400">
                  {editingTask ? "Edit Task" : "New Task"}
                </div>

                <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                  {editingTask
                    ? "Update task"
                    : "Create a task"}
                </h2>

                <p className="mt-1 text-sm leading-5 text-slate-500 dark:text-slate-400">
                  {editingTask
                    ? "Update the details of this task."
                    : "Add a new task to your workspace."}
                </p>
              </div>

              <button
                type="button"
                onClick={handleCloseModal}
                aria-label="Close modal"
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-xl text-slate-400 transition hover:bg-slate-100 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:text-slate-500 dark:hover:bg-slate-800 dark:hover:text-white"
              >
                ×
              </button>
            </div>

            {/* Form */}
            <form
              onSubmit={handleSubmit}
              className="mt-6 space-y-5"
            >
              {/* Title */}
              <div>
                <label className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                  Task Title
                </label>

                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="e.g. Complete dashboard design"
                  className="mt-2 w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:placeholder:text-slate-500"
                  required
                />
              </div>

              {/* Project */}
              <div>
                <label className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                  Project
                </label>

                <select
                  name="project"
                  value={formData.project}
                  onChange={handleChange}
                  className="mt-2 w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-700 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                  required
                >
                  <option value="" disabled>
                    Select a project
                  </option>

                  {projects.map((project) => (
                    <option
                      key={project._id}
                      value={project.name}
                    >
                      {project.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Status + Priority */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {/* Status */}
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                    Status
                  </label>

                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="mt-2 w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-700 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                  >
                    <option value="Todo">Todo</option>

                    <option value="In Progress">
                      In Progress
                    </option>

                    <option value="Done">Done</option>
                  </select>
                </div>

                {/* Priority */}
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                    Priority
                  </label>

                  <select
                    name="priority"
                    value={formData.priority}
                    onChange={handleChange}
                    className="mt-2 w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-700 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                  >
                    <option value="High">High</option>

                    <option value="Medium">
                      Medium
                    </option>

                    <option value="Low">Low</option>
                  </select>
                </div>
              </div>

              {/* Due Date */}
              <div>
                <label className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                  Due Date
                </label>

                <input
                  type="date"
                  name="dueDate"
                  value={formData.dueDate}
                  onChange={handleChange}
                  className="mt-2 w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-700 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                />
              </div>

              {/* Buttons */}
              <div className="flex gap-3 border-t border-slate-100 pt-5 dark:border-slate-800">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="flex-1 rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-500/10 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="flex-1 rounded-lg bg-blue-500 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-600 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500/30 active:scale-[0.98]"
                >
                  {editingTask
                    ? "Save Changes"
                    : "Create Task"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =====================================================
          DELETE CONFIRMATION MODAL
      ===================================================== */}

      {isDeleteModalOpen && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              handleCloseDeleteModal();
            }
          }}
        >
          <div
            className="w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-700 dark:bg-slate-900"
            onMouseDown={(event) => event.stopPropagation()}
          >
            {/* Warning Icon */}

            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-50 text-xl dark:bg-red-950/50">
              ⚠️
            </div>

            {/* Content */}

            <h2 className="mt-5 text-lg font-bold text-slate-900 dark:text-white">
              Delete Task?
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
              Are you sure you want to delete{" "}
              <span className="font-semibold text-slate-700 dark:text-slate-200">
                "{taskToDelete?.title}"
              </span>
              ? This action cannot be undone.
            </p>

            {/* Buttons */}

            <div className="mt-6 flex gap-3">
              <button
                type="button"
                onClick={handleCloseDeleteModal}
                className="flex-1 rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-300 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={confirmDeleteTask}
                className="flex-1 rounded-lg bg-red-500 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500/30 active:scale-[0.98]"
              >
                Delete Task
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Tasks;