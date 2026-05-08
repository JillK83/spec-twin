import { supabase } from './supabase'

export async function ensureSession(): Promise<void> {
  const { data: { session } } = await supabase.auth.getSession()
  if (session) return
  await supabase.auth.signInAnonymously()
}

export async function getCurrentUserId(): Promise<string | null> {
  const { data: { user } } = await supabase.auth.getUser()
  return user?.id ?? null
}
