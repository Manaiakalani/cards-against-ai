import { z } from 'zod'
import type {
  PresencePlayer,
  BroadcastGameState,
  GameAction,
} from '@/types/game'

// ── Runtime schemas for the multiplayer wire protocol ──
// Presence/broadcast messages arrive over the Supabase Realtime channel as
// `unknown` and may be forged, truncated, or sent by a mismatched client
// version. These zod schemas mirror the hand-written types in
// `types/game.ts` field-for-field so payloads can be *parsed* (with a
// precise, inspectable failure reason) instead of shape-checked ad hoc and
// blindly cast with `as`.

export const CardSchema = z.object({
  id: z.string(),
  text: z.string(),
  type: z.enum(['black', 'white']),
  blanks: z.number().optional(),
  category: z.string().optional(),
})

/** Player shape as broadcast to clients — `hand` is stripped server-side */
const BroadcastPlayerSchema = z.object({
  id: z.string(),
  name: z.string(),
  score: z.number(),
  isHost: z.boolean(),
  isCardCzar: z.boolean(),
  isConnected: z.boolean(),
  avatar: z.string(),
  avatarBg: z.string(),
  selectedCard: CardSchema.nullable(),
  isBot: z.boolean(),
})

const GameSettingsSchema = z.object({
  maxPlayers: z.number(),
  roundTime: z.number(),
  winningScore: z.number(),
  selectedDecks: z.array(z.string()),
  timerEnabled: z.boolean(),
  timerSeconds: z.number(),
  winnersPick: z.boolean(),
  rebootEnabled: z.boolean(),
})

const GamePhaseSchema = z.enum([
  'menu',
  'lobby',
  'playing',
  'revealing',
  'judging',
  'results',
  'scoreboard',
  'ended',
])

const SubmissionSchema = z.object({
  playerId: z.string(),
  cards: z.array(CardSchema),
})

const RoundResultSchema = z.object({
  blackCard: CardSchema,
  winningCards: z.array(CardSchema),
  winnerId: z.string(),
  czarId: z.string(),
  round: z.number(),
})

export const PresencePlayerSchema = z.object({
  id: z.string(),
  name: z.string(),
  avatar: z.string(),
  avatarBg: z.string(),
  isHost: z.boolean(),
  onlineAt: z.string(),
})

/** Full state snapshot broadcast host → clients (one per connected player) */
export const BroadcastGameStateSchema = z.object({
  phase: GamePhaseSchema,
  currentRound: z.number(),
  currentBlackCard: CardSchema.nullable(),
  players: z.array(BroadcastPlayerSchema),
  submissions: z.array(SubmissionSchema),
  roundWinner: z.string().nullable(),
  roundHistory: z.array(RoundResultSchema),
  settings: GameSettingsSchema,
  roomCode: z.string(),
  czarId: z.string(),
  yourHand: z.array(CardSchema),
  yourId: z.string(),
})

/**
 * Actions sent client → host. Modeled as a discriminated union (keyed by
 * `type`, mirroring `GameAction` in types/game.ts) so each variant's
 * `payload` is validated against exactly what that action needs — a
 * forged/truncated broadcast missing a required payload field is rejected
 * up front instead of throwing later when the host's reducer dereferences it.
 */
export const GameActionSchema = z.discriminatedUnion('type', [
  z.object({
    type: z.literal('player:join'),
    playerId: z.string(),
    payload: z.object({
      name: z.string(),
      avatar: z.string(),
      avatarBg: z.string(),
    }),
  }),
  z.object({
    type: z.literal('player:leave'),
    playerId: z.string(),
  }),
  z.object({
    type: z.literal('player:submit'),
    playerId: z.string(),
    payload: z.object({ cards: z.array(CardSchema) }),
  }),
  z.object({
    type: z.literal('player:pick_winner'),
    playerId: z.string(),
    payload: z.object({ winnerId: z.string() }),
  }),
  z.object({
    type: z.literal('player:reboot'),
    playerId: z.string(),
  }),
  z.object({
    type: z.literal('player:update_settings'),
    playerId: z.string(),
    payload: z.object({ settings: GameSettingsSchema.partial() }),
  }),
  z.object({
    type: z.literal('player:start_game'),
    playerId: z.string(),
    payload: z.object({ botCount: z.number().optional() }).optional(),
  }),
  z.object({
    type: z.literal('player:next_round'),
    playerId: z.string(),
  }),
  z.object({
    type: z.literal('player:continue'),
    playerId: z.string(),
  }),
  z.object({
    type: z.literal('player:new_game'),
    playerId: z.string(),
  }),
])

function warnInvalid(label: string, error: z.ZodError): void {
  if (process.env.NODE_ENV !== 'production') {
    console.warn(`[multiplayer] dropped invalid ${label} payload:`, error.issues)
  }
}

/** Parse an untrusted presence payload; logs and returns null if invalid. */
export function parsePresencePlayer(value: unknown): PresencePlayer | null {
  const result = PresencePlayerSchema.safeParse(value)
  if (!result.success) {
    warnInvalid('presence', result.error)
    return null
  }
  return result.data
}

/** Parse an untrusted `game:state` broadcast; logs and returns null if invalid. */
export function parseBroadcastGameState(value: unknown): BroadcastGameState | null {
  const result = BroadcastGameStateSchema.safeParse(value)
  if (!result.success) {
    warnInvalid('game state broadcast', result.error)
    return null
  }
  return result.data
}

/** Parse an untrusted `game:action` broadcast; logs and returns null if invalid. */
export function parseGameAction(value: unknown): GameAction | null {
  const result = GameActionSchema.safeParse(value)
  if (!result.success) {
    warnInvalid('game action', result.error)
    return null
  }
  return result.data
}
