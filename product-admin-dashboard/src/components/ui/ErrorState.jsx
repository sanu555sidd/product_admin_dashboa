export default function ErrorState({ message, onRetry }) {
  return (
    <div role="alert" className="rounded-lg border border-danger/30 bg-red-50 px-6 py-10 text-center">
      <h2 className="text-base font-semibold text-danger">Something went wrong</h2>
      <p className="mt-1 text-sm text-ink">{message}</p>
      {onRetry && (
        <button type="button" onClick={onRetry} className="btn btn-primary mt-4">
          Retry
        </button>
      )}
    </div>
  );
}
