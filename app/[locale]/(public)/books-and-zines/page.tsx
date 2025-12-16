export const dynamic = 'force-dynamic'
import PublicNavbar from '@/components/public/PublicNavbar'
import Footer from '@/components/public/Footer'
import BooksGallery from '@/components/public/gallery/BooksGallery'
import { getBooksWorks } from '@/lib/services/booksService'

type BooksPageProps = {
  params: {
    locale: string
  }
}

export default async function BooksAndZinesPage({ params }: BooksPageProps) {
  const books = await getBooksWorks()

  // Group by year
  const groupsMap = new Map<string, any[]>()

  books.forEach(book => {
    const entry = {
      src: book.cover_url,
      thumb: book.cover_url, // Cloudinary resize can be applied here
      titleZh: book.title_zh || '',
      titleEn: book.title_en || '',
      description:
        params.locale === 'en'
          ? `<p>${book.summary_en || book.summary_zh || ''}</p>`
          : `<p>${book.summary_zh || book.summary_en || ''}</p>`
    }

    if (!groupsMap.has(book.year)) {
      groupsMap.set(book.year, [])
    }
    groupsMap.get(book.year)!.push(entry)
  })

  const groups = Array.from(groupsMap.entries())
    .map(([year, entries]) => ({ year, entries }))
    .sort((a, b) => b.year.localeCompare(a.year)) // Sort years desc

  return (
    <div className='h-dvh flex flex-col gap-8'>
      <PublicNavbar />
      <main className='flex flex-col gap-8'>
        <BooksGallery groups={groups} locale={params.locale} />
      </main>
      <Footer />
    </div>
  )
}
