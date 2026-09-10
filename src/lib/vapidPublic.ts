/** Public VAPID key (safe to ship). Private key lives in Supabase secrets as VAPID_PRIVATE_KEY. */
export const VAPID_PUBLIC_KEY =
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY ??
  'BFdcKm7OfHaHX_YaH1tSJ2ZtHG1IKUdfnYENRou18tAVZKIXaOALFDWnNYYm6jWISYVNoBen-n01KJH2HLkIF7E'
