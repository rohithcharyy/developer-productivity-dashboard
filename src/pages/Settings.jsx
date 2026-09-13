import { useEffect, useState } from "react";
import Navbar from "../components/layout/Navbar";
import Sidebar from "../components/layout/Sidebar";

function Settings({
  currentPage,
  onNavigate,
  userProfile,
  setUserProfile,
}) {
  // Profile
  const [name, setName] = useState(userProfile?.name || "Rohith");
  const [role, setRole] = useState(
    userProfile?.role || "Developer"
  );

  // Notifications
  const [taskReminders, setTaskReminders] = useState(true);
  const [deadlineAlerts, setDeadlineAlerts] = useState(true);
  const [streakNotifications, setStreakNotifications] =
    useState(true);

  // Appearance
  const [compactMode, setCompactMode] = useState(false);

  // Productivity
  const [dailyGoal, setDailyGoal] = useState(5);
  const [streakTracking, setStreakTracking] = useState(true);

  const [saved, setSaved] = useState(false);

  // Keep form fields synchronized with shared profile
  useEffect(() => {
    if (userProfile) {
      setName(userProfile.name || "Rohith");
      setRole(userProfile.role || "Developer");
    }
  }, [userProfile]);

  // Save settings
 const handleSave = () => {
  const updatedProfile = {
    name: name.trim() || "Rohith",
    role: role.trim() || "Developer",
  };

  console.log("Saving profile:", updatedProfile);

  setUserProfile(updatedProfile);

  setSaved(true);

  setTimeout(() => {
    setSaved(false);
  }, 2000);
};

  // Reset settings
  const handleReset = () => {
    setName("Rohith");
    setRole("Developer");

    setTaskReminders(true);
    setDeadlineAlerts(true);
    setStreakNotifications(true);

    setCompactMode(false);

    setDailyGoal(5);
    setStreakTracking(true);
  };

  return (
    <div className="h-screen overflow-hidden bg-slate-50">

      <Navbar />

      <div className="flex h-[calc(100vh-4rem)]">

        {/* Sidebar */}
        <Sidebar
  currentPage={currentPage}
  onNavigate={onNavigate}
  userProfile={userProfile}
/>

        {/* Main Content */}
        <main className="min-w-0 flex-1 overflow-y-auto">

          <div className="mx-auto max-w-5xl p-4 sm:p-6 lg:p-8">

            {/* Header */}
            <section className="mb-8">
              <p className="text-sm font-medium text-blue-600">
                Workspace preferences
              </p>

              <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                Settings
              </h1>

              <p className="mt-2 text-sm text-slate-500 sm:text-base">
                Customize your DevDash workspace and productivity
                experience.
              </p>
            </section>

            <div className="space-y-6">

              {/* PROFILE */}
              <section className="rounded-xl border border-slate-200 bg-white shadow-sm">

                <div className="border-b border-slate-200 p-5 sm:p-6">
                  <h2 className="text-lg font-semibold text-slate-900">
                    Profile
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    Manage your developer profile.
                  </p>
                </div>

                <div className="grid gap-5 p-5 sm:grid-cols-2 sm:p-6">

                  {/* Name */}
                  <div>
                    <label className="text-sm font-medium text-slate-700">
                      Name
                    </label>

                    <input
                      type="text"
                      value={name}
                      onChange={(e) =>
                        setName(e.target.value)
                      }
                      className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-slate-400"
                    />
                  </div>

                  {/* Role */}
                  <div>
                    <label className="text-sm font-medium text-slate-700">
                      Role
                    </label>

                    <input
                      type="text"
                      value={role}
                      onChange={(e) =>
                        setRole(e.target.value)
                      }
                      className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-slate-400"
                    />
                  </div>

                </div>
              </section>

              {/* NOTIFICATIONS */}
              <section className="rounded-xl border border-slate-200 bg-white shadow-sm">

                <div className="border-b border-slate-200 p-5 sm:p-6">
                  <h2 className="text-lg font-semibold text-slate-900">
                    Notifications
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    Configure your notification preferences.
                  </p>
                </div>

                <div className="divide-y divide-slate-100">

                  <SettingToggle
                    title="Task reminders"
                    description="Receive reminders about upcoming tasks."
                    enabled={taskReminders}
                    onChange={setTaskReminders}
                  />

                  <SettingToggle
                    title="Deadline alerts"
                    description="Get notified when a task deadline is approaching."
                    enabled={deadlineAlerts}
                    onChange={setDeadlineAlerts}
                  />

                  <SettingToggle
                    title="Streak notifications"
                    description="Receive updates about your productivity streak."
                    enabled={streakNotifications}
                    onChange={setStreakNotifications}
                  />

                </div>
              </section>

              {/* APPEARANCE */}
              <section className="rounded-xl border border-slate-200 bg-white shadow-sm">

                <div className="border-b border-slate-200 p-5 sm:p-6">
                  <h2 className="text-lg font-semibold text-slate-900">
                    Appearance
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    Customize the appearance of DevDash.
                  </p>
                </div>

                <div className="divide-y divide-slate-100">

                  <SettingToggle
                    title="Compact mode"
                    description="Use smaller spacing to display more information on the screen."
                    enabled={compactMode}
                    onChange={setCompactMode}
                  />

                </div>
              </section>

              {/* PRODUCTIVITY */}
              <section className="rounded-xl border border-slate-200 bg-white shadow-sm">

                <div className="border-b border-slate-200 p-5 sm:p-6">
                  <h2 className="text-lg font-semibold text-slate-900">
                    Productivity
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    Configure your productivity goals.
                  </p>
                </div>

                <div className="space-y-6 p-5 sm:p-6">

                  {/* Daily Goal */}
                  <div>
                    <label className="text-sm font-medium text-slate-700">
                      Daily task goal
                    </label>

                    <p className="mt-1 text-xs text-slate-500">
                      Set the number of tasks you want to complete
                      each day.
                    </p>

                    <div className="mt-3 flex items-center gap-3">

                      <input
                        type="number"
                        min="1"
                        max="50"
                        value={dailyGoal}
                        onChange={(e) =>
                          setDailyGoal(
                            Number(e.target.value)
                          )
                        }
                        className="w-24 rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-slate-400"
                      />

                      <span className="text-sm text-slate-500">
                        tasks / day
                      </span>

                    </div>
                  </div>

                  {/* Streak Tracking */}
                  <SettingToggle
                    title="Streak tracking"
                    description="Track consecutive days of completed work."
                    enabled={streakTracking}
                    onChange={setStreakTracking}
                  />

                </div>
              </section>

              {/* AI */}
              <section className="rounded-xl border border-slate-200 bg-white shadow-sm">

                <div className="border-b border-slate-200 p-5 sm:p-6">

                  <div className="flex items-center gap-2">

                    <h2 className="text-lg font-semibold text-slate-900">
                      AI Assistant
                    </h2>

                    <span className="rounded-full bg-slate-100 px-2 py-1 text-xs font-medium text-slate-600">
                      Available
                    </span>

                  </div>

                  <p className="mt-1 text-sm text-slate-500">
                    AI-powered productivity analysis and
                    recommendations.
                  </p>

                </div>

                <div className="p-5 sm:p-6">

                  <div className="rounded-lg bg-slate-50 p-4">

                    <p className="text-sm font-medium text-slate-800">
                      🤖 DevDash AI
                    </p>

                    <p className="mt-1 text-xs leading-5 text-slate-500">
                      Your AI assistant analyzes your tasks,
                      projects and productivity patterns to provide
                      useful recommendations.
                    </p>

                  </div>

                </div>
              </section>

              {/* ACTIONS */}
              <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">

                <button
                  onClick={handleReset}
                  className="rounded-lg border border-slate-200 bg-white px-5 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                >
                  Reset
                </button>

                <button
                  onClick={handleSave}
                  className="rounded-lg bg-blue-500 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-blue-600"
                >
                  {saved ? "✓ Saved" : "Save Changes"}
                </button>

              </div>

              {/* DANGER ZONE */}
              <section className="rounded-xl border border-red-200 bg-white shadow-sm">

                <div className="p-5 sm:p-6">

                  <h2 className="text-lg font-semibold text-red-600">
                    Danger Zone
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    These actions can affect your dashboard data.
                  </p>

                  <button
                    onClick={() =>
                      alert(
                        "Reset functionality will be connected later."
                      )
                    }
                    className="mt-4 rounded-lg border border-red-200 px-4 py-2.5 text-sm font-medium text-red-600 transition hover:bg-red-50"
                  >
                    Reset Dashboard Data
                  </button>

                </div>

              </section>

              <div className="h-8"></div>

            </div>
          </div>

        </main>
      </div>
    </div>
  );
}

/* =========================================
   REUSABLE TOGGLE
========================================= */

function SettingToggle({
  title,
  description,
  enabled,
  onChange,
}) {
  return (
    <div className="flex items-center justify-between gap-4 p-5 sm:p-6">

      <div className="min-w-0">

        <h3 className="text-sm font-semibold text-slate-900">
          {title}
        </h3>

        <p className="mt-1 text-xs leading-5 text-slate-500">
          {description}
        </p>

      </div>

      <button
        type="button"
        onClick={() => onChange(!enabled)}
        className={`relative h-6 w-11 shrink-0 rounded-full transition ${
          enabled
            ? "bg-blue-500"
            : "bg-slate-200"
        }`}
        aria-pressed={enabled}
      >
        <span
          className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow-sm transition ${
            enabled
              ? "left-6"
              : "left-1"
          }`}
        />
      </button>

    </div>
  );
}

export default Settings;