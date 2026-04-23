'use client'

import { motion, useReducedMotion } from 'framer-motion'
import type { ReactNode } from 'react'

interface HeroEntranceProps {
  children: ReactNode
  className?: string
}

const container = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1, delayChildren: 0.05 }
  }
}

const item = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.25, 1, 0.5, 1] as [number, number, number, number] }
  }
}

export function HeroEntrance({ children, className }: HeroEntranceProps) {
  const shouldReduce = useReducedMotion()

  return (
    <motion.div
      className={className}
      variants={container}
      initial={shouldReduce ? false : 'hidden'}
      animate="visible"
    >
      {children}
    </motion.div>
  )
}

export function HeroEntranceItem({ children, className }: HeroEntranceProps) {
  return (
    <motion.div className={className} variants={item}>
      {children}
    </motion.div>
  )
}
