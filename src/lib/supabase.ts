import type { SupabaseClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? ''

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey)

let client: SupabaseClient | null = null
let loading: Promise<SupabaseClient | null> | null = null

/** Sync handle after `loadSupabase()` has resolved. Null until then. */
export function getSupabase(): SupabaseClient | null {
  return client
}

/** Dynamically import supabase-js so the splash/solo path does not pay for it. */
export function loadSupabase(): Promise<SupabaseClient | null> {
  if (!isSupabaseConfigured) return Promise.resolve(null)
  if (client) return Promise.resolve(client)
  if (typeof window === 'undefined') return Promise.resolve(null)
  if (!loading) {
    loading = import('@supabase/supabase-js').then(({ createClient }) => {
      client = createClient(supabaseUrl, supabaseAnonKey, {
        realtime: {
          params: {
            eventsPerSecond: 10,
          },
        },
      })
      return client
    })
  }
  return loading
}

export function preloadSupabase() {
  if (isSupabaseConfigured) void loadSupabase()
}
