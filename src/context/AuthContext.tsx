import { useEffect, useState, type ReactNode } from 'react'
import type { User1 } from '../types/posts'
import { getProfile } from '../api/auth.api'
import { AuthContext } from './auth-context'

export default function AuthContextProvider({ children }: { children: ReactNode }) {
  const [userData, setUserData] = useState<User1 | null>(null)
  const [isLoading, setIsLoading] = useState(!!localStorage.getItem('usertoken'))

  useEffect(() => {
    const token = localStorage.getItem('usertoken')
    if (!token) return

    async function fetchProfile() {
      try {
        const { data } = await getProfile()
        setUserData(data.data.user)
      } catch (err) {
        localStorage.removeItem('usertoken')
        setUserData(null)
        console.error(err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchProfile()
  }, [])

  return (
    <AuthContext.Provider value={{ userData, setUserData, isLoading }}>
      {children}
    </AuthContext.Provider>
  )
}
