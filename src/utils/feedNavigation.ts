export const FEED_HOME_EVENT = 'route-posts:feed-home'

export function goToFeedTop() {
  window.dispatchEvent(new Event(FEED_HOME_EVENT))
  window.scrollTo({ top: 0, behavior: 'smooth' })
}
