import type { Webtoon } from '@/app/_actions/public/webtoon'

import OptimizedImage from '@/components/public/OptimizedImage'

type WebtoonEntry = Webtoon & {
  title: string
  description?: string
}

type WebtoonGalleryProps = {
  entries: WebtoonEntry[]
}

export default function WebtoonGallery({ entries }: WebtoonGalleryProps) {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
      {entries.map((item) => (
        <a
          key={item.id}
          href={item.external_url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col gap-4 md:flex-row md:items-end"
        >
          <div className="group relative overflow-hidden shadow md:basis-1/2">
            <OptimizedImage
              url={item.cover_url}
              alt={item.title}
              width={item.width}
              height={item.height}
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
          <div className="md:basis-1/2">
            <p className="text-center font-bold md:text-start">{item.title}</p>
            {item.description && <p className="text-sm">{item.description}</p>}
          </div>
        </a>
      ))}
    </div>
  )
}
