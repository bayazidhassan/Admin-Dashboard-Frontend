import { useState } from 'react';
import {
  useAttachProductMediaMutation,
  useDetachProductMediaMutation,
  useGetProductByIdQuery,
  useReorderProductMediaMutation,
} from '../../features/product/productApi';

// Adjust this import to match your actual media module's export
import { useGetMediaQuery } from '../../features/media/mediaApi';
import { getMediaUrl } from '../../lib/media';

interface Props {
  productId: string;
}

const ProductMediaManager = ({ productId }: Props) => {
  const { data, isLoading } = useGetProductByIdQuery(productId);
  const { data: mediaLibrary } = useGetMediaQuery();

  const [selectedMediaId, setSelectedMediaId] = useState('');

  const [attachMedia, { isLoading: isAttaching }] =
    useAttachProductMediaMutation();
  const [detachMedia] = useDetachProductMediaMutation();
  const [reorderMedia] = useReorderProductMediaMutation();

  if (isLoading)
    return <p className="text-sm text-gray-500">Loading media...</p>;

  const attachments = data?.data.mediaAttachments ?? [];
  const sorted = [...attachments].sort((a, b) => a.sortOrder - b.sortOrder);

  // media not already attached to this product
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
          isThumbnail: attachments.length === 0, // first image becomes thumbnail automatically
          isGallery: true,
          sortOrder: attachments.length,
        },
      }).unwrap();

      setSelectedMediaId('');
    } catch (error) {
      console.log(error);
    }
  };

  const handleDetach = async (mediaId: string) => {
    const confirmDelete = window.confirm('Remove this image from the product?');
    if (!confirmDelete) return;

    try {
      await detachMedia({ productId, mediaId }).unwrap();
    } catch (error) {
      console.log(error);
    }
  };

  const handleSetThumbnail = async (mediaId: string) => {
    // Re-attach isn't allowed once attached; use reorder + a fresh attach with isThumbnail
    // Simplest approach given backend: detach then re-attach as thumbnail
    try {
      await detachMedia({ productId, mediaId }).unwrap();
      await attachMedia({
        productId,
        body: {
          mediaId,
          isThumbnail: true,
          isGallery: true,
          sortOrder: 0,
        },
      }).unwrap();
    } catch (error) {
      console.log(error);
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
      console.log(error);
    }
  };

  return (
    <div className="mt-6 rounded border p-4">
      <h3 className="mb-3 font-semibold">Product Media</h3>

      <div className="mb-4 flex gap-2">
        <select
          value={selectedMediaId}
          onChange={(e) => setSelectedMediaId(e.target.value)}
          className="flex-1 rounded border p-2"
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
          className="rounded bg-blue-600 px-4 py-2 text-white disabled:opacity-50"
        >
          {isAttaching ? 'Attaching...' : 'Attach'}
        </button>
      </div>

      {sorted.length === 0 ? (
        <p className="text-sm text-gray-500">No images attached yet.</p>
      ) : (
        <div className="grid grid-cols-4 gap-4">
          {sorted.map((attachment, index) => (
            <div
              key={attachment.id}
              className="relative rounded border p-2 text-center"
            >
              <img
                src={getMediaUrl(
                  attachment.media.thumbnail ?? attachment.media.publicUrl,
                )}
                alt={attachment.media.altText ?? attachment.media.fileName}
                className="mb-2 h-24 w-full rounded object-cover"
              />

              {attachment.isThumbnail && (
                <span className="mb-1 inline-block rounded bg-green-600 px-2 py-0.5 text-xs text-white">
                  Thumbnail
                </span>
              )}

              <div className="flex flex-wrap justify-center gap-1">
                <button
                  type="button"
                  onClick={() => handleMove(index, 'up')}
                  disabled={index === 0}
                  className="rounded border px-2 py-1 text-xs disabled:opacity-30"
                >
                  ↑
                </button>

                <button
                  type="button"
                  onClick={() => handleMove(index, 'down')}
                  disabled={index === sorted.length - 1}
                  className="rounded border px-2 py-1 text-xs disabled:opacity-30"
                >
                  ↓
                </button>

                {!attachment.isThumbnail && (
                  <button
                    type="button"
                    onClick={() => handleSetThumbnail(attachment.mediaId)}
                    className="rounded border px-2 py-1 text-xs"
                  >
                    Set Thumb
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => handleDetach(attachment.mediaId)}
                  className="rounded border border-red-400 px-2 py-1 text-xs text-red-600"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductMediaManager;
