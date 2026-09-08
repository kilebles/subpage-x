import { useEffect, useRef, useState } from 'react'
import { IconCheck, IconCopy, IconExternalLink, IconPlus } from '@tabler/icons-react'
import { TSubscriptionPagePlatformKey } from '@remnawave/subscription-page-types'
import { FaAndroid, FaApple, FaLinux, FaWindows } from 'react-icons/fa'
import { TbBrandFinder } from 'react-icons/tb'

import { constructSubscriptionUrl } from '@shared/utils/construct-subscription-url'
import { getIconFromLibrary } from '@shared/utils/config-parser'
import { TemplateEngine } from '@shared/utils/template-engine'
import { useSubscription } from '@entities/subscription-info-store'
import { useAppConfig } from '@entities/app-config-store'
import { useTranslation } from '@shared/hooks'
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

const PLATFORM_KEYS: TSubscriptionPagePlatformKey[] = ['ios', 'android', 'windows', 'macos', 'linux']

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

function detectPlatform(): TSubscriptionPagePlatformKey {
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
    const { platforms, svgLibrary } = useAppConfig()
    const { t } = useTranslation()

    const subscriptionUrl = constructSubscriptionUrl(window.location.href, subscription.user.shortUuid)

    const availableKeys = PLATFORM_KEYS.filter((key) => (platforms[key]?.apps.length ?? 0) > 0)

    const [activeKey, setActiveKey] = useState<TSubscriptionPagePlatformKey>(() => {
        const detected = detectPlatform()
        return availableKeys.includes(detected) ? detected : availableKeys[0]!
    })
    const [copied, setCopied] = useState(false)

    const apps = platforms[activeKey]?.apps ?? []
    const defaultAppIndex = (key: TSubscriptionPagePlatformKey, list: typeof apps) => {
        if (key !== 'ios') return 0
        const incyIndex = list.findIndex((a) => a.name.toUpperCase() === 'INCY')
        return incyIndex >= 0 ? incyIndex : 0
    }
    const [selectedAppIndex, setSelectedAppIndex] = useState(() => defaultAppIndex(activeKey, apps))

    useEffect(() => {
        setSelectedAppIndex(defaultAppIndex(activeKey, platforms[activeKey]?.apps ?? []))
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activeKey])

    const app = apps[selectedAppIndex] ?? apps[0]
    const blocks = app?.blocks ?? []
    const colors = PLATFORM_COLORS[activeKey]!

    const resolveLink = (link: string) =>
        TemplateEngine.formatWithMetaInfo(link, {
            subscriptionUrl,
            username: subscription.user.username
        })

    const handleCopy = (link: string) => {
        navigator.clipboard.writeText(link)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    if (availableKeys.length === 0) return null

    return (
        <div className={classes.root}>
            <div className={classes.body}>
                <div className={classes.layout}>
                    <div className={classes.stepsColumn}>
                        <div className={classes.switcherRow}>
                            <div className={classes.switcherIcons}>
                                {availableKeys.map((key) => {
                                    const Icon = PLATFORM_ICONS[key]!
                                    const active = activeKey === key
                                    const pc = PLATFORM_COLORS[key]!
                                    return (
                                        <div className={classes.platformBtnWrap} key={key}>
                                            <button
                                                className={classes.platformBtn}
                                                onClick={() => setActiveKey(key)}
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
                                            <div className={classes.tooltip}>{t(platforms[key]!.displayName)}</div>
                                        </div>
                                    )
                                })}
                            </div>

                            {apps.length > 1 && (
                                <div className={classes.appSwitcher}>
                                    {apps.map((appOption, index) => {
                                        const activeApp = index === selectedAppIndex
                                        const icon = appOption.svgIconKey
                                            ? getIconFromLibrary(appOption.svgIconKey, svgLibrary)
                                            : null
                                        return (
                                            <div className={classes.appBtnWrap} key={appOption.name}>
                                                <button
                                                    className={`${classes.appBtn} ${activeApp ? classes.appBtnActive : ''}`}
                                                    onClick={() => setSelectedAppIndex(index)}
                                                    type="button"
                                                >
                                                    {icon && (
                                                        <span
                                                            className={classes.appIcon}
                                                            dangerouslySetInnerHTML={{ __html: icon }}
                                                        />
                                                    )}
                                                </button>
                                                <div className={classes.tooltip}>{appOption.name}</div>
                                            </div>
                                        )
                                    })}
                                </div>
                            )}
                        </div>

                        <div className={classes.platformFade} key={activeKey}>
                            {blocks.map((block, i) => (
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
                                        {i < blocks.length - 1 && (
                                            <div className={classes.connectorWrap}>
                                                <NodeConnector color={colors.rgb} delay={i * 1.2} />
                                            </div>
                                        )}
                                    </div>

                                    <div className={classes.stepContent}>
                                        <span className={classes.stepTitle}>{t(block.title)}</span>
                                        <p className={classes.stepDesc}>{t(block.description)}</p>

                                        {block.buttons.length > 0 && (
                                            <div className={classes.buttonsRow}>
                                                <div className={classes.buttonGroup}>
                                                    {block.buttons.map((btn, j) => {
                                                        if (btn.type === 'subscriptionLink') {
                                                            const link = resolveLink(btn.link)
                                                            return (
                                                                <a
                                                                    className={classes.primaryBtn}
                                                                    href={link}
                                                                    key={j}
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
                                                                    {t(btn.text)}
                                                                </a>
                                                            )
                                                        }

                                                        if (btn.type === 'copyButton') {
                                                            const link = resolveLink(btn.link)
                                                            return (
                                                                <button
                                                                    className={`${classes.copyBtn} ${copied ? classes.copyBtnDone : ''}`}
                                                                    key={j}
                                                                    onClick={() => handleCopy(link)}
                                                                    type="button"
                                                                >
                                                                    {copied ? <IconCheck size={14} /> : <IconCopy size={14} />}
                                                                    {t(btn.text)}
                                                                </button>
                                                            )
                                                        }

                                                        return (
                                                            <a
                                                                className={classes.externalBtn}
                                                                href={btn.link}
                                                                key={j}
                                                                rel="noopener noreferrer"
                                                                target="_blank"
                                                            >
                                                                <IconExternalLink size={13} />
                                                                {t(btn.text)}
                                                            </a>
                                                        )
                                                    })}
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
