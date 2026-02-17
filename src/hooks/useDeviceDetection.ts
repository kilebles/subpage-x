import { useState, useEffect } from 'react'
import type { DeviceType } from '@/types/device'

export function detectDevice(): DeviceType {
  const userAgent = navigator.userAgent.toLowerCase()
  const platform = navigator.platform?.toLowerCase() || ''

  // iOS detection
  if (/iphone|ipad|ipod/.test(userAgent) ||
      (platform === 'macintel' && navigator.maxTouchPoints > 1)) {
    return 'ios'
  }

  // Android detection
  if (/android/.test(userAgent)) {
    return 'android'
  }

  // macOS detection
  if (/macintosh|mac os x/.test(userAgent) || platform.startsWith('mac')) {
    return 'macos'
  }

  // Windows detection
  if (/win32|win64|windows|wince/.test(userAgent) || platform.startsWith('win')) {
    return 'windows'
  }

  // Linux detection
  if (/linux/.test(userAgent) && !/android/.test(userAgent)) {
    return 'linux'
  }

  // Default to macOS
  return 'macos'
}

export function useDeviceDetection() {
  const [device, setDevice] = useState<DeviceType>('macos')
  const [isDetecting, setIsDetecting] = useState(true)

  useEffect(() => {
    const detected = detectDevice()
    setDevice(detected)
    setIsDetecting(false)
  }, [])

  return {
    device,
    setDevice,
    isDetecting,
  }
}
