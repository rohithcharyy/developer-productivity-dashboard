function EmptyState({
  icon = "📭",
  title = "Nothing found",
  message = "There is no data to display right now.",
}) {
  return (
    <div className="rounded-xl border border-dashed border-slate-300 bg-white px-6 py-10 text-center dark:border-slate-700 dark:bg-slate-800">
      <div className="text-3xl">{icon}</div>

      <h3 className="mt-3 text-base font-semibold text-slate-800 dark:text-slate-100">
        {title}
      </h3>

      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
        {message}
      </p>
    </div>
  );
}

export default EmptyState;