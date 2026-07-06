'use client'

import { useState, useCallback, useRef, useEffect } from 'react'
import { supabase, isSupabaseConfigured } from '@/lib/supabase'
import type { RealtimeChannel } from '@supabase/supabase-js'
import type {
  GameState,
  GameAction,
  BroadcastGameState,
  MultiplayerState,
  PresencePlayer,
  Card,
} from '@/types/game'

function generatePlayerId(): string {
  return `player-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
}

function generateRoomCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  return Array.from({ length: 6 }, () =>
    chars[Math.floor(Math.random() * chars.length)]
  ).join('')
}

/** Sanitize full game state for a specific player — hide other hands */
export function sanitizeStateForPlayer(
  state: GameState,
  playerId: string
): BroadcastGameState {
  const player = state.players.find((p) => p.id === playerId)
  return {
    phase: state.phase,
    currentRound: state.currentRound,
    currentBlackCard: state.currentBlackCard,
    players: state.players.map(({ hand, ...rest }) => rest),
    submissions: state.submissions,
    roundWinner: state.roundWinner,
    roundHistory: state.roundHistory,
    settings: state.settings,
    roomCode: state.roomCode,
    czarId: state.czarId,
    yourHand: player?.hand ?? [],
    yourId: playerId,
  }
}

// ── Runtime validation for untrusted Supabase Realtime payloads ──
// Presence/broadcast messages arrive as `unknown` over the wire and may be
// forged, truncated, or sent by a mismatched client version. Shape-check
// before trusting them instead of blindly casting with `as`.

function isCard(value: unknown): value is Card {
  if (typeof value !== 'object' || value === null) return false
  const v = value as Record<string, unknown>
  return (
    typeof v.id === 'string' &&
    typeof v.text === 'string' &&
    (v.type === 'black' || v.type === 'white')
  )
}

function isPresencePlayer(value: unknown): value is PresencePlayer {
  if (typeof value !== 'object' || value === null) return false
  const v = value as Record<string, unknown>
  return (
    typeof v.id === 'string' &&
    typeof v.name === 'string' &&
    typeof v.avatar === 'string' &&
    typeof v.avatarBg === 'string' &&
    typeof v.isHost === 'boolean' &&
    typeof v.onlineAt === 'string'
  )
}

function isBroadcastGameState(value: unknown): value is BroadcastGameState {
  if (typeof value !== 'object' || value === null) return false
  const v = value as Record<string, unknown>
  return (
    typeof v.phase === 'string' &&
    typeof v.currentRound === 'number' &&
    Array.isArray(v.players) &&
    Array.isArray(v.submissions) &&
    Array.isArray(v.roundHistory) &&
    typeof v.settings === 'object' && v.settings !== null &&
    typeof v.roomCode === 'string' &&
    typeof v.czarId === 'string' &&
    Array.isArray(v.yourHand) && v.yourHand.every(isCard) &&
    typeof v.yourId === 'string'
  )
}

function isGameAction(value: unknown): value is GameAction {
  if (typeof value !== 'object' || value === null) return false
  const v = value as Record<string, unknown>
  return typeof v.type === 'string' && typeof v.playerId === 'string'
}

/** Reconstruct full GameState on client from broadcast + local hand */
export function hydrateClientState(broadcast: BroadcastGameState): GameState {
  return {
    phase: broadcast.phase,
    currentRound: broadcast.currentRound,
    currentBlackCard: broadcast.currentBlackCard,
    players: broadcast.players.map((p) => ({
      ...p,
      hand: p.id === broadcast.yourId ? broadcast.yourHand : [],
      selectedCard: null,
    })),
    submissions: broadcast.submissions,
    roundWinner: broadcast.roundWinner,
    roundHistory: broadcast.roundHistory,
    settings: broadcast.settings,
    roomCode: broadcast.roomCode,
    czarId: broadcast.czarId,
  }
}

interface UseMultiplayerOptions {
  onStateUpdate?: (state: BroadcastGameState) => void
  onAction?: (action: GameAction) => void
  onPlayerJoin?: (player: PresencePlayer) => void
  onPlayerLeave?: (player: PresencePlayer) => void
  onError?: (error: string) => void
}

export function useMultiplayer(options: UseMultiplayerOptions = {}) {
  const [mpState, setMpState] = useState<MultiplayerState>({
    role: 'local',
    connected: false,
    roomCode: '',
    playerId: '',
    error: null,
  })
  const [presencePlayers, setPresencePlayers] = useState<PresencePlayer[]>([])

  const channelRef = useRef<RealtimeChannel | null>(null)
  const optionsRef = useRef(options)
  // Keep the ref in sync after every render (not during it) so callbacks
  // always see the latest options without making `setupChannel` unstable.
  useEffect(() => {
    optionsRef.current = options
  })

  /** Clean up channel on unmount */
  useEffect(() => {
    return () => {
      if (channelRef.current && supabase) {
        supabase.removeChannel(channelRef.current)
        channelRef.current = null
      }
    }
  }, [])

  const setupChannel = useCallback(
    (
      roomCode: string,
      playerId: string,
      playerInfo: { name: string; avatar: string; avatarBg: string },
      isHost: boolean
    ) => {
      // Clean up existing channel
      if (channelRef.current && supabase) {
        supabase.removeChannel(channelRef.current)
      }

      if (!supabase) return

      const channel = supabase.channel(`room:${roomCode}`, {
        config: { broadcast: { self: false }, presence: { key: playerId } },
      })

      // Presence: track joins/leaves
      channel.on('presence', { event: 'sync' }, () => {
        const state = channel.presenceState<PresencePlayer>()
        const players: PresencePlayer[] = []
        for (const key of Object.keys(state)) {
          const presences = state[key]
          if (presences?.[0]) players.push(presences[0])
        }
        setPresencePlayers(players)
      })

      channel.on(
        'presence',
        { event: 'join' },
        ({ newPresences }) => {
          const joined = newPresences[0]
          if (isPresencePlayer(joined)) optionsRef.current.onPlayerJoin?.(joined)
        }
      )

      channel.on(
        'presence',
        { event: 'leave' },
        ({ leftPresences }) => {
          const left = leftPresences[0]
          if (isPresencePlayer(left)) optionsRef.current.onPlayerLeave?.(left)
        }
      )

      // Game state broadcasts (host → clients). Every client on the shared
      // channel receives every personalized broadcast, so we must drop any
      // payload that isn't addressed to this client — otherwise another
      // player's hand briefly ends up in our local state (privacy leak +
      // visible flicker).
      channel.on('broadcast', { event: 'game:state' }, ({ payload }) => {
        if (!isBroadcastGameState(payload)) return
        if (payload.yourId !== playerId) return
        optionsRef.current.onStateUpdate?.(payload)
      })

      // Action broadcasts (clients → host)
      channel.on('broadcast', { event: 'game:action' }, ({ payload }) => {
        if (!isGameAction(payload)) return
        optionsRef.current.onAction?.(payload)
      })

      channel
        .subscribe(async (status) => {
          if (status === 'SUBSCRIBED') {
            await channel.track({
              id: playerId,
              name: playerInfo.name,
              avatar: playerInfo.avatar,
              avatarBg: playerInfo.avatarBg,
              isHost,
              onlineAt: new Date().toISOString(),
            } satisfies PresencePlayer)

            setMpState((prev) => ({ ...prev, connected: true, error: null }))
          } else if (status === 'CHANNEL_ERROR') {
            setMpState((prev) => ({
              ...prev,
              connected: false,
              error: 'Connection error - check your internet',
            }))
            optionsRef.current.onError?.('Connection error')
          } else if (status === 'TIMED_OUT') {
            setMpState((prev) => ({
              ...prev,
              connected: false,
              error: 'Connection timed out',
            }))
            optionsRef.current.onError?.('Connection timed out')
          }
        })

      channelRef.current = channel
    },
    []
  )

  /** Host creates a new room */
  const createRoom = useCallback(
    (playerInfo: { name: string; avatar: string; avatarBg: string }) => {
      const roomCode = generateRoomCode()
      const playerId = 'player-1' // Host is always player-1

      setMpState({
        role: 'host',
        connected: false,
        roomCode,
        playerId,
        error: null,
      })

      setupChannel(roomCode, playerId, playerInfo, true)
      return { roomCode, playerId }
    },
    [setupChannel]
  )

  /** Client joins an existing room */
  const joinRoom = useCallback(
    (
      roomCode: string,
      playerInfo: { name: string; avatar: string; avatarBg: string }
    ) => {
      const playerId = generatePlayerId()

      setMpState({
        role: 'client',
        connected: false,
        roomCode: roomCode.toUpperCase(),
        playerId,
        error: null,
      })

      setupChannel(roomCode.toUpperCase(), playerId, playerInfo, false)
      return { playerId }
    },
    [setupChannel]
  )

  /** Host broadcasts game state to all clients */
  const broadcastState = useCallback(
    (state: GameState) => {
      if (!channelRef.current || mpState.role !== 'host') return

      // Send personalized state to each non-host, non-bot player
      const remotePlayers = state.players.filter(
        (p) => !p.isBot && p.id !== 'player-1'
      )

      for (const player of remotePlayers) {
        const sanitized = sanitizeStateForPlayer(state, player.id)
        channelRef.current.send({
          type: 'broadcast',
          event: 'game:state',
          payload: sanitized,
        })
      }

      // Also broadcast a "spectator" version for late joiners
      // (uses empty hand since they'll get personalized state on join)
    },
    [mpState.role]
  )

  /** Client sends an action to the host */
  const sendAction = useCallback(
    (action: GameAction) => {
      if (!channelRef.current) return
      channelRef.current.send({
        type: 'broadcast',
        event: 'game:action',
        payload: action,
      })
    },
    []
  )

  /** Disconnect and clean up */
  const disconnect = useCallback(() => {
    if (channelRef.current && supabase) {
      supabase.removeChannel(channelRef.current)
      channelRef.current = null
    }
    setMpState({
      role: 'local',
      connected: false,
      roomCode: '',
      playerId: '',
      error: null,
    })
    setPresencePlayers([])
  }, [])

  return {
    mpState,
    presencePlayers,
    createRoom,
    joinRoom,
    broadcastState,
    sendAction,
    disconnect,
    isMultiplayer: mpState.role !== 'local',
    isHost: mpState.role === 'host',
    isClient: mpState.role === 'client',
  }
}
