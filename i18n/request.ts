import { getRequestConfig } from 'next-intl/server';
import { normalizeLocale } from '@/lib/i18n/config';
import { getUiMessages } from '@/app/_actions/public/ui-translation';

export default getRequestConfig(async ({ locale }) => {
  const normalized = normalizeLocale(locale);

  // Load translations from database instead of JSON files
  const messages = await getUiMessages(normalized);

  return {
    locale: normalized,
    messages,
  };
});

