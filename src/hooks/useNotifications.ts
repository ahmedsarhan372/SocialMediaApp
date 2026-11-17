import { useContext, useEffect, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { AuthContext } from '../context/auth-context'
import {
  getNotifications,
  markNotificationRead,
  markAllNotificationsRead,
} from '../api/notifications.api'
import { queryKeys } from '../api/queryKeys'
import type { Notification } from '../types/Notifications'
import {
  clearUnreadDismissedNotifications,
  dismissNotificationLocally,
  DISMISSED_NOTIFICATIONS_EVENT,
  getDismissedNotifications,
} from '../utils/dismissedNotifications'

export function useNotifications() {
  const queryClient = useQueryClient()
  const { userData } = useContext(AuthContext)
  const userId = userData?._id
  const [, setDismissalRevision] = useState(0)

  useEffect(() => {
    const refreshDismissed = () => setDismissalRevision((revision) => revision + 1)
    window.addEventListener(DISMISSED_NOTIFICATIONS_EVENT, refreshDismissed)
    return () => window.removeEventListener(DISMISSED_NOTIFICATIONS_EVENT, refreshDismissed)
  }, [])

  const listQuery = useQuery({
    queryKey: queryKeys.notifications,
    queryFn: () => getNotifications(),
  })

  const allNotifications: Notification[] = listQuery.data?.data.data.notifications ?? []
  const dismissed = getDismissedNotifications(userId)
  const dismissedIds = new Set(dismissed.map((entry) => entry.id))
  const notifications = allNotifications.filter((notification) => !dismissedIds.has(notification._id))

  const dismissNotification = (id: string) => {
    const notification = notifications.find((item) => item._id === id)
    if (!notification) return
    dismissNotificationLocally(userId, id, !notification.isRead)
  }

  const markRead = useMutation({
    mutationFn: (id: string) => markNotificationRead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.notifications })
      queryClient.invalidateQueries({ queryKey: queryKeys.unreadCount })
    },
  })

  const markAllRead = useMutation({
    mutationFn: () => markAllNotificationsRead(),
    onSuccess: () => {
      clearUnreadDismissedNotifications(userId)
      queryClient.invalidateQueries({ queryKey: queryKeys.notifications })
      queryClient.invalidateQueries({ queryKey: queryKeys.unreadCount })
    },
  })

  return {
    ...listQuery,
    notifications,
    markRead,
    markAllRead,
    dismissNotification,
  }
}
