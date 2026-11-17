import { createContext } from 'react'
import type { User1 } from '../types/posts'

export interface AuthContextType {
  userData: User1 | null
  setUserData: (user: User1 | null) => void
  isLoading: boolean
}

export const AuthContext = createContext<AuthContextType>({
  userData: null,
  setUserData: () => {},
  isLoading: false,
})
