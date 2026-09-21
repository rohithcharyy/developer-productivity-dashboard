import { useState } from "react";

function Sidebar({
  currentPage,
  onNavigate,
  userProfile,
  onLogout,
  accounts = [],
  onSwitchAccount,
}) {
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);
  const [switchAccountOpen, setSwitchAccountOpen] = useState(false);

  // =========================================================
  // NAVIGATION ITEMS
  // =========================================================

  const menuItems = [
    {
      name: "Dashboard",
      icon: "D",
      page: "dashboard",
    },
    {
      name: "Projects",
      icon: "📁",
      page: "projects",
    },
    {
      name: "Tasks",
      icon: "✔️",
      page: "tasks",
    },
    {
      name: "Calendar",
      icon: "📅",
      page: "calendar",
    },
    {
      name: "Analytics",
      icon: "📊",
      page: "analytics",
    },
    {
      name: "AI Assistant",
      icon: "🤖",
      page: "ai-assistant",
    },
  ];

  // =========================================================
  // USER INFORMATION
  // =========================================================

  const displayName = userProfile?.name || "Rohith";
  const displayRole = userProfile?.role || "Developer";

  const avatarLetter =
    displayName.charAt(0).toUpperCase();

  // =========================================================
  // CLOSE MENUS
  // =========================================================

  const closeMenus = () => {
    setAccountMenuOpen(false);
    setSwitchAccountOpen(false);
  };

  // =========================================================
  // LOGOUT
  // =========================================================

  const handleLogout = () => {
    closeMenus();
    onLogout();
  };

  // =========================================================
  // ACCOUNT SWITCH
  // =========================================================

  const handleAccountSelect = (account) => {
    if (!account?.user || !account?.token) {
      return;
    }

    closeMenus();
    onSwitchAccount(account);
  };

  // =========================================================
  // ADD ACCOUNT
  // =========================================================

  const handleAddAccount = () => {
    closeMenus();

    window.dispatchEvent(
      new Event("devdash:add-account")
    );
  };

  // =========================================================
  // NAVIGATION
  // =========================================================

  const handleNavigation = (page) => {
    closeMenus();
    onNavigate(page);
  };

  return (
    <aside className="hidden h-full w-64 shrink-0 border-r border-slate-200 bg-white md:flex md:flex-col dark:border-slate-800 dark:bg-slate-900">

      {/* =====================================================
          NAVIGATION
      ===================================================== */}

      <div className="flex-1 overflow-y-auto p-4">

        {/* Workspace Label */}

        <p className="mb-3 px-3 text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
          Workspace
        </p>

        {/* Navigation */}

        <nav className="space-y-1">

          {menuItems.map((item) => {
            const isActive =
              currentPage === item.page;

            return (
              <button
                key={item.name}
                type="button"
                onClick={() =>
                  handleNavigation(item.page)
                }
                className={`group flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-medium transition-all duration-150 ${
                  isActive
                    ? "bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
                }`}
              >

                {/* Icon */}

                <span
                  className={`flex h-5 w-5 shrink-0 items-center justify-center text-base transition-transform duration-150 ${
                    !isActive
                      ? "group-hover:scale-105"
                      : ""
                  }`}
                >
                  {item.icon}
                </span>

                {/* Name */}

                <span className="truncate">
                  {item.name}
                </span>

                {/* Active Indicator */}

                {isActive && (
                  <span className="ml-auto h-1.5 w-1.5 shrink-0 rounded-full bg-blue-500" />
                )}

              </button>
            );
          })}

        </nav>

        {/* ===================================================
            DIVIDER
        =================================================== */}

        <div className="my-6 border-t border-slate-200 dark:border-slate-800" />

        {/* ===================================================
            ACCOUNT
        =================================================== */}

        <p className="mb-3 px-3 text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
          Account
        </p>

        {/* Settings */}

        <button
          type="button"
          onClick={() =>
            handleNavigation("settings")
          }
          className={`group flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-medium transition-all duration-150 ${
            currentPage === "settings"
              ? "bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400"
              : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
          }`}
        >

          <span className="flex h-5 w-5 shrink-0 items-center justify-center text-base">
            ⚙
          </span>

          <span>
            Settings
          </span>

          {currentPage === "settings" && (
            <span className="ml-auto h-1.5 w-1.5 rounded-full bg-blue-500" />
          )}

        </button>

      </div>

      {/* =====================================================
          USER ACCOUNT AREA
      ===================================================== */}

      <div className="relative border-t border-slate-200 p-4 dark:border-slate-800">

        {/* ===================================================
            ACCOUNT MENU
        =================================================== */}

        {accountMenuOpen && !switchAccountOpen && (

          <div className="absolute bottom-[88px] left-4 right-4 z-50 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg shadow-slate-200/50 dark:border-slate-700 dark:bg-slate-900 dark:shadow-black/20">

            {/* Account Header */}

            <div className="border-b border-slate-100 px-3 py-3 dark:border-slate-800">

              <div className="flex items-center gap-3">

                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-500 text-sm font-semibold text-white">
                  {avatarLetter}
                </div>

                <div className="min-w-0">

                  <p className="truncate text-sm font-semibold text-slate-900 dark:text-white">
                    {displayName}
                  </p>

                  <p className="truncate text-xs text-slate-500 dark:text-slate-400">
                    {displayRole}
                  </p>

                </div>

              </div>

            </div>

            {/* Account Settings */}

            <button
              type="button"
              onClick={() => {
                setAccountMenuOpen(false);
                onNavigate("settings");
              }}
              className="flex w-full items-center gap-3 px-3 py-2.5 text-left text-sm text-slate-700 transition hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-slate-800"
            >
              <span className="flex h-5 w-5 items-center justify-center">
                ⚙️
              </span>

              <span>
                Account Settings
              </span>
            </button>

            {/* Switch Account */}

            <button
              type="button"
              onClick={() =>
                setSwitchAccountOpen(true)
              }
              className="flex w-full items-center gap-3 px-3 py-2.5 text-left text-sm text-slate-700 transition hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-slate-800"
            >
              <span className="flex h-5 w-5 items-center justify-center">
                ⇄
              </span>

              <span>
                Switch Account
              </span>
            </button>

            {/* Logout */}

            <button
              type="button"
              onClick={handleLogout}
              className="flex w-full items-center gap-3 border-t border-slate-100 px-3 py-2.5 text-left text-sm text-red-600 transition hover:bg-red-50 dark:border-slate-800 dark:text-red-400 dark:hover:bg-red-950/30"
            >
              <span className="flex h-5 w-5 items-center justify-center">
                🚪
              </span>

              <span>
                Logout
              </span>
            </button>

          </div>
        )}

        {/* ===================================================
            SWITCH ACCOUNT MENU
        =================================================== */}

        {switchAccountOpen && (

          <div className="absolute bottom-[88px] left-4 right-4 z-50 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg shadow-slate-200/50 dark:border-slate-700 dark:bg-slate-900 dark:shadow-black/20">

            {/* Header */}

            <div className="flex items-center gap-2 border-b border-slate-100 px-3 py-3 dark:border-slate-800">

              <button
                type="button"
                onClick={() =>
                  setSwitchAccountOpen(false)
                }
                className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white"
              >
                ←
              </button>

              <div className="min-w-0">

                <p className="text-sm font-semibold text-slate-900 dark:text-white">
                  Switch Account
                </p>

                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Choose an account
                </p>

              </div>

            </div>

            {/* Saved Accounts */}

            <div className="max-h-64 overflow-y-auto p-2">

              {accounts.length > 0 ? (

                accounts.map((account) => {

                  const accountUser =
                    account?.user;

                  if (!accountUser) {
                    return null;
                  }

                  const accountName =
                    accountUser.name || "User";

                  const accountRole =
                    accountUser.role || "Developer";

                  const accountLetter =
                    accountName
                      .charAt(0)
                      .toUpperCase();

                  const isCurrentAccount =
                    String(accountUser.id) ===
                    String(userProfile?.id);

                  return (
                    <button
                      key={accountUser.id}
                      type="button"
                      disabled={isCurrentAccount}
                      onClick={() =>
                        handleAccountSelect(account)
                      }
                      className={`flex w-full items-center gap-3 rounded-lg p-2.5 text-left transition ${
                        isCurrentAccount
                          ? "cursor-default bg-blue-50 dark:bg-blue-950/50"
                          : "hover:bg-slate-50 dark:hover:bg-slate-800"
                      }`}
                    >

                      {/* Avatar */}

                      <div
                        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-semibold ${
                          isCurrentAccount
                            ? "bg-blue-500 text-white"
                            : "bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-200"
                        }`}
                      >
                        {accountLetter}
                      </div>

                      {/* Details */}

                      <div className="min-w-0 flex-1">

                        <p className="truncate text-sm font-semibold text-slate-800 dark:text-slate-100">
                          {accountName}
                        </p>

                        <p className="truncate text-xs text-slate-500 dark:text-slate-400">
                          {accountRole}
                        </p>

                      </div>

                      {/* Current Account */}

                      {isCurrentAccount && (
                        <span className="shrink-0 text-[11px] font-semibold text-blue-600 dark:text-blue-400">
                          Current
                        </span>
                      )}

                    </button>
                  );
                })

              ) : (

                <div className="px-4 py-6 text-center">

                  <div className="text-2xl">
                    👤
                  </div>

                  <p className="mt-2 text-sm font-medium text-slate-700 dark:text-slate-200">
                    No saved accounts
                  </p>

                  <p className="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400">
                    Accounts you log into will appear here.
                  </p>

                </div>

              )}

            </div>

            {/* Add Account */}

            <div className="border-t border-slate-100 p-2 dark:border-slate-800">

              <button
                type="button"
                onClick={handleAddAccount}
                className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-medium text-blue-600 transition hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-950/30"
              >

                <span className="flex h-5 w-5 items-center justify-center text-lg">
                  ＋
                </span>

                <span>
                  Add Account
                </span>

              </button>

            </div>

          </div>
        )}

        {/* ===================================================
            USER CARD
        =================================================== */}

        <button
          type="button"
          onClick={() => {
            setSwitchAccountOpen(false);

            setAccountMenuOpen(
              (previous) => !previous
            );
          }}
          className={`flex w-full items-center gap-3 rounded-xl border p-3 text-left transition-all duration-150 ${
            accountMenuOpen
              ? "border-blue-200 bg-blue-50 dark:border-blue-900/50 dark:bg-blue-950/30"
              : "border-transparent bg-slate-50 hover:border-slate-200 hover:bg-slate-100 dark:bg-slate-800 dark:hover:border-slate-700 dark:hover:bg-slate-750"
          }`}
        >

          {/* Avatar */}

          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-500 text-sm font-semibold text-white">
            {avatarLetter}
          </div>

          {/* User Details */}

          <div className="min-w-0 flex-1">

            <p className="truncate text-sm font-semibold text-slate-800 dark:text-white">
              {displayName}
            </p>

            <p className="truncate text-xs text-slate-500 dark:text-slate-400">
              {displayRole}
            </p>

          </div>

          {/* Menu Arrow */}

          <span
            className={`text-sm text-slate-400 transition-transform duration-200 ${
              accountMenuOpen
                ? "rotate-180"
                : ""
            }`}
          >
            ⌄
          </span>

        </button>

      </div>

    </aside>
  );
}

export default Sidebar;