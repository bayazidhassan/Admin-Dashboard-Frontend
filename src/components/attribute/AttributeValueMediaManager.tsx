import { useState } from 'react';
import type { AttributeValue } from '../../features/attribute/attributeApi';
import { useGetMediaQuery } from '../../features/media/mediaApi';
import {
  useAttachAttributeValueMediaMutation,
  useDetachAttributeValueMediaMutation,
} from '../../features/product/productApi';
import { getMediaUrl } from '../../lib/media';

interface Props {
  attributeValue: AttributeValue;
}

const AttributeValueMediaManager = ({ attributeValue }: Props) => {
  const { data: mediaLibrary } = useGetMediaQuery();
  const [selectedMediaId, setSelectedMediaId] = useState('');

  const [attachMedia, { isLoading: isAttaching }] =
    useAttachAttributeValueMediaMutation();
  const [detachMedia] = useDetachAttributeValueMediaMutation();

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

      setSelectedMediaId('');
    } catch (error) {
      console.log(error);
    }
  };

  const handleDetach = async (mediaId: string) => {
    const confirmDelete = window.confirm('Remove this image?');
    if (!confirmDelete) return;

    try {
      await detachMedia({ valueId: attributeValue.id, mediaId }).unwrap();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="mt-2 rounded border border-dashed p-2">
      <div className="mb-2 flex gap-2">
        <select
          value={selectedMediaId}
          onChange={(e) => setSelectedMediaId(e.target.value)}
          className="flex-1 rounded border p-1 text-xs"
        >
          <option value="">Select an image</option>
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
          className="rounded bg-blue-600 px-2 py-1 text-xs text-white disabled:opacity-50"
        >
          Attach
        </button>
      </div>

      {attachments.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {attachments.map((attachment) => (
            <div key={attachment.id} className="relative">
              <img
                src={getMediaUrl(
                  attachment.media.thumbnail ?? attachment.media.publicUrl,
                )}
                alt={attachment.media.altText ?? attachment.media.fileName}
                className="h-12 w-12 rounded object-cover"
              />

              {attachment.isThumbnail && (
                <span className="absolute top-0 left-0 rounded bg-green-600 px-1 text-[9px] text-white">
                  Thumb
                </span>
              )}

              <button
                type="button"
                onClick={() => handleDetach(attachment.mediaId)}
                className="absolute right-0 bottom-0 rounded bg-red-500 px-1 text-[9px] text-white"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AttributeValueMediaManager;
