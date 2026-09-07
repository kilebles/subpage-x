export function Footer() {
  return (
    <footer className="shrink-0 px-8 py-4 flex items-center justify-end gap-6">
      <a
        href="https://teletype.in/@tunnelx_vpn/privacy-policy"
        target="_blank"
        rel="noopener noreferrer"
        className="font-mono text-xs tracking-widest uppercase text-foreground/25 hover:text-foreground/60 transition-colors"
      >
        Политика
      </a>
      <a
        href="https://teletype.in/@tunnelx_vpn/usage_rules"
        target="_blank"
        rel="noopener noreferrer"
        className="font-mono text-xs tracking-widest uppercase text-foreground/25 hover:text-foreground/60 transition-colors"
      >
        Соглашение
      </a>
    </footer>
  )
}
