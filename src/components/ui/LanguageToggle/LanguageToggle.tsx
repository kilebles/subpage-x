import { TranslateIcon } from '@/components/ui/Icons'
import styles from './LanguageToggle.module.css'

export function LanguageToggle() {
  return (
    <button className={styles.button}>
      <TranslateIcon size={24} />
    </button>
  )
}
