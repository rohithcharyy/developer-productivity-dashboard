function TaskCard({ title, project, status, priority, dueDate }) {
  const statusStyles = {
  "Not Started": "bg-slate-100 text-slate-600",
  "In Progress": "bg-blue-50 text-blue-600",
  Done: "bg-green-50 text-green-600",
};

  const priorityStyles = {
    High: "bg-red-50 text-red-600",
    Medium: "bg-yellow-50 text-yellow-600",
    Low: "bg-green-50 text-green-600",
  };

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-md">
      {/* Task Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h3 className="text-base font-semibold text-slate-900">
            {title}
          </h3>

          <p className="mt-1 text-sm text-slate-500">
            {project}
          </p>
        </div>

        {/* Status */}
        <span
          className={`shrink-0 whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-semibold ${
            statusStyles[status]
          }`}
        >
          {status}
        </span>
      </div>

      {/* Task Details */}
      <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-4">
        {/* Priority */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400">
            Priority:
          </span>

          <span
            className={`rounded-md px-2.5 py-1 text-xs font-semibold ${
              priorityStyles[priority]
            }`}
          >
            {priority}
          </span>
        </div>

        {/* Due Date */}
        <div className="text-right">
          <p className="text-xs text-slate-400">
            Due date
          </p>

          <p className="mt-1 text-sm font-medium text-slate-600">
            {dueDate}
          </p>
        </div>
      </div>
    </div>
  );
}

export default TaskCard;