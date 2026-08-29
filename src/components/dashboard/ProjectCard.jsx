function ProjectCard({
  name,
  description,
  progress,
  tasksCompleted,
  totalTasks,
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-md">
      {/* Project Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h3 className="text-lg font-semibold text-slate-900">
            {name}
          </h3>

          <p className="mt-2 text-sm text-slate-500">
            {description}
          </p>
        </div>

        <span className="shrink-0 rounded-lg bg-blue-50 px-3 py-1.5 text-sm font-semibold text-blue-600">
          {progress}%
        </span>
      </div>

      {/* Progress Information */}
      <div className="mt-6">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-sm font-medium text-slate-600">
            Progress
          </span>

          <span className="text-sm text-slate-500">
            {tasksCompleted} of {totalTasks} tasks
          </span>
        </div>

        {/* Progress Bar */}
        <div className="h-3 w-full overflow-hidden rounded-full bg-slate-100">
          <div
            className="h-full rounded-full bg-blue-500 transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Project Footer */}
      <div className="mt-6 border-t border-slate-100 pt-4">
        <span className="text-sm text-slate-500">
          Active Project
        </span>
      </div>
    </div>
  );
}

export default ProjectCard;