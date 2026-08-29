function StreakCard({ streak }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">
            Current Streak
          </p>

          <div className="mt-2 flex items-center gap-2">
            <span className="text-3xl">🔥</span>

            <span className="text-3xl font-bold text-slate-900">
              {streak}
            </span>

            <span className="text-sm text-slate-500">
              {streak === 1 ? "day" : "days"}
            </span>
          </div>
        </div>

        <div className="rounded-lg bg-orange-50 px-3 py-2 text-xl">
          🔥
        </div>
      </div>

      <p className="mt-4 text-sm text-slate-500">
        {streak > 0
          ? "Keep completing tasks to maintain your streak!"
          : "Complete a task today to start your streak."}
      </p>
    </div>
  );
}

export default StreakCard;