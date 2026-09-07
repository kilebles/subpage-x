'use client'

import React, { useState, useEffect, useRef } from 'react'
import { ExternalLink, Plus, QrCode, Copy, Check, Wifi } from 'lucide-react'
import Link from 'next/link'
import { QRCodeSVG } from 'qrcode.react'
import { FaApple, FaAndroid, FaWindows, FaLinux } from 'react-icons/fa'
import { TbBrandFinder } from 'react-icons/tb'

function IosIcon({ className }: { className?: string }) {
  return <FaApple className={className} />
}

function AndroidIcon({ className }: { className?: string }) {
  return <FaAndroid className={className} />
}

function WindowsIcon({ className }: { className?: string }) {
  return <FaWindows className={className} />
}

function MacosIcon({ className }: { className?: string }) {
  return <TbBrandFinder className={className} />
}

function LinuxIcon({ className }: { className?: string }) {
  return <FaLinux className={className} />
}

function NodeConnector({ delay = 0, color = '168,85,247' }: { delay?: number; color?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const mouseRef = useRef({ x: -9999, y: -9999 })
  const rafRef = useRef<number>(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')!
    let t = delay

    const resize = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio
      canvas.height = canvas.offsetHeight * window.devicePixelRatio
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio)
    }

    const onMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect()
      mouseRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top }
    }
    const onMouseLeave = () => { mouseRef.current = { x: -9999, y: -9999 } }

    window.addEventListener('mousemove', onMouseMove)
    canvas.addEventListener('mouseleave', onMouseLeave)
    window.addEventListener('resize', resize)
    resize()

    const draw = () => {
      t += 0.012
      const w = canvas.offsetWidth
      const h = canvas.offsetHeight
      ctx.clearRect(0, 0, w, h)

      const cx = w / 2
      const ax = cx, ay = 0
      const bx = cx, by = h

      // Distance from mouse to line segment
      const dx = bx - ax, dy = by - ay
      const len2 = dx * dx + dy * dy
      const mx = mouseRef.current.x, my = mouseRef.current.y
      const tp = Math.max(0, Math.min(1, ((mx - ax) * dx + (my - ay) * dy) / len2))
      const nearX = ax + tp * dx, nearY = ay + tp * dy
      const nearDist = Math.sqrt((nearX - mx) ** 2 + (nearY - my) ** 2)
      const hl = Math.max(0, 1 - nearDist / 40)

      // Line
      ctx.beginPath()
      ctx.moveTo(ax, ay)
      ctx.lineTo(bx, by)
      ctx.strokeStyle = hl > 0
        ? `rgba(${color},${0.15 + hl * 0.6})`
        : `rgba(${color},0.15)`
      ctx.lineWidth = 1
      ctx.stroke()

      // Pulse dot
      const period = 2.5
      const pos = (t % period) / period
      const px = ax + dx * pos
      const py = ay + dy * pos
      const alpha = Math.sin(pos * Math.PI) * (0.7 + hl * 0.3)
      if (alpha > 0.05) {
        const grad = ctx.createRadialGradient(px, py, 0, px, py, 5)
        grad.addColorStop(0, `rgba(${color},${alpha})`)
        grad.addColorStop(0.4, `rgba(${color},${alpha * 0.4})`)
        grad.addColorStop(1, `rgba(${color},0)`)
        ctx.beginPath()
        ctx.arc(px, py, 5, 0, Math.PI * 2)
        ctx.fillStyle = grad
        ctx.fill()
      }

      rafRef.current = requestAnimationFrame(draw)
    }

    rafRef.current = requestAnimationFrame(draw)
    return () => {
      cancelAnimationFrame(rafRef.current)
      window.removeEventListener('mousemove', onMouseMove)
      canvas.removeEventListener('mouseleave', onMouseLeave)
      window.removeEventListener('resize', resize)
    }
  }, [delay, color])

  return <canvas ref={canvasRef} className="w-full flex-1" style={{ display: 'block', minHeight: '3rem' }} />
}

interface Block {
  title: string
  description: string
  buttons: { text: string; type: string; link: string }[]
}

