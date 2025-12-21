export const dynamic = 'force-dynamic'
import PublicNavbar from '@/components/public/PublicNavbar'
import Footer from '@/components/public/Footer'
import { normalizeLocale } from '@/lib/i18n/config'
import { AboutService } from '@/lib/services/aboutService'
import ContactLinks from './ContactLinks'

type AboutPageProps = {
  params: {
    locale: string
  }
}

export default async function AboutPage({ params }: AboutPageProps) {
  const locale = normalizeLocale(params.locale)
  const { bio, profileImage, contactLinks } = await AboutService.getPageData(locale)

  return (
    <div className='h-dvh flex flex-col'>
      <PublicNavbar />
      <main className='m-auto'>
        <div>
          <div className='flex flex-col-reverse md:flex-row items-center gap-4'>
            <div>
              <p>{bio}</p>
            </div>
            <div>
              <img src={profileImage} className='max-w-64' alt='Lin Chao Yu' />
            </div>
          </div>
          <div className='flex gap-4 items-center mt-8'>
            <ContactLinks links={contactLinks} locale={locale} />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
