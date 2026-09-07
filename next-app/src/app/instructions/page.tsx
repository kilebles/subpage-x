'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { ChevronLeft, Plus, ArrowUp } from 'lucide-react'
import { useRef } from 'react'
import { FadeIn } from '@/components/FadeIn'
import { TbBrandFinder } from 'react-icons/tb'
import { FaAndroid, FaWindows, FaLinux, FaApple } from 'react-icons/fa'
import { createPortal } from 'react-dom'

const PLATFORM_ICONS: Record<string, React.ReactNode> = {
  macos:   <TbBrandFinder className="w-4 h-4" />,
  ios:     <FaApple className="w-4 h-4" />,
  android: <FaAndroid className="w-4 h-4" />,
  windows: <FaWindows className="w-4 h-4" />,
  linux:   <FaLinux className="w-4 h-4" />,
}

const PLATFORM_COLORS: Record<string, string> = {
  macos:   '#007aff',
  ios:     '#666666',
  android: '#3ddc84',
  windows: '#00adef',
  linux:   '#ffb900',
}

interface Device {
  key: string
  label: string
  platform: string
  articles: { key: string; title: string }[]
}

interface Section {
  key: string
  title: string
  description: string
  devices: Device[]
}

const SECTIONS: Section[] = [
  {
    key: 'first-connect',
    title: 'Первое подключение',
    description: 'Подключите VPN на своём устройстве впервые',
    devices: [
      { key: 'macos',   label: 'macOS',   platform: 'macos',   articles: [{ key: 'macos-happ',    title: 'Happ' }] },
      { key: 'ios',     label: 'iOS',     platform: 'ios',     articles: [{ key: 'ios-happ',      title: 'Happ' }] },
      { key: 'android', label: 'Android', platform: 'android', articles: [{ key: 'android-happ',  title: 'Happ' }] },
      { key: 'windows', label: 'Windows', platform: 'windows', articles: [{ key: 'windows-happ',  title: 'Happ' }] },
      { key: 'linux',   label: 'Linux',   platform: 'linux',   articles: [{ key: 'linux-flclash', title: 'FlClashX' }] },
    ],
  },
  {
    key: 'change-region',
    title: 'Смена региона Apple ID',
    description: 'Смените регион аккаунта Apple для скачивания Happ, ChatGPT и др. приложений',
    devices: [
      { key: 'ios-region', label: 'iOS', platform: 'ios', articles: [{ key: 'ios-change-region', title: 'Смена региона' }] },
    ],
  },
]

export default function InstructionsPage() {
  return <Suspense><InstructionsPageInner /></Suspense>
}

function InstructionsPageInner() {
  const searchParams = useSearchParams()
  const [activeArticle, setActiveArticle] = useState<string | null>(null)
  const [showScrollTop, setShowScrollTop] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const article = searchParams.get('article')
    if (article) setActiveArticle(article)
  }, [searchParams])

  useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    const onScroll = () => setShowScrollTop(el.scrollTop > 300)
    el.addEventListener('scroll', onScroll)
    return () => el.removeEventListener('scroll', onScroll)
  }, [activeArticle])

  return (
    <div className="h-screen flex flex-col">
      <Header />
      <div ref={scrollRef} className="flex-1 flex flex-col min-h-0 overflow-y-auto relative">

        {activeArticle === null ? (
          <FadeIn className="px-4 sm:px-6 md:px-12 py-6 sm:py-8 md:py-10 flex flex-col gap-0">
            <div>
              {SECTIONS.map((section, i) => (
                <SectionRow
                  key={section.key}
                  section={section}
                  onSelect={setActiveArticle}
                  delay={i * 80}
                />
              ))}
            </div>
          </FadeIn>
        ) : (
          <FadeIn className="px-4 sm:px-6 md:px-12 py-6 sm:py-8 md:py-10 w-full max-w-4xl flex flex-col gap-8">
            <button
              onClick={() => setActiveArticle(null)}
              className="flex items-center gap-2 font-mono text-sm tracking-widest uppercase text-foreground/30 hover:text-foreground/70 transition-colors w-fit"
            >
              <ChevronLeft size={16} />
              Все инструкции
            </button>

            {activeArticle === 'macos-happ'        && <MacosHappGuide        subscriptionUrl="" />}
            {activeArticle === 'ios-happ'          && <IosHappGuide          subscriptionUrl="" />}
            {activeArticle === 'android-happ'      && <AndroidHappGuide      subscriptionUrl="" />}
            {activeArticle === 'windows-happ'      && <WindowsHappGuide      subscriptionUrl="" />}
            {activeArticle === 'ios-change-region' && <IosChangeRegionGuide />}
          </FadeIn>
        )}

        {showScrollTop && activeArticle && (
          <button
            onClick={() => scrollRef.current?.scrollTo({ top: 0, behavior: 'smooth' })}
            className="fixed bottom-4 right-4 sm:bottom-8 sm:right-8 w-10 h-10 sm:w-11 sm:h-11 flex items-center justify-center border border-border bg-card text-foreground/40 hover:text-foreground hover:border-foreground/40 transition-all duration-200 z-50"
          >
            <ArrowUp size={16} />
          </button>
        )}
      </div>
      <Footer />
    </div>
  )
}

