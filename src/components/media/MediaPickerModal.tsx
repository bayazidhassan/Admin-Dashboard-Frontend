import type { Media } from '../../features/media/mediaApi';
import { getMediaUrl } from '../../lib/media';

interface Props {
  open: boolean;
  media: Media[];
  onClose: () => void;
  onSelect: (media: Media) => void;
}

const MediaPickerModal = ({ open, media, onClose, onSelect }: Props) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="max-h-[90vh] w-[1000px] overflow-y-auto rounded-lg bg-white p-6">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold">Select Media</h2>

          <button
            onClick={onClose}
            className="cursor-pointer rounded border px-4 py-2"
          >
            Close
          </button>
        </div>

        {media.length === 0 ? (
          <p className="text-gray-500">No media found.</p>
        ) : (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-5">
            {media.map((item) => (
              <div
                key={item.id}
                onClick={() => onSelect(item)}
                className="cursor-pointer overflow-hidden rounded-lg border transition hover:border-blue-500 hover:shadow-md"
              >
                <img
                  src={getMediaUrl(item.thumbnail ?? item.publicUrl)}
                  alt={item.altText ?? item.fileName}
                  className="h-40 w-full object-cover"
                />

                <div className="p-2">
                  <p className="truncate text-sm font-medium">
                    {item.title ?? item.fileName}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MediaPickerModal;
