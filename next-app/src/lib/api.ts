const API = process.env.NEXT_PUBLIC_API_URL ?? ''

export interface PublicUser {
  short_uuid: string
  subscription_url: string
  crypto_link: string | null
  language: string
}

export async function getPublicUser(short_uuid: string): Promise<PublicUser> {
  const res = await fetch(`${API}/api/user/${short_uuid}`)
  if (!res.ok) throw new Error('User not found')
  return res.json()
}
