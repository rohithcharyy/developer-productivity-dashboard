import { useMemo, useState } from "react";
import Navbar from "../components/layout/Navbar";
import Sidebar from "../components/layout/Sidebar";

function Calendar({
  currentPage,
  onNavigate,
  tasks,
  userProfile,
  onLogout,
  accounts,
  onSwitchAccount,
}) {
  const today = new Date();

  const [currentDate, setCurrentDate] = useState(
    new Date(today.getFullYear(), today.getMonth(), 1)
  );

  const [selectedDate, setSelectedDate] = useState(
    new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate()
    )
  );

  // =========================================================
  // CALENDAR INFORMATION
  // =========================================================

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDay = new Date(year, month, 1).getDay();

  const daysInMonth = new Date(
    year,
    month + 1,
    0
  ).getDate();

  const monthName = currentDate.toLocaleDateString(
    "en-US",
    {
      month: "long",
      year: "numeric",
    }
  );

  // =========================================================
  // FORMAT DATE AS YYYY-MM-DD
  // =========================================================

  const formatDate = (date) => {
    if (!date) return "";

    const y = date.getFullYear();

    const m = String(
      date.getMonth() + 1
    ).padStart(2, "0");

    const d = String(
      date.getDate()
    ).padStart(2, "0");

    return `${y}-${m}-${d}`;
  };

  // =========================================================
  // CREATE CALENDAR DAYS
  // =========================================================

  const calendarDays = useMemo(() => {
    const days = [];

    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      days.push(
        new Date(year, month, day)
      );
    }

    return days;
  }, [
    year,
    month,
    firstDay,
    daysInMonth,
  ]);

  // =========================================================
  // GET TASKS FOR A DATE
  // =========================================================

  const getTasksForDate = (date) => {
    if (!date) return [];

    return tasks.filter(
      (task) =>
        task.dueDate === formatDate(date)
    );
  };

  // =========================================================
  // SELECTED DATE TASKS
  // =========================================================

  const selectedDateTasks = getTasksForDate(
    selectedDate
  );

  // =========================================================
  // DATE HELPERS
  // =========================================================

  const isToday = (date) => {
    if (!date) return false;

    return (
      formatDate(date) ===
      formatDate(today)
    );
  };

  const isSelected = (date) => {
    if (!date) return false;

    return (
      formatDate(date) ===
      formatDate(selectedDate)
    );
  };

  // =========================================================
  // MONTH NAVIGATION
  // =========================================================

  const previousMonth = () => {
    setCurrentDate(
      new Date(year, month - 1, 1)
    );
  };

  const nextMonth = () => {
    setCurrentDate(
      new Date(year, month + 1, 1)
    );
  };

  const goToToday = () => {
    const todayDate = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate()
    );

    setCurrentDate(
      new Date(
        today.getFullYear(),
        today.getMonth(),
        1
      )
    );

    setSelectedDate(todayDate);
  };

  // =========================================================
  // STYLES
  // =========================================================

  const priorityStyles = {
    High:
      "bg-red-50 text-red-600 border border-red-200 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/20",

    Medium:
      "bg-yellow-50 text-yellow-700 border border-yellow-200 dark:bg-yellow-500/10 dark:text-yellow-400 dark:border-yellow-500/20",

    Low:
      "bg-green-50 text-green-600 border border-green-200 dark:bg-green-500/10 dark:text-green-400 dark:border-green-500/20",
  };

  const statusStyles = {
    Todo:
      "bg-slate-100 text-slate-600 border border-slate-200 dark:bg-slate-700/60 dark:text-slate-300 dark:border-slate-600/50",

    "In Progress":
      "bg-blue-50 text-blue-600 border border-blue-200 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20",

    Done:
      "bg-green-50 text-green-600 border border-green-200 dark:bg-green-500/10 dark:text-green-400 dark:border-green-500/20",
  };

  return (
    <div className="h-screen overflow-hidden bg-slate-50 dark:bg-slate-900">

      {/* =====================================================
          NAVBAR
      ===================================================== */}

      <Navbar />

      <div className="flex h-[calc(100vh-4rem)]">

        {/* ===================================================
            SIDEBAR
        =================================================== */}

        <Sidebar
          currentPage={currentPage}
          onNavigate={onNavigate}
          userProfile={userProfile}
          onLogout={onLogout}
          accounts={accounts}
          onSwitchAccount={onSwitchAccount}
        />

        {/* ===================================================
            MAIN CONTENT
        =================================================== */}

        <main className="min-w-0 flex-1 overflow-y-auto bg-slate-50 dark:bg-slate-900">

          <div className="mx-auto max-w-7xl p-4 sm:p-5 lg:p-6">

            {/* =================================================
                HEADER
            ================================================= */}

            <section className="mb-5">

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

                <div>

                  <p className="text-sm font-medium text-blue-600 dark:text-blue-400">
                    Schedule
                  </p>

                  <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
                    Calendar
                  </h1>

                  <p className="mt-1.5 text-sm text-slate-500 dark:text-slate-400 sm:text-base">
                    View and manage your upcoming tasks.
                  </p>

                </div>

                <button
                  type="button"
                  onClick={goToToday}
                  className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:border-slate-600 dark:hover:bg-slate-700 sm:w-auto"
                >
                  Today
                </button>

              </div>

            </section>

            {/* =================================================
                CALENDAR + SELECTED DAY
            ================================================= */}

            <div className="grid gap-4 xl:grid-cols-[1fr_280px]">

              {/* =================================================
                  CALENDAR
              ================================================= */}

              <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-800">

                {/* Calendar Header */}

                <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3 dark:border-slate-700 sm:px-5">

                  <div>

                    <h2 className="text-base font-semibold text-slate-900 dark:text-white sm:text-lg">
                      {monthName}
                    </h2>

                    <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                      Select a day to view tasks
                    </p>

                  </div>

                  <div className="flex items-center gap-1.5">

                    <button
                      type="button"
                      onClick={previousMonth}
                      className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:border-slate-600 dark:hover:bg-slate-700 dark:hover:text-white"
                      title="Previous month"
                    >
                      ←
                    </button>

                    <button
                      type="button"
                      onClick={nextMonth}
                      className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:border-slate-600 dark:hover:bg-slate-700 dark:hover:text-white"
                      title="Next month"
                    >
                      →
                    </button>

                  </div>

                </div>

                {/* =================================================
                    WEEKDAYS
                ================================================= */}

                <div className="grid grid-cols-7 border-b border-slate-200 dark:border-slate-700">

                  {[
                    "SUN",
                    "MON",
                    "TUE",
                    "WED",
                    "THU",
                    "FRI",
                    "SAT",
                  ].map((day) => (

                    <div
                      key={day}
                      className="border-r border-slate-100 px-1 py-2 text-center text-[9px] font-semibold tracking-wide text-slate-400 last:border-r-0 dark:border-slate-700 dark:text-slate-400 sm:text-[10px]"
                    >
                      {day}
                    </div>

                  ))}

                </div>

                {/* =================================================
                    CALENDAR GRID
                ================================================= */}

                <div className="grid grid-cols-7">

                  {calendarDays.map(
                    (date, index) => {

                      const dayTasks =
                        getTasksForDate(date);

                      return (
                        <button
                          key={
                            date
                              ? formatDate(date)
                              : `empty-${index}`
                          }
                          type="button"
                          disabled={!date}
                          onClick={() =>
                            date &&
                            setSelectedDate(date)
                          }
                          className={`relative min-h-[68px] border-b border-r border-slate-100 p-1.5 text-left transition dark:border-slate-700 sm:min-h-[78px] ${
                            !date
                              ? "cursor-default bg-slate-50 dark:bg-slate-900/40"
                              : "bg-white hover:bg-slate-50 dark:bg-slate-800 dark:hover:bg-slate-700"
                          } ${
                            isSelected(date)
                              ? "bg-slate-50 dark:bg-slate-700/40"
                              : ""
                          }`}
                        >

                          {date && (
                            <>

                              {/* Date Number */}

                              <div
                                className={`flex h-6 w-6 items-center justify-center rounded-full text-[11px] font-medium transition ${
                                  isToday(date)
                                    ? "bg-blue-500 font-semibold text-white"
                                    : isSelected(date)
                                    ? "bg-slate-200 text-slate-900 dark:bg-slate-600 dark:text-white"
                                    : "text-slate-700 dark:text-slate-300"
                                }`}
                              >
                                {date.getDate()}
                              </div>

                              {/* Tasks */}

                              <div className="mt-1 space-y-0.5">

                                {dayTasks
                                  .slice(0, 2)
                                  .map((task) => (

                                    <div
                                      key={
                                        task._id ||
                                        task.id
                                      }
                                      className={`truncate rounded px-1.5 py-0.5 text-[8px] font-medium sm:text-[9px] ${
                                        statusStyles[
                                          task.status
                                        ] ||
                                        statusStyles.Todo
                                      }`}
                                    >
                                      {task.title}
                                    </div>

                                  ))}

                                {dayTasks.length > 2 && (
                                  <p className="px-1 text-[8px] font-medium text-slate-400 dark:text-slate-500">
                                    +
                                    {dayTasks.length - 2}{" "}
                                    more
                                  </p>
                                )}

                              </div>

                            </>
                          )}

                        </button>
                      );
                    }
                  )}

                </div>

              </section>

              {/* =================================================
                  SELECTED DAY
              ================================================= */}

              <aside className="h-fit overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-800">

                {/* Selected Day Header */}

                <div className="border-b border-slate-200 p-3.5 dark:border-slate-700">

                  <p className="text-[10px] font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                    Selected Day
                  </p>

                  <h2 className="mt-1 text-sm font-semibold text-slate-900 dark:text-white">
                    {selectedDate.toLocaleDateString(
                      "en-US",
                      {
                        weekday: "long",
                        month: "long",
                        day: "numeric",
                      }
                    )}
                  </h2>

                </div>

                {/* Selected Day Content */}

                <div className="p-3.5">

                  {selectedDateTasks.length > 0 ? (

                    <div className="space-y-2.5">

                      {selectedDateTasks.map(
                        (task) => (

                          <div
                            key={
                              task._id ||
                              task.id
                            }
                            className="rounded-lg border border-slate-200 bg-white p-3 transition hover:border-slate-300 dark:border-slate-700 dark:bg-slate-900/40 dark:hover:border-slate-600"
                          >

                            <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                              {task.title}
                            </h3>

                            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                              {task.project}
                            </p>

                            <div className="mt-2.5 flex flex-wrap gap-1.5">

                              <span
                                className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                                  statusStyles[
                                    task.status
                                  ] ||
                                  statusStyles.Todo
                                }`}
                              >
                                {task.status || "Todo"}
                              </span>

                              <span
                                className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                                  priorityStyles[
                                    task.priority
                                  ] ||
                                  priorityStyles.Medium
                                }`}
                              >
                                {task.priority || "Medium"}
                              </span>

                            </div>

                          </div>

                        )
                      )}

                    </div>

                  ) : (

                    <div className="flex min-h-[160px] flex-col items-center justify-center py-5 text-center">

                      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-xl dark:bg-blue-500/10">
                        📅
                      </div>

                      <h3 className="mt-3 text-sm font-semibold text-slate-900 dark:text-white">
                        No tasks
                      </h3>

                      <p className="mt-1 max-w-[200px] text-xs leading-5 text-slate-500 dark:text-slate-400">
                        No tasks are scheduled for this day.
                      </p>

                    </div>

                  )}

                </div>

              </aside>

            </div>

          </div>

        </main>

      </div>

    </div>
  );
}

export default Calendar;