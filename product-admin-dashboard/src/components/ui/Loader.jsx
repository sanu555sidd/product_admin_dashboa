export default function Loader({ label = 'Loading…' }) {
  return (
    <div role="status" className="flex flex-col items-center justify-center gap-3 py-20 text-muted">
      <span className="h-8 w-8 animate-spin rounded-full border-2 border-line border-t-brand motion-reduce:animate-none" />
      <span className="text-sm">{label}</span>
    </div>
  );
}
