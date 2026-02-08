import { supabase } from '@/lib/supabase'

import Footer from '@/components/public/Footer'
import PublicNavbar from '@/components/public/PublicNavbar'

import HomeKV from './HomeKV'

export const dynamic = 'force-dynamic'

type HomePageProps = {
  params: Promise<{
    locale: string
  }>
}

export default async function HomePage({ params }: HomePageProps) {
  const kvFrames = await getHomeKVFrames()
  const frames = kvFrames.map(f => f.url)
  const alt = kvFrames.length > 0 ? kvFrames[0].alt : 'Gallery frame'

  return (
    <div className='min-h-dvh flex flex-col justify-between'>
      <PublicNavbar />
      <main className='flex flex-1 items-center justify-center'>
        <div className='m-auto max-w-lg'>
          <HomeKV frames={frames} alt={alt || 'Gallery frame'} />
        </div>
      </main>
      <Footer />
    </div>
  )
}

async function getHomeKVFrames() {
  const { data } = await supabase
    .from('home_kv_frames')
    .select('url, alt')
    .eq('is_active', true)
    .order('order_index', { ascending: true })

  return data || []
}
