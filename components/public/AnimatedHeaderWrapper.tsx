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
      className="fixed top-0 left-0 w-full z-50 transition-all duration-300"
      style={{
        backgroundColor: scrolled ? 'rgba(249, 249, 247, 0.92)' : 'rgba(249, 249, 247, 1)',
        backdropFilter: scrolled && !shouldReduce ? 'blur(12px)' : 'none',
        boxShadow: scrolled ? '0 12px 32px rgba(26,28,27,0.04)' : 'none',
        borderBottom: scrolled ? '1px solid #E0DED7' : '1px solid transparent',
      }}
    >
      {children}
    </motion.header>
  )
}
