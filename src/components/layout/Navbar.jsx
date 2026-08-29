function Navbar({ searchQuery, setSearchQuery }) {
  return (
    <nav className="sticky top-0 z-50 border-b border-slate-200 bg-white">
      <div className="flex h-16 items-center justify-between px-4 sm:px-6">

        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-500 font-bold text-white">
            D
          </div>

          <div>
            <h1 className="text-lg font-bold text-slate-900">
              DevDash
            </h1>

            <p className="hidden text-xs text-slate-500 sm:block">
              Productivity Workspace
            </p>
          </div>
        </div>

        {/* Right Side */}
        <div className="flex items-center gap-2 sm:gap-4">

          {/* Search */}
          <div className="hidden items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 md:flex">
            <span className="text-sm">🔍</span>

            <input
              type="text"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Search..."
              className="w-32 bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400 lg:w-48"
            />

            {/* Clear Search Button */}
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="flex h-5 w-5 items-center justify-center rounded-full text-xs text-slate-400 transition hover:bg-slate-200 hover:text-slate-700"
                title="Clear search"
                aria-label="Clear search"
              >
                ✕
              </button>
            )}
          </div>

          {/* Notification */}
          <button
            className="relative flex h-10 w-10 items-center justify-center rounded-lg text-lg text-slate-600 transition hover:bg-slate-100"
            title="Notifications"
          >
            🔔

            <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500"></span>
          </button>

          {/* Profile */}
          <div className="flex items-center gap-2 border-l border-slate-200 pl-2 sm:pl-4">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-500 text-sm font-semibold text-white">
              R
            </div>

            <div className="hidden lg:block">
              <p className="text-sm font-semibold text-slate-800">
                Rohith
              </p>

              <p className="text-xs text-slate-500">
                Developer
              </p>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;