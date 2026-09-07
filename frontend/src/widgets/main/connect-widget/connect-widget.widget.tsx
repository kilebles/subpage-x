import { useEffect, useRef, useState } from 'react'
import {
    IconCheck,
    IconCopy,
    IconExternalLink,
    IconPlus,
    IconQrcode,
    IconWifi
} from '@tabler/icons-react'
import { renderSVG } from 'uqr'
import { FaAndroid, FaApple, FaLinux, FaWindows } from 'react-icons/fa'
import { TbBrandFinder } from 'react-icons/tb'

import { useSubscription } from '@entities/subscription-info-store'
import classes from './connect-widget.module.css'

function NodeConnector({ color = '168,85,247', delay = 0 }: { color?: string; delay?: number }) {
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
        const onMouseLeave = () => {
            mouseRef.current = { x: -9999, y: -9999 }
        }

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
            const ax = cx
            const ay = 0
            const bx = cx
            const by = h

            const dx = bx - ax
            const dy = by - ay
            const len2 = dx * dx + dy * dy
            const mx = mouseRef.current.x
            const my = mouseRef.current.y
            const tp = Math.max(0, Math.min(1, ((mx - ax) * dx + (my - ay) * dy) / len2))
            const nearX = ax + tp * dx
            const nearY = ay + tp * dy
            const nearDist = Math.sqrt((nearX - mx) ** 2 + (nearY - my) ** 2)
            const hl = Math.max(0, 1 - nearDist / 40)

            ctx.beginPath()
            ctx.moveTo(ax, ay)
            ctx.lineTo(bx, by)
            ctx.strokeStyle = hl > 0 ? `rgba(${color},${0.15 + hl * 0.6})` : `rgba(${color},0.15)`
            ctx.lineWidth = 1
            ctx.stroke()

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

    return <canvas className={classes.connectorCanvas} ref={canvasRef} style={{ display: 'block', minHeight: '3rem', width: '100%' }} />
}

interface Block {
    buttons: { link: string; text: string; type: 'external' | 'subscriptionLink' }[]
    description: string
    title: string
}

interface Platform {
    blocks: Block[]
    key: string
    label: string
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
                    {
                        text: 'App Store (RU)',
                        type: 'external',
                        link: 'https://apps.apple.com/ru/app/happ-proxy-utility-plus/id6746188973'
                    },
                    {
                        text: 'App Store (Global)',
                        type: 'external',
                        link: 'https://apps.apple.com/us/app/happ-proxy-utility/id6504287215'
                    }
                ]
            },
            {
                title: 'Подключай',
                description: 'VPN добавится в приложение автоматически.',
                buttons: [{ text: 'Подключить', type: 'subscriptionLink', link: 'happ://add/{{SUBSCRIPTION_LINK}}' }]
            }
        ]
    },
    {
        key: 'android',
        label: 'Android',
        blocks: [
            {
                title: 'Скачай приложение',
                description: 'Установите приложение из Google Play или скачайте APK напрямую.',
                buttons: [
                    {
                        text: 'Google Play',
                        type: 'external',
                        link: 'https://play.google.com/store/apps/details?id=com.happproxy'
                    },
                    {
                        text: 'Скачать APK',
                        type: 'external',
                        link: 'https://github.com/Happ-proxy/happ-android/releases/latest/download/Happ.apk'
                    }
                ]
            },
            {
                title: 'Подключай',
                description: 'VPN добавится в приложение автоматически.',
                buttons: [{ text: 'Подключить', type: 'subscriptionLink', link: 'happ://add/{{SUBSCRIPTION_LINK}}' }]
            }
        ]
    },
    {
        key: 'windows',
        label: 'Windows',
        blocks: [
            {
                title: 'Скачай приложение',
                description: 'Загрузите установщик и запустите его. Разрешите все доступы в процессе установки.',
                buttons: [
                    {
                        text: 'Скачать для Windows',
                        type: 'external',
                        link: 'https://github.com/Happ-proxy/happ-desktop/releases/latest/download/setup-Happ.x64.exe'
                    }
                ]
            },
            {
                title: 'Подключай',
                description: 'VPN добавится в приложение автоматически. Нажмите кнопку включения в приложении.',
                buttons: [{ text: 'Подключить', type: 'subscriptionLink', link: 'happ://add/{{SUBSCRIPTION_LINK}}' }]
            }
        ]
    },
    {
        key: 'macos',
        label: 'macOS',
        blocks: [
            {
                title: 'Скачай приложение',
                description: 'Установите из App Store и разрешите все доступы в процессе.',
                buttons: [
                    {
                        text: 'App Store (RU)',
                        type: 'external',
                        link: 'https://apps.apple.com/ru/app/happ-proxy-utility-plus/id6746188973'
                    },
                    {
                        text: 'App Store (Global)',
                        type: 'external',
                        link: 'https://apps.apple.com/us/app/happ-proxy-utility/id6504287215'
                    }
                ]
            },
            {
                title: 'Подключай',
                description: 'VPN добавится в приложение автоматически.',
                buttons: [{ text: 'Подключить', type: 'subscriptionLink', link: 'happ://add/{{SUBSCRIPTION_LINK}}' }]
            }
        ]
    },
    {
        key: 'linux',
        label: 'Linux',
        blocks: [
            {
                title: 'Скачай приложение',
                description: 'Выберите подходящую версию для вашего устройства и установите приложение.',
                buttons: [
                    {
                        text: 'amd64 (.deb)',
                        type: 'external',
                        link: 'https://github.com/pluralplay/FlClashX/releases/download/v0.2.1/FlClashX-0.2.1-linux-amd64.deb'
                    },
                    {
                        text: 'amd64 (AppImage)',
                        type: 'external',
                        link: 'https://github.com/pluralplay/FlClashX/releases/download/v0.2.1/FlClashX-0.2.1-linux-amd64.AppImage'
                    },
                    {
                        text: 'arm64 (.deb)',
                        type: 'external',
                        link: 'https://github.com/pluralplay/FlClashX/releases/download/v0.2.1/FlClashX-0.2.1-linux-arm64.deb'
                    }
                ]
            },
            {
                title: 'Добавь подписку',
                description: 'Нажмите кнопку ниже, чтобы добавить подписку автоматически.',
                buttons: [
                    {
                        text: 'Добавить подписку',
                        type: 'subscriptionLink',
                        link: 'flclashx://install-config?url={{SUBSCRIPTION_LINK}}'
                    }
                ]
            }
        ]
    }
]

