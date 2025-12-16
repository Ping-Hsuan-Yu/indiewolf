import { getRequestConfig } from 'next-intl/server';
import { normalizeLocale } from '@/lib/i18n/config';
import { UiTranslationService } from '@/lib/services/uiTranslationService';

export default getRequestConfig(async ({ locale }) => {
  const normalized = normalizeLocale(locale);

  // Load translations from database instead of JSON files
  const messages = await UiTranslationService.getMessages(normalized);

  return {
    locale: normalized,
    messages,
  };
});

