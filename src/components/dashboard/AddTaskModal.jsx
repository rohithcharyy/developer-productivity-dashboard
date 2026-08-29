import { useEffect, useState } from "react";
function AddTaskModal({
  isOpen,
  onClose,
  onAddTask,
  projects,
}) {
    const [formData, setFormData] = useState({
    title: "",
    project: "",
    priority: "Medium",
    status: "Not Started",
    dueDate: "",
  });

  const [error, setError] = useState("");

  useEffect(() => {
  if (isOpen) {
    document.body.style.overflow = "hidden";
  }

  return () => {
    document.body.style.overflow = "";
  };
}, [isOpen]);

if (!isOpen) {
    return null;
  }

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]: value,
    }));

    // Clear error when user starts correcting the form
    if (error) {
      setError("");
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!formData.title.trim()) {
      setError("Please enter a task title.");
      return;
    }

    if (!formData.project) {
      setError("Please select a project.");
      return;
    }

    if (!formData.dueDate) {
      setError("Please select a due date.");
      return;
    }

    onAddTask(formData);

    setFormData({
      title: "",
      project: "",
      priority: "Medium",
      status: "Not Started",
      dueDate: "",
    });

    setError("");
  };

  const handleClose = () => {
    setError("");
    onClose();
  };

  const handleBackgroundClick = (event) => {
    if (event.target === event.currentTarget) {
      handleClose();
    }
  };

 return (
  <div
    onClick={handleBackgroundClick}
    className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/30 px-4"
  >
      <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">

        {/* Modal Header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-slate-900">
              Add New Task
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Create a new task for your project.
            </p>
          </div>

          <button
            type="button"
            onClick={handleClose}
            className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
          >
            ✕
          </button>
        </div>

        {/* Validation Error */}
        {error && (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2.5 text-sm text-red-600">
            ⚠️ {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Task Title */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">
              Task Title
            </label>

            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter task title"
              className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          {/* Project */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">
              Project
            </label>

           <div>
  <label className="mb-1.5 block text-sm font-medium text-slate-700">
    Project
  </label>

  <select
    name="project"
    value={formData.project}
    onChange={handleChange}
    className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
  >
    <option value="">Select project</option>

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
          </div>

          {/* Priority */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">
              Priority
            </label>

            <select
              name="priority"
              value={formData.priority}
              onChange={handleChange}
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
          </div>

          {/* Status */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">
              Status
            </label>

            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            >
              <option value="Not Started">Not Started</option>
              <option value="In Progress">In Progress</option>
              <option value="Done">Done</option>
            </select>
          </div>

          {/* Due Date */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">
              Due Date
            </label>

            <input
              type="date"
              name="dueDate"
              value={formData.dueDate}
              onChange={handleChange}
              className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-3">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="flex-1 rounded-lg bg-blue-500 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-blue-600"
            >
              Add Task
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}

export default AddTaskModal;