interface Platform {
  key: string
  label: string
  blocks: Block[]
}

const PLATFORMS: Platform[] = [
  {
    key: 'ios',
    label: 'iOS',
    blocks: [
      {
        title: 'Скачай приложение',
        description: 'Установите из App Store и разрешите все доступы в процессе.',
        buttons: [
          { text: 'App Store (RU)', type: 'external', link: 'https://apps.apple.com/ru/app/happ-proxy-utility-plus/id6746188973' },
          { text: 'App Store (Global)', type: 'external', link: 'https://apps.apple.com/us/app/happ-proxy-utility/id6504287215' },
        ],
      },
      {
        title: 'Подключай',
        description: 'VPN добавится в приложение автоматически.',
        buttons: [{ text: 'Подключить', type: 'subscriptionLink', link: 'happ://add/{{SUBSCRIPTION_LINK}}' }],
      },
    ],
  },
  {
    key: 'android',
    label: 'Android',
    blocks: [
      {
        title: 'Скачай приложение',
        description: 'Установите приложение из Google Play или скачайте APK напрямую.',
        buttons: [
          { text: 'Google Play', type: 'external', link: 'https://play.google.com/store/apps/details?id=com.happproxy' },
          { text: 'Скачать APK', type: 'external', link: 'https://github.com/Happ-proxy/happ-android/releases/latest/download/Happ.apk' },
        ],
      },
      {
        title: 'Подключай',
        description: 'VPN добавится в приложение автоматически.',
        buttons: [{ text: 'Подключить', type: 'subscriptionLink', link: 'happ://add/{{SUBSCRIPTION_LINK}}' }],
      },
    ],
  },
  {
    key: 'windows',
    label: 'Windows',
    blocks: [
      {
        title: 'Скачай приложение',
        description: 'Загрузите установщик и запустите его. Разрешите все доступы в процессе установки.',
        buttons: [
          { text: 'Скачать для Windows', type: 'external', link: 'https://github.com/Happ-proxy/happ-desktop/releases/latest/download/setup-Happ.x64.exe' },
        ],
      },
      {
        title: 'Подключай',
        description: 'VPN добавится в приложение автоматически. Нажмите кнопку включения в приложении.',
        buttons: [{ text: 'Подключить', type: 'subscriptionLink', link: 'happ://add/{{SUBSCRIPTION_LINK}}' }],
      },
    ],
  },
  {
    key: 'macos',
    label: 'macOS',
    blocks: [
      {
        title: 'Скачай приложение',
        description: 'Установите из App Store и разрешите все доступы в процессе.',
        buttons: [
          { text: 'App Store (RU)', type: 'external', link: 'https://apps.apple.com/ru/app/happ-proxy-utility-plus/id6746188973' },
          { text: 'App Store (Global)', type: 'external', link: 'https://apps.apple.com/us/app/happ-proxy-utility/id6504287215' },
        ],
      },
      {
        title: 'Подключай',
        description: 'VPN добавится в приложение автоматически.',
        buttons: [{ text: 'Подключить', type: 'subscriptionLink', link: 'happ://add/{{SUBSCRIPTION_LINK}}' }],
      },
    ],
  },
  {
    key: 'linux',
    label: 'Linux',
    blocks: [
      {
        title: 'Скачай приложение',
        description: 'Выберите подходящую версию для вашего устройства и установите приложение.',
        buttons: [
          { text: 'amd64 (.deb)', type: 'external', link: 'https://github.com/pluralplay/FlClashX/releases/download/v0.2.1/FlClashX-0.2.1-linux-amd64.deb' },
          { text: 'amd64 (AppImage)', type: 'external', link: 'https://github.com/pluralplay/FlClashX/releases/download/v0.2.1/FlClashX-0.2.1-linux-amd64.AppImage' },
          { text: 'arm64 (.deb)', type: 'external', link: 'https://github.com/pluralplay/FlClashX/releases/download/v0.2.1/FlClashX-0.2.1-linux-arm64.deb' },
        ],
      },
      {
        title: 'Добавь подписку',
        description: 'Нажмите кнопку ниже, чтобы добавить подписку автоматически.',
        buttons: [{ text: 'Добавить подписку', type: 'subscriptionLink', link: 'flclashx://install-config?url={{SUBSCRIPTION_LINK}}' }],
      },
    ],
  },
]

