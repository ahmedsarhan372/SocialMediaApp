import { useState } from 'react'
import Modal from '../ui/Modal'
import { getApiErrorMessage } from '../../utils/getApiErrorMessage'

export interface ShareModalProps {
  open: boolean
  onClose: () => void
  onShare: (text: string) => Promise<void>
  isPending: boolean
}

export default function ShareModal({ open, onClose, onShare, isPending }: ShareModalProps) {
  const [shareText, setShareText] = useState('')
  const [errorMessage, setErrorMessage] = useState('')

  const handleSubmit = async () => {
    setErrorMessage('')
    try {
      await onShare(shareText.trim())
      setShareText('')
    } catch (error) {
      setErrorMessage(getApiErrorMessage(error, 'Could not share this post. Please try again.'))
    }
  }

  return (
    <Modal open={open} onClose={onClose} title="Share post">
      <textarea
        value={shareText}
        onChange={(e) => setShareText(e.target.value)}
        rows={3}
        placeholder="Say something about this..."
        className="w-full resize-none rounded-2xl border border-gray-200 bg-slate-50 p-4 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
      />

      {errorMessage && (
        <p role="alert" className="mt-2 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-900/30 dark:text-red-300">
          {errorMessage}
        </p>
      )}

      <div className="mt-4 flex justify-end gap-2">
        <button
          onClick={onClose}
          className="rounded-xl px-5 py-2.5 font-semibold text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
        >
          Cancel
        </button>
        <button
          onClick={handleSubmit}
          disabled={isPending}
          className="flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 font-semibold text-white hover:bg-blue-700"
        >
          <i className="fa-solid fa-share-nodes"></i> {isPending ? 'Sharing…' : 'Share now'}
        </button>
      </div>
    </Modal>
  )
}
