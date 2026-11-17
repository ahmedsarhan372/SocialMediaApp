import axios, { isAxiosError } from 'axios'

export { isAxiosError }

const PUBLIC_PATHS = ['/users/signin', '/users/signup']
const API_BASE_URL =
  import.meta.env.VITE_API_URL?.trim() || 'https://route-posts.routemisr.com'

function isPublicRequest(url?: string): boolean {
  return !!url && PUBLIC_PATHS.some((path) => url.startsWith(path))
}

function isOnAuthPage(): boolean {
  const path = window.location.hash.replace(/^#/, '').split('?')[0].toLowerCase()
  return path === '' || path === '/' || path === '/login'
}

export const api = axios.create({
  baseURL: API_BASE_URL,
})

api.interceptors.request.use((config) => {
  if (isPublicRequest(config.url)) return config
  const token = localStorage.getItem('usertoken')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (
      isAxiosError(error) &&
      error.response?.status === 401 &&
      !isPublicRequest(error.config?.url) &&
      !isOnAuthPage()
    ) {
      localStorage.removeItem('usertoken')
      window.location.hash = '#/Login'
    }
    return Promise.reject(error)
  },
)
