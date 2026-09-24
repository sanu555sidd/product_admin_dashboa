const OPTIONS = [
  { value: '', label: 'Sort: default' },
  { value: 'price:asc', label: 'Price: low to high' },
  { value: 'price:desc', label: 'Price: high to low' },
  { value: 'rating:desc', label: 'Rating: high to low' },
  { value: 'rating:asc', label: 'Rating: low to high' },
  { value: 'title:asc', label: 'Title: A to Z' },
  { value: 'title:desc', label: 'Title: Z to A' },
];

export default function SortSelect({ sort, order, onChange }) {
  const value = sort ? `${sort}:${order}` : '';
  return (
    <div>
      <label htmlFor="sort" className="sr-only">Sort products</label>
      <select id="sort" value={value} onChange={(e) => onChange(e.target.value)} className="input">
        {OPTIONS.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
    </div>
  );
}
