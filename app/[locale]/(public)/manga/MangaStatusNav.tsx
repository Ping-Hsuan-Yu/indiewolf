'use client'

import { useMemo } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { useTranslations } from 'next-intl'

import { DEFAULT_APP_LOCALE, isAppLocale } from '@/lib/i18n/config'

// TODO: uncomment 'ongoing' when there is ongoing manga content
const STATUSES = [/* 'ongoing', */ 'completed'] as const

export default function MangaStatusNav() {
  const t = useTranslations('navbar')
  const pathname = usePathname()

  const locale = useMemo(() => {
    const [, maybeLocale] = pathname.split('/')
    if (maybeLocale && isAppLocale(maybeLocale)) {
      return maybeLocale
    }
    return DEFAULT_APP_LOCALE
  }, [pathname])

  return (
    <nav className="flex gap-6">
      {STATUSES.map((status) => {
        const href = `/${locale}/manga/${status}`
        const isActive = pathname.includes(`/manga/${status}`)
        const label = t(`manga__${status}`)

        return (
          <Link
            key={status}
            href={href}
            className={`relative uppercase after:absolute after:bottom-0 after:left-0 after:h-px after:w-full after:origin-left after:rounded-full after:bg-black after:transition-transform after:duration-300 ${
              isActive
                ? 'after:scale-x-100'
                : 'after:scale-x-0 hover:after:scale-x-100'
            }`}
          >
            {label}
          </Link>
        )
      })}
    </nav>
  )
}
