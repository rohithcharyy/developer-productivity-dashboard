import { useMemo, useState } from "react";
import Navbar from "../components/layout/Navbar";
import Sidebar from "../components/layout/Sidebar";

function Calendar({
  currentPage,
  onNavigate,
  tasks,
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

  // -----------------------------
  // Calendar information
  // -----------------------------

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

  // -----------------------------
  // Format date as YYYY-MM-DD
  // -----------------------------

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

  // -----------------------------
  // Create calendar days
  // -----------------------------

  const calendarDays = useMemo(() => {
    const days = [];

    // Empty cells before first day
    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }

    // Actual days
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

  // -----------------------------
  // Get tasks for a date
  // -----------------------------

  const getTasksForDate = (date) => {
    if (!date) return [];

    return tasks.filter(
      (task) =>
        task.dueDate === formatDate(date)
    );
  };

  // -----------------------------
  // Selected date tasks
  // -----------------------------

  const selectedDateTasks = getTasksForDate(
    selectedDate
  );

  // -----------------------------
  // Date helpers
  // -----------------------------

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

  // -----------------------------
  // Month navigation
  // -----------------------------

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

  // -----------------------------
  // Styles
  // -----------------------------

  const priorityStyles = {
    High: "bg-red-100 text-red-600",
    Medium: "bg-yellow-100 text-yellow-700",
    Low: "bg-green-100 text-green-600",
  };

  const statusStyles = {
    Todo: "bg-slate-100 text-slate-600",
    "In Progress":
      "bg-blue-100 text-blue-600",
    Done: "bg-green-100 text-green-600",
  };

  return (
    <div className="h-screen overflow-hidden bg-slate-50">

      {/* Navbar */}
      <Navbar />

      <div className="flex h-[calc(100vh-4rem)]">

        {/* Sidebar */}
        <Sidebar
          currentPage={currentPage}
          onNavigate={onNavigate}
        />

        {/* Main Content */}
        <main className="min-w-0 flex-1 overflow-y-auto">

          <div className="mx-auto max-w-7xl p-4 sm:p-6 lg:p-8">

            {/* Header */}
            <section className="mb-5">

              <p className="text-sm font-medium text-blue-600">
                Schedule
              </p>

              <div className="mt-1 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

                <div>
                  <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                    Calendar
                  </h1>

                  <p className="mt-1 text-sm text-slate-500 sm:text-base">
                    View and manage your upcoming tasks.
                  </p>
                </div>

                <button
                  onClick={goToToday}
                  className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50"
                >
                  Today
                </button>

              </div>

            </section>

            {/* Calendar + Selected Day */}
            <div className="grid gap-5 xl:grid-cols-[1fr_300px]">

              {/* Calendar */}
              <section className="rounded-xl border border-slate-200 bg-white shadow-sm">

                {/* Calendar Header */}
                <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3">

                  <h2 className="text-lg font-semibold text-slate-900">
                    {monthName}
                  </h2>

                  <div className="flex items-center gap-2">

                    <button
                      onClick={previousMonth}
                      className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-600 transition hover:bg-slate-50"
                      title="Previous month"
                    >
                      ←
                    </button>

                    <button
                      onClick={nextMonth}
                      className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-600 transition hover:bg-slate-50"
                      title="Next month"
                    >
                      →
                    </button>

                  </div>

                </div>

                {/* Weekdays */}
                <div className="grid grid-cols-7 border-b border-slate-200">

                  {[
                    "Sun",
                    "Mon",
                    "Tue",
                    "Wed",
                    "Thu",
                    "Fri",
                    "Sat",
                  ].map((day) => (

                    <div
                      key={day}
                      className="border-r border-slate-100 px-1 py-2 text-center text-[10px] font-semibold text-slate-400 last:border-r-0 sm:text-xs"
                    >
                      {day}
                    </div>

                  ))}

                </div>

                {/* Calendar Grid */}
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
                          disabled={!date}
                          onClick={() =>
                            date &&
                            setSelectedDate(date)
                          }
                          className={`relative min-h-[75px] border-b border-r border-slate-100 p-1.5 text-left transition last:border-r-0 sm:min-h-[85px] ${
                            !date
                              ? "cursor-default bg-slate-50/50"
                              : "hover:bg-slate-50"
                          } ${
                            isSelected(date)
                              ? "bg-slate-50"
                              : ""
                          }`}
                        >

                          {date && (
                            <>
                              {/* Date Number */}
                              <div
                                className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-medium ${
                                  isToday(date)
                                    ? "bg-black text-white"
                                    : isSelected(date)
                                    ? "bg-slate-200 text-slate-900"
                                    : "text-slate-700"
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
                                      key={task.id}
                                      className={`truncate rounded px-1 py-0.5 text-[9px] font-medium sm:text-[10px] ${
                                        statusStyles[
                                          task.status
                                        ]
                                      }`}
                                    >
                                      {task.title}
                                    </div>

                                  ))}

                                {dayTasks.length >
                                  2 && (
                                  <p className="px-1 text-[9px] font-medium text-slate-400">
                                    +
                                    {dayTasks.length -
                                      2}{" "}
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

              {/* Selected Day */}
              <aside className="h-fit rounded-xl border border-slate-200 bg-white shadow-sm">

                <div className="border-b border-slate-200 p-4">

                  <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                    Selected Day
                  </p>

                  <h2 className="mt-1 text-base font-semibold text-slate-900">
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

                <div className="p-4">

                  {selectedDateTasks.length >
                  0 ? (

                    <div className="space-y-3">

                      {selectedDateTasks.map(
                        (task) => (

                          <div
                            key={task.id}
                            className="rounded-lg border border-slate-200 p-3"
                          >

                            <h3 className="text-sm font-semibold text-slate-900">
                              {task.title}
                            </h3>

                            <p className="mt-1 text-xs text-slate-500">
                              {task.project}
                            </p>

                            <div className="mt-2 flex flex-wrap gap-1.5">

                              <span
                                className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                                  statusStyles[
                                    task.status
                                  ]
                                }`}
                              >
                                {task.status}
                              </span>

                              <span
                                className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                                  priorityStyles[
                                    task.priority
                                  ]
                                }`}
                              >
                                {task.priority}
                              </span>

                            </div>

                          </div>

                        )
                      )}

                    </div>

                  ) : (

                    <div className="py-6 text-center">

                      <div className="text-2xl">
                        📅
                      </div>

                      <h3 className="mt-2 text-sm font-semibold text-slate-900">
                        No tasks
                      </h3>

                      <p className="mt-1 text-xs text-slate-500">
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