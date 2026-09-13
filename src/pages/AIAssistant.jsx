import Navbar from "../components/layout/Navbar";
import Sidebar from "../components/layout/Sidebar";
function AIAssistant({
  currentPage,
  onNavigate,
  tasks,
  projects,
  userProfile,
}) {
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

        {/* Main Content */}
        <main className="min-w-0 flex-1 overflow-y-auto">

          <div className="mx-auto flex min-h-full max-w-6xl flex-col px-4 py-6 sm:px-6 lg:px-8">

            {/* Header */}
            <div className="mb-8">

              <div className="flex items-center gap-3">

                {/* AI Icon */}
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-xl">
                  🤖
                </div>

                <div>
                  <div className="flex items-center gap-2">

                    <h1 className="text-xl font-bold text-slate-900 sm:text-2xl">
                      AI Assistant
                    </h1>

                    <span className="rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-semibold text-blue-600">
                      AI
                    </span>

                  </div>

                  <p className="mt-1 text-sm text-slate-500">
                    Your personal productivity assistant.
                  </p>
                </div>

              </div>

            </div>

            {/* Main Assistant Area */}
            <div className="flex flex-1 flex-col items-center">

              {/* Welcome */}
              <div className="mt-8 max-w-2xl text-center">

                <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                  How can I help with your work?
                </h2>

                <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-slate-500 sm:text-base">
                  Ask me about your tasks, projects, deadlines,
                  productivity, workload, or what you should
                  focus on next.
                </p>

              </div>

              {/* Suggested Questions */}
              <div className="mt-10 w-full max-w-3xl">

                <div className="mb-4 flex items-center justify-between">

                  <div>
                    <h3 className="text-sm font-semibold text-slate-800">
                      Suggested questions
                    </h3>

                    <p className="mt-1 text-xs text-slate-400">
                      Start with one of these or ask your own question.
                    </p>
                  </div>

                </div>

                <div className="grid gap-3 sm:grid-cols-2">

                  {/* Question 1 */}
                  <button
                    className="group rounded-xl border border-slate-200 bg-white p-4 text-left shadow-sm transition hover:border-blue-200 hover:shadow-md"
                  >
                    <div className="flex items-start gap-3">

                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-base">
                        🎯
                      </div>

                      <div>
                        <h4 className="text-sm font-semibold text-slate-800 group-hover:text-blue-600">
                          What should I work on next?
                        </h4>

                        <p className="mt-1 text-xs leading-5 text-slate-400">
                          Find the most important task based on my workload.
                        </p>
                      </div>

                    </div>
                  </button>

                  {/* Question 2 */}
                  <button
                    className="group rounded-xl border border-slate-200 bg-white p-4 text-left shadow-sm transition hover:border-blue-200 hover:shadow-md"
                  >
                    <div className="flex items-start gap-3">

                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-amber-50 text-base">
                        ⚠️
                      </div>

                      <div>
                        <h4 className="text-sm font-semibold text-slate-800 group-hover:text-blue-600">
                          Which deadlines are at risk?
                        </h4>

                        <p className="mt-1 text-xs leading-5 text-slate-400">
                          Identify overdue and approaching tasks.
                        </p>
                      </div>

                    </div>
                  </button>

                  {/* Question 3 */}
                  <button
                    className="group rounded-xl border border-slate-200 bg-white p-4 text-left shadow-sm transition hover:border-blue-200 hover:shadow-md"
                  >
                    <div className="flex items-start gap-3">

                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-base">
                        📊
                      </div>

                      <div>
                        <h4 className="text-sm font-semibold text-slate-800 group-hover:text-blue-600">
                          Analyze my productivity
                        </h4>

                        <p className="mt-1 text-xs leading-5 text-slate-400">
                          Review my completion rate and workload.
                        </p>
                      </div>

                    </div>
                  </button>

                  {/* Question 4 */}
                  <button
                    className="group rounded-xl border border-slate-200 bg-white p-4 text-left shadow-sm transition hover:border-blue-200 hover:shadow-md"
                  >
                    <div className="flex items-start gap-3">

                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-base">
                        📁
                      </div>

                      <div>
                        <h4 className="text-sm font-semibold text-slate-800 group-hover:text-blue-600">
                          Which project needs attention?
                        </h4>

                        <p className="mt-1 text-xs leading-5 text-slate-400">
                          Find projects that may be falling behind.
                        </p>
                      </div>

                    </div>
                  </button>

                </div>

              </div>

            </div>

            {/* Input Area */}
            <div className="sticky bottom-0 mt-8 pb-2">

              <div className="rounded-2xl border border-slate-200 bg-white p-2 shadow-sm transition focus-within:border-blue-300 focus-within:ring-2 focus-within:ring-blue-50">

                <div className="flex items-end gap-2">

                  <textarea
                    placeholder="Ask DevDash AI about your work..."
                    rows={1}
                    className="min-h-[44px] flex-1 resize-none border-0 bg-transparent px-3 py-3 text-sm text-slate-800 outline-none placeholder:text-slate-400"
                  />

                  <button
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-500 text-white transition hover:bg-blue-600"
                    title="Send"
                  >
                    ➤
                  </button>

                </div>

              </div>

              <p className="mt-2 text-center text-[11px] text-slate-400">
                AI responses are based on your current DevDash workspace data.
              </p>

            </div>

          </div>

        </main>

      </div>

    </div>
  );
}

export default AIAssistant;