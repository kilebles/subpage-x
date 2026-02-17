import styles from './Logo.module.css'

export function Logo() {
  return (
    <div className={styles.logo}>
      <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
        <circle cx="20" cy="20" r="18" stroke="url(#gradient)" strokeWidth="2" fill="none"/>
        <circle cx="20" cy="20" r="14" fill="url(#gradient)" fillOpacity="0.1"/>
        <path
          d="M15 15L25 20L15 25V15Z"
          fill="url(#gradient)"
        />
        <text x="20" y="24" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold">X</text>
        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#58d5c0"/>
            <stop offset="100%" stopColor="#8b5cf6"/>
          </linearGradient>
        </defs>
      </svg>
    </div>
  )
}
