import { useContext, useEffect, useRef, useState } from 'react'
import { AuthContext } from '../../context/auth-context'
import { useCreateReply } from '../../hooks/useCreateReply'
import UserAvatar from '../ui/UserAvatar'
import { getApiErrorMessage } from '../../utils/getApiErrorMessage'
import { showThemedAlert } from '../../utils/showThemedAlert'

export interface ReplyCreatorProps {
  postId: string
  commentId: string
  replyToName: string
  autoFocus?: boolean
}

export default function ReplyCreator({
  postId,
  commentId,
  replyToName,
  autoFocus = false,
}: ReplyCreatorProps) {
  const { userData } = useContext(AuthContext)
  const [replyText, setReplyText] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)
  const createReplyMutation = useCreateReply(postId, commentId)

  useEffect(() => {
    if (autoFocus) {
      inputRef.current?.focus()
    }
  }, [autoFocus])

  const handleCreateReply = () => {
    const content = replyText.trim()
    if (!content || createReplyMutation.isPending) return

    createReplyMutation.mutate(content, {
      onSuccess: () => {
        setReplyText('')
      },
      onError: (error) => {
        void showThemedAlert({
          icon: 'error',
          title: 'Could not send reply',
          text: getApiErrorMessage(error, 'Please try again.'),
        })
      },
    })
  }

  return (
    <div className="flex items-start gap-2">
      <UserAvatar src={userData?.photo} size="xs" />
      <div className="flex flex-1 items-center gap-2 rounded-2xl border border-gray-200 bg-white px-3 py-1.5 dark:border-gray-700 dark:bg-gray-800">
        <input
          onChange={(e) => setReplyText(e.target.value)}
          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              event.preventDefault()
              handleCreateReply()
            }
          }}
          value={replyText}
          ref={inputRef}
          type="text"
          placeholder={`Reply to ${replyToName}...`}
          className="flex-1 border-0 bg-transparent p-0 text-sm text-gray-900 placeholder-gray-400 focus:ring-0 focus:outline-none dark:text-white dark:placeholder-gray-400"
        />
        <button
          type="button"
          onClick={handleCreateReply}
          disabled={createReplyMutation.isPending || !replyText.trim()}
          aria-label="Post reply"
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-600 text-xs text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <i aria-hidden="true" className={createReplyMutation.isPending ? 'fa-solid fa-spinner fa-spin' : 'fa-regular fa-paper-plane'}></i>
        </button>
      </div>
    </div>
  )
}