const PLATFORM_COLORS_DARK: Record<string, { border: string; text: string; bg: string; shadow: string; rgb: string }> = {
  ios:     { border: 'rgba(255,255,255,0.5)',  text: '#ffffff',  bg: 'rgba(255,255,255,0.08)', shadow: 'rgba(255,255,255,0.15)', rgb: '255,255,255' },
  android: { border: '#3ddc84',               text: '#3ddc84',  bg: 'rgba(61,220,132,0.1)',   shadow: 'rgba(61,220,132,0.25)',  rgb: '61,220,132'  },
  windows: { border: '#00adef',               text: '#00adef',  bg: 'rgba(0,173,239,0.1)',    shadow: 'rgba(0,173,239,0.25)',   rgb: '0,173,239'   },
  macos:   { border: '#007aff',               text: '#007aff',  bg: 'rgba(0,122,255,0.1)',    shadow: 'rgba(0,122,255,0.25)',   rgb: '0,122,255'   },
  linux:   { border: '#ffb900',               text: '#ffb900',  bg: 'rgba(255,185,0,0.1)',    shadow: 'rgba(255,185,0,0.25)',   rgb: '255,185,0'   },
}

const PLATFORM_COLORS_LIGHT: Record<string, { border: string; text: string; bg: string; shadow: string; rgb: string }> = {
  ios:     { border: '#555555',               text: '#333333',  bg: 'rgba(0,0,0,0.06)',       shadow: 'rgba(0,0,0,0.15)',       rgb: '50,50,50'    },
  android: { border: '#1a9955',               text: '#1a9955',  bg: 'rgba(26,153,85,0.08)',   shadow: 'rgba(26,153,85,0.2)',    rgb: '26,153,85'   },
  windows: { border: '#0078c8',               text: '#0078c8',  bg: 'rgba(0,120,200,0.08)',   shadow: 'rgba(0,120,200,0.2)',    rgb: '0,120,200'   },
  macos:   { border: '#0055cc',               text: '#0055cc',  bg: 'rgba(0,85,204,0.08)',    shadow: 'rgba(0,85,204,0.2)',     rgb: '0,85,204'    },
  linux:   { border: '#c47f00',               text: '#c47f00',  bg: 'rgba(196,127,0,0.08)',   shadow: 'rgba(196,127,0,0.2)',    rgb: '196,127,0'   },
}

const PLATFORM_ICONS: Record<string, ({ className }: { className?: string }) => React.JSX.Element> = {
  ios: IosIcon,
  android: AndroidIcon,
  windows: WindowsIcon,
  macos: MacosIcon,
  linux: LinuxIcon,
}

interface Props {
  subscriptionUrl: string
  variant?: 'dashboard' | 'public'
}

