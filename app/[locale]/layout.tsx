import type { Metadata } from 'next';
import { NextIntlClientProvider } from 'next-intl';
import { notFound } from 'next/navigation';
import { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'Lin ChaoYu',
  description: '插畫修行。',
  icons: {
    icon: '/assets/logo.svg',
  },
};

const SUPPORTED_LOCALES = ['zh', 'en'] as const;

// https://nextjs.org/docs/app/api-reference/functions/generate-static-params
export function generateStaticParams() {
  return SUPPORTED_LOCALES.map((locale) => ({ locale }));
}

type LocaleLayoutProps = {
  children: ReactNode;
  params: {
    locale: (typeof SUPPORTED_LOCALES)[number];
  };
};

export default async function LocaleLayout({ children, params }: LocaleLayoutProps) {
  const { locale } = params;
  const messages = await loadMessages(locale);

  return (
    <html lang={locale === 'zh' ? 'zh-Hant' : 'en'}>
      <body className="bg-white text-black">
        <NextIntlClientProvider locale={locale} messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}

async function loadMessages(locale: (typeof SUPPORTED_LOCALES)[number]) {
  const { UiTranslationService } = await import('@/lib/services/uiTranslationService');
  const messages = await UiTranslationService.getMessages(locale);
  
  if (!messages || Object.keys(messages).length === 0) {
    notFound();
  }
  
  return messages;
}

