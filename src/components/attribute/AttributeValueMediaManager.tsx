import { useState } from 'react';
import toast from 'react-hot-toast';
import type { AttributeValue } from '../../features/attribute/attributeApi';
import { useGetMediaQuery } from '../../features/media/mediaApi';
import {
  useAttachAttributeValueMediaMutation,
  useDetachAttributeValueMediaMutation,
} from '../../features/product/productApi';
import { getMediaUrl } from '../../lib/media';
import ConfirmModal from '../common/ConfirmModal';

interface Props {
  attributeValue: AttributeValue;
}

const Spinner = ({ className = 'h-3 w-3' }: { className?: string }) => (
  <svg className={`${className} animate-spin`} viewBox="0 0 24 24" fill="none">
    <circle
      className="opacity-25"
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="4"
    />
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 0 1 8-8V0C5.4 0 0 5.4 0 12h4Z"
    />
  </svg>
);

const AttributeValueMediaManager = ({ attributeValue }: Props) => {
  const { data: mediaLibrary } = useGetMediaQuery();
  const [selectedMediaId, setSelectedMediaId] = useState('');
  const [mediaIdToRemove, setMediaIdToRemove] = useState<string | null>(null);

  const [attachMedia, { isLoading: isAttaching }] =
    useAttachAttributeValueMediaMutation();
  const [detachMedia, { isLoading: isDetaching }] =
    useDetachAttributeValueMediaMutation();

  const attachments = attributeValue.mediaAttachments ?? [];

  const availableMedia = (mediaLibrary?.data.items ?? []).filter(
    (m: { id: string }) => !attachments.some((a) => a.mediaId === m.id),
  );

  const handleAttach = async () => {
    if (!selectedMediaId) return;

    try {
      await attachMedia({
        valueId: attributeValue.id,
        body: {
          mediaId: selectedMediaId,
          isThumbnail: attachments.length === 0,
          isGallery: true,
          sortOrder: attachments.length,
        },
      }).unwrap();

      toast.success('Image attached');
      setSelectedMediaId('');
    } catch (error) {
      console.error(error);
      toast.error('Failed to attach image');
    }
  };

  const handleConfirmDetach = async () => {
    if (!mediaIdToRemove) return;

    try {
      await detachMedia({
        valueId: attributeValue.id,
        mediaId: mediaIdToRemove,
      }).unwrap();
      toast.success('Image removed');
    } catch (error) {
      console.error(error);
      toast.error('Failed to remove image');
    } finally {
      setMediaIdToRemove(null);
    }
  };

  return (
    <div className="w-52 rounded-md border border-dashed border-slate-300 p-2">
      <div className="mb-2 flex gap-1.5">
        <select
          value={selectedMediaId}
          onChange={(e) => setSelectedMediaId(e.target.value)}
          className="min-w-0 flex-1 rounded border border-slate-300 px-1.5 py-1 text-xs focus:border-indigo-500 focus:outline-none"
        >
          <option value="">Select image</option>
          {availableMedia.map((m: { id: string; fileName: string }) => (
            <option key={m.id} value={m.id}>
              {m.fileName}
            </option>
          ))}
        </select>

        <button
          type="button"
          onClick={handleAttach}
          disabled={!selectedMediaId || isAttaching}
          className="inline-flex shrink-0 cursor-pointer items-center gap-1 rounded bg-indigo-600 px-2 py-1 text-xs text-white transition-colors hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isAttaching && <Spinner />}
          Add
        </button>
      </div>

      {attachments.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {attachments.map((attachment) => (
            <div key={attachment.id} className="group relative">
              <img
                src={getMediaUrl(
                  attachment.media.thumbnail ?? attachment.media.publicUrl,
                )}
                alt={attachment.media.altText ?? attachment.media.fileName}
                className="h-12 w-12 rounded object-cover"
              />

              {attachment.isThumbnail && (
                <span className="absolute top-0 left-0 rounded-br bg-emerald-600 px-1 text-[9px] font-medium text-white">
                  Thumb
                </span>
              )}

              <button
                type="button"
                onClick={() => setMediaIdToRemove(attachment.mediaId)}
                disabled={isDetaching && mediaIdToRemove === attachment.mediaId}
                className="absolute inset-0 flex items-center justify-center rounded bg-black/60 text-[10px] font-medium text-white opacity-0 transition-opacity group-hover:opacity-100"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      )}

      <ConfirmModal
        open={mediaIdToRemove !== null}
        title="Remove this image?"
        description="This will detach the image from this attribute value."
        confirmLabel="Remove"
        loadingLabel="Removing..."
        isLoading={isDetaching}
        onConfirm={handleConfirmDetach}
        onCancel={() => setMediaIdToRemove(null)}
      />
    </div>
  );
};

export default AttributeValueMediaManager;
