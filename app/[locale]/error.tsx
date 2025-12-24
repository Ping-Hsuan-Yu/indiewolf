'use client'

import Footer from '@/components/public/Footer'

export default function Error({ error }: { error: Error & { digest?: string } }) {
  return (
    <div className='h-screen flex flex-col'>
      <main className='flex flex-col items-center justify-center my-auto flex-1'>
        <h1 className='text-2xl font-bold'>500 Internal Server Error</h1>
        <p>Something went wrong.</p>
        {error?.message && <p className='text-sm text-gray-600 mx-4'>{error.message}</p>}
      </main>
      <Footer />
    </div>
  )
}