export function ConnectWidget({ subscriptionUrl, variant = 'dashboard' }: Props) {
  const [activeKey, setActiveKey] = useState('ios')
  const [showQr, setShowQr] = useState(false)
  const [copied, setCopied] = useState(false)
  const [isLight, setIsLight] = useState(false)

  useEffect(() => {
    const check = () => setIsLight(document.documentElement.classList.contains('light'))
    check()
    const observer = new MutationObserver(check)
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })
    return () => observer.disconnect()
  }, [])

  const PLATFORM_COLORS = isLight ? PLATFORM_COLORS_LIGHT : PLATFORM_COLORS_DARK

  function handleCopy() {
    navigator.clipboard.writeText(subscriptionUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }
  useEffect(() => {
    const ua = navigator.userAgent
    if (/android/i.test(ua)) setActiveKey('android')
    else if (/iphone|ipad|ipod/i.test(ua)) setActiveKey('ios')
    else if (/macintosh|mac os x/i.test(ua)) setActiveKey('macos')
    else if (/windows/i.test(ua)) setActiveKey('windows')
    else if (/linux/i.test(ua)) setActiveKey('linux')
  }, [])

  const platform = PLATFORMS.find(p => p.key === activeKey)!
  const colors = PLATFORM_COLORS[activeKey]

  function resolveLink(link: string) {
    return link.replace('{{SUBSCRIPTION_LINK}}', subscriptionUrl)
  }

  const articleKey = `${activeKey}-${activeKey === 'linux' ? 'flclash' : 'happ'}`

  return (
    <div className="h-full flex flex-col">
      {variant === 'public' ? (
        <Link href={`/instructions?article=${articleKey}`} className="hover-header px-7 py-4 border-b border-border flex items-center gap-3 bg-foreground/4 hover:bg-foreground/6 transition-colors group">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.png" alt="TunnelX" className="w-6 h-6 object-contain" />
          <span className="font-mono text-sm tracking-[0.3em] uppercase text-foreground/50 group-hover:text-foreground/80 transition-colors">Подробная инструкция</span>
        </Link>
      ) : (
        <Link href={`/dashboard/instructions?article=${articleKey}`} className="hover-header px-7 py-5 border-b border-border flex items-center gap-3 bg-foreground/4 hover:bg-foreground/6 transition-colors group">
          <Wifi size={16} className="text-[#A855F7]" />
          <span className="font-mono text-sm tracking-[0.3em] uppercase text-foreground/50 group-hover:text-foreground/80 transition-colors">Подключение</span>
        </Link>
      )}
      <div className="overflow-y-auto px-5 md:px-8 py-6 md:py-8">
          <div className="flex gap-10 items-start">

            {/* Steps */}
            <div className="flex flex-col flex-1">

              {/* Platform switcher */}
              <div className="flex items-center justify-between mb-6 md:mb-8">
                <div className="flex gap-1">
                  {PLATFORMS.map(p => {
                    const Icon = PLATFORM_ICONS[p.key]
                    const active = activeKey === p.key
                    const pc = PLATFORM_COLORS[p.key]
                    return (
                      <div key={p.key} className="relative group">
                        <button
                          onClick={() => { setActiveKey(p.key); setShowQr(false) }}
                          className="w-10 h-10 flex items-center justify-center border transition-all duration-200"
                          style={active ? {
                            borderColor: pc.border,
                            color: pc.text,
                            backgroundColor: pc.bg,
                            boxShadow: `0 0 14px ${pc.shadow}`,
                          } : {
                            borderColor: 'color-mix(in srgb, var(--foreground) 25%, transparent)',
                            color: 'color-mix(in srgb, var(--foreground) 45%, transparent)',
                          }}
                        >
                          <Icon className="w-5 h-5" />
                        </button>
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-card border border-border font-mono text-[10px] tracking-widest uppercase text-foreground/60 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                          {p.label}
                        </div>
                      </div>
                    )
                  })}
                </div>
                {variant === 'public' && (
                  <div className="relative">
                    <button
                      onClick={() => setShowQr(v => !v)}
                      className={`flex items-center gap-2 px-3 h-10 border font-mono text-[10px] tracking-widest uppercase transition-colors ${
                        showQr ? 'border-[#A855F7] text-[#A855F7]' : 'border-foreground/20 text-foreground/40 hover:border-foreground/40 hover:text-foreground/70'
                      }`}
                    >
                      <QrCode size={13} />
                      <span className="hidden sm:inline">Другое устройство</span>
                    </button>
                    {showQr && (
                      <div
                        className="absolute top-full right-0 mt-2 z-20 border border-border p-4 bg-background flex flex-col items-center gap-3"
                        style={{
                          animation: 'platformFadeIn 0.2s ease',
                        }}
                      >
                        <QRCodeSVG value={resolveLink('happ://add/{{SUBSCRIPTION_LINK}}')} size={180} bgColor="transparent" fgColor="#A855F7" level="M" />
                        <span className="font-mono text-[10px] tracking-widest uppercase text-foreground/30">Сканируй с другого устройства</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
              <div key={activeKey} style={{ animation: 'platformFadeIn 0.25s ease' }}>
              {platform.blocks.map((block, i) => (
                <div key={i} className="flex gap-8">
                  {/* Step node */}
                  <div className="shrink-0 flex flex-col items-center">
                    {/* Node square */}
                    <div
className="group relative w-10 h-10 flex items-center justify-center cursor-default transition-all duration-200 shrink-0"
                    >
                      {/* Glow */}
                      <div className="absolute inset-0 opacity-40 group-hover:opacity-100 transition-opacity duration-200" style={{ boxShadow: `0 0 18px 4px rgba(${colors.rgb},0.5)` }} />
                      {/* Border */}
                      <div className="absolute inset-0 transition-colors duration-200" style={{ border: `1px solid rgba(${colors.rgb},0.5)` }} />
                      {/* Number */}
                      <span className="relative z-10 font-mono text-sm transition-colors duration-200" style={{ color: colors.text }}>{i + 1}</span>
                    </div>
                    {/* Connector line with pulse */}
                    {i < platform.blocks.length - 1 && (
                      <div className="flex flex-col items-center w-10 flex-1">
                        <NodeConnector delay={i * 1.2} color={colors.rgb} />
                      </div>
                    )}
                  </div>
                  {/* Content */}
                  <div className="flex flex-col gap-4 pb-10">
                    <span className="font-mono text-base tracking-widest uppercase text-foreground/90">{block.title}</span>
                    <p className="font-mono text-base text-foreground/50 leading-relaxed max-w-lg">{block.description}</p>
                    {block.buttons.length > 0 && (
                      <div className="flex items-start gap-6 mt-1">
                        <div className="flex flex-col gap-2 md:flex-row md:flex-wrap md:gap-3">
                          {block.buttons.map((btn, j) => (
                            btn.type === 'subscriptionLink' ? (
                              <div key={j} className="flex flex-col gap-2 md:flex-row md:flex-wrap md:gap-3">
                                <a
                                  href={resolveLink(btn.link)}
                                  className="font-mono text-xs md:text-sm tracking-widest uppercase px-4 md:px-6 h-10 md:h-11 flex items-center justify-center gap-2 transition-all duration-200 hover:brightness-125 hover:scale-[1.02] w-full md:w-auto"
                                  style={isLight
                                    ? { backgroundColor: `rgba(${colors.rgb},0.12)`, color: colors.text, boxShadow: `0 0 16px rgba(${colors.rgb},0.2)`, border: `1px solid rgba(${colors.rgb},0.4)` }
                                    : { backgroundColor: colors.text === '#ffffff' ? '#1a1a2e' : colors.text, color: colors.text === '#ffffff' ? '#ffffff' : '#000000', boxShadow: `0 0 16px rgba(${colors.rgb},0.35)`, border: colors.text === '#ffffff' ? '1px solid rgba(255,255,255,0.3)' : 'none' }
                                  }
                                >
                                  <Plus size={13} />
                                  {btn.text}
                                </a>
                                <button
                                  onClick={handleCopy}
                                  className={`h-10 md:h-11 px-4 md:px-5 border transition-colors flex items-center justify-center gap-2 font-mono text-xs md:text-sm tracking-widest uppercase w-full md:w-auto ${
                                    copied ? 'border-green-500/60 text-green-400' : 'border-foreground/30 text-foreground/60 hover:border-foreground/60 hover:text-foreground'
                                  }`}
                                >
                                  {copied ? <Check size={14} /> : <Copy size={14} />}
                                  {copied ? 'Скопировано' : 'Скопировать'}
                                </button>
                              </div>
                            ) : (
                              <a
                                key={j}
                                href={btn.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="font-mono text-xs md:text-sm tracking-widest uppercase text-foreground/60 px-4 md:px-6 h-10 md:h-11 flex items-center justify-center gap-2 border border-foreground/30 hover:border-foreground/60 hover:text-foreground transition-colors w-full md:w-auto"
                              >
                                <ExternalLink size={13} />
                                {btn.text}
                              </a>
                            )
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
              </div>

            </div>

          </div>
      </div>
    </div>
  )
}
