'use server'

import { redirect } from 'next/navigation'

import { createAdminClient } from '@/utils/supabase/admin'
import { createClient } from '@/utils/supabase/server'

export async function logout() {
  const supabase = await createClient()
  await supabase.auth.signOut()

  redirect('/admin/login')
}

/**
 * Returns an admin Supabase client after verifying the user is authenticated.
 * This client bypasses RLS using the service role key.
 * ⚠️ Only use for admin operations!
 */
export async function getAuthorizedAdminClient() {
  // First verify the user is authenticated
  const supabase = await createClient()
  const {
    data: { user },
    error: authError
  } = await supabase.auth.getUser()

  if (authError || !user) {
    throw new Error('Unauthorized')
  }

  // Return admin client with service role key
  return createAdminClient()
}
