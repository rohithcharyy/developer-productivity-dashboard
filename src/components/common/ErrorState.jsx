function ErrorState({
  title = "Something went wrong",
  message = "We couldn't load the dashboard data. Please try again.",
  onRetry,
}) {
  return (
    <div className="rounded-xl border border-red-200 bg-red-50 px-6 py-10 text-center">
      <div className="text-3xl">⚠️</div>

      <h3 className="mt-3 text-base font-semibold text-red-700">
        {title}
      </h3>

      <p className="mt-1 text-sm text-red-600">
        {message}
      </p>

      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-5 rounded-lg bg-red-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-600"
        >
          Try Again
        </button>
      )}
    </div>
  );
}

export default ErrorState;