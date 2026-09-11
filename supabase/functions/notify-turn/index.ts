// One-time in the SQL editor (do not grant SELECT to anon):
// create table if not exists public.push_subscriptions (
//   endpoint text primary key, room_code text not null, player_id text not null,
//   p256dh text not null, auth text not null, updated_at timestamptz not null default now());
// create index if not exists push_subscriptions_room_code_idx on public.push_subscriptions (room_code);
// alter table public.push_subscriptions enable row level security;
// create policy push_sub_insert on public.push_subscriptions for insert to anon, authenticated with check (true);
// create policy push_sub_update on public.push_subscriptions for update to anon, authenticated using (true) with check (true);
// create policy push_sub_delete on public.push_subscriptions for delete to anon, authenticated using (true);

import { createClient } from 'npm:@supabase/supabase-js@2'
import webpush from 'npm:web-push@3.6.7'

const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const COOLDOWN_MS = 8000
const lastSent = new Map<string, number>()

type GameLike = {
  phase?: string
  czarId?: string
  submissions?: { playerId: string }[]
  players?: { id: string; isBot?: boolean; isCardCzar?: boolean }[]
  roomCode?: string
}

type SubRow = { player_id: string; endpoint: string; p256dh: string; auth: string }

function isPlayersTurn(state: GameLike, playerId: string): boolean {
  const player = state.players?.find((p) => p.id === playerId)
  if (!player) return false
  if (state.phase === 'playing') {
    return !player.isCardCzar && !(state.submissions ?? []).some((s) => s.playerId === playerId)
  }
  if (state.phase === 'judging') return player.id === state.czarId
  return false
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: cors })

  const vapidPublic = Deno.env.get('VAPID_PUBLIC_KEY')
  const vapidPrivate = Deno.env.get('VAPID_PRIVATE_KEY')
  const vapidSubject = Deno.env.get('VAPID_SUBJECT') ?? 'mailto:hello@tinyinternet.company'
  if (!vapidPublic || !vapidPrivate) {
    return Response.json({ ok: false, error: 'push is not configured' }, { status: 501, headers: cors })
  }

  let roomCode = ''
  let exceptPlayerId = ''
  try {
    const body = await req.json()
    roomCode = String(body.roomCode ?? '').toUpperCase()
    exceptPlayerId = String(body.exceptPlayerId ?? '')
  } catch {
    return Response.json({ ok: false }, { status: 400, headers: cors })
  }
  if (!roomCode) return Response.json({ ok: false }, { status: 400, headers: cors })

  const prev = lastSent.get(roomCode) ?? 0
  if (Date.now() - prev < COOLDOWN_MS) {
    return Response.json({ ok: true, skipped: 'cooldown' }, { headers: cors })
  }
  lastSent.set(roomCode, Date.now())

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
  )
  const { data, error } = await supabase.rpc('get_async_game', { p_code: roomCode })
  if (error || !data?.state) {
    return Response.json({ ok: false, error: 'no table' }, { status: 404, headers: cors })
  }

  const state = data.state as GameLike
  const { data: rows } = await supabase
    .from('push_subscriptions')
    .select('player_id, endpoint, p256dh, auth')
    .eq('room_code', roomCode)

  const fromTable: SubRow[] = rows ?? []

  const seen = new Set<string>()
  const due: SubRow[] = []
  for (const sub of fromTable) {
    if (seen.has(sub.endpoint)) continue
    seen.add(sub.endpoint)
    if (!sub.player_id || sub.player_id === exceptPlayerId) continue
    if (!isPlayersTurn(state, sub.player_id)) continue
    due.push(sub)
  }

  webpush.setVapidDetails(vapidSubject, vapidPublic, vapidPrivate)
  const url = `https://cards.tinyinternet.company/?room=${encodeURIComponent(roomCode)}`
  const payload = JSON.stringify({
    title: 'Your turn',
    body: 'Cards Against AI — play a card or judge.',
    url,
  })

  const dead: string[] = []
  await Promise.all(
    due.map(async (sub) => {
      try {
        await webpush.sendNotification(
          {
            endpoint: sub.endpoint,
            keys: { p256dh: sub.p256dh, auth: sub.auth },
          },
          payload,
        )
      } catch (err) {
        const status = Number((err as { statusCode?: number }).statusCode ?? 0)
        if (status === 404 || status === 410) dead.push(sub.endpoint)
      }
    }),
  )

  if (dead.length) {
    await supabase.from('push_subscriptions').delete().in('endpoint', dead)
  }

  return Response.json({ ok: true, sent: due.length - dead.length, pruned: dead.length }, { headers: cors })
})
