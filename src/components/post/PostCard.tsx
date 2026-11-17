import { Card } from 'flowbite-react'
import { useContext, useState } from 'react'
import type { Post } from '../../types/posts'
import { AuthContext } from '../../context/auth-context'
import { usePostActions } from '../../hooks/usePostActions'
import PhotoLightbox from '../profile/PhotoLightbox'
import PostFooter from './PostFooter'
import PostHeader from './PostHeader'
import PostEditForm from './PostEditForm'
import SharedPostPreview from './SharedPostPreview'
import { getApiErrorMessage } from '../../utils/getApiErrorMessage'
import { showThemedAlert } from '../../utils/showThemedAlert'

export interface PostCardProps {
  element: Post
}

export default function PostCard({ element }: PostCardProps) {
  const { userData } = useContext(AuthContext)
  const {
    sharedPost,
    _id,
    image,
    body,
    createdAt,
    bookmarked,
    user: { name, photo, _id: userId },
  } = element

  const { deletePost, editPost, toggleBookmark } = usePostActions(_id)
  const [isEditing, setIsEditing] = useState(false)
  const [editText, setEditText] = useState('')
  const [showLightbox, setShowLightbox] = useState(false)
  const [imgLoaded, setImgLoaded] = useState(false)

  const imageAlt = body?.trim() || 'Post image'

  const handleUpdate = () =>
    editPost.mutate(editText, { onSuccess: () => setIsEditing(false) })

  const handleDelete = async () => {
    const isDark = document.documentElement.classList.contains('dark')
    const dialogTheme = {
      background: isDark ? '#1f2937' : '#ffffff',
      color: isDark ? '#f9fafb' : '#111827',
    }

    const confirmation = await showThemedAlert({
      title: 'Delete this post?',
      text: 'This action cannot be undone.',
      icon: 'warning',
      ...dialogTheme,
      showCancelButton: true,
      confirmButtonText: 'Delete post',
      cancelButtonText: 'Cancel',
      confirmButtonColor: '#dc2626',
      cancelButtonColor: isDark ? '#374151' : '#6b7280',
      reverseButtons: true,
      focusCancel: true,
    })

    if (!confirmation.isConfirmed) return

    deletePost.mutate(undefined, {
      onError: (error) => {
        void showThemedAlert({
          title: 'Could not delete post',
          text: getApiErrorMessage(error, 'Please try again.'),
          icon: 'error',
          ...dialogTheme,
          confirmButtonColor: '#2563eb',
        })
      },
    })
  }

  return (
    <Card
      className="w-full overflow-hidden"
      theme={{ root: { children: 'flex flex-col p-0' } }}
    >
      <PostHeader
        userId={userId}
        name={name}
        photo={photo}
        createdAt={createdAt}
        bookmarked={bookmarked}
        isOwner={userId === userData?._id}
        onToggleBookmark={() => toggleBookmark.mutate()}
        onEdit={() => {
          setIsEditing(true)
          setEditText(body ?? '')
        }}
        onDelete={handleDelete}
      />

      {isEditing ? (
        <PostEditForm
          value={editText}
          onChange={setEditText}
          onSave={handleUpdate}
          onCancel={() => setIsEditing(false)}
          isPending={editPost.isPending}
        />
      ) : (
        body && <p className="px-4 pb-3 text-gray-800 dark:text-gray-200">{body}</p>
      )}

      {image && (
        <>
          <button
            type="button"
            aria-label="View image"
            onClick={() => setShowLightbox(true)}
            className={`block w-full cursor-zoom-in bg-gray-50 dark:bg-gray-900 ${
              imgLoaded ? '' : 'min-h-48 animate-pulse'
            }`}
          >
            <img
              src={image}
              alt={imageAlt}
              loading="lazy"
              decoding="async"
              onLoad={() => setImgLoaded(true)}
              className="max-h-[420px] w-full object-contain sm:max-h-[520px]"
            />
          </button>
          <PhotoLightbox
            src={image}
            alt={imageAlt}
            open={showLightbox}
            onClose={() => setShowLightbox(false)}
          />
        </>
      )}

      {sharedPost && <SharedPostPreview sharedPost={sharedPost} />}

      <PostFooter postdetail={element} />
    </Card>
  )
}
