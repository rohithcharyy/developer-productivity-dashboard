import { useEffect, useState } from "react";

function AIInsights({
  tasks = [],
  projects = [],
  streak = 0,
}) {
  const [insights, setInsights] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  const fetchAIInsights = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch(
        "http://localhost:5000/api/ai/insights"
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.error ||
            result.message ||
            "Failed to generate AI insights"
        );
      }

      setInsights(result.data);
      setLastUpdated(new Date());
    } catch (error) {
      console.error("AI insights error:", error);

      setError(
        error.message ||
          "Unable to generate AI insights."
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAIInsights();
  }, []);

  // -----------------------------
  // LOADING
  // -----------------------------

  if (isLoading) {
    return (
      <section className="mt-8 rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800 sm:p-6">

        <div className="flex items-start gap-3">

          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-900 text-lg text-white dark:bg-slate-700">
            🤖
          </div>

          <div>
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
              AI Productivity Coach
            </h2>

            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Analyzing your workspace...
            </p>
          </div>

        </div>

        <div className="mt-6 space-y-3">

          <div className="h-4 w-3/4 animate-pulse rounded bg-slate-100 dark:bg-slate-700" />

          <div className="h-4 w-full animate-pulse rounded bg-slate-100 dark:bg-slate-700" />

          <div className="h-4 w-5/6 animate-pulse rounded bg-slate-100 dark:bg-slate-700" />

        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2">

          {[1, 2, 3, 4].map((item) => (
            <div
              key={item}
              className="h-24 animate-pulse rounded-lg bg-slate-50 dark:bg-slate-700/50"
            />
          ))}

        </div>

      </section>
    );
  }

  // -----------------------------
  // ERROR
  // -----------------------------

  if (error) {
    return (
      <section className="mt-8 rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800 sm:p-6">

        <div className="flex items-start justify-between gap-4">

          <div className="flex items-start gap-3">

            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-900 text-lg text-white dark:bg-slate-700">
              🤖
            </div>

            <div>

              <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                AI Productivity Coach
              </h2>

              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                Your workspace analysis
              </p>

            </div>

          </div>

          <button
            onClick={fetchAIInsights}
            className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium text-slate-600 transition hover:bg-slate-50 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-700"
          >
            Retry
          </button>

        </div>

        <div className="mt-6 rounded-lg border border-red-100 bg-red-50 p-4 dark:border-red-900/40 dark:bg-red-950/30">

          <div className="flex items-start gap-3">

            <span className="text-lg">
              ⚠️
            </span>

            <div>

              <h3 className="text-sm font-semibold text-red-700 dark:text-red-400">
                Unable to generate insights
              </h3>

              <p className="mt-1 text-sm leading-6 text-red-600 dark:text-red-300">
                {error}
              </p>

            </div>

          </div>

        </div>

        <div className="mt-4 border-t border-slate-100 pt-4 dark:border-slate-700">

          <p className="text-xs text-slate-400 dark:text-slate-500">
            Make sure the backend server and Gemini API
            connection are running correctly.
          </p>

        </div>

      </section>
    );
  }

  if (!insights) {
    return null;
  }

  // -----------------------------
  // MAIN UI
  // -----------------------------

  return (
    <section className="mt-8 rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800 sm:p-6">

      {/* HEADER */}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">

        <div className="flex items-start gap-3">

          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-900 text-lg text-white dark:bg-slate-700">
            🤖
          </div>

          <div>

            <div className="flex items-center gap-2">

              <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                AI Productivity Coach
              </h2>

              <span className="rounded-full bg-green-50 px-2 py-0.5 text-[10px] font-semibold text-green-600 dark:bg-green-500/10 dark:text-green-400">
                LIVE
              </span>

            </div>

            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Personalized analysis of your current workspace.
            </p>

          </div>

        </div>

        <button
          onClick={fetchAIInsights}
          disabled={isLoading}
          className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-700"
        >
          ↻ Regenerate
        </button>

      </div>

      {/* SUMMARY */}

      <div className="mt-6 rounded-xl bg-slate-900 p-5 text-white dark:bg-slate-950">

        <div className="flex items-start gap-3">

          <span className="text-xl">
            🧠
          </span>

          <div>

            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
              AI Summary
            </p>

            <p className="mt-2 text-sm leading-6 text-slate-200">
              {insights.summary}
            </p>

          </div>

        </div>

      </div>

      {/* FOCUS TASK */}

      {insights.focusTask && (
        <div className="mt-5 rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-800">

          <div className="flex items-start gap-3">

            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-700">
              🎯
            </div>

            <div className="min-w-0">

              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                Recommended Focus
              </p>

              <h3 className="mt-1 text-base font-semibold text-slate-900 dark:text-white">
                {insights.focusTask.title}
              </h3>

              <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
                {insights.focusTask.reason}
              </p>

            </div>

          </div>

        </div>
      )}

      {/* PRIORITIES */}

      {insights.priorities?.length > 0 && (
        <div className="mt-6">

          <div className="mb-3">

            <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
              Recommended Priorities
            </h3>

            <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">
              Work the AI believes deserves your attention.
            </p>

          </div>

          <div className="grid gap-3 md:grid-cols-2">

            {insights.priorities.map((priority, index) => {

              const priorityStyle =
                priority.priority === "High"
                  ? "bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400"
                  : priority.priority === "Medium"
                  ? "bg-yellow-50 text-yellow-600 dark:bg-yellow-500/10 dark:text-yellow-400"
                  : "bg-green-50 text-green-600 dark:bg-green-500/10 dark:text-green-400";

              return (
                <div
                  key={index}
                  className="rounded-lg border border-slate-100 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-700/40"
                >

                  <div className="flex items-start justify-between gap-3">

                    <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-100">
                      {priority.title}
                    </h4>

                    <span
                      className={`shrink-0 rounded-full px-2 py-1 text-[10px] font-semibold ${priorityStyle}`}
                    >
                      {priority.priority}
                    </span>

                  </div>

                  <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
                    {priority.reason}
                  </p>

                </div>
              );
            })}

          </div>

        </div>
      )}

      {/* RISKS */}

      {insights.risks?.length > 0 && (
        <div className="mt-6">

          <div className="mb-3">

            <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
              Productivity Risks
            </h3>

            <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">
              Issues that may affect your progress or deadlines.
            </p>

          </div>

          <div className="space-y-3">

            {insights.risks.map((risk, index) => (

              <div
                key={index}
                className="rounded-lg border border-red-100 bg-red-50 p-4 dark:border-red-900/40 dark:bg-red-950/30"
              >

                <div className="flex items-start gap-3">

                  <span className="text-lg">
                    ⚠️
                  </span>

                  <div>

                    <h4 className="text-sm font-semibold text-red-700 dark:text-red-400">
                      {risk.title}
                    </h4>

                    <p className="mt-1 text-sm leading-6 text-red-600 dark:text-red-300">
                      {risk.description}
                    </p>

                  </div>

                </div>

              </div>

            ))}

          </div>

        </div>
      )}

      {/* RECOMMENDATIONS */}

      {insights.recommendations?.length > 0 && (
        <div className="mt-6">

          <div className="mb-3">

            <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
              Recommended Actions
            </h3>

            <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">
              Practical next steps based on your workspace.
            </p>

          </div>

          <div className="space-y-2">

            {insights.recommendations.map(
              (recommendation, index) => (

                <div
                  key={index}
                  className="flex items-start gap-3 rounded-lg border border-slate-100 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-700/40"
                >

                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-slate-900 text-xs font-semibold text-white dark:bg-slate-600">
                    {index + 1}
                  </div>

                  <p className="text-sm leading-6 text-slate-600 dark:text-slate-300">
                    {recommendation}
                  </p>

                </div>

              )
            )}

          </div>

        </div>
      )}

      {/* WORKSPACE CONTEXT */}

      <div className="mt-6 grid grid-cols-3 gap-3 border-t border-slate-100 pt-5 dark:border-slate-700">

        <div className="text-center">

          <p className="text-lg font-bold text-slate-900 dark:text-white">
            {tasks.length}
          </p>

          <p className="text-[11px] text-slate-400 dark:text-slate-500">
            Tasks analyzed
          </p>

        </div>

        <div className="border-x border-slate-100 text-center dark:border-slate-700">

          <p className="text-lg font-bold text-slate-900 dark:text-white">
            {projects.length}
          </p>

          <p className="text-[11px] text-slate-400 dark:text-slate-500">
            Projects analyzed
          </p>

        </div>

        <div className="text-center">

          <p className="text-lg font-bold text-slate-900 dark:text-white">
            {streak}
          </p>

          <p className="text-[11px] text-slate-400 dark:text-slate-500">
            Day streak
          </p>

        </div>

      </div>

      {/* FOOTER */}

      <div className="mt-5 border-t border-slate-100 pt-4 dark:border-slate-700">

        <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">

          <p className="text-xs text-slate-400 dark:text-slate-500">
            AI analysis is generated from your current DevDash workspace data.
          </p>

          {lastUpdated && (
            <p className="text-xs text-slate-400 dark:text-slate-500">
              Updated{" "}
              {lastUpdated.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          )}

        </div>

      </div>

    </section>
  );
}

export default AIInsights;