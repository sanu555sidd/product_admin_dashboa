import Link from 'next/link';

export default function ProductNotFound() {
  return (
    <div className="mx-auto max-w-md py-20 text-center">
      <h1 className="text-2xl font-semibold">Product not found</h1>
      <p className="mt-2 text-muted">
        This product doesn't exist, or it was deleted. Check the link and try again.
      </p>
      <Link href="/products" className="btn btn-primary mt-6">Back to products</Link>
    </div>
  );
}
