function ProjectCard({
  name,
  description,
  progress,
  tasksCompleted,
  totalTasks,
}) {
  return (
    <div className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md dark:border-slate-700 dark:bg-slate-800">

      {/* Project Header */}
      <div className="flex items-start justify-between gap-4">

        <div className="min-w-0">

          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-base dark:bg-blue-500/10">
              📁
            </div>

            <h3 className="truncate text-lg font-semibold text-slate-900 dark:text-white">
              {name}
            </h3>
          </div>

          <p className="mt-3 line-clamp-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
            {description || "No project description available."}
          </p>

        </div>

        {/* Progress Percentage */}
        <span className="shrink-0 rounded-xl bg-blue-50 px-3 py-2 text-sm font-bold text-blue-600 dark:bg-blue-500/10 dark:text-blue-400">
          {progress}%
        </span>

      </div>

      {/* Progress Information */}
      <div className="mt-6">

        <div className="mb-2.5 flex items-center justify-between">

          <span className="text-xs font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500">
            Progress
          </span>

          <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
            {tasksCompleted} of {totalTasks} tasks
          </span>

        </div>

        {/* Progress Bar */}
        <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-700">

          <div
            className="h-full rounded-full bg-blue-500 transition-all duration-500"
            style={{
              width: `${Math.min(Math.max(progress || 0, 0), 100)}%`,
            }}
          />

        </div>

      </div>

      {/* Project Footer */}
      <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4 dark:border-slate-700">

        <div className="flex items-center gap-2">

          <span className="h-2 w-2 rounded-full bg-emerald-500" />

          <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
            Active Project
          </span>

        </div>

        <span className="text-xs font-medium text-slate-400 dark:text-slate-500">
          {totalTasks === 1 ? "1 task" : `${totalTasks} tasks`}
        </span>

      </div>

    </div>
  );
}

export default ProjectCard;