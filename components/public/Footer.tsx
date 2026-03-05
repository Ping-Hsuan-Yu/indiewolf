'use client'

import { useTranslations } from 'next-intl'

export default function Footer() {
  const t = useTranslations('footer')
  return (
    <footer className="mt-auto py-8 text-center text-sm">
      {t('copyright')}
      <br />
      <span className="text-[9px] text-gray-400">{t('announcement')}</span>
    </footer>
  )
}