// ── переиспользуем те же компоненты что и в dashboard ──

function SectionRow({ section, onSelect, delay }: {
  section: Section
  onSelect: (key: string) => void
  delay: number
}) {
  const [expanded, setExpanded] = useState(false)
  const [visible, setVisible] = useState(false)
  const [hovered, setHovered] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), delay)
    return () => clearTimeout(t)
  }, [delay])

  function handleClick() {
    if (section.devices.length === 1) {
      onSelect(section.devices[0].articles[0].key)
    } else {
      setExpanded(v => !v)
    }
  }

  return (
    <div style={{ opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(12px)', transition: 'opacity 0.45s cubic-bezier(0.4,0,0.2,1), transform 0.45s cubic-bezier(0.4,0,0.2,1)' }}>
      <button
        onClick={handleClick}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className="w-full flex items-center gap-6 px-2 py-5 group transition-colors duration-150 text-left relative"
        style={{ background: hovered ? 'rgba(168,85,247,0.03)' : 'transparent' }}
      >
        <div className="absolute left-0 top-0 bottom-0 w-[2px] transition-all duration-200" style={{ background: hovered ? '#A855F7' : 'transparent' }} />
        <div className="flex-1 grid grid-cols-1 sm:grid-cols-[280px_1fr] sm:items-center gap-1 sm:gap-6">
          <span className="font-sans text-lg font-light text-foreground group-hover:text-foreground/80 transition-colors">{section.title}</span>
          <span className="font-mono text-sm tracking-wide text-foreground/60">{section.description}</span>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {section.devices.length === 1 ? (
            <FaApple className="w-5 h-5 text-foreground/50 group-hover:text-foreground/80 transition-colors" />
          ) : (
            <div className="flex items-center gap-2">
              {!expanded && section.devices.map(device => (
                <span key={device.key} style={{ color: PLATFORM_COLORS[device.platform] }} className="opacity-70 group-hover:opacity-100 transition-opacity [&>svg]:w-5 [&>svg]:h-5">
                  {PLATFORM_ICONS[device.platform]}
                </span>
              ))}
              <ChevronLeft size={14} className="text-foreground/20 group-hover:text-foreground/50 transition-all duration-200" style={{ transform: expanded ? 'rotate(-90deg)' : 'rotate(180deg)' }} />
            </div>
          )}
        </div>
      </button>

      {expanded && section.devices.length > 1 && (
        <div className="pb-4 pl-4 sm:pl-14 flex flex-wrap gap-2">
          {section.devices.map(device => {
            const color = PLATFORM_COLORS[device.platform]
            return (
              <button
                key={device.key}
                onClick={() => onSelect(device.articles[0].key)}
                className="flex items-center gap-2 px-4 py-2 border transition-all duration-150 group/btn"
                style={{ borderColor: `${color}25` }}
                onMouseEnter={e => (e.currentTarget.style.borderColor = `${color}70`)}
                onMouseLeave={e => (e.currentTarget.style.borderColor = `${color}25`)}
              >
                <span style={{ color }}>{PLATFORM_ICONS[device.platform]}</span>
                <span className="font-mono text-sm text-foreground/60 group-hover/btn:text-foreground transition-colors tracking-wide">{device.label}</span>
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}

function GuideImage({ src, alt, maxWidth }: { src: string; alt: string; maxWidth?: number }) {
  const [open, setOpen] = useState(false)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (!open) return
    const t = requestAnimationFrame(() => setVisible(true))
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') handleClose() }
    document.addEventListener('keydown', onKey)
    return () => { cancelAnimationFrame(t); document.removeEventListener('keydown', onKey) }
  }, [open])

  function handleClose() {
    setVisible(false)
    setTimeout(() => setOpen(false), 250)
  }

  return (
    <>
      <div className="mt-4 overflow-hidden rounded-lg flex justify-start cursor-zoom-in" onClick={() => setOpen(true)}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} alt={alt} className="object-cover max-w-full" style={{ maxWidth: maxWidth ? `${maxWidth}px` : '100%' }} onError={e => { (e.target as HTMLImageElement).style.display = 'none' }} />
      </div>
      {open && typeof document !== 'undefined' && createPortal(
        <div className="cursor-zoom-out" style={{ position: 'fixed', inset: 0, zIndex: 9999, background: `rgba(0,0,0,${visible ? 0.85 : 0})`, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px', transition: 'background 0.25s ease' }} onClick={handleClose}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={src} alt={alt} style={{ maxWidth: '90vw', maxHeight: '90vh', objectFit: 'contain', borderRadius: '8px', opacity: visible ? 1 : 0, transform: visible ? 'scale(1)' : 'scale(0.92)', transition: 'opacity 0.25s ease, transform 0.25s ease' }} />
        </div>,
        document.body
      )}
    </>
  )
}

function Step({ index, color, title, children }: { index: number; color: string; title: string; children: React.ReactNode }) {
  return (
    <FadeIn delay={index * 60}>
      <div className="flex gap-4 sm:gap-5">
        <div className="shrink-0 w-7 h-7 flex items-center justify-center mt-0.5" style={{ border: `1px solid ${color}40`, boxShadow: `0 0 10px ${color}20` }}>
          <span className="font-mono text-xs" style={{ color }}>{index}</span>
        </div>
        <div className="flex flex-col gap-3 flex-1 min-w-0">
          <h2 className="font-mono text-sm sm:text-base tracking-widest uppercase text-foreground/90">{title}</h2>
          <div className="font-mono text-sm sm:text-base text-foreground/50 leading-relaxed">{children}</div>
        </div>
      </div>
    </FadeIn>
  )
}

function MacosHappGuide({ subscriptionUrl }: { subscriptionUrl: string }) {
  return (
    <article className="flex flex-col gap-8">
      <div className="flex flex-col gap-2 pb-6 border-b border-border">
        <div className="flex items-center gap-2 mb-1">
          <TbBrandFinder className="w-4 h-4 text-[#007aff]" />
          <span className="font-mono text-sm tracking-[0.3em] uppercase text-[#007aff]">macOS</span>
        </div>
        <h1 className="font-sans text-2xl sm:text-4xl font-light text-foreground">Подключение через Happ</h1>
      </div>
      <div className="flex flex-col gap-8">
        <Step index={1} color="#007aff" title="Скачайте приложение Happ">
          <p>Выберите версию App Store: если вы в России — <strong className="text-foreground/80 font-normal">RU</strong>, если вне России — <strong className="text-foreground/80 font-normal">Global</strong>.</p>
          <div className="flex flex-wrap gap-3 mt-4">
            <a href="https://apps.apple.com/ru/app/happ-proxy-utility-plus/id6746188973" target="_blank" rel="noopener noreferrer" className="font-mono text-xs tracking-widest uppercase px-5 py-2.5 border border-[#007aff]/50 text-[#007aff] hover:bg-[#007aff]/10 transition-colors">App Store RU</a>
            <a href="https://apps.apple.com/us/app/happ-proxy-utility/id6504287215" target="_blank" rel="noopener noreferrer" className="font-mono text-xs tracking-widest uppercase px-5 py-2.5 border border-foreground/15 text-foreground/50 hover:border-foreground/30 hover:text-foreground/80 transition-colors">App Store Global</a>
          </div>
        </Step>
        <Step index={2} color="#007aff" title="Откройте приложение в Mac App Store">
          <p>После нажатия вас перенаправит на официальную страницу приложения в браузере. Нажмите на синюю кнопку <strong className="text-foreground/80 font-normal">"Просмотреть в Mac App Store"</strong> и откройте приложение в App Store.</p>
          <GuideImage src="/macos/step2.png" alt="Страница Happ в браузере" />
        </Step>
        <Step index={3} color="#007aff" title="Скачайте приложение из App Store">
          <p>Нажмите кнопку «Загрузить» и дождитесь окончания установки.</p>
          <GuideImage src="/macos/step3.png" alt="Happ в App Store" />
        </Step>
        <Step index={4} color="#007aff" title='Нажмите кнопку "Подключить"'>
          <p>Если приложение установлено — серверы добавятся автоматически.</p>
          {subscriptionUrl && (
            <div className="mt-4">
              <a href={`happ://add/${subscriptionUrl}`} className="font-mono text-xs tracking-widest uppercase text-white px-6 h-11 inline-flex items-center gap-2 transition-all duration-200 hover:brightness-125" style={{ backgroundColor: '#007aff', boxShadow: '0 0 16px rgba(0,122,255,0.35)' }}>
                <Plus size={13} />Подключить
              </a>
            </div>
          )}
        </Step>
        <Step index={5} color="#007aff" title="Включите VPN">
          <p>Нажмите на кнопку включения в приложении Happ. При включении Happ может запросить разрешение — разрешайте всё.</p>
          <GuideImage src="/macos/step5.png" alt="Запрос разрешения" />
        </Step>
        <Step index={6} color="#007aff" title="Готово">
          <p>VPN подключён. Happ покажет активное соединение.</p>
          <GuideImage src="/macos/step6.png" alt="Подключённый Happ" />
        </Step>
      </div>
    </article>
  )
}

function IosHappGuide({ subscriptionUrl }: { subscriptionUrl: string }) {
  return (
    <article className="flex flex-col gap-8">
      <div className="flex flex-col gap-2 pb-6 border-b border-border">
        <div className="flex items-center gap-2 mb-1">
          <FaApple className="w-4 h-4 text-foreground/60" />
          <span className="font-mono text-sm tracking-[0.3em] uppercase text-foreground/60">iOS</span>
        </div>
        <h1 className="font-sans text-2xl sm:text-4xl font-light text-foreground">Подключение через Happ</h1>
      </div>
      <div className="flex flex-col gap-8">
        <Step index={1} color="#888888" title="Скачайте приложение Happ">
          <p>Выберите версию App Store: если вы в России — <strong className="text-foreground/80 font-normal">RU</strong>, если вне России — <strong className="text-foreground/80 font-normal">Global</strong>.</p>
          <div className="flex flex-wrap gap-3 mt-4">
            <a href="https://apps.apple.com/ru/app/happ-proxy-utility-plus/id6746188973" target="_blank" rel="noopener noreferrer" className="font-mono text-xs tracking-widest uppercase px-5 py-2.5 border border-foreground/30 text-foreground/60 hover:border-foreground/50 hover:text-foreground/90 transition-colors">App Store RU</a>
            <a href="https://apps.apple.com/us/app/happ-proxy-utility/id6504287215" target="_blank" rel="noopener noreferrer" className="font-mono text-xs tracking-widest uppercase px-5 py-2.5 border border-foreground/15 text-foreground/40 hover:border-foreground/30 hover:text-foreground/70 transition-colors">App Store Global</a>
          </div>
          <GuideImage src="/ios/1.PNG" alt="Happ в App Store" maxWidth={260} />
        </Step>
        <Step index={2} color="#888888" title='Нажмите кнопку "Подключить"'>
          <p>После установки откройте приложение. Нажмите кнопку ниже — серверы TunnelX добавятся автоматически.</p>
          {subscriptionUrl && (
            <div className="mt-4">
              <a href={`happ://add/${subscriptionUrl}`} className="font-mono text-xs tracking-widest uppercase px-6 h-11 inline-flex items-center gap-2 transition-all duration-200 hover:brightness-125" style={{ backgroundColor: 'rgba(255,255,255,0.12)', color: '#ffffff', boxShadow: '0 0 16px rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.25)' }}>
                <Plus size={13} />Подключить
              </a>
            </div>
          )}
          <GuideImage src="/ios/2.PNG" alt="Серверы TunnelX в Happ" maxWidth={260} />
        </Step>
        <Step index={3} color="#888888" title="Разрешите добавление VPN">
          <p>Happ запросит разрешение на добавление конфигурации VPN. Нажмите <strong className="text-foreground/80 font-normal">«Разрешить»</strong>.</p>
          <GuideImage src="/ios/3.PNG" alt="Запрос разрешения VPN" maxWidth={260} />
        </Step>
        <Step index={4} color="#888888" title="Введите код-пароль iPhone">
          <p>iOS попросит подтвердить добавление VPN-конфигурации кодом-паролем устройства. Введите свой PIN-код.</p>
          <GuideImage src="/ios/4.PNG" alt="Ввод код-пароля iPhone" maxWidth={260} />
        </Step>
        <Step index={5} color="#888888" title="Готово">
          <p>VPN подключён — кнопка питания загорится, таймер покажет время соединения. В статус-баре появится значок VPN.</p>
          <GuideImage src="/ios/5.PNG" alt="Happ подключён" maxWidth={260} />
        </Step>
      </div>
    </article>
  )
}

function AndroidHappGuide({ subscriptionUrl }: { subscriptionUrl: string }) {
  return (
    <article className="flex flex-col gap-8">
      <div className="flex flex-col gap-2 pb-6 border-b border-border">
        <div className="flex items-center gap-2 mb-1">
          <FaAndroid className="w-4 h-4 text-[#3ddc84]" />
          <span className="font-mono text-sm tracking-[0.3em] uppercase text-[#3ddc84]">Android</span>
        </div>
        <h1 className="font-sans text-2xl sm:text-4xl font-light text-foreground">Подключение через Happ</h1>
      </div>
      <div className="flex flex-col gap-8">
        <Step index={1} color="#3ddc84" title="Скачайте приложение Happ">
          <p>Установите приложение из Google Play или скачайте APK напрямую, если Google Play недоступен.</p>
          <div className="flex flex-wrap gap-3 mt-4">
            <a href="https://play.google.com/store/apps/details?id=com.happproxy" target="_blank" rel="noopener noreferrer" className="font-mono text-xs tracking-widest uppercase px-5 py-2.5 border border-[#3ddc84]/50 text-[#3ddc84] hover:bg-[#3ddc84]/10 transition-colors">Google Play</a>
            <a href="https://github.com/Happ-proxy/happ-android/releases/latest/download/Happ.apk" target="_blank" rel="noopener noreferrer" className="font-mono text-xs tracking-widest uppercase px-5 py-2.5 border border-foreground/15 text-foreground/50 hover:border-foreground/30 hover:text-foreground/80 transition-colors">Скачать APK</a>
          </div>
          <GuideImage src="/android/1.1.png" alt="Happ в Google Play" maxWidth={260} />
        </Step>
        <Step index={2} color="#3ddc84" title='Нажмите кнопку "Подключить"'>
          <p>После установки откройте приложение. Нажмите кнопку ниже — серверы добавятся автоматически.</p>
          {subscriptionUrl && (
            <div className="mt-4">
              <a href={`happ://add/${subscriptionUrl}`} className="font-mono text-xs tracking-widest uppercase text-white px-6 h-11 inline-flex items-center gap-2 transition-all duration-200 hover:brightness-125" style={{ backgroundColor: '#3ddc84', color: '#000', boxShadow: '0 0 16px rgba(61,220,132,0.35)' }}>
                <Plus size={13} />Подключить
              </a>
            </div>
          )}
          <GuideImage src="/android/2.1.png" alt="Главный экран Happ" maxWidth={260} />
        </Step>
        <Step index={3} color="#3ddc84" title="Серверы добавлены">
          <p>После нажатия подписка TunnelX загрузится автоматически — вы увидите список серверов в приложении. Нажмите на кнопку питания чтобы включить VPN.</p>
          <GuideImage src="/android/3.1.png" alt="Серверы TunnelX в Happ" maxWidth={260} />
        </Step>
        <Step index={4} color="#3ddc84" title="Разрешите подключение VPN">
          <p>Android покажет системный запрос на создание VPN-соединения. Нажмите <strong className="text-foreground/80 font-normal">«ОК»</strong>.</p>
          <GuideImage src="/android/4.1.png" alt="Запрос разрешения VPN" maxWidth={260} />
        </Step>
        <Step index={5} color="#3ddc84" title="Готово">
          <p>VPN подключён — кнопка питания загорится, таймер покажет время соединения.</p>
          <GuideImage src="/android/5.1.png" alt="Happ подключён" maxWidth={260} />
        </Step>
      </div>
    </article>
  )
}

function WindowsHappGuide({ subscriptionUrl }: { subscriptionUrl: string }) {
  return (
    <article className="flex flex-col gap-8">
      <div className="flex flex-col gap-2 pb-6 border-b border-border">
        <div className="flex items-center gap-2 mb-1">
          <FaWindows className="w-4 h-4 text-[#00adef]" />
          <span className="font-mono text-sm tracking-[0.3em] uppercase text-[#00adef]">Windows</span>
        </div>
        <h1 className="font-sans text-2xl sm:text-4xl font-light text-foreground">Подключение через Happ</h1>
      </div>
      <div className="flex flex-col gap-8">
        <Step index={1} color="#00adef" title="Скачайте установщик Happ">
          <p>Нажмите кнопку ниже — загрузится файл <strong className="text-foreground/80 font-normal">setup-Happ.x64.exe</strong>.</p>
          <div className="mt-4">
            <a href="https://github.com/Happ-proxy/happ-desktop/releases/latest/download/setup-Happ.x64.exe" target="_blank" rel="noopener noreferrer" className="font-mono text-xs tracking-widest uppercase px-5 py-2.5 border border-[#00adef]/50 text-[#00adef] hover:bg-[#00adef]/10 transition-colors inline-block">Скачать для Windows</a>
          </div>
          <GuideImage src="/windows/1.png" alt="Файл setup-Happ.x64 в проводнике" maxWidth={480} />
        </Step>
        <Step index={2} color="#00adef" title="Запустите установщик">
          <p>Дважды кликните по файлу. Windows покажет предупреждение — нажмите <strong className="text-foreground/80 font-normal">«Запустить»</strong>.</p>
          <GuideImage src="/windows/2.png" alt="Предупреждение безопасности Windows" maxWidth={400} />
        </Step>
        <Step index={3} color="#00adef" title="Выберите язык"><p>Оставьте <strong className="text-foreground/80 font-normal">Русский</strong> и нажмите <strong className="text-foreground/80 font-normal">«ОК»</strong>.</p><GuideImage src="/windows/3.png" alt="Выбор языка" maxWidth={280} /></Step>
        <Step index={4} color="#00adef" title="Выберите папку установки"><p>Оставьте путь по умолчанию и нажмите <strong className="text-foreground/80 font-normal">«Далее»</strong>.</p><GuideImage src="/windows/4.png" alt="Папка установки" maxWidth={440} /></Step>
        <Step index={5} color="#00adef" title="Папка в меню Пуск"><p>Оставьте по умолчанию и нажмите <strong className="text-foreground/80 font-normal">«Далее»</strong>.</p><GuideImage src="/windows/5.png" alt="Меню Пуск" maxWidth={440} /></Step>
        <Step index={6} color="#00adef" title="Дополнительные параметры"><p>Нажмите <strong className="text-foreground/80 font-normal">«Далее»</strong>.</p><GuideImage src="/windows/6.png" alt="Доп параметры" maxWidth={440} /></Step>
        <Step index={7} color="#00adef" title="Подтвердите установку"><p>Нажмите <strong className="text-foreground/80 font-normal">«Установить»</strong>.</p><GuideImage src="/windows/7.png" alt="Установка" maxWidth={440} /></Step>
        <Step index={8} color="#00adef" title="Дождитесь завершения"><p>Установщик распакует файлы.</p><GuideImage src="/windows/8.png" alt="Процесс" maxWidth={440} /></Step>
        <Step index={9} color="#00adef" title="Завершите установку"><p>Нажмите <strong className="text-foreground/80 font-normal">«Завершить»</strong>.</p><GuideImage src="/windows/9.png" alt="Завершение" maxWidth={440} /></Step>
        <Step index={10} color="#00adef" title='Нажмите кнопку "Подключить"'>
          <p>Запустите Happ. Нажмите кнопку ниже — серверы TunnelX добавятся автоматически.</p>
          {subscriptionUrl && (
            <div className="mt-4">
              <a href={`happ://add/${subscriptionUrl}`} className="font-mono text-xs tracking-widest uppercase text-white px-6 h-11 inline-flex items-center gap-2 transition-all duration-200 hover:brightness-125" style={{ backgroundColor: '#00adef', color: '#000', boxShadow: '0 0 16px rgba(0,173,239,0.35)' }}>
                <Plus size={13} />Подключить
              </a>
            </div>
          )}
          <GuideImage src="/windows/10.png" alt="Happ с серверами TunnelX" maxWidth={560} />
        </Step>
      </div>
    </article>
  )
}

function IosChangeRegionGuide() {
  return (
    <article className="flex flex-col gap-8">
      <div className="flex flex-col gap-2 pb-6 border-b border-border">
        <h1 className="font-sans text-2xl sm:text-4xl font-light text-foreground">Смена региона Apple ID</h1>
        <p className="font-mono text-sm text-foreground/40 leading-relaxed mt-1">Если при загрузке Happ появляется сообщение «Приложение недоступно» — смените регион на Казахстан.</p>
      </div>
      <div className="flex flex-col gap-8">
        <Step index={1} color="#888888" title="Откройте App Store и перейдите в аккаунт"><p>Нажмите на иконку своего аккаунта в правом верхнем углу.</p><GuideImage src="/change-region/9.jpg" alt="Иконка аккаунта" maxWidth={260} /></Step>
        <Step index={2} color="#888888" title="Перейдите в настройки учётной записи"><p>Нажмите на своё имя вверху.</p><GuideImage src="/change-region/2.jpg" alt="Настройки учётной записи" maxWidth={260} /></Step>
        <Step index={3} color="#888888" title='Нажмите "Страна/регион"'><p>Найдите строку <strong className="text-foreground/80 font-normal">«Страна/регион»</strong> и нажмите на неё.</p><GuideImage src="/change-region/2.jpg" alt="Страна/регион" maxWidth={260} /></Step>
        <Step index={4} color="#888888" title="Выберите Казахстан"><p>Введите в поиске <strong className="text-foreground/80 font-normal">«Каз»</strong> и выберите <strong className="text-foreground/80 font-normal">Казахстан</strong>.</p><GuideImage src="/change-region/3.jpg" alt="Список стран" maxWidth={260} /><GuideImage src="/change-region/4.jpg" alt="Поиск Казахстана" maxWidth={260} /></Step>
        <Step index={5} color="#888888" title="Подтвердите смену региона"><p>Нажмите <strong className="text-foreground/80 font-normal">«Продолжить»</strong>.</p><GuideImage src="/change-region/5.jpg" alt="Подтверждение" maxWidth={260} /></Step>
        <Step index={6} color="#888888" title="Примите условия использования"><p>Нажмите <strong className="text-foreground/80 font-normal">«Принять»</strong>.</p><GuideImage src="/change-region/6.jpg" alt="Условия" maxWidth={260} /></Step>
        <Step index={7} color="#888888" title="Укажите платёжные данные">
          <p>Выберите <strong className="text-foreground/80 font-normal">«None»</strong> и заполните адрес:</p>
          <div className="mt-3 px-4 py-3 border border-foreground/10 font-mono text-sm text-foreground/50 flex flex-col gap-1">
            <span>Street: Tunnelx</span><span>City/Town: Tunnelx</span><span>Region: Almaty</span><span>Postcode: 050000</span><span>Phone: 7 123123123</span>
          </div>
          <GuideImage src="/change-region/7.jpg" alt="Платёжные данные" maxWidth={260} />
        </Step>
        <Step index={8} color="#888888" title="Готово"><p>Регион изменён на <strong className="text-foreground/80 font-normal">Казахстан</strong>. Теперь можно скачать Happ.</p><GuideImage src="/change-region/8.jpg" alt="Kazakhstan" maxWidth={260} /></Step>
      </div>
    </article>
  )
}
