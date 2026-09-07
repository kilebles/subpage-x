'use client'

import { useEffect, useState, CSSProperties } from 'react'

export function FadeIn({ children, delay = 0, className = '', style }: { children: React.ReactNode; delay?: number; className?: string; style?: CSSProperties }) {
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), delay)
    return () => clearTimeout(t)
  }, [delay])
  return (
    <div
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'scale(1) translateY(0)' : 'scale(0.97) translateY(10px)',
        transition: 'opacity 0.5s cubic-bezier(0.4,0,0.2,1), transform 0.5s cubic-bezier(0.4,0,0.2,1)',
        ...style,
      }}
    >
      {children}
    </div>
  )
}
