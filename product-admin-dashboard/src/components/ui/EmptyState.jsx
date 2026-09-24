export default function EmptyState({ title, hint, action }) {
  return (
    <div className="rounded-lg border border-dashed border-line bg-surface px-6 py-14 text-center">
      <h2 className="text-base font-semibold">{title}</h2>
      {hint && <p className="mt-1 text-sm text-muted">{hint}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
