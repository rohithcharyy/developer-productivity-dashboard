function TaskCard({
  title,
  project,
  status,
  priority,
  dueDate,
}) {
  const statusStyles = {
    Todo:
      "bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300",

    "Not Started":
      "bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300",

    "In Progress":
      "bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400",

    Done:
      "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400",
  };

  const priorityStyles = {
    High:
      "bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400",

    Medium:
      "bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400",

    Low:
      "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400",
  };

  const statusDotStyles = {
    Todo: "bg-slate-400",
    "Not Started": "bg-slate-400",
    "In Progress": "bg-blue-500",
    Done: "bg-emerald-500",
  };

  return (
    <div className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md dark:border-slate-700 dark:bg-slate-800">

      {/* Task Header */}
      <div className="flex items-start justify-between gap-4">

        <div className="min-w-0">

          {/* Task title */}
          <div className="flex items-start gap-3">

            <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-sm dark:bg-slate-700">
              ✓
            </div>

            <div className="min-w-0">

              <h3 className="truncate text-base font-semibold text-slate-900 dark:text-white">
                {title}
              </h3>

              <p className="mt-1 truncate text-sm text-slate-500 dark:text-slate-400">
                {project}
              </p>

            </div>

          </div>

        </div>

        {/* Status */}
        <span
          className={`flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-semibold ${
            statusStyles[status] ||
            "bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300"
          }`}
        >
          <span
            className={`h-1.5 w-1.5 rounded-full ${
              statusDotStyles[status] || "bg-slate-400"
            }`}
          />

          {status}
        </span>

      </div>

      {/* Task Details */}
      <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4 dark:border-slate-700">

        {/* Priority */}
        <div className="flex items-center gap-2">

          <span className="text-xs font-medium text-slate-400 dark:text-slate-500">
            Priority
          </span>

          <span
            className={`rounded-md px-2.5 py-1 text-xs font-semibold ${
              priorityStyles[priority] ||
              "bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300"
            }`}
          >
            {priority}
          </span>

        </div>

        {/* Due Date */}
        <div className="text-right">

          <p className="text-xs font-medium text-slate-400 dark:text-slate-500">
            Due date
          </p>

          <p className="mt-1 text-sm font-medium text-slate-700 dark:text-slate-300">
            {dueDate || "No due date"}
          </p>

        </div>

      </div>

    </div>
  );
}

export default TaskCard;