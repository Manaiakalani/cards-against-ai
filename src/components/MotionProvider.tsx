'use client'

import { LazyMotion, domAnimation, MotionConfig } from 'framer-motion'

export function MotionProvider({ children }: { children: React.ReactNode }) {
  return (
    <LazyMotion features={domAnimation} strict>
      {/* "user" defers to the OS prefers-reduced-motion setting: Framer Motion
          then automatically strips transform/layout animations for users who
          asked for reduced motion, without every screen needing to check it. */}
      <MotionConfig reducedMotion="user">{children}</MotionConfig>
    </LazyMotion>
  )
}
