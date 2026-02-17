import type { ReactNode } from 'react'
import { ExternalLinkIcon, PlusIcon } from '@/components/ui/Icons'
import styles from './Button.module.css'

interface ButtonProps {
  children: ReactNode
  variant?: 'outline' | 'filled'
  icon?: 'external' | 'plus'
  onClick?: () => void
  href?: string
}

const ICONS = {
  external: ExternalLinkIcon,
  plus: PlusIcon,
}

export function Button({ children, variant = 'outline', icon, onClick, href }: ButtonProps) {
  const Icon = icon ? ICONS[icon] : null
  const className = `${styles.button} ${styles[variant]}`

  if (href) {
    return (
      <a href={href} className={className} target="_blank" rel="noopener noreferrer">
        {Icon && <Icon size={18} />}
        <span>{children}</span>
      </a>
    )
  }

  return (
    <button className={className} onClick={onClick}>
      {Icon && <Icon size={18} />}
      <span>{children}</span>
    </button>
  )
}
