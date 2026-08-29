import { useState } from "react";
import Navbar from "../components/layout/Navbar";
import Sidebar from "../components/layout/Sidebar";

function Tasks({
  currentPage,
  onNavigate,
  tasks,
  setTaskList,
  projects,
  setProjectList,
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  const [formData, setFormData] = useState({
    title: "",
    project: "",
    status: "Todo",
    priority: "Medium",
    dueDate: "",
  });

  // -----------------------------
  // Open New Task Modal
  // -----------------------------
  const handleNewTask = () => {
    setEditingTask(null);

    setFormData({
      title: "",
      project: projects.length > 0 ? projects[0].name : "",
      status: "Todo",
      priority: "Medium",
      dueDate: "",
    });

    setIsModalOpen(true);
  };

  // -----------------------------
  // Open Edit Task Modal
  // -----------------------------
  const handleEditTask = (task) => {
    setEditingTask(task);

    setFormData({
      title: task.title,
      project: task.project,
      status: task.status,
      priority: task.priority,
      dueDate: task.dueDate,
    });

    setIsModalOpen(true);
  };

  // -----------------------------
  // Handle Form Changes
  // -----------------------------
  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // -----------------------------
  // Update Project Statistics
  // -----------------------------
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
            ? Math.round(
                (completedTasks / totalTasks) * 100
              )
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

  // -----------------------------
  // Save Task
  // -----------------------------
  const handleSubmit = (event) => {
    event.preventDefault();

    if (!formData.title.trim()) {
      return;
    }

    // Editing existing task
    if (editingTask) {
      const updatedTasks = tasks.map((task) =>
        task.id === editingTask.id
          ? {
              ...task,
              title: formData.title,
              project: formData.project,
              status: formData.status,
              priority: formData.priority,
              dueDate: formData.dueDate,
              completedAt:
                formData.status === "Done"
                  ? task.completedAt ||
                    new Date()
                      .toISOString()
                      .split("T")[0]
                  : null,
            }
          : task
      );

      setTaskList(updatedTasks);
      updateProjectStats(updatedTasks);
    }

    // Creating new task
    else {
      const today = new Date()
        .toISOString()
        .split("T")[0];

      const newTask = {
        id: Date.now(),
        title: formData.title,
        project: formData.project,
        status: formData.status,
        priority: formData.priority,
        dueDate: formData.dueDate,
        createdAt: today,
        completedAt:
          formData.status === "Done"
            ? today
            : null,
      };

      const updatedTasks = [
        ...tasks,
        newTask,
      ];

      setTaskList(updatedTasks);
      updateProjectStats(updatedTasks);
    }

    setIsModalOpen(false);
  };

  // -----------------------------
  // Delete Task
  // -----------------------------
  const handleDeleteTask = (taskId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this task?"
    );

    if (!confirmed) return;

    const updatedTasks = tasks.filter(
      (task) => task.id !== taskId
    );

    setTaskList(updatedTasks);
    updateProjectStats(updatedTasks);
  };

  // -----------------------------
  // Status Styles
  // -----------------------------
  const statusStyles = {
    Todo: "bg-slate-100 text-slate-600",
    "In Progress": "bg-blue-50 text-blue-600",
    Done: "bg-green-50 text-green-600",
  };

  // -----------------------------
  // Priority Styles
  // -----------------------------
  const priorityStyles = {
    High: "bg-red-50 text-red-600",
    Medium: "bg-yellow-50 text-yellow-600",
    Low: "bg-green-50 text-green-600",
  };

  return (
    <div className="h-screen overflow-hidden bg-slate-50">

      {/* Navbar */}
      <Navbar />

      <div className="flex h-[calc(100vh-4rem)]">

        {/* Sidebar */}
        <Sidebar
          currentPage={currentPage}
          onNavigate={onNavigate}
        />

        {/* Main Content */}
        <main className="min-w-0 flex-1 overflow-y-auto">

          <div className="mx-auto max-w-7xl p-4 sm:p-6 lg:p-8">

            {/* Header */}
            <section className="mb-8">

              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                <div>
                  <p className="text-sm font-medium text-blue-600">
                    Workspace
                  </p>

                  <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                    Tasks
                  </h1>

                  <p className="mt-2 text-sm text-slate-500 sm:text-base">
                    Manage and track your tasks.
                  </p>
                </div>

                {/* New Task */}
                <button
                  onClick={handleNewTask}
                  className="w-full rounded-lg bg-blue-500 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-blue-600 sm:w-auto"
                >
                  + New Task
                </button>

              </div>
            </section>

            {/* Task Count */}
            <div className="mb-5">
              <p className="text-sm text-slate-500">
                {tasks.length}{" "}
                {tasks.length === 1
                  ? "task"
                  : "tasks"}{" "}
                in your workspace
              </p>
            </div>

            {/* Task Cards */}
            {tasks.length > 0 ? (

              <div className="grid gap-5 lg:grid-cols-2">

                {tasks.map((task) => (

                  <div
                    key={task.id}
                    className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-md"
                  >

                    {/* Header */}
                    <div className="flex items-start justify-between gap-4">

                      <div className="min-w-0">

                        <h2 className="text-base font-semibold text-slate-900">
                          {task.title}
                        </h2>

                        <p className="mt-1 text-sm text-slate-500">
                          {task.project}
                        </p>

                      </div>

                      <button
                        onClick={() =>
                          handleEditTask(task)
                        }
                        className="shrink-0 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 transition hover:bg-slate-50"
                      >
                        Edit
                      </button>

                    </div>

                    {/* Status + Priority */}
                    <div className="mt-5 flex flex-wrap gap-2">

                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                          statusStyles[task.status]
                        }`}
                      >
                        {task.status}
                      </span>

                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                          priorityStyles[task.priority]
                        }`}
                      >
                        {task.priority} Priority
                      </span>

                    </div>

                    {/* Task Details */}
                    <div className="mt-5 grid grid-cols-2 gap-4 border-t border-slate-100 pt-4">

                      <div>
                        <p className="text-xs text-slate-400">
                          Due Date
                        </p>

                        <p className="mt-1 text-sm font-medium text-slate-700">
                          {task.dueDate || "Not set"}
                        </p>
                      </div>

                      <div className="text-right">
                        <p className="text-xs text-slate-400">
                          Status
                        </p>

                        <p className="mt-1 text-sm font-medium text-slate-700">
                          {task.status}
                        </p>
                      </div>

                    </div>

                    {/* Delete */}
                    <div className="mt-4 border-t border-slate-100 pt-4">

                      <button
                        onClick={() =>
                          handleDeleteTask(task.id)
                        }
                        className="text-xs font-medium text-red-500 transition hover:text-red-700"
                      >
                        Delete task
                      </button>

                    </div>

                  </div>

                ))}

              </div>

            ) : (

              <div className="rounded-xl border border-dashed border-slate-300 bg-white p-12 text-center">

                <div className="text-4xl">
                  📋
                </div>

                <h2 className="mt-4 text-lg font-semibold text-slate-900">
                  No tasks yet
                </h2>

                <p className="mt-2 text-sm text-slate-500">
                  Create your first task to get started.
                </p>

                <button
                  onClick={handleNewTask}
                  className="mt-5 rounded-lg bg-blue-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-600"
                >
                  + New Task
                </button>

              </div>

            )}

          </div>

        </main>
      </div>

      {/* Add / Edit Task Modal */}
      {isModalOpen && (

        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black-500/40 p-4">

          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">

            {/* Modal Header */}
            <div className="flex items-center justify-between">

              <div>
                <h2 className="text-lg font-semibold text-slate-900">
                  {editingTask
                    ? "Edit Task"
                    : "Create Task"}
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  {editingTask
                    ? "Update your task details."
                    : "Add a new task to your workspace."}
                </p>
              </div>

              <button
                onClick={() =>
                  setIsModalOpen(false)
                }
                className="flex h-8 w-8 items-center justify-center rounded-lg text-lg text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
              >
                ×
              </button>

            </div>

            {/* Form */}
            <form
              onSubmit={handleSubmit}
              className="mt-6 space-y-4"
            >

              {/* Title */}
              <div>

                <label className="text-sm font-medium text-slate-700">
                  Task Title
                </label>

                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Enter task title"
                  className="mt-1.5 w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
                  required
                />

              </div>

              {/* Project */}
              <div>

                <label className="text-sm font-medium text-slate-700">
                  Project
                </label>

                <select
                  name="project"
                  value={formData.project}
                  onChange={handleChange}
                  className="mt-1.5 w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none"
                  required
                >

                  {projects.map((project) => (
                    <option
                      key={project.id}
                      value={project.name}
                    >
                      {project.name}
                    </option>
                  ))}

                </select>

              </div>

              {/* Status */}
              <div>

                <label className="text-sm font-medium text-slate-700">
                  Status
                </label>

                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="mt-1.5 w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none"
                >

                  <option value="Todo">
                    Todo
                  </option>

                  <option value="In Progress">
                    In Progress
                  </option>

                  <option value="Done">
                    Done
                  </option>

                </select>

              </div>

              {/* Priority */}
              <div>

                <label className="text-sm font-medium text-slate-700">
                  Priority
                </label>

                <select
                  name="priority"
                  value={formData.priority}
                  onChange={handleChange}
                  className="mt-1.5 w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none"
                >

                  <option value="High">
                    High
                  </option>

                  <option value="Medium">
                    Medium
                  </option>

                  <option value="Low">
                    Low
                  </option>

                </select>

              </div>

              {/* Due Date */}
              <div>

                <label className="text-sm font-medium text-slate-700">
                  Due Date
                </label>

                <input
                  type="date"
                  name="dueDate"
                  value={formData.dueDate}
                  onChange={handleChange}
                  className="mt-1.5 w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none"
                />

              </div>

              {/* Buttons */}
              <div className="flex gap-3 pt-2">

                <button
                  type="button"
                  onClick={() =>
                    setIsModalOpen(false)
                  }
                  className="flex-1 rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="flex-1 rounded-lg bg-blue-500 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-blue-600"
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

    </div>
  );
}

export default Tasks;