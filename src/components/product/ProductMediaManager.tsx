import { useState } from 'react';
import toast from 'react-hot-toast';
import { useGetMediaQuery } from '../../features/media/mediaApi';
import {
  useAttachProductMediaMutation,
  useDetachProductMediaMutation,
  useGetProductByIdQuery,
  useReorderProductMediaMutation,
} from '../../features/product/productApi';
import { getMediaUrl } from '../../lib/media';
import ConfirmModal from '../common/ConfirmModal';

interface Props {
  productId: string;
}

const Spinner = ({ className = 'h-4 w-4' }: { className?: string }) => (
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

const ProductMediaManager = ({ productId }: Props) => {
  const { data, isLoading } = useGetProductByIdQuery(productId);
  const { data: mediaLibrary } = useGetMediaQuery();

  const [selectedMediaId, setSelectedMediaId] = useState('');
  const [mediaIdToRemove, setMediaIdToRemove] = useState<string | null>(null);

  const [attachMedia, { isLoading: isAttaching }] =
    useAttachProductMediaMutation();
  const [detachMedia, { isLoading: isDetaching }] =
    useDetachProductMediaMutation();
  const [reorderMedia] = useReorderProductMediaMutation();

  if (isLoading) {
    return (
      <div className="flex items-center gap-2 rounded-lg border border-slate-200 p-4 text-sm text-slate-400">
        <Spinner />
        Loading media...
      </div>
    );
  }

  const attachments = data?.data.mediaAttachments ?? [];
  const sorted = [...attachments].sort((a, b) => a.sortOrder - b.sortOrder);

  const availableMedia = (mediaLibrary?.data.items ?? []).filter(
    (m: { id: string }) => !attachments.some((a) => a.mediaId === m.id),
  );

  const handleAttach = async () => {
    if (!selectedMediaId) return;

    try {
      await attachMedia({
        productId,
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
      await detachMedia({ productId, mediaId: mediaIdToRemove }).unwrap();
      toast.success('Image removed');
    } catch (error) {
      console.error(error);
      toast.error('Failed to remove image');
    } finally {
      setMediaIdToRemove(null);
    }
  };

  const handleSetThumbnail = async (mediaId: string) => {
    try {
      await detachMedia({ productId, mediaId }).unwrap();
      await attachMedia({
        productId,
        body: { mediaId, isThumbnail: true, isGallery: true, sortOrder: 0 },
      }).unwrap();
      toast.success('Thumbnail updated');
    } catch (error) {
      console.error(error);
      toast.error('Failed to set thumbnail');
    }
  };

  const handleMove = async (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= sorted.length) return;

    const reordered = [...sorted];
    [reordered[index], reordered[targetIndex]] = [
      reordered[targetIndex],
      reordered[index],
    ];

    const items = reordered.map((attachment, i) => ({
      mediaId: attachment.mediaId,
      sortOrder: i,
    }));

    try {
      await reorderMedia({ productId, items }).unwrap();
    } catch (error) {
      console.error(error);
      toast.error('Failed to reorder images');
    }
  };

  return (
    <div className="rounded-lg border border-slate-200 p-4">
      <h3 className="mb-3 text-sm font-semibold text-slate-800">
        Product media
      </h3>

      <div className="mb-4 flex gap-2">
        <select
          value={selectedMediaId}
          onChange={(e) => setSelectedMediaId(e.target.value)}
          className="flex-1 rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none"
        >
          <option value="">Select an image from the media library</option>
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
          className="inline-flex cursor-pointer items-center gap-2 rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isAttaching && <Spinner />}
          {isAttaching ? 'Attaching...' : 'Attach'}
        </button>
      </div>

      {sorted.length === 0 ? (
        <p className="text-sm text-slate-400">No images attached yet.</p>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {sorted.map((attachment, index) => (
            <div
              key={attachment.id}
              className="group relative overflow-hidden rounded-md border border-slate-200"
            >
              <img
                src={getMediaUrl(
                  attachment.media.thumbnail ?? attachment.media.publicUrl,
                )}
                alt={attachment.media.altText ?? attachment.media.fileName}
                className="h-24 w-full object-cover"
              />

              {attachment.isThumbnail && (
                <span className="absolute top-1 left-1 rounded-full bg-emerald-600 px-2 py-0.5 text-[10px] font-medium text-white">
                  Thumbnail
                </span>
              )}

              <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 bg-black/60 p-1 opacity-0 transition-opacity group-hover:opacity-100">
                <div className="flex gap-1">
                  <button
                    type="button"
                    onClick={() => handleMove(index, 'up')}
                    disabled={index === 0}
                    className="cursor-pointer rounded bg-white/90 px-1.5 py-0.5 text-xs text-slate-700 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    ↑
                  </button>

                  <button
                    type="button"
                    onClick={() => handleMove(index, 'down')}
                    disabled={index === sorted.length - 1}
                    className="cursor-pointer rounded bg-white/90 px-1.5 py-0.5 text-xs text-slate-700 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    ↓
                  </button>
                </div>

                {!attachment.isThumbnail && (
                  <button
                    type="button"
                    onClick={() => handleSetThumbnail(attachment.mediaId)}
                    className="cursor-pointer rounded bg-white/90 px-2 py-0.5 text-[10px] font-medium text-slate-700"
                  >
                    Set thumbnail
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => setMediaIdToRemove(attachment.mediaId)}
                  disabled={
                    isDetaching && mediaIdToRemove === attachment.mediaId
                  }
                  className="cursor-pointer rounded bg-red-600 px-2 py-0.5 text-[10px] font-medium text-white disabled:cursor-not-allowed disabled:opacity-60"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <ConfirmModal
        open={mediaIdToRemove !== null}
        title="Remove this image?"
        description="This will detach the image from this product."
        confirmLabel="Remove"
        loadingLabel="Removing..."
        isLoading={isDetaching}
        onConfirm={handleConfirmDetach}
        onCancel={() => setMediaIdToRemove(null)}
      />
    </div>
  );
};

export default ProductMediaManager;
