import { Logo } from '@/components/ui/Logo'
import { IconButton } from '@/components/ui/IconButton'
import { LinkIcon, TelegramIcon } from '@/components/ui/Icons'
import styles from './Header.module.css'

export function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.logo}>
        <Logo />
        <span className={styles.title}>TunnelX VPN</span>
      </div>
      <div className={styles.actions}>
        <IconButton icon={<LinkIcon />} label="Copy link" />
        <IconButton icon={<TelegramIcon />} label="Telegram" />
      </div>
    </header>
  )
}
