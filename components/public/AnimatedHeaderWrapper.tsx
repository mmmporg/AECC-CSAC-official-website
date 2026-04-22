'use client'

import { motion, useReducedMotion } from 'framer-motion'
import { useEffect, useState, ReactNode } from 'react'

export function AnimatedHeaderWrapper({ children }: { children: ReactNode }) {
  const [scrolled, setScrolled] = useState(false)
  const shouldReduce = useReducedMotion()

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  return (
    <motion.header
      initial={shouldReduce ? false : { opacity: 0, y: -18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className="fixed top-0 left-0 z-50 w-full transition-all duration-300"
      style={{
        backgroundColor: scrolled ? 'rgba(252, 249, 242, 0.84)' : 'rgba(252, 249, 242, 0.94)',
        backdropFilter: scrolled && !shouldReduce ? 'blur(12px)' : 'none',
        boxShadow: scrolled ? '0 18px 42px rgba(26,28,27,0.08)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(224, 222, 215, 0.75)' : '1px solid transparent',
      }}
    >
      {children}
    </motion.header>
  )
}
