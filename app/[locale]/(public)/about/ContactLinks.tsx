'use client'

import { useState } from 'react'

import { SocialLink } from '@/app/_actions/public/about'

type Props = {
  links: SocialLink[]
  locale: string
}

const DICTIONARY: Record<string, { copyEmail: string; copied: string }> = {
  en: { copyEmail: 'Copy email to clipboard', copied: 'Copied!' },
  zh: { copyEmail: '複製 Email 到剪貼簿', copied: '已複製!' },
}

export default function ContactLinks({ links, locale }: Props) {
  const t = DICTIONARY[locale] || DICTIONARY.en
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null)

  const handleCopy = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url)
      setCopiedUrl(url)
      setTimeout(() => setCopiedUrl(null), 2000)
    } catch (err) {
      console.error('Failed to copy!', err)
    }
  }

  return (
    <>
      {links.map((link) => {
        const isEmail = !link.url.startsWith('http')

        if (isEmail) {
          return (
            <div key={link.url} className="relative w-7">
              <button
                onClick={() => handleCopy(link.url)}
                className="block h-full w-full transition-opacity hover:opacity-80"
                type="button"
                title={t.copyEmail}
              >
                <img
                  src={link.logo}
                  alt={link.label ?? link.url}
                  className="h-full w-full object-contain"
                />
              </button>
              {copiedUrl === link.url && (
                <div className="absolute -top-8 left-1/2 z-10 -translate-x-1/2 rounded bg-black px-2 py-1 text-xs whitespace-nowrap text-white">
                  {t.copied}
                </div>
              )}
            </div>
          )
        }

        return (
          <div key={link.url} className="w-7">
            <a
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block h-full w-full transition-opacity hover:opacity-80"
            >
              <img
                src={link.logo}
                alt={link.label ?? link.url}
                className="h-full w-full object-contain"
              />
            </a>
          </div>
        )
      })}
    </>
  )
}
