import { useState } from "react";
import Navbar from "../components/layout/Navbar";
import Sidebar from "../components/layout/Sidebar";

function AIAssistant({
  currentPage,
  onNavigate,
  userProfile,
  onLogout,
  accounts,
  onSwitchAccount,
}) {
  const [question, setQuestion] = useState("");
  const [insights, setInsights] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [lastQuestion, setLastQuestion] = useState("");

  const askAI = async (selectedQuestion = "") => {
    const userQuestion = selectedQuestion || question;

    setLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("devdash_token");

      if (!token) {
        throw new Error("You are not logged in.");
      }

      const response = await fetch(
        "http://localhost:5000/api/ai/insights",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      let result = null;

      try {
        result = await response.json();
      } catch {
        throw new Error(
          "The server returned an invalid response."
        );
      }

      if (!response.ok) {
        throw new Error(
          result?.message ||
            "Failed to generate AI insights."
        );
      }

      if (!result?.data) {
        throw new Error(
          "The AI service returned no insights."
        );
      }

      setInsights({
        ...result.data,
        question:
          userQuestion ||
          "Analyze my current workspace",
      });

      setLastQuestion(userQuestion);
      setQuestion("");
      setError("");
    } catch (err) {
      console.error("AI Assistant error:", err);

      setInsights(null);

      setError(
        err.message ||
          "Something went wrong while contacting the AI service."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSuggestedQuestion = (text) => {
    setQuestion(text);
    askAI(text);
  };

  const handleRetry = () => {
    askAI(lastQuestion);
  };

  return (
    <div className="h-screen overflow-hidden bg-slate-50 dark:bg-slate-900">
      <Navbar />

      <div className="flex h-[calc(100vh-4rem)]">
        <Sidebar
          currentPage={currentPage}
          onNavigate={onNavigate}
          userProfile={userProfile}
          onLogout={onLogout}
          accounts={accounts}
          onSwitchAccount={onSwitchAccount}
        />

        <main className="min-w-0 flex-1 overflow-y-auto bg-slate-50 dark:bg-slate-900">
          <div className="mx-auto flex min-h-full max-w-6xl flex-col px-4 py-6 sm:px-6 lg:px-8">

            {/* Header */}
            <div className="mb-8">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-xl dark:bg-blue-500/10">
                  🤖
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <h1 className="text-xl font-bold text-slate-900 dark:text-white sm:text-2xl">
                      AI Assistant
                    </h1>

                    <span className="rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-semibold text-blue-600 dark:bg-blue-500/10 dark:text-blue-400">
                      AI
                    </span>
                  </div>

                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                    Your personal productivity assistant.
                  </p>
                </div>
              </div>
            </div>

            {/* AI RESPONSE */}
            {insights && (
              <div className="mb-8 w-full max-w-4xl self-center">

                {/* User Question */}
                <div className="mb-4 flex justify-end">
                  <div className="max-w-xl rounded-2xl rounded-br-md bg-blue-500 px-4 py-3 text-sm text-white shadow-sm dark:bg-blue-600">
                    {insights.question}
                  </div>
                </div>

                {/* AI Response */}
                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800">

                  <div className="mb-5 flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 dark:bg-blue-500/10">
                      🤖
                    </div>

                    <div>
                      <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
                        DevDash AI
                      </h3>

                      <p className="text-xs text-slate-400 dark:text-slate-500">
                        Based on your current workspace
                      </p>
                    </div>
                  </div>

                  {/* Summary */}
                  {insights.summary && (
                    <div className="mb-6">
                      <h4 className="mb-2 text-sm font-semibold text-slate-800 dark:text-slate-200">
                        Summary
                      </h4>

                      <p className="text-sm leading-6 text-slate-600 dark:text-slate-300">
                        {insights.summary}
                      </p>
                    </div>
                  )}

                  {/* Focus Task */}
                  {insights.focusTask && (
                    <div className="mb-6 rounded-xl border border-blue-100 bg-blue-50 p-4 dark:border-blue-900/40 dark:bg-blue-950/30">
                      <div className="mb-2 flex items-center gap-2">
                        <span>🎯</span>

                        <h4 className="text-sm font-semibold text-blue-800 dark:text-blue-300">
                          Recommended focus
                        </h4>
                      </div>

                      <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                        {insights.focusTask.title}
                      </p>

                      <p className="mt-1 text-xs leading-5 text-slate-600 dark:text-slate-400">
                        {insights.focusTask.reason}
                      </p>
                    </div>
                  )}

                  {/* Priorities */}
                  {insights.priorities?.length > 0 && (
                    <div className="mb-6">
                      <h4 className="mb-3 text-sm font-semibold text-slate-800 dark:text-slate-200">
                        Priorities
                      </h4>

                      <div className="space-y-3">
                        {insights.priorities.map(
                          (item, index) => (
                            <div
                              key={`${item.title}-${index}`}
                              className="rounded-xl border border-slate-200 p-4 dark:border-slate-700 dark:bg-slate-700/30"
                            >
                              <div className="flex items-start justify-between gap-3">
                                <div>
                                  <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                                    {item.title}
                                  </p>

                                  <p className="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400">
                                    {item.reason}
                                  </p>
                                </div>

                                <span className="shrink-0 rounded-full bg-slate-100 px-2 py-1 text-[10px] font-semibold text-slate-600 dark:bg-slate-600 dark:text-slate-200">
                                  {item.priority}
                                </span>
                              </div>
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  )}

                  {/* Risks */}
                  {insights.risks?.length > 0 && (
                    <div className="mb-6">
                      <h4 className="mb-3 text-sm font-semibold text-slate-800 dark:text-slate-200">
                        Potential risks
                      </h4>

                      <div className="space-y-3">
                        {insights.risks.map(
                          (risk, index) => (
                            <div
                              key={`${risk.title}-${index}`}
                              className="rounded-xl border border-amber-200 bg-amber-50 p-4 dark:border-amber-900/40 dark:bg-amber-950/30"
                            >
                              <div className="flex items-start gap-3">
                                <span className="text-lg">
                                  ⚠️
                                </span>

                                <div>
                                  <p className="text-sm font-semibold text-amber-900 dark:text-amber-300">
                                    {risk.title}
                                  </p>

                                  <p className="mt-1 text-xs leading-5 text-amber-800 dark:text-amber-400">
                                    {risk.description}
                                  </p>
                                </div>
                              </div>
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  )}

                  {/* Recommendations */}
                  {insights.recommendations?.length > 0 && (
                    <div>
                      <h4 className="mb-3 text-sm font-semibold text-slate-800 dark:text-slate-200">
                        Recommendations
                      </h4>

                      <div className="space-y-2">
                        {insights.recommendations.map(
                          (recommendation, index) => (
                            <div
                              key={`${recommendation}-${index}`}
                              className="flex items-start gap-3 rounded-xl bg-slate-50 p-3 dark:bg-slate-700/40"
                            >
                              <span className="mt-0.5 text-sm text-slate-700 dark:text-slate-300">
                                ✓
                              </span>

                              <p className="text-sm leading-5 text-slate-600 dark:text-slate-300">
                                {recommendation}
                              </p>
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  )}

                </div>
              </div>
            )}

            {/* WELCOME STATE */}
            {!insights && !loading && !error && (
              <div className="flex flex-1 flex-col items-center">

                <div className="mt-8 max-w-2xl text-center">
                  <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
                    How can I help with your work?
                  </h2>

                  <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-slate-500 dark:text-slate-400 sm:text-base">
                    Ask me about your tasks, projects, deadlines,
                    productivity, workload, or what you should
                    focus on next.
                  </p>
                </div>

                {/* Suggested Questions */}
                <div className="mt-10 w-full max-w-3xl">
                  <div className="mb-4">
                    <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                      Suggested questions
                    </h3>

                    <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">
                      Start with one of these or ask your own question.
                    </p>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2">

                    {/* Question 1 */}
                    <button
                      type="button"
                      onClick={() =>
                        handleSuggestedQuestion(
                          "What should I work on next?"
                        )
                      }
                      className="group rounded-xl border border-slate-200 bg-white p-4 text-left shadow-sm transition hover:border-blue-200 hover:shadow-md dark:border-slate-700 dark:bg-slate-800 dark:hover:border-blue-500/50"
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-base dark:bg-blue-500/10">
                          🎯
                        </div>

                        <div>
                          <h4 className="text-sm font-semibold text-slate-800 group-hover:text-blue-600 dark:text-slate-200 dark:group-hover:text-blue-400">
                            What should I work on next?
                          </h4>

                          <p className="mt-1 text-xs leading-5 text-slate-400 dark:text-slate-500">
                            Find the most important task based on my workload.
                          </p>
                        </div>
                      </div>
                    </button>

                    {/* Question 2 */}
                    <button
                      type="button"
                      onClick={() =>
                        handleSuggestedQuestion(
                          "Which deadlines are at risk?"
                        )
                      }
                      className="group rounded-xl border border-slate-200 bg-white p-4 text-left shadow-sm transition hover:border-blue-200 hover:shadow-md dark:border-slate-700 dark:bg-slate-800 dark:hover:border-blue-500/50"
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-amber-50 text-base dark:bg-amber-500/10">
                          ⚠️
                        </div>

                        <div>
                          <h4 className="text-sm font-semibold text-slate-800 group-hover:text-blue-600 dark:text-slate-200 dark:group-hover:text-blue-400">
                            Which deadlines are at risk?
                          </h4>

                          <p className="mt-1 text-xs leading-5 text-slate-400 dark:text-slate-500">
                            Identify overdue and approaching tasks.
                          </p>
                        </div>
                      </div>
                    </button>

                    {/* Question 3 */}
                    <button
                      type="button"
                      onClick={() =>
                        handleSuggestedQuestion(
                          "Analyze my productivity"
                        )
                      }
                      className="group rounded-xl border border-slate-200 bg-white p-4 text-left shadow-sm transition hover:border-blue-200 hover:shadow-md dark:border-slate-700 dark:bg-slate-800 dark:hover:border-blue-500/50"
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-base dark:bg-indigo-500/10">
                          📊
                        </div>

                        <div>
                          <h4 className="text-sm font-semibold text-slate-800 group-hover:text-blue-600 dark:text-slate-200 dark:group-hover:text-blue-400">
                            Analyze my productivity
                          </h4>

                          <p className="mt-1 text-xs leading-5 text-slate-400 dark:text-slate-500">
                            Review my completion rate and workload.
                          </p>
                        </div>
                      </div>
                    </button>

                    {/* Question 4 */}
                    <button
                      type="button"
                      onClick={() =>
                        handleSuggestedQuestion(
                          "Which project needs attention?"
                        )
                      }
                      className="group rounded-xl border border-slate-200 bg-white p-4 text-left shadow-sm transition hover:border-blue-200 hover:shadow-md dark:border-slate-700 dark:bg-slate-800 dark:hover:border-blue-500/50"
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-base dark:bg-emerald-500/10">
                          📁
                        </div>

                        <div>
                          <h4 className="text-sm font-semibold text-slate-800 group-hover:text-blue-600 dark:text-slate-200 dark:group-hover:text-blue-400">
                            Which project needs attention?
                          </h4>

                          <p className="mt-1 text-xs leading-5 text-slate-400 dark:text-slate-500">
                            Find projects that may be falling behind.
                          </p>
                        </div>
                      </div>
                    </button>

                  </div>
                </div>
              </div>
            )}

            {/* LOADING */}
            {loading && (
              <div className="flex flex-1 items-center justify-center">
                <div className="rounded-2xl border border-slate-200 bg-white px-8 py-7 text-center shadow-sm dark:border-slate-700 dark:bg-slate-800">

                  <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-50 text-xl dark:bg-blue-500/10">
                    🤖
                  </div>

                  <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                    DevDash AI is analyzing your workspace...
                  </h3>

                  <p className="mt-2 text-xs text-slate-400 dark:text-slate-500">
                    Reviewing your projects, tasks and priorities.
                  </p>

                  <div className="mx-auto mt-5 h-1.5 w-40 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-700">
                    <div className="h-full w-1/2 animate-pulse rounded-full bg-blue-500" />
                  </div>

                </div>
              </div>
            )}

            {/* ERROR */}
            {error && !loading && (
              <div className="mx-auto mt-8 w-full max-w-2xl rounded-xl border border-amber-200 bg-amber-50 p-4 dark:border-amber-900/40 dark:bg-amber-950/30">

                <div className="flex items-start gap-3">
                  <span className="text-lg">
                    ⚠️
                  </span>

                  <div className="flex-1">
                    <h3 className="text-sm font-semibold text-amber-900 dark:text-amber-300">
                      AI Assistant is temporarily unavailable
                    </h3>

                    <p className="mt-1 text-xs leading-5 text-amber-800 dark:text-amber-400">
                      {error}
                    </p>

                    <button
                      type="button"
                      onClick={handleRetry}
                      disabled={loading}
                      className="mt-3 rounded-lg bg-amber-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-amber-700 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      Try again
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* INPUT AREA */}
            <div className="sticky bottom-0 mt-8 pb-2">

              <div className="rounded-2xl border border-slate-200 bg-white p-2 shadow-sm transition focus-within:border-blue-300 focus-within:ring-2 focus-within:ring-blue-50 dark:border-slate-700 dark:bg-slate-800 dark:focus-within:border-blue-500/50 dark:focus-within:ring-blue-500/10">

                <div className="flex items-end gap-2">

                  <textarea
                    value={question}
                    onChange={(event) =>
                      setQuestion(event.target.value)
                    }
                    onKeyDown={(event) => {
                      if (
                        event.key === "Enter" &&
                        !event.shiftKey
                      ) {
                        event.preventDefault();

                        if (
                          question.trim() &&
                          !loading
                        ) {
                          askAI();
                        }
                      }
                    }}
                    placeholder="Ask DevDash AI about your work..."
                    rows={1}
                    className="min-h-[44px] flex-1 resize-none border-0 bg-transparent px-3 py-3 text-sm text-slate-800 outline-none placeholder:text-slate-400 dark:text-slate-200 dark:placeholder:text-slate-500"
                  />

                  <button
                    type="button"
                    onClick={() => askAI()}
                    disabled={!question.trim() || loading}
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-500 text-white transition hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-40 dark:bg-blue-600 dark:hover:bg-blue-500"
                    title="Send"
                  >
                    ➤
                  </button>

                </div>
              </div>

              <p className="mt-2 text-center text-[11px] text-slate-400 dark:text-slate-500">
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