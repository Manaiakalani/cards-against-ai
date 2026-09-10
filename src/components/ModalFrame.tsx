'use client'

import { useEffect, useCallback, type ReactNode } from 'react'
import { m, AnimatePresence } from 'framer-motion'
import { useFocusTrap } from '@/hooks/useFocusTrap'

export function ModalCloseButton({
  onClick,
  label,
}: {
  onClick: () => void
  label: string
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="cai-dialog-close"
    >
      ✕
    </button>
  )
}

export function ModalFrame({
  open,
  onClose,
  labelledBy,
  children,
  wide = false,
}: {
  open: boolean
  onClose: () => void
  labelledBy: string
  children: ReactNode
  wide?: boolean
}) {
  const handleEsc = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    },
    [onClose],
  )

  useEffect(() => {
    if (!open) return
    document.addEventListener('keydown', handleEsc)
    return () => document.removeEventListener('keydown', handleEsc)
  }, [open, handleEsc])

  const trapRef = useFocusTrap<HTMLDivElement>(open)

  return (
    <AnimatePresence>
      {open && (
        <>
          <m.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[200]"
            style={{ backgroundColor: 'var(--theme-overlay)' }}
          />
          <m.div
            ref={trapRef}
            tabIndex={-1}
            initial={{ opacity: 0, scale: 0.95, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 16 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className={wide ? 'cai-dialog cai-dialog-wide' : 'cai-dialog'}
            role="dialog"
            aria-modal="true"
            aria-labelledby={labelledBy}
          >
            {children}
          </m.div>
        </>
      )}
    </AnimatePresence>
  )
}
