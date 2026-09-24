export default function RowActions({ product, onEdit, onDelete }) {
  return (
    <div className="flex gap-2">
      <button type="button" className="btn btn-secondary btn-sm" onClick={() => onEdit(product)} aria-label={`Edit ${product.title}`}>
        Edit
      </button>
      <button type="button" className="btn btn-secondary btn-sm text-danger" onClick={() => onDelete(product)} aria-label={`Delete ${product.title}`}>
        Delete
      </button>
    </div>
  );
}
