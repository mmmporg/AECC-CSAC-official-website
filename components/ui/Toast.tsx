'use client'

import { motion, AnimatePresence } from 'framer-motion'

interface ToastProps {
  message: string
  isVisible: boolean
  type?: 'success' | 'error'
}

export function Toast({ message, isVisible, type = 'success' }: ToastProps) {
  const isSuccess = type === 'success'
  
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 16, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -16, scale: 0.95 }}
          transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
          className={`px-4 py-3 rounded-lg shadow-lg flex items-center gap-3 mt-4 text-sm font-medium ${
            isSuccess 
              ? 'bg-brand-50 text-brand-700 border border-brand-100' 
              : 'bg-red-50 text-error border border-red-100'
          }`}
        >
          {isSuccess ? (
            <svg className="w-5 h-5 text-brand-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          ) : (
            <svg className="w-5 h-5 text-error" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          )}
          {message}
        </motion.div>
      )}
    </AnimatePresence>
  )
}
