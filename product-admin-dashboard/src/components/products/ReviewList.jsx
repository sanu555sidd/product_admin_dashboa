import Rating from '@/components/products/Rating';
import { formatDate } from '@/lib/format';

export default function ReviewList({ reviews }) {
  if (!reviews?.length) return <p className="text-sm text-muted">No reviews yet.</p>;
  return (
    <ul className="divide-y divide-line rounded-lg border border-line bg-surface">
      {reviews.map((r, i) => (
        <li key={`${r.reviewerEmail}-${i}`} className="space-y-1 p-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="font-medium">{r.reviewerName}</p>
            <p className="text-xs text-muted">{formatDate(r.date)}</p>
          </div>
          <div className="text-sm"><Rating value={r.rating} /></div>
          <p className="text-sm">{r.comment}</p>
        </li>
      ))}
    </ul>
  );
}
