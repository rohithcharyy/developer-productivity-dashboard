import { useEffect, useState } from "react";
import Navbar from "../components/layout/Navbar";
import Sidebar from "../components/layout/Sidebar";

import {
  getProjects,
  createProject,
  updateProject,
  deleteProject,
} from "../api/projectApi";
function Projects({
  currentPage,
  onNavigate,
  projects,
  setProjectList,
  userProfile,
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    status: "Planning",
    priority: "Medium",
  });

  // --------------------------------
  // Load Projects
  // --------------------------------
  useEffect(() => {
    const loadProjects = async () => {
      try {
        setIsLoading(true);
        setError("");

        const response = await getProjects();

        setProjectList(response.data);
      } catch (err) {
        console.error("Failed to load projects:", err);
        setError("Failed to load projects.");
      } finally {
        setIsLoading(false);
      }
    };

    loadProjects();
  }, [setProjectList]);

  // --------------------------------
  // Open New Project Modal
  // --------------------------------
  const handleNewProject = () => {
    setEditingProject(null);

    setFormData({
      name: "",
      description: "",
      status: "Planning",
      priority: "Medium",
    });

    setError("");
    setIsModalOpen(true);
  };

  // --------------------------------
  // Open Edit Project Modal
  // --------------------------------
  const handleEditProject = (project) => {
    setEditingProject(project);

    setFormData({
      name: project.name || "",
      description: project.description || "",
      status: project.status || "Planning",
      priority: project.priority || "Medium",
    });

    setError("");
    setIsModalOpen(true);
  };

  // --------------------------------
  // Handle Form Changes
  // --------------------------------
  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // --------------------------------
  // Create / Update Project
  // --------------------------------
  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!formData.name.trim()) {
      setError("Project name is required.");
      return;
    }

    try {
      setError("");

      // Update existing project
      if (editingProject) {
        const response = await updateProject(
          editingProject._id,
          formData
        );

        setProjectList((previousProjects) =>
          previousProjects.map((project) =>
            project._id === editingProject._id
              ? response.data
              : project
          )
        );
      }

      // Create new project
      else {
        const response = await createProject(formData);

        setProjectList((previousProjects) => [
          ...previousProjects,
          response.data,
        ]);
      }

      setIsModalOpen(false);
      setEditingProject(null);
    } catch (err) {
      console.error("Project operation failed:", err);
      setError(
        editingProject
          ? "Failed to update project."
          : "Failed to create project."
      );
    }
  };

  // --------------------------------
  // Delete Project
  // --------------------------------
  const handleDeleteProject = async (projectId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this project?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setError("");

      await deleteProject(projectId);

      setProjectList((previousProjects) =>
        previousProjects.filter(
          (project) => project._id !== projectId
        )
      );
    } catch (err) {
      console.error("Failed to delete project:", err);
      setError("Failed to delete project.");
    }
  };

  // --------------------------------
  // Close Modal
  // --------------------------------
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingProject(null);
    setError("");
  };

  // --------------------------------
  // Styles
  // --------------------------------
  const statusStyles = {
    Planning: "bg-slate-100 text-slate-600",
    "In Progress": "bg-blue-50 text-blue-600",
    Completed: "bg-green-50 text-green-600",
  };

  const priorityStyles = {
    High: "bg-red-50 text-red-600",
    Medium: "bg-yellow-50 text-yellow-600",
    Low: "bg-green-50 text-green-600",
  };

  // --------------------------------
  // Loading State
  // --------------------------------
  if (isLoading) {
    return (
      <div className="h-screen overflow-hidden bg-slate-50">
        <Navbar />

        <div className="flex h-[calc(100vh-4rem)]">
          <Sidebar
            currentPage={currentPage}
            onNavigate={onNavigate}
            userProfile={userProfile}
          />

          <main className="flex min-w-0 flex-1 items-center justify-center">
            <p className="text-sm text-slate-500">
              Loading projects...
            </p>
          </main>
        </div>
      </div>
    );
  }

  // --------------------------------
  // Main UI
  // --------------------------------
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
          <div className="mx-auto max-w-7xl p-4 sm:p-6 lg:p-8">

            {/* Header */}
            <section className="mb-8">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                <div>
                  <p className="text-sm font-medium text-blue-600">
                    Workspace
                  </p>

                  <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                    Projects
                  </h1>

                  <p className="mt-2 text-sm text-slate-500 sm:text-base">
                    Manage and track your projects.
                  </p>
                </div>

                <button
                  onClick={handleNewProject}
                  className="w-full rounded-lg bg-blue-500 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-blue-600 sm:w-auto"
                >
                  + New Project
                </button>

              </div>
            </section>

            {/* Error */}
            {error && (
              <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                {error}
              </div>
            )}

            {/* Count */}
            <div className="mb-5">
              <p className="text-sm text-slate-500">
                {projects.length}{" "}
                {projects.length === 1 ? "project" : "projects"}{" "}
                in your workspace
              </p>
            </div>

            {/* Project List */}
            {projects.length > 0 ? (
              <div className="grid gap-5 md:grid-cols-2">

                {projects.map((project) => (
                  <div
                    key={project._id}
                    className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-md"
                  >

                    {/* Project Header */}
                    <div className="flex items-start justify-between gap-4">

                      <div className="min-w-0">
                        <h2 className="text-lg font-semibold text-slate-900">
                          {project.name}
                        </h2>

                        <p className="mt-2 text-sm leading-6 text-slate-500">
                          {project.description || "No description"}
                        </p>
                      </div>

                      <button
                        onClick={() => handleEditProject(project)}
                        className="shrink-0 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 transition hover:bg-slate-50"
                      >
                        Edit
                      </button>

                    </div>

                    {/* Status + Priority */}
                    <div className="mt-5 flex flex-wrap gap-2">

                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                          statusStyles[project.status] ||
                          statusStyles.Planning
                        }`}
                      >
                        {project.status || "Planning"}
                      </span>

                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                          priorityStyles[project.priority] ||
                          priorityStyles.Medium
                        }`}
                      >
                        {project.priority || "Medium"} Priority
                      </span>

                    </div>

                    {/* Progress */}
                    <div className="mt-6">

                      <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-500">
                          Progress
                        </span>

                        <span className="font-semibold text-slate-700">
                          {project.progress || 0}%
                        </span>
                      </div>

                      <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100">
                        <div
                          className="h-full rounded-full bg-blue-500 transition-all duration-300"
                          style={{
                            width: `${project.progress || 0}%`,
                          }}
                        />
                      </div>

                    </div>

                    {/* Task Information */}
                    <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4">

                      <div>
                        <p className="text-xs text-slate-400">
                          Tasks
                        </p>

                        <p className="mt-1 text-sm font-semibold text-slate-700">
                          {project.tasksCompleted || 0} /{" "}
                          {project.totalTasks || 0}
                        </p>
                      </div>

                      <div className="text-right">
                        <p className="text-xs text-slate-400">
                          Completion
                        </p>

                        <p className="mt-1 text-sm font-semibold text-slate-700">
                          {project.progress || 0}%
                        </p>
                      </div>

                    </div>

                    {/* Delete */}
                    <div className="mt-4 border-t border-slate-100 pt-4">
                      <button
                        onClick={() =>
                          handleDeleteProject(project._id)
                        }
                        className="text-xs font-medium text-red-500 transition hover:text-red-700"
                      >
                        Delete project
                      </button>
                    </div>

                  </div>
                ))}

              </div>
            ) : (
              /* Empty State */
              <div className="rounded-xl border border-dashed border-slate-300 bg-white p-12 text-center">

                <div className="text-4xl">
                  📁
                </div>

                <h2 className="mt-4 text-lg font-semibold text-slate-900">
                  No projects yet
                </h2>

                <p className="mt-2 text-sm text-slate-500">
                  Create your first project to get started.
                </p>

                <button
                  onClick={handleNewProject}
                  className="mt-5 rounded-lg bg-blue-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-600"
                >
                  + New Project
                </button>

              </div>
            )}

          </div>
        </main>
      </div>

      {/* --------------------------------
          Add / Edit Project Modal
      -------------------------------- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">

          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">

            {/* Modal Header */}
            <div className="flex items-center justify-between">

              <div>
                <h2 className="text-lg font-semibold text-slate-900">
                  {editingProject
                    ? "Edit Project"
                    : "Create Project"}
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  {editingProject
                    ? "Update your project details."
                    : "Add a new project to your workspace."}
                </p>
              </div>

              <button
                onClick={handleCloseModal}
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

              {/* Project Name */}
              <div>
                <label className="text-sm font-medium text-slate-700">
                  Project Name
                </label>

                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter project name"
                  className="mt-1.5 w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
                  required
                />
              </div>

              {/* Description */}
              <div>
                <label className="text-sm font-medium text-slate-700">
                  Description
                </label>

                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Describe your project"
                  rows="3"
                  className="mt-1.5 w-full resize-none rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
                />
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
                  <option value="Planning">
                    Planning
                  </option>

                  <option value="In Progress">
                    In Progress
                  </option>

                  <option value="Completed">
                    Completed
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

              {/* Buttons */}
              <div className="flex gap-3 pt-2">

                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="flex-1 rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="flex-1 rounded-lg bg-blue-500 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-blue-600"
                >
                  {editingProject
                    ? "Save Changes"
                    : "Create Project"}
                </button>

              </div>

            </form>

          </div>
        </div>
      )}
    </div>
  );
}

export default Projects;