'use client'

import { useState, useSyncExternalStore } from 'react'
import { m } from 'framer-motion'
import { Sun, Moon, Volume2, VolumeX } from 'lucide-react'
import { useGame } from '@/contexts/GameContext'
import { useTheme } from '@/contexts/ThemeContext'
import { useSound } from '@/hooks/useSound'
import dynamic from 'next/dynamic'
import { ModalCloseButton, ModalFrame } from '@/components/ModalFrame'
import { getModalOpen, getModalOpenServer, subscribeModalOpen } from '@/lib/modalOpen'

const HelpModal = dynamic(
  () => import('@/components/HelpModal').then((mod) => mod.HelpModal),
  { ssr: false }
)
const AchievementToast = dynamic(
  () => import('@/components/AchievementToast').then((mod) => mod.AchievementToast),
  { ssr: false }
)

export function GlobalOverlay() {
  const { gameState, newGame } = useGame()
  const { isDark, toggleTheme } = useTheme()
  const { isMuted, toggleMute } = useSound()
  const [helpOpen, setHelpOpen] = useState(false)
  const [confirmQuit, setConfirmQuit] = useState(false)

  const chromeHidden = useSyncExternalStore(subscribeModalOpen, getModalOpen, getModalOpenServer)
  const isInGame = !['menu', 'lobby'].includes(gameState.phase)

  // Always 44px for WCAG touch-target minimum. Sit below the safe area so
  // the top of the pills is never clipped by overflow:hidden on .screen.
  const btnSize = 44
  const btnTop = isInGame
    ? 'calc(env(safe-area-inset-top, 0px) + 6px)'
    : 'calc(env(safe-area-inset-top, 0px) + 12px)'

  return (
    <>
      {!chromeHidden && (
      <>
      {/* Sound mute toggle */}
      <m.button
        onClick={toggleMute}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        aria-label={isMuted ? 'Unmute sounds' : 'Mute sounds'}
        className="fixed z-[150] flex cursor-pointer items-center justify-center rounded-full"
        style={{
          top: btnTop,
          right: isInGame ? 104 : 120,
          width: btnSize,
          height: btnSize,
          backgroundColor: 'var(--theme-surface)',
          color: 'var(--theme-text)',
          border: isInGame ? '2px solid var(--theme-border)' : '3px solid var(--theme-border)',
          boxShadow: isInGame ? 'none' : '3px 3px 0px var(--theme-shadow-soft)',
        }}
      >
        {isMuted
          ? <VolumeX className={isInGame ? 'h-4 w-4' : 'h-5 w-5'} strokeWidth={2} aria-hidden="true" />
          : <Volume2 className={isInGame ? 'h-4 w-4' : 'h-5 w-5'} strokeWidth={2} aria-hidden="true" />
        }
      </m.button>

      {/* Theme toggle — always visible, next to help */}
      <m.button
        onClick={toggleTheme}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
        className="fixed z-[150] flex cursor-pointer items-center justify-center rounded-full"
        style={{
          top: btnTop,
          right: isInGame ? 56 : 68,
          width: btnSize,
          height: btnSize,
          backgroundColor: 'var(--theme-surface)',
          color: 'var(--theme-text)',
          border: isInGame ? '2px solid var(--theme-border)' : '3px solid var(--theme-border)',
          boxShadow: isInGame ? 'none' : '3px 3px 0px var(--theme-shadow-soft)',
        }}
      >
        {isDark
          ? <Sun className={isInGame ? 'h-4 w-4' : 'h-5 w-5'} strokeWidth={2} aria-hidden="true" />
          : <Moon className={isInGame ? 'h-4 w-4' : 'h-5 w-5'} strokeWidth={2} aria-hidden="true" />
        }
      </m.button>

      {/* Help "?" button — always visible */}
      <m.button
        onClick={() => setHelpOpen(true)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        aria-label="How to play"
        className="fixed z-[150] flex cursor-pointer items-center justify-center rounded-full"
        style={{
          top: btnTop,
          right: isInGame ? 8 : 16,
          width: btnSize,
          height: btnSize,
          backgroundColor: 'var(--theme-text)',
          color: 'var(--theme-bg)',
          border: isInGame ? '2px solid var(--theme-border)' : '3px solid var(--theme-border)',
          boxShadow: isInGame ? 'none' : '3px 3px 0px var(--theme-shadow-soft)',
          fontFamily: 'var(--font-archivo)',
          fontSize: isInGame ? 18 : 22,
        }}
      >
        ?
      </m.button>
      </>
      )}

      {/* Quit button — only during active game, inside HUD bar. Stays
          mounted (never unmounts) while the confirm dialog is open, driving
          its enter/exit via `animate` instead of AnimatePresence, so the
          focus trap can restore focus to this exact node afterward — an
          unmounted-and-remounted button would be a stale ref on close. */}
      {isInGame && (
        <m.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: confirmQuit ? 0 : 1, scale: confirmQuit ? 0.8 : 1 }}
          onClick={() => setConfirmQuit(true)}
          whileHover={confirmQuit ? undefined : { scale: 1.1 }}
          whileTap={confirmQuit ? undefined : { scale: 0.9 }}
          aria-label="Quit game"
          aria-hidden={confirmQuit}
          tabIndex={confirmQuit ? -1 : 0}
          className="fixed z-[150] flex cursor-pointer items-center justify-center rounded-full"
          style={{
            top: btnTop,
            left: 10,
            width: 44,
            height: 44,
            backgroundColor: 'var(--theme-danger)',
            color: '#fff',
            border: '2px solid var(--theme-border)',
            fontFamily: 'var(--font-inter)',
            fontSize: 16,
            pointerEvents: confirmQuit ? 'none' : 'auto',
          }}
        >
          ✕
        </m.button>
      )}

      <ModalFrame
        open={confirmQuit}
        onClose={() => setConfirmQuit(false)}
        labelledBy="quit-confirm-title"
      >
        <div className="cai-dialog-header">
          <h2
            id="quit-confirm-title"
            className="uppercase"
            style={{
              fontFamily: 'var(--font-archivo)',
              fontSize: 24,
              color: 'var(--theme-text)',
            }}
          >
            Quit Game?
          </h2>
          <ModalCloseButton onClick={() => setConfirmQuit(false)} label="Close quit dialog" />
        </div>
        <div className="cai-dialog-body px-7 py-6 text-center">
          <span style={{ fontSize: 48, display: 'block', marginBottom: 12 }}>🚪</span>
          <p
            style={{
              fontFamily: 'var(--font-inter)',
              fontSize: 14,
              color: 'var(--theme-text-secondary)',
              marginBottom: 24,
              lineHeight: 1.5,
            }}
          >
            {gameState.playMode === 'async'
              ? 'You can rejoin later with the room code. This table stays put.'
              : 'Your progress will be lost. No take-backs, bestie.'}
          </p>
          <div className="flex gap-3">
            <button
              onClick={() => setConfirmQuit(false)}
              className="flex-1 cursor-pointer rounded-full py-3 shadow-hard-sm"
              style={{
                fontFamily: 'var(--font-archivo)',
                fontSize: 16,
                textTransform: 'uppercase',
                backgroundColor: 'var(--theme-surface)',
                color: 'var(--theme-text)',
                border: '3px solid var(--theme-border)',
              }}
            >
              Stay
            </button>
            <button
              onClick={() => {
                setConfirmQuit(false)
                newGame()
              }}
              className="flex-1 cursor-pointer rounded-full py-3 shadow-hard-sm"
              style={{
                fontFamily: 'var(--font-archivo)',
                fontSize: 16,
                textTransform: 'uppercase',
                backgroundColor: 'var(--theme-danger)',
                color: '#fff',
                border: '3px solid var(--theme-border)',
              }}
            >
              Quit
            </button>
          </div>
        </div>
      </ModalFrame>

      {/* Help modal */}
      <HelpModal open={helpOpen} onClose={() => setHelpOpen(false)} />

      {/* Achievement toasts */}
      <AchievementToast />
    </>
  )
}
