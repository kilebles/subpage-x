'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { getPublicUser, type PublicUser } from '@/lib/api'
import { ConnectWidget } from '@/components/ConnectWidget'

export default function SubPage() {
  const { uuid } = useParams<{ uuid: string }>()
  const [user, setUser] = useState<PublicUser | null>(null)
  const [error, setError] = useState(false)

  useEffect(() => {
    getPublicUser(uuid)
      .then(setUser)
      .catch(() => setError(true))
  }, [uuid])

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="font-mono text-sm text-foreground/40">Страница не найдена</span>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="font-mono text-sm text-foreground/40">Загрузка...</span>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-2xl border border-border bg-background">
        <ConnectWidget subscriptionUrl={user.subscription_url} variant="public" />
      </div>
    </div>
  )
}
