import { supabase } from '@/lib/supabase';

type UiTranslationRecord = {
  namespace: string;
  key: string;
  value: string;
};

export const UiTranslationService = {
  async getMessages(locale: string) {
    const { data, error } = await supabase
      .from('ui_translations')
      .select('namespace, key, value')
      .eq('locale', locale);

    if (error) {
      console.error('Error fetching UI translations:', error);
      return {};
    }

    // Transform flat records to nested JSON
    // Support dot notation: 'project.golden_pig' -> { project: { golden_pig: ... } }
    const messages: Record<string, any> = {};

    (data || []).forEach((record: UiTranslationRecord) => {
      const { namespace, key, value } = record;

      if (!messages[namespace]) {
        messages[namespace] = {};
      }

      // Keep flat structure - don't convert dots to nesting
      // This allows keys like 'project.golden_pig' to coexist with 'project'
      messages[namespace][key] = value;
    });

    return messages;
  }
};
