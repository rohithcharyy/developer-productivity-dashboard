function AIInsights({ tasks, projects, streak }) {
  const totalTasks = tasks.length;

  const completedTasks = tasks.filter(
    (task) => task.status === "Done"
  );

  const inProgressTasks = tasks.filter(
    (task) => task.status === "In Progress"
  );

  const todoTasks = tasks.filter(
    (task) => task.status === "Todo"
  );

  const highPriorityTasks = tasks.filter(
    (task) =>
      task.priority === "High" &&
      task.status !== "Done"
  );

  const completionRate =
    totalTasks > 0
      ? Math.round(
          (completedTasks.length / totalTasks) * 100
        )
      : 0;

  // Generate productivity insights
  const insights = [];

  // Completion rate insight
  if (completionRate >= 75) {
    insights.push({
      icon: "🚀",
      title: "Excellent completion rate",
      message: `You've completed ${completionRate}% of your tasks. Your current pace is strong.`,
    });
  } else if (completionRate >= 50) {
    insights.push({
      icon: "📈",
      title: "Good progress",
      message: `You've completed ${completionRate}% of your tasks. Keep the momentum going.`,
    });
  } else {
    insights.push({
      icon: "💡",
      title: "Room for improvement",
      message: `Your completion rate is ${completionRate}%. Consider focusing on fewer tasks at a time.`,
    });
  }

  // High priority insight
  if (highPriorityTasks.length > 0) {
    insights.push({
      icon: "⚠️",
      title: "High-priority workload",
      message: `You have ${highPriorityTasks.length} unfinished high-priority ${
        highPriorityTasks.length === 1
          ? "task"
          : "tasks"
      }. Consider completing these first.`,
    });
  }

  // In-progress insight
  if (inProgressTasks.length >= 3) {
    insights.push({
      icon: "🎯",
      title: "Too many tasks in progress",
      message: `You currently have ${inProgressTasks.length} tasks in progress. Finishing existing work before starting new tasks may improve focus.`,
    });
  }

  // Todo insight
  if (todoTasks.length > 0) {
    insights.push({
      icon: "📋",
      title: "Upcoming workload",
      message: `${todoTasks.length} ${
        todoTasks.length === 1
          ? "task is"
          : "tasks are"
      } waiting to be started.`,
    });
  }

  // Streak insight
  if (streak >= 3) {
    insights.push({
      icon: "🔥",
      title: "Strong productivity streak",
      message: `You're currently on a ${streak}-day streak. Keep completing tasks to maintain it.`,
    });
  } else if (streak === 0) {
    insights.push({
      icon: "🔥",
      title: "Start a productivity streak",
      message:
        "Complete a task today to start building your productivity streak.",
    });
  }

  // Project insight
  const projectNeedingAttention = projects
    .filter((project) => project.progress < 50)
    .sort((a, b) => a.progress - b.progress)[0];

  if (projectNeedingAttention) {
    insights.push({
      icon: "📊",
      title: "Project needs attention",
      message: `${projectNeedingAttention.name} is currently at ${projectNeedingAttention.progress}% progress. Consider prioritizing tasks from this project.`,
    });
  }

  return (
    <section className="mt-8 rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">

      {/* Header */}
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-900 text-lg text-white">
          🤖
        </div>

        <div>
          <h2 className="text-lg font-semibold text-slate-900">
            AI Productivity Insights
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Personalized recommendations based on your work patterns.
          </p>
        </div>
      </div>

      {/* Insights */}
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {insights.slice(0, 4).map((insight, index) => (
          <div
            key={index}
            className="rounded-lg border border-slate-100 bg-slate-50 p-4"
          >
            <div className="flex items-start gap-3">
              <span className="text-xl">
                {insight.icon}
              </span>

              <div>
                <h3 className="text-sm font-semibold text-slate-800">
                  {insight.title}
                </h3>

                <p className="mt-1 text-sm leading-6 text-slate-500">
                  {insight.message}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* AI disclaimer */}
      <div className="mt-5 border-t border-slate-100 pt-4">
        <p className="text-xs text-slate-400">
          Insights are generated from your current DevDash productivity data.
        </p>
      </div>
    </section>
  );
}

export default AIInsights;