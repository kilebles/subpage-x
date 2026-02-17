export type DeviceType = 'macos' | 'ios' | 'android' | 'windows' | 'linux'

export interface DeviceInfo {
  type: DeviceType
  label: string
  icon: string
}

export interface DeviceConfig {
  type: DeviceType
  label: string
  appName: string
  steps: StepConfig[]
}

export interface StepConfig {
  number: number
  title: string
  description: string
  buttons: ButtonConfig[]
}

export interface ButtonConfig {
  label: string
  icon: 'external' | 'plus'
  url?: string
  action?: string
}
