import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
import type { UserData } from '@/types/user'

interface UserContextValue {
  user: UserData | null
  isLoading: boolean
  error: string | null
}

const UserContext = createContext<UserContextValue | null>(null)

interface UserProviderProps {
  children: ReactNode
}

export function UserProvider({ children }: UserProviderProps) {
  const [user, setUser] = useState<UserData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchUserData = async () => {
      // Получаем short_uuid из URL: /abc123 или /?id=abc123
      const pathname = window.location.pathname
      const searchParams = new URLSearchParams(window.location.search)

      let shortUuid = searchParams.get('id')

      if (!shortUuid) {
        // Пробуем получить из пути: /abc123
        const pathMatch = pathname.match(/^\/([a-zA-Z0-9]+)$/)
        if (pathMatch) {
          shortUuid = pathMatch[1]
        }
      }

      if (!shortUuid) {
        setError('User ID not found in URL')
        setIsLoading(false)
        return
      }

      try {
        const apiUrl = import.meta.env.VITE_API_URL || ''
        const response = await fetch(`${apiUrl}/api/user/${shortUuid}`)

        if (!response.ok) {
          if (response.status === 404) {
            throw new Error('User not found')
          }
          throw new Error('Failed to fetch user data')
        }

        const data: UserData = await response.json()
        setUser(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error')
      } finally {
        setIsLoading(false)
      }
    }

    fetchUserData()
  }, [])

  return (
    <UserContext.Provider value={{ user, isLoading, error }}>
      {children}
    </UserContext.Provider>
  )
}

export function useUser(): UserContextValue {
  const context = useContext(UserContext)
  if (!context) {
    throw new Error('useUser must be used within UserProvider')
  }
  return context
}