const PLATFORM_COLORS: Record<
    string,
    { bg: string; border: string; rgb: string; shadow: string; text: string }
> = {
    ios: { border: 'rgba(255,255,255,0.5)', text: '#ffffff', bg: 'rgba(255,255,255,0.08)', shadow: 'rgba(255,255,255,0.15)', rgb: '255,255,255' },
    android: { border: '#3ddc84', text: '#3ddc84', bg: 'rgba(61,220,132,0.1)', shadow: 'rgba(61,220,132,0.25)', rgb: '61,220,132' },
    windows: { border: '#00adef', text: '#00adef', bg: 'rgba(0,173,239,0.1)', shadow: 'rgba(0,173,239,0.25)', rgb: '0,173,239' },
    macos: { border: '#007aff', text: '#007aff', bg: 'rgba(0,122,255,0.1)', shadow: 'rgba(0,122,255,0.25)', rgb: '0,122,255' },
    linux: { border: '#ffb900', text: '#ffb900', bg: 'rgba(255,185,0,0.1)', shadow: 'rgba(255,185,0,0.25)', rgb: '255,185,0' }
}

const PLATFORM_ICONS: Record<string, ({ className }: { className?: string }) => React.JSX.Element> = {
    ios: ({ className }) => <FaApple className={className} />,
    android: ({ className }) => <FaAndroid className={className} />,
    windows: ({ className }) => <FaWindows className={className} />,
    macos: ({ className }) => <TbBrandFinder className={className} />,
    linux: ({ className }) => <FaLinux className={className} />
}

function detectPlatform(): string {
    const ua = navigator.userAgent
    if (/android/i.test(ua)) return 'android'
    if (/iphone|ipad|ipod/i.test(ua)) return 'ios'
    if (/macintosh|mac os x/i.test(ua)) return 'macos'
    if (/windows/i.test(ua)) return 'windows'
    if (/linux/i.test(ua)) return 'linux'
    return 'ios'
}

