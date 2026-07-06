'use client'

import { useEffect, useRef } from 'react'

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'

/**
 * Standard modal dialog focus behavior (WAI-ARIA Authoring Practices):
 * while `active`, moves focus into the container, traps Tab/Shift+Tab
 * cycling within it, and restores focus to whatever was focused before
 * the dialog opened once it closes/unmounts.
 *
 * Attach the returned ref to the dialog's outer element and give that
 * element `tabIndex={-1}` as a focus fallback if it has no focusable
 * children.
 */
export function useFocusTrap<T extends HTMLElement>(active: boolean) {
  const containerRef = useRef<T | null>(null)
  const previouslyFocused = useRef<HTMLElement | null>(null)

  useEffect(() => {
    if (!active) return
    previouslyFocused.current = document.activeElement as HTMLElement | null

    const container = containerRef.current
    const focusables = container
      ? Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR))
      : []
    ;(focusables[0] ?? container)?.focus()

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key !== 'Tab' || !container) return
      const nodes = Array.from(
        container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)
      ).filter((el) => el.offsetParent !== null)
      if (nodes.length === 0) return

      const first = nodes[0]
      const last = nodes[nodes.length - 1]

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      // Guard against the previously-focused node having been unmounted
      // while the dialog was open (e.g. a conditionally-rendered opener) —
      // calling .focus() on a detached node is a silent no-op, so check
      // first rather than relying on that.
      if (previouslyFocused.current?.isConnected) {
        previouslyFocused.current.focus()
      }
    }
  }, [active])

  return containerRef
}
