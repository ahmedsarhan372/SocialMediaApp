
export const queryKeys = {
  posts: ['newposts'] as const,

  postDetailsAll: ['postdetails'] as const,
  postDetails: (id: string | undefined) => ['postdetails', id] as const,

  userPostsAll: ['userposts'] as const,
  userPosts: (userId: string | undefined) => ['userposts', userId] as const,

  bookmarks: ['bookmarks'] as const,

  comments: (postId: string) => ['comments', postId] as const,
  replies: (commentId: string) => ['replies', commentId] as const,

  notifications: ['notifications'] as const,
  unreadCount: ['notifications', 'unread-count'] as const,

  suggestionsAll: ['friends'] as const,
  suggestions: (search: string) => ['friends', search] as const,
  allSuggestions: (search: string) => ['friends', 'all', search] as const,

  profilesAll: ['userProfile'] as const,
  profile: (userId: string | undefined) => ['userProfile', userId] as const,
}
