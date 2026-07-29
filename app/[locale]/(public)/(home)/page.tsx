import { supabase } from '@/lib/supabase'

import Footer from '@/components/public/Footer'
import PublicNavbar from '@/components/public/PublicNavbar'

import HomeKV from './HomeKV'

// PERF-2: was force-dynamic (every visit re-rendered + hit the DB across the Pacific,
// never cached). KV frames change rarely and only via direct DB edit, so ISR is safe.
export const revalidate = 3600

// PERF-3: KV images are raw Cloudinary originals (~111KB each). Serve f_auto/q_auto at
// a sensible width so the LCP frame drops to ~40KB and the others stop competing.
function optimizeKvUrl(url: string) {
  return url.includes('/upload/')
    ? url.replace('/upload/', '/upload/f_auto,q_auto,w_1024/')
    : url
}

type HomePageProps = {
  params: Promise<{
    locale: string
  }>
}

export default async function HomePage({ params }: HomePageProps) {
  const kvFrames = await getHomeKVFrames()
  const frames = kvFrames.map((f) => optimizeKvUrl(f.url))
  const alt = kvFrames.length > 0 ? kvFrames[0].alt : 'Gallery frame'

  return (
    <div className="flex min-h-dvh flex-col justify-between">
      <PublicNavbar />
      <main className="flex flex-1 items-center justify-center">
        <div className="m-auto max-w-lg">
          <HomeKV frames={frames} alt={alt || 'Gallery frame'} />
        </div>
      </main>
      <Footer />
    </div>
  )
}

async function getHomeKVFrames() {
  const { data, error } = await supabase
    .from('home_kv_frames')
    .select('url, alt')
    .eq('is_active', true)
    .order('order_index', { ascending: true })

  if (error) {
    console.error('getHomeKVFrames error:', error)
    throw new Error(`Failed to load home KV frames: ${error.message}`)
  }

  return data || []
}
