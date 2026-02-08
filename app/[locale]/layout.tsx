import type { Metadata } from 'next'
import { NextIntlClientProvider } from 'next-intl'
import { notFound } from 'next/navigation'
import { ReactNode } from 'react'
import { gambetta, notoSerifTC, abhayaLibre } from '@/app/font'
import './globals.css'

export const metadata: Metadata = {
  title: 'Lin ChaoYu',
  description: '插畫修行。',
  icons: {
    icon: '/assets/logo.svg'
  }
}

const SUPPORTED_LOCALES = ['zh', 'en'] as const

// https://nextjs.org/docs/app/api-reference/functions/generate-static-params
export function generateStaticParams() {
  return SUPPORTED_LOCALES.map(locale => ({ locale }))
}

type LocaleLayoutProps = {
  children: ReactNode
  params: Promise<{
    locale: string
  }>
}

export default async function LocaleLayout({ children, params }: LocaleLayoutProps) {
  const { locale } = await params
  if (!SUPPORTED_LOCALES.includes(locale as any)) {
    notFound()
  }
  const messages = await loadMessages(locale as (typeof SUPPORTED_LOCALES)[number])

  return (
    <html
      lang={locale === 'zh' ? 'zh-Hant' : 'en'}
      className={`${gambetta.variable} ${notoSerifTC.variable} ${abhayaLibre.variable}`}>
      <body className='bg-white text-black'>
        <NextIntlClientProvider locale={locale} messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  )
}

async function loadMessages(locale: (typeof SUPPORTED_LOCALES)[number]) {
  const { getUiMessages } = await import('@/app/_actions/public/ui-translation')
  const messages = await getUiMessages(locale)

  if (!messages || Object.keys(messages).length === 0) {
    notFound()
  }

  return messages
}
