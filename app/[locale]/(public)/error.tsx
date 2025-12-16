'use client';

export default function Error({ error }: { error: Error & { digest?: string } }) {
  return (
    <main className="py-16">
      <h1 className="text-2xl font-bold">500 Internal Server Error</h1>
      <p className="mt-2">Something went wrong.</p>
      {error?.message && (
        <p className="mt-4 text-sm text-gray-600">{error.message}</p>
      )}
    </main>
  );
}
