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
      initial={false}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0 }}
      className="fixed top-0 left-0 z-50 w-full transition-all duration-300"
      style={{
        backgroundColor: scrolled ? 'rgba(250, 250, 247, 0.94)' : 'rgba(250, 250, 247, 0.98)',
        backdropFilter: !shouldReduce ? 'blur(14px)' : 'none',
        boxShadow: scrolled ? '0 20px 42px rgba(26,28,27,0.08)' : '0 8px 24px rgba(26,28,27,0.03)',
        borderBottom: scrolled ? '1px solid rgba(224, 222, 215, 0.82)' : '1px solid rgba(232, 229, 221, 0.72)',
      }}
    >
      {children}
    </motion.header>
  )
}
