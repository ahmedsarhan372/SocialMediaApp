export interface DismissedNotification {
  id: string
  wasUnread: boolean
}

export const DISMISSED_NOTIFICATIONS_EVENT = 'route-posts:dismissed-notifications-changed'

function storageKey(userId: string | undefined) {
  return `route-posts:dismissed-notifications:${userId ?? 'anonymous'}`
}

export function getDismissedNotifications(userId: string | undefined): DismissedNotification[] {
  try {
    const value: unknown = JSON.parse(localStorage.getItem(storageKey(userId)) ?? '[]')
    if (!Array.isArray(value)) return []
    return value.filter(
      (entry): entry is DismissedNotification =>
        typeof entry?.id === 'string' && typeof entry?.wasUnread === 'boolean',
    )
  } catch {
    return []
  }
}

export function dismissNotificationLocally(
  userId: string | undefined,
  id: string,
  wasUnread: boolean,
) {
  if (!userId) return
  const current = getDismissedNotifications(userId)
  if (!current.some((entry) => entry.id === id)) {
    localStorage.setItem(storageKey(userId), JSON.stringify([...current, { id, wasUnread }]))
    window.dispatchEvent(new Event(DISMISSED_NOTIFICATIONS_EVENT))
  }
}

export function clearUnreadDismissedNotifications(userId: string | undefined) {
  if (!userId) return
  const current = getDismissedNotifications(userId)
  const updated = current.map((entry) => ({ ...entry, wasUnread: false }))
  localStorage.setItem(storageKey(userId), JSON.stringify(updated))
  window.dispatchEvent(new Event(DISMISSED_NOTIFICATIONS_EVENT))
}
