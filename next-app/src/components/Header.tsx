'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { Sun, Moon } from 'lucide-react'

export function Header() {
  const [dark, setDark] = useState(true)

  useEffect(() => {
    const stored = localStorage.getItem('theme')
    const isDark = stored ? stored === 'dark' : true
    setDark(isDark)
    document.documentElement.classList.toggle('light', !isDark)
  }, [])

  function toggleTheme(e: React.MouseEvent) {
    const next = !dark
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect()
    const x = rect.left + rect.width / 2
    const y = rect.top + rect.height / 2

    const apply = () => {
      setDark(next)
      localStorage.setItem('theme', next ? 'dark' : 'light')
      document.documentElement.classList.toggle('light', !next)
    }

    if (!document.startViewTransition) { apply(); return }

    const maxR = Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y))
    document.documentElement.style.setProperty('--ripple-x', `${x}px`)
    document.documentElement.style.setProperty('--ripple-y', `${y}px`)
    document.documentElement.style.setProperty('--ripple-r', `${maxR}px`)

    const transition = document.startViewTransition(apply)
    transition.ready.then(() => {
      document.documentElement.animate(
        { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${maxR}px at ${x}px ${y}px)`] },
        { duration: 500, easing: 'cubic-bezier(0.4, 0, 0.2, 1)', pseudoElement: '::view-transition-new(root)' }
      )
    })
  }

  return (
    <header className="relative px-6 md:px-14 h-[64px] md:h-[76px] flex items-center justify-between border-b border-border shrink-0 header-bg">
      <Link href="/" className="flex items-center gap-3">
        <Image src={dark ? '/logo.gif' : '/logo.png'} alt="TunnelX" width={32} height={32} unoptimized className="md:w-[40px] md:h-[40px]" />
        <span className="font-mono text-sm md:text-base tracking-widest uppercase text-foreground/90">TunnelX</span>
      </Link>
      <button
        onClick={toggleTheme}
        className="w-8 h-8 flex items-center justify-center text-foreground/40 hover:text-foreground/80 transition-colors"
        title={dark ? 'Светлая тема' : 'Тёмная тема'}
      >
        {dark ? <Sun size={16} /> : <Moon size={16} />}
      </button>
    </header>
  )
}
