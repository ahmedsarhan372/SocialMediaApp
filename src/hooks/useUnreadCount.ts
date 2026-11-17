import { useContext, useEffect, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { AuthContext } from '../context/auth-context'
import { getUnreadCount } from '../api/notifications.api'
import { queryKeys } from '../api/queryKeys'
import { DISMISSED_NOTIFICATIONS_EVENT, getDismissedNotifications } from '../utils/dismissedNotifications'

export function useUnreadCount(options?: { enabled?: boolean }) {
  const { userData } = useContext(AuthContext)
  const userId = userData?._id
  const [, setDismissalRevision] = useState(0)

  useEffect(() => {
    const refreshDismissed = () => setDismissalRevision((revision) => revision + 1)
    window.addEventListener(DISMISSED_NOTIFICATIONS_EVENT, refreshDismissed)
    return () => window.removeEventListener(DISMISSED_NOTIFICATIONS_EVENT, refreshDismissed)
  }, [])

  const query = useQuery({
    queryKey: queryKeys.unreadCount,
    queryFn: () => getUnreadCount(),
    ...(options?.enabled !== undefined ? { enabled: options.enabled } : {}),
  })

  const serverUnreadCount: number = query.data?.data.data.unreadCount ?? 0
  const dismissed = getDismissedNotifications(userId)
  const dismissedUnreadCount = dismissed.filter((entry) => entry.wasUnread).length
  const unreadCount = Math.max(0, serverUnreadCount - dismissedUnreadCount)

  return { ...query, unreadCount }
}
