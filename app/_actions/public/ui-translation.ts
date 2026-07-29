'use server'

import { supabase } from '@/lib/supabase'

import type { Tables } from '@/types/database.types'

type UiTranslationRecord = Pick<
  Tables<'ui_translations'>,
  'namespace' | 'key' | 'value'
>

export async function getUiMessages(locale: string) {
  const { data, error } = await supabase
    .from('ui_translations')
    .select('namespace, key, value')
    .eq('locale', locale)

  if (error) {
    // AVAIL-1: surface real query failures (e.g. DB offline) to the error boundary
    // instead of returning {} — which the root layout would misread as "no such
    // page" and render a 404, masking the outage.
    console.error('Error fetching UI translations:', error)
    throw new Error(`Failed to load UI translations: ${error.message}`)
  }

  // Transform flat records to nested JSON
  // Support dot notation: 'project.golden_pig' -> { project: { golden_pig: ... } }
  const messages: Record<string, any> = {}

  ;(data || []).forEach((record: UiTranslationRecord) => {
    const { namespace, key, value } = record
    const ns = namespace || 'default' // Handle null namespace

    if (!messages[ns]) {
      messages[ns] = {}
    }

    // Keep flat structure - don't convert dots to nesting
    // This allows keys like 'project.golden_pig' to coexist with 'project'
    messages[ns][key] = value
  })

  return messages
}
