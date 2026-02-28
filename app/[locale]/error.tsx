'use client'

import Footer from '@/components/public/Footer'

export default function Error({
  error,
}: {
  error: Error & { digest?: string }
}) {
  return (
    <div className="flex h-screen flex-col">
      <main className="my-auto flex flex-1 flex-col items-center justify-center">
        <h1 className="text-2xl font-bold">500 Internal Server Error</h1>
        <p>Something went wrong.</p>
        {error?.message && (
          <p className="mx-4 text-sm text-gray-600">{error.message}</p>
        )}
      </main>
      <Footer />
    </div>
  )
}
