import Footer from '@/components/public/Footer'

export default function NotFound() {
  return (
    <div className="flex h-screen flex-col">
      <main className="my-auto flex flex-1 flex-col items-center justify-center">
        <h1 className="text-2xl font-bold">404 Page Not Found</h1>
        <p>This page could not be found.</p>
      </main>
      <Footer />
    </div>
  )
}
