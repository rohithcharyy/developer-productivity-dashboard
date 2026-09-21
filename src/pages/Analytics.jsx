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

function Analytics({
  currentPage,
  onNavigate,
  tasks,
  projects,
  userProfile,
  onLogout,
  accounts,
  onSwitchAccount,
}) {
  // --------------------------------------------------
  // COMPLETED TASKS
  // --------------------------------------------------

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
      ? Math.round(
          (totalCompleted / tasks.length) * 100
        )
      : 0;

  // --------------------------------------------------
  // DATE HELPERS
  // --------------------------------------------------

  const formatDate = (date) => {
    const year = date.getFullYear();

    const month = String(
      date.getMonth() + 1
    ).padStart(2, "0");

    const day = String(
      date.getDate()
    ).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

  // --------------------------------------------------
  // COMPLETION DATE
  // --------------------------------------------------

  const getCompletionDate = (task) => {
    if (task.completedAt) {
      return String(task.completedAt).slice(0, 10);
    }

    if (
      task.status === "Done" ||
      task.status === "Completed"
    ) {
      return task.dueDate
        ? String(task.dueDate).slice(0, 10)
        : null;
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

      const formattedDate = formatDate(date);

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
        date: formattedDate,
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

    const dates = completionDates
      .map((dateString) => {
        return new Date(
          `${dateString}T00:00:00`
        );
      })
      .sort(
        (a, b) =>
          b.getTime() - a.getTime()
      );

    const today = new Date();

    today.setHours(0, 0, 0, 0);

    const latestDate = dates[0];

    const daysSinceLatest = Math.floor(
      (
        today.getTime() -
        latestDate.getTime()
      ) /
        (1000 * 60 * 60 * 24)
    );

    if (daysSinceLatest > 1) {
      return 0;
    }

    let streak = 1;

    for (
      let i = 1;
      i < dates.length;
      i++
    ) {
      const difference = Math.floor(
        (
          dates[i - 1].getTime() -
          dates[i].getTime()
        ) /
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

  const currentStreak = calculateStreak();

  // --------------------------------------------------
  // WORKSPACE SUMMARY
  // --------------------------------------------------

  const activeTasks = tasks.filter(
    (task) =>
      task.status !== "Done" &&
      task.status !== "Completed"
  );

  const highPriorityTasks = activeTasks.filter(
    (task) => task.priority === "High"
  );

  // --------------------------------------------------
  // OVERDUE TASKS
  // --------------------------------------------------

  const today = formatDate(new Date());

  const overdueTasks = activeTasks.filter(
    (task) =>
      task.dueDate &&
      String(task.dueDate).slice(0, 10) <
        today
  );

  // --------------------------------------------------
  // ACTIVE PROJECTS
  // --------------------------------------------------

  const projectsInProgress = projects.filter(
    (project) =>
      project.status === "In Progress"
  );

  // --------------------------------------------------
  // RENDER
  // --------------------------------------------------

  return (
    <div className="h-screen overflow-hidden bg-slate-50 dark:bg-slate-900">

      {/* Navbar */}
      <Navbar />

      <div className="flex h-[calc(100vh-4rem)]">

        {/* Sidebar */}
        <Sidebar
          currentPage={currentPage}
          onNavigate={onNavigate}
          userProfile={userProfile}
          onLogout={onLogout}
          accounts={accounts}
          onSwitchAccount={onSwitchAccount}
        />

        {/* Main Content */}
        <main className="min-w-0 flex-1 overflow-y-auto bg-slate-50 dark:bg-slate-900">

          <div className="mx-auto max-w-7xl p-4 sm:p-6 lg:p-8">

            {/* ==========================================
                HEADER
            ========================================== */}

            <section className="mb-8">

              <p className="text-sm font-medium text-blue-600 dark:text-blue-400">
                Workspace
              </p>

              <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
                Analytics
              </h1>

              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400 sm:text-base">
                Understand your productivity and
                workspace activity.
              </p>

            </section>

            {/* ==========================================
                OVERVIEW
            ========================================== */}

            <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

              {/* Tasks Completed */}
              <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md dark:border-slate-700 dark:bg-slate-800">

                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                  Tasks Completed
                </p>

                <div className="mt-3 flex items-end justify-between">

                  <p className="text-3xl font-bold text-slate-900 dark:text-white">
                    {totalCompleted}
                  </p>

                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-green-50 text-sm text-green-600 dark:bg-green-500/10 dark:text-green-400">
                    ✓
                  </div>

                </div>

                <p className="mt-2 text-xs text-slate-400 dark:text-slate-500">
                  Total completed tasks
                </p>

              </div>

              {/* Completion Rate */}
              <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md dark:border-slate-700 dark:bg-slate-800">

                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                  Completion Rate
                </p>

                <div className="mt-3 flex items-end justify-between">

                  <p className="text-3xl font-bold text-slate-900 dark:text-white">
                    {completionRate}%
                  </p>

                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-sm text-blue-600 dark:bg-blue-500/10 dark:text-blue-400">
                    %
                  </div>

                </div>

                <p className="mt-2 text-xs text-slate-400 dark:text-slate-500">
                  Of all current tasks
                </p>

              </div>

              {/* Weekly Completed */}
              <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md dark:border-slate-700 dark:bg-slate-800">

                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                  Weekly Completed
                </p>

                <div className="mt-3 flex items-end justify-between">

                  <p className="text-3xl font-bold text-slate-900 dark:text-white">
                    {weeklyCompleted}
                  </p>

                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-sm text-blue-600 dark:bg-blue-500/10 dark:text-blue-400">
                    ↑
                  </div>

                </div>

                <p className="mt-2 text-xs text-slate-400 dark:text-slate-500">
                  Last 7 days
                </p>

              </div>

              {/* Streak */}
              <StreakCard
                streak={currentStreak}
              />

            </section>

            {/* ==========================================
                PRODUCTIVITY SIGNALS
            ========================================== */}

            <section className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

              {/* Active Tasks */}
              <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800">

                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                  Active Tasks
                </p>

                <p className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">
                  {activeTasks.length}
                </p>

                <p className="mt-2 text-xs text-slate-400 dark:text-slate-500">
                  Tasks still requiring work
                </p>

              </div>

              {/* High Priority */}
              <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800">

                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                  High Priority
                </p>

                <p className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">
                  {highPriorityTasks.length}
                </p>

                <p className="mt-2 text-xs text-slate-400 dark:text-slate-500">
                  High-priority active tasks
                </p>

              </div>

              {/* Overdue */}
              <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800">

                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                  Overdue
                </p>

                <p className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">
                  {overdueTasks.length}
                </p>

                <p className="mt-2 text-xs text-slate-400 dark:text-slate-500">
                  Tasks past their deadline
                </p>

              </div>

              {/* Active Projects */}
              <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800">

                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                  Active Projects
                </p>

                <p className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">
                  {projectsInProgress.length}
                </p>

                <p className="mt-2 text-xs text-slate-400 dark:text-slate-500">
                  Projects currently in progress
                </p>

              </div>

            </section>

            {/* ==========================================
                WEEKLY PRODUCTIVITY
            ========================================== */}

            <section className="mt-6 rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-800">

              {/* Chart Header */}
              <div className="border-b border-slate-100 px-5 py-4 dark:border-slate-700 sm:px-6">

                <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                  Weekly Productivity
                </h2>

                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  Tasks completed over the last 7 days.
                </p>

              </div>

              {/* Chart */}
              <div className="h-72 p-4 sm:h-80 sm:p-6">

                <ResponsiveContainer
                  width="100%"
                  height="100%"
                >

                  <BarChart
                    data={weeklyData}
                    margin={{
                      top: 10,
                      right: 10,
                      left: -10,
                      bottom: 0,
                    }}
                  >

                    <CartesianGrid
                      strokeDasharray="3 3"
                      vertical={false}
                      stroke="#e2e8f0"
                    />

                    <XAxis
                      dataKey="day"
                      axisLine={false}
                      tickLine={false}
                      tick={{
                        fill: "#64748b",
                        fontSize: 12,
                      }}
                    />

                    <YAxis
                      allowDecimals={false}
                      domain={[0, "auto"]}
                      axisLine={false}
                      tickLine={false}
                      tick={{
                        fill: "#64748b",
                        fontSize: 12,
                      }}
                    />

                    <Tooltip
                      cursor={{
                        fill: "#f8fafc",
                      }}
                      contentStyle={{
                        borderRadius: "8px",
                        border: "1px solid #e2e8f0",
                        boxShadow:
                          "0 4px 12px rgba(15, 23, 42, 0.08)",
                      }}
                    />

                    <Bar
                      dataKey="completed"
                      fill="#2563eb"
                      radius={[
                        5,
                        5,
                        0,
                        0,
                      ]}
                      maxBarSize={45}
                    />

                  </BarChart>

                </ResponsiveContainer>

              </div>

            </section>

            {/* ==========================================
                TASK ANALYTICS
            ========================================== */}

            <section className="mt-6 grid gap-6 lg:grid-cols-2">

              <TaskStatusChart
                tasks={tasks}
              />

              <PriorityChart
                tasks={tasks}
              />

            </section>

            {/* Bottom spacing */}
            <div className="h-8" />

          </div>

        </main>

      </div>

    </div>
  );
}

export default Analytics;