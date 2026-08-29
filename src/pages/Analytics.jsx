import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import Navbar from "../components/layout/Navbar";
import Sidebar from "../components/layout/Sidebar";
import StreakCard from "../components/Analytics/StreakCard";
import TaskStatusChart from "../components/Analytics/TaskStatusChart";
import PriorityChart from "../components/Analytics/PriorityChart";
import AIInsights from "../components/Analytics/AIInsights";

function Analytics({
  tasks,
  projects,
  currentPage,
  onNavigate,
}) {

  // --------------------------------------------------
  // COMPLETED TASKS
  // --------------------------------------------------

  // Treat "Done" as completed.
  // This also supports "Completed" in case your data uses that.
  const completedTasks = tasks.filter(
    (task) =>
      task.status === "Done" ||
      task.status === "Completed"
  );

  const totalCompleted = completedTasks.length;

  // --------------------------------------------------
  // COMPLETION RATE
  // --------------------------------------------------

  const completionRate =
    tasks.length > 0
      ? Math.round((totalCompleted / tasks.length) * 100)
      : 0;

  // --------------------------------------------------
  // GET COMPLETION DATE
  // --------------------------------------------------

  /*
    New tasks should ideally have completedAt.

    For older/demo tasks:
    if a task is Done but doesn't have completedAt,
    use dueDate as a fallback so existing data still
    appears correctly in Analytics.
  */

  const getCompletionDate = (task) => {
    if (task.completedAt) {
      return task.completedAt;
    }

    if (
      task.status === "Done" ||
      task.status === "Completed"
    ) {
      return task.dueDate || null;
    }

    return null;
  };

  // --------------------------------------------------
  // LAST 7 DAYS
  // --------------------------------------------------

  const getLast7Days = () => {
    const days = [];

    for (let i = 6; i >= 0; i--) {
      const date = new Date();

      date.setHours(0, 0, 0, 0);
      date.setDate(date.getDate() - i);

      const year = date.getFullYear();
      const month = String(
        date.getMonth() + 1
      ).padStart(2, "0");
      const day = String(
        date.getDate()
      ).padStart(2, "0");

      const formattedDate =
        `${year}-${month}-${day}`;

      const dayName = date.toLocaleDateString(
        "en-US",
        {
          weekday: "short",
        }
      );

      const completedCount =
        completedTasks.filter((task) => {
          const completionDate =
            getCompletionDate(task);

          return completionDate === formattedDate;
        }).length;

      days.push({
        day: dayName,
        completed: completedCount,
      });
    }

    return days;
  };

  const weeklyData = getLast7Days();

  const weeklyCompleted = weeklyData.reduce(
    (total, day) =>
      total + day.completed,
    0
  );

  // --------------------------------------------------
  // PRODUCTIVITY STREAK
  // --------------------------------------------------

  const calculateStreak = () => {
    const completionDates = [
      ...new Set(
        completedTasks
          .map((task) =>
            getCompletionDate(task)
          )
          .filter(Boolean)
      ),
    ];

    if (completionDates.length === 0) {
      return 0;
    }

    // Convert dates to local midnight
    const dates = completionDates
      .map((dateString) => {
        const date = new Date(
          `${dateString}T00:00:00`
        );

        return date;
      })
      .sort(
        (a, b) => b.getTime() - a.getTime()
      );

    const today = new Date();

    today.setHours(0, 0, 0, 0);

    const latestDate = dates[0];

    const daysSinceLatest = Math.floor(
      (today.getTime() -
        latestDate.getTime()) /
        (1000 * 60 * 60 * 24)
    );

    // If the most recent completion is older
    // than yesterday, the current streak is 0.
    if (daysSinceLatest > 1) {
      return 0;
    }

    let streak = 1;

    for (let i = 1; i < dates.length; i++) {
      const difference = Math.floor(
        (dates[i - 1].getTime() -
          dates[i].getTime()) /
          (1000 * 60 * 60 * 24)
      );

      if (difference === 1) {
        streak++;
      } else if (difference > 1) {
        break;
      }
    }

    return streak;
  };

  const currentStreak =
    calculateStreak();

  // --------------------------------------------------
  // RENDER
  // --------------------------------------------------

  return (
    <div className="h-screen overflow-hidden bg-slate-50">

      {/* Navbar */}
      <Navbar />

      {/* Workspace */}
      <div className="flex h-[calc(100vh-4rem)]">

        {/* Sidebar */}
        <Sidebar
          currentPage={currentPage}
          onNavigate={onNavigate}
        />

        {/* Main Analytics Area */}
        <main className="min-w-0 flex-1 overflow-y-auto">

          <div className="mx-auto max-w-7xl p-4 sm:p-6 lg:p-8">

            {/* Header */}
            <section className="mb-8">

              <p className="text-sm font-medium text-blue-600">
                Your work insights
              </p>

              <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                Productivity Analytics 📊
              </h1>

              <p className="mt-2 text-sm text-slate-500 sm:text-base">
                Understand your work patterns and track your productivity.
              </p>

            </section>

            {/* Overview Cards */}
            <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

              {/* Tasks Completed */}
              <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">

                <p className="text-sm font-medium text-slate-500">
                  Tasks Completed
                </p>

                <p className="mt-2 text-3xl font-bold text-slate-900">
                  {totalCompleted}
                </p>

                <p className="mt-2 text-sm text-green-600">
                  Completed tasks
                </p>

              </div>

              {/* Completion Rate */}
              <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">

                <p className="text-sm font-medium text-slate-500">
                  Completion Rate
                </p>

                <p className="mt-2 text-3xl font-bold text-slate-900">
                  {completionRate}%
                </p>

                <p className="mt-2 text-sm text-slate-500">
                  Of all current tasks
                </p>

              </div>

              {/* Weekly Completed */}
              <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">

                <p className="text-sm font-medium text-slate-500">
                  Weekly Completed
                </p>

                <p className="mt-2 text-3xl font-bold text-slate-900">
                  {weeklyCompleted}
                </p>

                <p className="mt-2 text-sm text-slate-500">
                  Tasks completed in the last 7 days
                </p>

              </div>

              {/* Streak */}
              <StreakCard
                streak={currentStreak}
              />

            </section>

            {/* Weekly Productivity */}
            <section className="mt-8 rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">

              <div className="mb-6">

                <h2 className="text-lg font-semibold text-slate-900">
                  Weekly Productivity
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Number of tasks completed over the last 7 days.
                </p>

              </div>

              <div className="h-72 w-full sm:h-80">

                <ResponsiveContainer
                  width="100%"
                  height="100%"
                >

                  <BarChart data={weeklyData}>

                    <CartesianGrid
                      strokeDasharray="3 3"
                    />

                    <XAxis
                      dataKey="day"
                    />

                    <YAxis
                      allowDecimals={false}
                      domain={[0, "auto"]}
                    />

                    <Tooltip />

                    <Bar
                      dataKey="completed"
                      fill="#2563eb"
                      radius={[6, 6, 0, 0]}
                    />

                  </BarChart>

                </ResponsiveContainer>

              </div>

            </section>

            {/* Analytics Charts */}
            <section className="mt-8 grid gap-6 lg:grid-cols-2">

              {/* Task Status */}
              <TaskStatusChart
                tasks={tasks}
              />

              {/* Priority */}
              <PriorityChart
                tasks={tasks}
              />

            </section>

            {/* AI Insights */}
            <AIInsights
              tasks={tasks}
              projects={projects}
              streak={currentStreak}
            />

            <div className="h-8" />

          </div>

        </main>

      </div>

    </div>
  );
}

export default Analytics;