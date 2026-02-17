import { useState, useRef, useEffect } from 'react'
import type { DeviceType } from '@/types/device'
import { DEVICE_OPTIONS } from '@/data/deviceConfigs'
import { ChevronDownIcon, MacOSIcon, IOSIcon, AndroidIcon, WindowsIcon, LinuxIcon } from '@/components/ui/Icons'
import styles from './DeviceSelect.module.css'

interface DeviceSelectProps {
  value: DeviceType
  onChange: (device: DeviceType) => void
}

const DEVICE_ICONS: Record<DeviceType, React.ComponentType<{ size?: number }>> = {
  macos: MacOSIcon,
  ios: IOSIcon,
  android: AndroidIcon,
  windows: WindowsIcon,
  linux: LinuxIcon,
}

export function DeviceSelect({ value, onChange }: DeviceSelectProps) {
  const [isOpen, setIsOpen] = useState(false)
  const selectRef = useRef<HTMLDivElement>(null)

  const selectedOption = DEVICE_OPTIONS.find(opt => opt.type === value)
  const SelectedIcon = DEVICE_ICONS[value]

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div className={styles.container} ref={selectRef}>
      <button
        className={styles.trigger}
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
      >
        <SelectedIcon size={20} />
        <span>{selectedOption?.label}</span>
        <ChevronDownIcon size={16} className={isOpen ? styles.chevronOpen : ''} />
      </button>
      {isOpen && (
        <div className={styles.dropdown}>
          {DEVICE_OPTIONS.map(option => {
            const Icon = DEVICE_ICONS[option.type]
            return (
              <button
                key={option.type}
                className={`${styles.option} ${option.type === value ? styles.selected : ''}`}
                onClick={() => {
                  onChange(option.type)
                  setIsOpen(false)
                }}
              >
                <Icon size={20} />
                <span>{option.label}</span>
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
