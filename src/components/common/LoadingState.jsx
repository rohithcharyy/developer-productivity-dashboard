function LoadingState({ message = "Loading dashboard..." }) {
  return (
    <div className="flex min-h-[300px] flex-col items-center justify-center gap-4">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-blue-500" />

      <p className="text-sm font-medium text-slate-500">
        {message}
      </p>
    </div>
  );
}

export default LoadingState;