export const ConnectWidget = () => {
    const subscription = useSubscription()
    const subscriptionUrl = subscription.subscriptionUrl

    const [activeKey, setActiveKey] = useState(detectPlatform)
    const [showQr, setShowQr] = useState(false)
    const [copied, setCopied] = useState(false)

    const handleCopy = () => {
        navigator.clipboard.writeText(subscriptionUrl)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    const platform = PLATFORMS.find((p) => p.key === activeKey)!
    const colors = PLATFORM_COLORS[activeKey]!

    const resolveLink = (link: string) => link.replace('{{SUBSCRIPTION_LINK}}', subscriptionUrl)

    const qrSvg = renderSVG(resolveLink('happ://add/{{SUBSCRIPTION_LINK}}'), {
        whiteColor: '#161B22',
        blackColor: '#A855F7'
    })

    return (
        <div className={classes.root}>
            <div className={classes.header}>
                <IconWifi color="#A855F7" size={16} />
                <span className={classes.headerLabel}>Подключение</span>
            </div>

            <div className={classes.body}>
                <div className={classes.layout}>
                    <div className={classes.stepsColumn}>
                        <div className={classes.switcherRow}>
                            <div className={classes.switcherIcons}>
                                {PLATFORMS.map((p) => {
                                    const Icon = PLATFORM_ICONS[p.key]!
                                    const active = activeKey === p.key
                                    const pc = PLATFORM_COLORS[p.key]!
                                    return (
                                        <div className={classes.platformBtnWrap} key={p.key}>
                                            <button
                                                className={classes.platformBtn}
                                                onClick={() => {
                                                    setActiveKey(p.key)
                                                    setShowQr(false)
                                                }}
                                                style={
                                                    active
                                                        ? {
                                                              borderColor: pc.border,
                                                              color: pc.text,
                                                              backgroundColor: pc.bg,
                                                              boxShadow: `0 0 14px ${pc.shadow}`
                                                          }
                                                        : undefined
                                                }
                                                type="button"
                                            >
                                                <Icon className={classes.platformIcon} />
                                            </button>
                                            <div className={classes.tooltip}>{p.label}</div>
                                        </div>
                                    )
                                })}
                            </div>

                            <div style={{ position: 'relative' }}>
                                <button
                                    className={`${classes.qrToggle} ${showQr ? classes.qrToggleActive : ''}`}
                                    onClick={() => setShowQr((v) => !v)}
                                    type="button"
                                >
                                    <IconQrcode size={13} />
                                    <span>Другое устройство</span>
                                </button>
                                {showQr && (
                                    <div className={classes.qrPanel}>
                                        <img
                                            alt="QR"
                                            src={`data:image/svg+xml;utf8,${encodeURIComponent(qrSvg)}`}
                                            style={{ width: 180, height: 180 }}
                                        />
                                        <span className={classes.qrPanelLabel}>
                                            Сканируй с другого устройства
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className={classes.platformFade} key={activeKey}>
                            {platform.blocks.map((block, i) => (
                                <div className={classes.step} key={i}>
                                    <div className={classes.stepNodeCol}>
                                        <div className={classes.stepNode}>
                                            <div
                                                className={classes.stepGlow}
                                                style={{ boxShadow: `0 0 18px 4px rgba(${colors.rgb},0.5)` }}
                                            />
                                            <div
                                                className={classes.stepBorder}
                                                style={{ border: `1px solid rgba(${colors.rgb},0.5)` }}
                                            />
                                            <span className={classes.stepNumber} style={{ color: colors.text }}>
                                                {i + 1}
                                            </span>
                                        </div>
                                        {i < platform.blocks.length - 1 && (
                                            <div className={classes.connectorWrap}>
                                                <NodeConnector color={colors.rgb} delay={i * 1.2} />
                                            </div>
                                        )}
                                    </div>

                                    <div className={classes.stepContent}>
                                        <span className={classes.stepTitle}>{block.title}</span>
                                        <p className={classes.stepDesc}>{block.description}</p>

                                        {block.buttons.length > 0 && (
                                            <div className={classes.buttonsRow}>
                                                <div className={classes.buttonGroup}>
                                                    {block.buttons.map((btn, j) =>
                                                        btn.type === 'subscriptionLink' ? (
                                                            <div className={classes.buttonGroup} key={j}>
                                                                <a
                                                                    className={classes.primaryBtn}
                                                                    href={resolveLink(btn.link)}
                                                                    style={{
                                                                        backgroundColor:
                                                                            colors.text === '#ffffff'
                                                                                ? '#1a1a2e'
                                                                                : colors.text,
                                                                        color:
                                                                            colors.text === '#ffffff'
                                                                                ? '#ffffff'
                                                                                : '#000000',
                                                                        boxShadow: `0 0 16px rgba(${colors.rgb},0.35)`,
                                                                        border:
                                                                            colors.text === '#ffffff'
                                                                                ? '1px solid rgba(255,255,255,0.3)'
                                                                                : 'none'
                                                                    }}
                                                                >
                                                                    <IconPlus size={13} />
                                                                    {btn.text}
                                                                </a>
                                                                <button
                                                                    className={`${classes.copyBtn} ${copied ? classes.copyBtnDone : ''}`}
                                                                    onClick={handleCopy}
                                                                    type="button"
                                                                >
                                                                    {copied ? (
                                                                        <IconCheck size={14} />
                                                                    ) : (
                                                                        <IconCopy size={14} />
                                                                    )}
                                                                    {copied ? 'Скопировано' : 'Скопировать'}
                                                                </button>
                                                            </div>
                                                        ) : (
                                                            <a
                                                                className={classes.externalBtn}
                                                                href={btn.link}
                                                                key={j}
                                                                rel="noopener noreferrer"
                                                                target="_blank"
                                                            >
                                                                <IconExternalLink size={13} />
                                                                {btn.text}
                                                            </a>
                                                        )
                                                    )}
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
