function StatsCard({ title, value, icon, description }) {
  return (
    <div className="group rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">
            {title}
          </p>

          <h3 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
            {value}
          </h3>
        </div>

        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-xl transition group-hover:scale-105">
          {icon}
        </div>
      </div>

      <div className="mt-5 border-t border-slate-100 pt-4">
        <p className="text-sm text-slate-500">
          {description}
        </p>
      </div>
    </div>
  );
}

export default StatsCard;