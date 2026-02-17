import type { StepConfig } from '@/types/device'
import { useUser } from '@/context/UserContext'
import { Button } from '@/components/ui/Button'
import styles from './InstallationStep.module.css'

interface InstallationStepProps {
  step: StepConfig
}

export function InstallationStep({ step }: InstallationStepProps) {
  const { user } = useUser()

  const getButtonHref = (button: StepConfig['buttons'][0]): string | undefined => {
    // Если это кнопка "Подключить" (action: connect), используем crypto_link
    if (button.action === 'connect' && user?.crypto_link) {
      return user.crypto_link
    }
    return button.url
  }

  return (
    <div className={styles.step}>
      <div className={styles.numberWrapper}>
        <div className={styles.number}>{step.number}</div>
        {step.number < 2 && <div className={styles.line} />}
      </div>
      <div className={styles.content}>
        <h3 className={styles.title}>{step.title}</h3>
        <p className={styles.description}>{step.description}</p>
        <div className={styles.buttons}>
          {step.buttons.map((button, index) => (
            <Button
              key={index}
              icon={button.icon}
              href={getButtonHref(button)}
            >
              {button.label}
            </Button>
          ))}
        </div>
      </div>
    </div>
  )
}
