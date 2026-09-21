function TaskFilters({
  statusFilter,
  setStatusFilter,
  priorityFilter,
  setPriorityFilter,
  projectFilter,
  setProjectFilter,
  projects,
}) {
  return (
    <div className="mb-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">

      {/* Status Filter */}
      <select
        value={statusFilter}
        onChange={(event) =>
          setStatusFilter(event.target.value)
        }
        className="rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:focus:border-blue-500 dark:focus:ring-blue-950"
      >
        <option value="All">All Statuses</option>
        <option value="Not Started">Not Started</option>
        <option value="In Progress">In Progress</option>
        <option value="Done">Done</option>
      </select>

      {/* Priority Filter */}
      <select
        value={priorityFilter}
        onChange={(event) =>
          setPriorityFilter(event.target.value)
        }
        className="rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:focus:border-blue-500 dark:focus:ring-blue-950"
      >
        <option value="All">All Priorities</option>
        <option value="High">High Priority</option>
        <option value="Medium">Medium Priority</option>
        <option value="Low">Low Priority</option>
      </select>

      {/* Project Filter */}
      <select
        value={projectFilter}
        onChange={(event) =>
          setProjectFilter(event.target.value)
        }
        className="rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:focus:border-blue-500 dark:focus:ring-blue-950"
      >
        <option value="All">All Projects</option>

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
  );
}

export default TaskFilters;