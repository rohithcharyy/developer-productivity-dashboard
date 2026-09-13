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
      <section className="mt-8 rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-900 text-lg text-white">
            🤖
          </div>

          <div>
            <h2 className="text-lg font-semibold text-slate-900">
              AI Productivity Coach
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Analyzing your workspace...
            </p>
          </div>
        </div>

        <div className="mt-6 space-y-3">
          <div className="h-4 w-3/4 animate-pulse rounded bg-slate-100" />
          <div className="h-4 w-full animate-pulse rounded bg-slate-100" />
          <div className="h-4 w-5/6 animate-pulse rounded bg-slate-100" />
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {[1, 2, 3, 4].map((item) => (
            <div
              key={item}
              className="h-24 animate-pulse rounded-lg bg-slate-50"
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
      <section className="mt-8 rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-900 text-lg text-white">
              🤖
            </div>

            <div>
              <h2 className="text-lg font-semibold text-slate-900">
                AI Productivity Coach
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Your workspace analysis
              </p>
            </div>
          </div>

          <button
            onClick={fetchAIInsights}
            className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium text-slate-600 transition hover:bg-slate-50"
          >
            Retry
          </button>
        </div>

        <div className="mt-6 rounded-lg border border-red-100 bg-red-50 p-4">
          <div className="flex items-start gap-3">
            <span className="text-lg">⚠️</span>

            <div>
              <h3 className="text-sm font-semibold text-red-700">
                Unable to generate insights
              </h3>

              <p className="mt-1 text-sm leading-6 text-red-600">
                {error}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-4 border-t border-slate-100 pt-4">
          <p className="text-xs text-slate-400">
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
    <section className="mt-8 rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">

      {/* HEADER */}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-900 text-lg text-white">
            🤖
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-semibold text-slate-900">
                AI Productivity Coach
              </h2>

              <span className="rounded-full bg-green-50 px-2 py-0.5 text-[10px] font-semibold text-green-600">
                LIVE
              </span>
            </div>

            <p className="mt-1 text-sm text-slate-500">
              Personalized analysis of your current workspace.
            </p>
          </div>
        </div>

        <button
          onClick={fetchAIInsights}
          disabled={isLoading}
          className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          ↻ Regenerate
        </button>
      </div>

      {/* SUMMARY */}

      <div className="mt-6 rounded-xl bg-slate-900 p-5 text-white">
        <div className="flex items-start gap-3">
          <span className="text-xl">🧠</span>

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
        <div className="mt-5 rounded-xl border border-slate-200 bg-white p-5">
          <div className="flex items-start gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100">
              🎯
            </div>

            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                Recommended Focus
              </p>

              <h3 className="mt-1 text-base font-semibold text-slate-900">
                {insights.focusTask.title}
              </h3>

              <p className="mt-2 text-sm leading-6 text-slate-500">
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
            <h3 className="text-sm font-semibold text-slate-900">
              Recommended Priorities
            </h3>

            <p className="mt-1 text-xs text-slate-400">
              Work the AI believes deserves your attention.
            </p>
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            {insights.priorities.map((priority, index) => {
              const priorityStyle =
                priority.priority === "High"
                  ? "bg-red-50 text-red-600"
                  : priority.priority === "Medium"
                  ? "bg-yellow-50 text-yellow-600"
                  : "bg-green-50 text-green-600";

              return (
                <div
                  key={index}
                  className="rounded-lg border border-slate-100 bg-slate-50 p-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <h4 className="text-sm font-semibold text-slate-800">
                      {priority.title}
                    </h4>

                    <span
                      className={`shrink-0 rounded-full px-2 py-1 text-[10px] font-semibold ${priorityStyle}`}
                    >
                      {priority.priority}
                    </span>
                  </div>

                  <p className="mt-2 text-sm leading-6 text-slate-500">
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
            <h3 className="text-sm font-semibold text-slate-900">
              Productivity Risks
            </h3>

            <p className="mt-1 text-xs text-slate-400">
              Issues that may affect your progress or deadlines.
            </p>
          </div>

          <div className="space-y-3">
            {insights.risks.map((risk, index) => (
              <div
                key={index}
                className="rounded-lg border border-red-100 bg-red-50 p-4"
              >
                <div className="flex items-start gap-3">
                  <span className="text-lg">⚠️</span>

                  <div>
                    <h4 className="text-sm font-semibold text-red-700">
                      {risk.title}
                    </h4>

                    <p className="mt-1 text-sm leading-6 text-red-600">
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
            <h3 className="text-sm font-semibold text-slate-900">
              Recommended Actions
            </h3>

            <p className="mt-1 text-xs text-slate-400">
              Practical next steps based on your workspace.
            </p>
          </div>

          <div className="space-y-2">
            {insights.recommendations.map(
              (recommendation, index) => (
                <div
                  key={index}
                  className="flex items-start gap-3 rounded-lg border border-slate-100 bg-slate-50 p-3"
                >
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-slate-900 text-xs font-semibold text-white">
                    {index + 1}
                  </div>

                  <p className="text-sm leading-6 text-slate-600">
                    {recommendation}
                  </p>
                </div>
              )
            )}
          </div>
        </div>
      )}

      {/* WORKSPACE CONTEXT */}

      <div className="mt-6 grid grid-cols-3 gap-3 border-t border-slate-100 pt-5">
        <div className="text-center">
          <p className="text-lg font-bold text-slate-900">
            {tasks.length}
          </p>

          <p className="text-[11px] text-slate-400">
            Tasks analyzed
          </p>
        </div>

        <div className="border-x border-slate-100 text-center">
          <p className="text-lg font-bold text-slate-900">
            {projects.length}
          </p>

          <p className="text-[11px] text-slate-400">
            Projects analyzed
          </p>
        </div>

        <div className="text-center">
          <p className="text-lg font-bold text-slate-900">
            {streak}
          </p>

          <p className="text-[11px] text-slate-400">
            Day streak
          </p>
        </div>
      </div>

      {/* FOOTER */}

      <div className="mt-5 border-t border-slate-100 pt-4">
        <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-slate-400">
            AI analysis is generated from your current DevDash workspace data.
          </p>

          {lastUpdated && (
            <p className="text-xs text-slate-400">
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