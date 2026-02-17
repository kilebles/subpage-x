import type { DeviceConfig, DeviceInfo } from '@/types/device'

export const DEVICE_OPTIONS: DeviceInfo[] = [
  { type: 'macos', label: 'macOS', icon: 'macos' },
  { type: 'ios', label: 'iOS', icon: 'ios' },
  { type: 'android', label: 'Android', icon: 'android' },
  { type: 'windows', label: 'Windows', icon: 'windows' },
  { type: 'linux', label: 'Linux', icon: 'linux' },
]

export const DEVICE_CONFIGS: Record<string, DeviceConfig> = {
  macos: {
    type: 'macos',
    label: 'macOS',
    appName: 'Приложение для подключения macOS',
    steps: [
      {
        number: 1,
        title: 'Скачай приложение',
        description: 'Установите из App Store и разрешите все доступы в процессе. После установки вернитесь сюда.',
        buttons: [
          { label: 'App Store (RU)', icon: 'external', url: '#' },
          { label: 'App Store (Global)', icon: 'external', url: '#' },
        ],
      },
      {
        number: 2,
        title: 'Скачалось? Подключай',
        description: 'VPN добавится в приложение автоматически. Жмите большую круглую кнопку в приложении для включения VPN.',
        buttons: [
          { label: 'Подключить', icon: 'plus', action: 'connect' },
        ],
      },
    ],
  },
  ios: {
    type: 'ios',
    label: 'iOS',
    appName: 'Приложение для подключения iOS',
    steps: [
      {
        number: 1,
        title: 'Скачай приложение',
        description: 'Установите из App Store и разрешите все доступы в процессе. После установки вернитесь сюда.',
        buttons: [
          { label: 'App Store (RU)', icon: 'external', url: '#' },
          { label: 'App Store (Global)', icon: 'external', url: '#' },
        ],
      },
      {
        number: 2,
        title: 'Скачалось? Подключай',
        description: 'VPN добавится в приложение автоматически. Жмите большую круглую кнопку в приложении для включения VPN.',
        buttons: [
          { label: 'Подключить', icon: 'plus', action: 'connect' },
        ],
      },
    ],
  },
  android: {
    type: 'android',
    label: 'Android',
    appName: 'Приложение для подключения Android',
    steps: [
      {
        number: 1,
        title: 'Скачай приложение',
        description: 'Установите из Google Play и разрешите все доступы в процессе. После установки вернитесь сюда.',
        buttons: [
          { label: 'Google Play', icon: 'external', url: '#' },
          { label: 'APK файл', icon: 'external', url: '#' },
        ],
      },
      {
        number: 2,
        title: 'Скачалось? Подключай',
        description: 'VPN добавится в приложение автоматически. Жмите большую круглую кнопку в приложении для включения VPN.',
        buttons: [
          { label: 'Подключить', icon: 'plus', action: 'connect' },
        ],
      },
    ],
  },
  windows: {
    type: 'windows',
    label: 'Windows',
    appName: 'Приложение для подключения Windows',
    steps: [
      {
        number: 1,
        title: 'Скачай приложение',
        description: 'Скачайте и установите приложение. После установки вернитесь сюда.',
        buttons: [
          { label: 'Скачать .exe', icon: 'external', url: '#' },
        ],
      },
      {
        number: 2,
        title: 'Скачалось? Подключай',
        description: 'VPN добавится в приложение автоматически. Жмите большую круглую кнопку в приложении для включения VPN.',
        buttons: [
          { label: 'Подключить', icon: 'plus', action: 'connect' },
        ],
      },
    ],
  },
  linux: {
    type: 'linux',
    label: 'Linux',
    appName: 'Приложение для подключения Linux',
    steps: [
      {
        number: 1,
        title: 'Скачай приложение',
        description: 'Скачайте и установите приложение. После установки вернитесь сюда.',
        buttons: [
          { label: 'Скачать .deb', icon: 'external', url: '#' },
          { label: 'Скачать .rpm', icon: 'external', url: '#' },
        ],
      },
      {
        number: 2,
        title: 'Скачалось? Подключай',
        description: 'VPN добавится в приложение автоматически. Используйте терминал или GUI для включения VPN.',
        buttons: [
          { label: 'Подключить', icon: 'plus', action: 'connect' },
        ],
      },
    ],
  },
}
