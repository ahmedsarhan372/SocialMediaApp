import { useEffect, useRef, useState } from "react";
import { type EmojiClickData } from "emoji-picker-react";
import { useCommentActions } from "../../hooks/useCommentActions";
import { getApiErrorMessage } from "../../utils/getApiErrorMessage";
import UserAvatar from "../ui/UserAvatar";
import EmojiToggle from "../ui/EmojiToggle";
import MediaUploadInput from "../ui/MediaUploadInput";
import { showThemedAlert } from "../../utils/showThemedAlert";

interface CommentCreatorProps {
  name: string;
  photo: string;
  postId: string;
}

export default function CommentCreator({ name, photo, postId }: CommentCreatorProps) {
  const [content, setContent] = useState("");
  const [picture, setPicture] = useState<File | null>(null);
  const [picturePreview, setPicturePreview] = useState<string | null>(null);
  const picturePreviewRef = useRef<string | null>(null);
  const [showEmoji, setShowEmoji] = useState(false);

  const { createComment } = useCommentActions(postId);

  useEffect(() => () => {
    if (picturePreviewRef.current) URL.revokeObjectURL(picturePreviewRef.current);
  }, []);

  function handlePictureChange(file: File | null) {
    if (picturePreviewRef.current) URL.revokeObjectURL(picturePreviewRef.current);
    const previewUrl = file ? URL.createObjectURL(file) : null;
    picturePreviewRef.current = previewUrl;
    setPicturePreview(previewUrl);
    setPicture(file);
  }

  function handleEmoji(emojiData: EmojiClickData) {
    setContent((prev) => prev + emojiData.emoji);
  }

  function handleCreateComment() {
    const formData = new FormData();
    if (content.trim()) formData.append("content", content);
    if (picture) formData.append("image", picture);
    createComment.mutate(formData, {
      onSuccess: () => {
        setContent("");
        handlePictureChange(null);
        setShowEmoji(false);
      },
      onError: (err) => {
        void showThemedAlert({
          icon: "error",
          title: "Error!",
          text: getApiErrorMessage(err, "Failed to create comment"),
        });
      },
    });
  }

  return (
    <div className="mx-4 mb-4">
      <div className="flex items-start gap-3">
        <UserAvatar src={photo} size="sm" />

        <div className="flex-1 rounded-2xl border border-gray-200 bg-gray-100 px-4 py-3 dark:border-gray-700 dark:bg-gray-800">
          <textarea
            rows={2}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder={`Comment as ${name}...`}
            className="w-full resize-none border-0 bg-transparent p-0 text-gray-800 placeholder-gray-500 focus:ring-0 focus:outline-none dark:text-white"
          />

          {picturePreview && (
            <div className="relative mt-2 w-32">
              <img src={picturePreview} alt="Selected comment image preview" className="h-24 w-32 rounded-lg object-cover" />
              <button
                type="button"
                onClick={() => handlePictureChange(null)}
                aria-label="Remove attached image"
                className="absolute top-1 right-1 h-7 w-7 rounded-full bg-gray-900/70 text-xs text-white hover:bg-gray-900"
              >
                <i aria-hidden="true" className="fa-solid fa-xmark"></i>
              </button>
            </div>
          )}

          <div className="mt-2 flex items-center justify-between">
            <div className="flex items-center gap-1 text-gray-500">
              <MediaUploadInput value={picture} onChange={handlePictureChange} variant="comment" mode="trigger" />

              <EmojiToggle
                open={showEmoji}
                onToggle={() => setShowEmoji(!showEmoji)}
                onEmojiSelect={handleEmoji}
                variant="comment"
                mode="button"
              />
            </div>

            <button
              type="button"
              onClick={handleCreateComment}
              aria-label="Post comment"
              disabled={createComment.isPending || (!content.trim() && !picture)}
              className="flex h-11 w-11 items-center justify-center rounded-full bg-blue-600 text-white hover:bg-blue-700 disabled:bg-blue-300"
            >
              <i aria-hidden="true" className="fa-regular fa-paper-plane"></i>
            </button>
          </div>
        </div>
      </div>

      <EmojiToggle
        open={showEmoji}
        onToggle={() => setShowEmoji(!showEmoji)}
        onEmojiSelect={handleEmoji}
        variant="comment"
        mode="picker"
      />
    </div>
  );
}
