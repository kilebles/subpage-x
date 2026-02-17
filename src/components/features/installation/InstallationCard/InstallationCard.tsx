import { useDeviceDetection } from '@/hooks/useDeviceDetection'
import { DeviceSelect } from '@/components/ui/DeviceSelect'
import { InstallationStep } from '../InstallationStep'
import { DEVICE_CONFIGS } from '@/data/deviceConfigs'
import styles from './InstallationCard.module.css'

export function InstallationCard() {
  const { device, setDevice, isDetecting } = useDeviceDetection()
  const config = DEVICE_CONFIGS[device]

  if (isDetecting) {
    return (
      <div className={styles.card}>
        <div className={styles.loading}>Определение устройства...</div>
      </div>
    )
  }

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <h1 className={styles.title}>Установка</h1>
        <DeviceSelect value={device} onChange={setDevice} />
      </div>

      <div className={styles.appBanner}>
        <div className={styles.indicator} />
        <span className={styles.appName}>{config.appName}</span>
        <div className={styles.appIcon}>
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
            <path d="M8 8L24 16L8 24V8Z" fill="#30363d" />
          </svg>
        </div>
      </div>

      <div className={styles.steps}>
        {config.steps.map(step => (
          <InstallationStep key={step.number} step={step} />
        ))}
      </div>
    </div>
  )
}
