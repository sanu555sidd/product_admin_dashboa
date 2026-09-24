// Text + colour, so the meaning never depends on colour alone.
export default function StockBadge({ stock }) {
  if (stock <= 0) return <span className="font-medium text-danger">Out of stock</span>;
  if (stock < 10) return <span className="font-medium text-warn">{stock} left</span>;
  return <span>{stock}</span>;
}
