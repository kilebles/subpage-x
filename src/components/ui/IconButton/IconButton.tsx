import type { ReactNode } from 'react'
import styles from './IconButton.module.css'

interface IconButtonProps {
  icon: ReactNode
  label: string
  onClick?: () => void
}

export function IconButton({ icon, label, onClick }: IconButtonProps) {
  return (
    <button className={styles.button} onClick={onClick} aria-label={label} title={label}>
      {icon}
    </button>
  )
}
