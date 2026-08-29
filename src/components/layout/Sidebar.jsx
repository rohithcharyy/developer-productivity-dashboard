function Sidebar({
  currentPage,
  onNavigate,
}) {
  const menuItems = [
    { name: "Dashboard", icon: "D", page: "dashboard" },
    { name: "Projects", icon: "📁", page: "projects" },
    { name: "Tasks", icon: "✔️", page: "tasks" },
    { name: "Calendar", icon: "📅", page: "calendar" },
    { name: "Analytics", icon: "📊", page: "analytics" },
  ];

  return (
    <aside className="hidden h-full w-64 shrink-0 border-r border-slate-200 bg-white md:flex md:flex-col">

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto p-4">

        <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
          Workspace
        </p>

        <nav className="space-y-1">

          {menuItems.map((item) => {
            const isActive = currentPage === item.page;

            return (
              <button
                key={item.name}
                onClick={() => onNavigate(item.page)}
                className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-medium transition ${
                  isActive
                    ? "bg-blue-50 text-blue-600"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                }`}
              >
                <span className="flex h-5 w-5 items-center justify-center text-base">
                  {item.icon}
                </span>

                <span>{item.name}</span>

                {isActive && (
                  <span className="ml-auto h-1.5 w-1.5 rounded-full bg-blue-500"></span>
                )}
              </button>
            );
          })}

        </nav>

        <div className="my-6 border-t border-slate-200"></div>

        {/* Account */}
        <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
          Account
        </p>

        <button
          onClick={() => onNavigate("settings")}
          className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-medium transition ${
            currentPage === "settings"
              ? "bg-blue-50 text-blue-600"
              : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
          }`}
        >
          <span className="flex h-5 w-5 items-center justify-center text-base">
            ⚙
          </span>

          <span>Settings</span>

          {currentPage === "settings" && (
            <span className="ml-auto h-1.5 w-1.5 rounded-full bg-blue-500"></span>
          )}
        </button>

      </div>

      {/* Bottom User Card */}
      <div className="border-t border-slate-200 p-4">

        <div className="rounded-xl bg-slate-50 p-3">

          <div className="flex items-center gap-3">

            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-500 text-sm font-semibold text-white">
              R
            </div>

            <div className="min-w-0">

              <p className="truncate text-sm font-semibold text-slate-800">
                Rohith
              </p>

              <p className="truncate text-xs text-slate-500">
                Developer
              </p>

            </div>

          </div>

        </div>

      </div>

    </aside>
  );
}

export default Sidebar;