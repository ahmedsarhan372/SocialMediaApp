import { useMutation, useQueryClient } from '@tanstack/react-query'
import { followUser as followUserApi } from '../api/users.api'
import { queryKeys } from '../api/queryKeys'

// Used by SuggestedFriends (passes userId to mutate(userId))
// and UserProfile (can pass profileUserId to the hook or to mutate).
export function useFollowUser(profileUserId?: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (userId?: string) => followUserApi(userId ?? profileUserId),
    onSuccess: (_data, variables) => {
      // A follow changes both people’s counts and can change which posts are visible.
      queryClient.invalidateQueries({ queryKey: queryKeys.profilesAll })
      queryClient.invalidateQueries({ queryKey: queryKeys.posts })
      if (profileUserId || variables) {
        queryClient.invalidateQueries({ queryKey: queryKeys.userPosts(profileUserId ?? variables) })
      }
      queryClient.invalidateQueries({ queryKey: queryKeys.suggestionsAll })
    },
  })
}
