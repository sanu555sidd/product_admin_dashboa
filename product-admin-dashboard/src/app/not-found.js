import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="mx-auto max-w-md px-4 py-24 text-center">
      <h1 className="text-2xl font-semibold">Page not found</h1>
      <p className="mt-2 text-muted">The page you're looking for doesn't exist.</p>
      <Link href="/products" className="btn btn-primary mt-6">Go to products</Link>
    </main>
  );
}
