export default function Rating({ value }) {
  if (!value) return <span className="text-muted">No ratings</span>;
  return (
    <span className="inline-flex items-center gap-1" aria-label={`Rated ${Number(value).toFixed(1)} out of 5`}>
      <svg aria-hidden viewBox="0 0 20 20" className="h-4 w-4 fill-amber-500">
        <path d="M10 1.5l2.6 5.5 6 .8-4.4 4.2 1.1 6-5.3-2.9-5.3 2.9 1.1-6L1.4 7.8l6-.8z" />
      </svg>
      {Number(value).toFixed(1)}
    </span>
  );
}
