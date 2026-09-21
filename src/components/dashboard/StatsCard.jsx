function StatsCard({
  title,
  value,
  icon,
  description,
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-colors dark:border-slate-700 dark:bg-slate-800">

      {/* Top Section */}
      <div className="flex items-start justify-between">

        <div>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
            {title}
          </p>

          <p className="mt-2 text-3xl font-bold text-slate-900 dark:text-white">
            {value}
          </p>
        </div>

        {/* Icon */}
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-xl dark:bg-slate-700">
          {icon}
        </div>

      </div>

      {/* Divider */}
      <div className="my-5 border-t border-slate-100 dark:border-slate-700" />

      {/* Description */}
      <p className="text-sm text-slate-500 dark:text-slate-400">
        {description}
      </p>

    </div>
  );
}

export default StatsCard;