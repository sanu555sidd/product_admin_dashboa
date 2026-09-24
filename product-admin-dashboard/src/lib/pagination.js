// Returns e.g. [1, 'gap-left', 8, 9, 10, 11, 12, 'gap-right', 20]
export function getPageItems(page, totalPages) {
  if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1);

  const windowSize = 5;
  const start = Math.max(2, Math.min(page - 2, totalPages - windowSize));
  const end = Math.min(totalPages - 1, start + windowSize - 1);

  const items = [1];
  if (start > 2) items.push('gap-left');
  for (let p = start; p <= end; p += 1) items.push(p);
  if (end < totalPages - 1) items.push('gap-right');
  items.push(totalPages);
  return items;
}
