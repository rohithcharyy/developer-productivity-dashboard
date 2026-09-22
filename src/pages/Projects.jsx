import { useEffect, useMemo, useState } from "react";
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
  onLogout,
  accounts,
  onSwitchAccount,
}) {
  // =========================================================
  // STATE
  // =========================================================

  const [searchQuery, setSearchQuery] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);

  // Delete confirmation state
  const [projectToDelete, setProjectToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    status: "Planning",
    priority: "Medium",
  });

  // =========================================================
  // LOAD PROJECTS
  // =========================================================

  useEffect(() => {
    const loadProjects = async () => {
      try {
        setIsLoading(true);
        setError("");

        const response = await getProjects();

        setProjectList(response.data || []);
      } catch (error) {
        console.error("Failed to load projects:", error);
        setError("Failed to load projects.");
      } finally {
        setIsLoading(false);
      }
    };

    loadProjects();
  }, [setProjectList]);

  // =========================================================
  // SEARCH PROJECTS
  // =========================================================

  const filteredProjects = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    if (!query) {
      return projects;
    }

    return projects.filter((project) => {
      return (
        project.name?.toLowerCase().includes(query) ||
        project.description?.toLowerCase().includes(query) ||
        project.status?.toLowerCase().includes(query) ||
        project.priority?.toLowerCase().includes(query)
      );
    });
  }, [projects, searchQuery]);

  // =========================================================
  // NEW PROJECT
  // =========================================================

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

  // =========================================================
  // EDIT PROJECT
  // =========================================================

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
  // CREATE / UPDATE PROJECT
  // =========================================================

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!formData.name.trim()) {
      setError("Project name is required.");
      return;
    }

    try {
      setError("");

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
      } else {
        const response = await createProject(formData);

        setProjectList((previousProjects) => [
          ...previousProjects,
          response.data,
        ]);
      }

      setIsModalOpen(false);
      setEditingProject(null);
    } catch (error) {
      console.error("Project operation failed:", error);

      setError(
        editingProject
          ? "Failed to update project."
          : "Failed to create project."
      );
    }
  };

  // =========================================================
  // OPEN DELETE CONFIRMATION
  // =========================================================

  const handleDeleteProject = (project) => {
    setProjectToDelete(project);
    setError("");
  };

  // =========================================================
  // CONFIRM DELETE PROJECT
  // =========================================================

  const confirmDeleteProject = async () => {
    if (!projectToDelete) return;

    try {
      setIsDeleting(true);
      setError("");

      await deleteProject(projectToDelete._id);

      setProjectList((previousProjects) =>
        previousProjects.filter(
          (project) => project._id !== projectToDelete._id
        )
      );

      setProjectToDelete(null);
    } catch (error) {
      console.error("Failed to delete project:", error);
      setError("Failed to delete project.");
    } finally {
      setIsDeleting(false);
    }
  };

  // =========================================================
  // CLOSE DELETE CONFIRMATION
  // =========================================================

  const handleCloseDeleteModal = () => {
    if (isDeleting) return;

    setProjectToDelete(null);
  };

  // =========================================================
  // CLOSE EDIT / CREATE MODAL
  // =========================================================

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingProject(null);
    setError("");
  };

  // =========================================================
  // STYLES
  // =========================================================

  const statusStyles = {
    Planning:
      "bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300",

    "In Progress":
      "bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400",

    Completed:
      "bg-green-50 text-green-600 dark:bg-green-950 dark:text-green-400",
  };

  const priorityStyles = {
    High:
      "bg-red-50 text-red-600 dark:bg-red-950 dark:text-red-400",

    Medium:
      "bg-yellow-50 text-yellow-600 dark:bg-yellow-950 dark:text-yellow-400",

    Low:
      "bg-green-50 text-green-600 dark:bg-green-950 dark:text-green-400",
  };

  // =========================================================
  // LOADING
  // =========================================================

  if (isLoading) {
    return (
      <div className="h-screen select-none overflow-hidden bg-slate-50 dark:bg-slate-950">

        <Navbar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          showSearch={true}
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

          <main className="flex min-w-0 flex-1 items-center justify-center">

            <div className="text-center">

              <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-slate-200 border-t-blue-500 dark:border-slate-700 dark:border-t-blue-400" />

              <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">
                Loading projects...
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
    <div className="h-screen select-none overflow-hidden bg-slate-50 dark:bg-slate-950">

      {/* =====================================================
          NAVBAR
      ===================================================== */}

      <Navbar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        showSearch={true}
        onLogout={onLogout}
      />

      <div className="flex h-[calc(100vh-4rem)]">

        {/* ===================================================
            SIDEBAR
        =================================================== */}

        <Sidebar
          currentPage={currentPage}
          onNavigate={onNavigate}
          userProfile={userProfile}
          onLogout={onLogout}
          accounts={accounts}
          onSwitchAccount={onSwitchAccount}
        />

        {/* ===================================================
            MAIN CONTENT
        =================================================== */}

        <main className="min-w-0 flex-1 overflow-y-auto">

          <div className="mx-auto max-w-7xl p-4 sm:p-6 lg:p-8">

            {/* =================================================
                HEADER
            ================================================= */}

            <section className="mb-8">

              <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">

                <div>

                  <div className="flex items-center gap-3">

                    <p className="text-sm font-semibold text-blue-600 dark:text-blue-400">
                      Workspace
                    </p>

                    <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                      {projects.length}{" "}
                      {projects.length === 1
                        ? "project"
                        : "projects"}
                    </span>

                  </div>

                  <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
                    Projects
                  </h1>

                  <p className="mt-2 max-w-xl text-sm leading-6 text-slate-500 dark:text-slate-400 sm:text-base">
                    Manage your projects, track progress, and keep
                    your work organized.
                  </p>

                </div>

                <button
                  type="button"
                  onClick={handleNewProject}
                  className="w-full rounded-lg bg-blue-500 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-600 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-slate-950 sm:w-auto"
                >
                  + New Project
                </button>

              </div>

            </section>

            {/* =================================================
                SEARCH INFORMATION
            ================================================= */}

            {searchQuery && (
              <div className="mb-5 flex items-center justify-between gap-4 rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm dark:border-slate-800 dark:bg-slate-900">

                <p className="min-w-0 truncate text-sm text-slate-600 dark:text-slate-300">

                  Showing results for{" "}

                  <span className="font-semibold text-slate-900 dark:text-white">
                    "{searchQuery}"
                  </span>

                </p>

                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="shrink-0 text-xs font-semibold text-blue-600 transition hover:text-blue-700 focus:outline-none dark:text-blue-400 dark:hover:text-blue-300"
                >
                  Clear
                </button>

              </div>
            )}

            {/* =================================================
                ERROR
            ================================================= */}

            {error && (
              <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600 dark:border-red-900 dark:bg-red-950/40 dark:text-red-400">
                {error}
              </div>
            )}

            {/* =================================================
                RESULT COUNT
            ================================================= */}

            <div className="mb-5 flex items-center justify-between">

              <p className="text-sm text-slate-500 dark:text-slate-400">

                {filteredProjects.length}{" "}

                {filteredProjects.length === 1
                  ? "project"
                  : "projects"}{" "}

                {searchQuery
                  ? "found"
                  : "in your workspace"}

              </p>

            </div>

            {/* =================================================
                PROJECT LIST
            ================================================= */}

            {filteredProjects.length > 0 ? (

              <div className="grid gap-5 md:grid-cols-2">

                {filteredProjects.map((project) => {

                  const progress = project.progress || 0;

                  return (
                    <div
                      key={project._id}
                      className="group rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-md dark:border-slate-800 dark:bg-slate-900 dark:hover:bg-slate-800/80"
                    >

                      {/* Project Header */}

                      <div className="flex items-start justify-between gap-4">

                        <div className="min-w-0">

                          <h2 className="truncate text-lg font-semibold text-slate-900 dark:text-white">
                            {project.name}
                          </h2>

                          <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
                            {project.description ||
                              "No description provided."}
                          </p>

                        </div>

                        {/* Status */}

                        <span
                          className={`shrink-0 whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-semibold ${
                            statusStyles[project.status] ||
                            statusStyles.Planning
                          }`}
                        >
                          {project.status || "Planning"}
                        </span>

                      </div>

                      {/* Priority */}

                      <div className="mt-4">

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

                        <div className="flex items-center justify-between">

                          <span className="text-sm font-medium text-slate-600 dark:text-slate-300">
                            Progress
                          </span>

                          <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                            {progress}%
                          </span>

                        </div>

                        <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-700">

                          <div
                            className="h-full rounded-full bg-blue-500 transition-all duration-500"
                            style={{
                              width: `${Math.min(
                                Math.max(progress, 0),
                                100
                              )}%`,
                            }}
                          />

                        </div>

                      </div>

                      {/* Project Statistics */}

                      <div className="mt-5 grid grid-cols-2 gap-4 border-t border-slate-100 pt-4 dark:border-slate-700">

                        <div>

                          <p className="text-xs font-medium text-slate-400 dark:text-slate-500">
                            Tasks
                          </p>

                          <p className="mt-1 text-sm font-semibold text-slate-700 dark:text-slate-200">
                            {project.tasksCompleted || 0} /{" "}
                            {project.totalTasks || 0}
                          </p>

                        </div>

                        <div className="text-right">

                          <p className="text-xs font-medium text-slate-400 dark:text-slate-500">
                            Completion
                          </p>

                          <p className="mt-1 text-sm font-semibold text-slate-700 dark:text-slate-200">
                            {progress}%
                          </p>

                        </div>

                      </div>

                      {/* Actions */}

                      <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4 dark:border-slate-700">

                        <button
                          type="button"
                          onClick={() =>
                            handleDeleteProject(project)
                          }
                          className="rounded-md px-2 py-1 text-xs font-semibold text-red-500 transition hover:bg-red-50 hover:text-red-700 focus:outline-none focus:ring-2 focus:ring-red-500/20 dark:text-red-400 dark:hover:bg-red-950/40 dark:hover:text-red-300"
                        >
                          Delete
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            handleEditProject(project)
                          }
                          className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600 transition hover:bg-slate-50 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-300 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
                        >
                          Edit Project
                        </button>

                      </div>

                    </div>
                  );
                })}

              </div>

            ) : (

              /* =================================================
                 EMPTY STATE
                 ================================================= */

              <div className="rounded-xl border border-dashed border-slate-300 bg-white px-6 py-14 text-center shadow-sm dark:border-slate-700 dark:bg-slate-900">

                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-2xl dark:bg-slate-800">
                  {searchQuery ? "🔍" : "📁"}
                </div>

                <h2 className="mt-5 text-lg font-semibold text-slate-900 dark:text-white">

                  {searchQuery
                    ? "No projects found"
                    : "No projects yet"}

                </h2>

                <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500 dark:text-slate-400">

                  {searchQuery
                    ? "Try changing your search term or clear the search to view all projects."
                    : "Create your first project to start organizing your work."}

                </p>

                {searchQuery ? (

                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    className="mt-5 rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-300 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                  >
                    Clear Search
                  </button>

                ) : (

                  <button
                    type="button"
                    onClick={handleNewProject}
                    className="mt-5 rounded-lg bg-blue-500 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-600 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-slate-950"
                  >
                    + New Project
                  </button>

                )}

              </div>

            )}

          </div>

        </main>

      </div>

      {/* =====================================================
          CREATE / EDIT MODAL
      ===================================================== */}

      {isModalOpen && (

        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm"
          onClick={handleCloseModal}
        >

          <div
            className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-700 dark:bg-slate-900"
            onClick={(event) => event.stopPropagation()}
          >

            {/* Modal Header */}

            <div className="flex items-start justify-between gap-4">

              <div>

                <p className="text-xs font-semibold uppercase tracking-wide text-blue-600 dark:text-blue-400">
                  {editingProject
                    ? "Project Settings"
                    : "New Project"}
                </p>

                <h2 className="mt-1 text-xl font-semibold text-slate-900 dark:text-white">

                  {editingProject
                    ? "Edit Project"
                    : "Create Project"}

                </h2>

                <p className="mt-1 text-sm leading-5 text-slate-500 dark:text-slate-400">

                  {editingProject
                    ? "Update your project details."
                    : "Add a new project to your workspace."}

                </p>

              </div>

              <button
                type="button"
                onClick={handleCloseModal}
                aria-label="Close modal"
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-xl leading-none text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
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

                <label
                  htmlFor="project-name"
                  className="text-sm font-medium text-slate-700 dark:text-slate-300"
                >
                  Project Name
                </label>

                <input
                  id="project-name"
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter project name"
                  className="mt-1.5 w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:placeholder:text-slate-500 dark:focus:border-blue-500 dark:focus:ring-blue-950"
                  required
                />

              </div>

              {/* Description */}

              <div>

                <label
                  htmlFor="project-description"
                  className="text-sm font-medium text-slate-700 dark:text-slate-300"
                >
                  Description
                </label>

                <textarea
                  id="project-description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Describe your project"
                  rows="3"
                  className="mt-1.5 w-full resize-none rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:placeholder:text-slate-500 dark:focus:border-blue-500 dark:focus:ring-blue-950"
                />

              </div>

              {/* Status */}

              <div>

                <label
                  htmlFor="project-status"
                  className="text-sm font-medium text-slate-700 dark:text-slate-300"
                >
                  Status
                </label>

                <select
                  id="project-status"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="mt-1.5 w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:focus:border-blue-500 dark:focus:ring-blue-950"
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

                <label
                  htmlFor="project-priority"
                  className="text-sm font-medium text-slate-700 dark:text-slate-300"
                >
                  Priority
                </label>

                <select
                  id="project-priority"
                  name="priority"
                  value={formData.priority}
                  onChange={handleChange}
                  className="mt-1.5 w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:focus:border-blue-500 dark:focus:ring-blue-950"
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

              {/* Form Error */}

              {error && (
                <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2.5 text-sm text-red-600 dark:border-red-900 dark:bg-red-950/40 dark:text-red-400">
                  {error}
                </div>
              )}

              {/* Buttons */}

              <div className="flex gap-3 pt-2">

                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="flex-1 rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-300 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="flex-1 rounded-lg bg-blue-500 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-600 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900"
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

      {/* =====================================================
          DELETE CONFIRMATION MODAL
      ===================================================== */}

      {projectToDelete && (

        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm"
          onClick={handleCloseDeleteModal}
        >

          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-project-title"
            className="w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-700 dark:bg-slate-900"
            onClick={(event) => event.stopPropagation()}
          >

            {/* Warning Icon */}

            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100 dark:bg-red-950/50">

              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="h-6 w-6 text-red-600 dark:text-red-400"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 9v4m0 4h.01M10.29 3.86l-7.82 13.5A2 2 0 004.2 20h15.6a2 2 0 001.73-2.64l-7.82-13.5a2 2 0 00-3.42 0z"
                />
              </svg>

            </div>

            {/* Title */}

            <h2
              id="delete-project-title"
              className="mt-5 text-lg font-semibold text-slate-900 dark:text-white"
            >
              Delete project?
            </h2>

            {/* Message */}

            <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">

              Are you sure you want to delete{" "}

              <span className="font-semibold text-slate-700 dark:text-slate-200">
                "{projectToDelete.name}"
              </span>
              ?

              <br />

              <span className="text-xs text-slate-400 dark:text-slate-500">
                This action cannot be undone.
              </span>

            </p>

            {/* Buttons */}

            <div className="mt-6 flex gap-3">

              <button
                type="button"
                onClick={handleCloseDeleteModal}
                disabled={isDeleting}
                className="flex-1 rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-300 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={confirmDeleteProject}
                disabled={isDeleting}
                className="flex-1 rounded-lg bg-red-500 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-red-600 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 dark:focus:ring-offset-slate-900"
              >

                {isDeleting ? (

                  <span className="flex items-center justify-center gap-2">

                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />

                    Deleting...

                  </span>

                ) : (
                  "Delete Project"
                )}

              </button>

            </div>

          </div>

        </div>

      )}

    </div>
  );
}

export default Projects;