import { useState } from 'react';
import EditMediaModal from '../../components/media/EditMediaModal';
import UploadMediaModal from '../../components/media/UploadMediaModal';
import {
  useDeleteMediaMutation,
  useGetMediaQuery,
  type Media,
} from '../../features/media/mediaApi';
import { getMediaUrl } from '../../lib/media';

const Media = () => {
  const { data, isLoading, error } = useGetMediaQuery();
  const [openUploadModal, setOpenUploadModal] = useState(false);
  const [deleteMedia, { isLoading: isDeleting }] = useDeleteMediaMutation();
  const [selectedMedia, setSelectedMedia] = useState<Media | null>(null);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [title, setTitle] = useState('');
  const [altText, setAltText] = useState('');

  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    const confirmed = window.confirm(
      'Are you sure you want to delete this media?',
    );

    if (!confirmed) return;

    try {
      setDeletingId(id);

      await deleteMedia(id).unwrap();
    } catch (err) {
      console.error(err);
    } finally {
      setDeletingId(null);
    }
  };

  if (isLoading) return <h2>Loading...</h2>;

  if (error) return <h2>Something went wrong.</h2>;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Media Library</h1>
        <button
          onClick={() => setOpenUploadModal(true)}
          className="cursor-pointer rounded bg-black px-4 py-2 text-white"
        >
          Upload
        </button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
        {data?.data.items.map((media) => (
          <div
            key={media.id}
            className="overflow-hidden rounded-lg border bg-white shadow"
          >
            <img
              src={getMediaUrl(media.thumbnail ?? media.publicUrl)}
              alt={media.altText ?? media.fileName}
              className="h-40 w-full object-cover"
            />

            <div className="space-y-2 p-3">
              <p className="truncate font-medium">
                {media.title ?? media.fileName}
              </p>

              <p className="text-xs text-gray-500">
                {(media.size / 1024 / 1024).toFixed(2)} MB
              </p>

              <p className="text-xs text-gray-500">
                {media.width} × {media.height}
              </p>

              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setSelectedMedia(media);
                    setTitle(media.title ?? '');
                    setAltText(media.altText ?? '');
                    setOpenEditModal(true);
                  }}
                  className="cursor-pointer rounded bg-blue-500 px-3 py-1 text-white"
                >
                  Edit
                </button>

                <button
                  onClick={() => handleDelete(media.id)}
                  disabled={isDeleting && deletingId === media.id}
                  className="cursor-pointer rounded bg-red-500 px-3 py-1 text-white disabled:opacity-50"
                >
                  {isDeleting && deletingId === media.id
                    ? 'Deleting...'
                    : 'Delete'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <UploadMediaModal
        open={openUploadModal}
        onClose={() => setOpenUploadModal(false)}
      />

      <EditMediaModal
        open={openEditModal}
        media={selectedMedia}
        title={title}
        setTitle={setTitle}
        altText={altText}
        setAltText={setAltText}
        onClose={() => {
          setOpenEditModal(false);
          setSelectedMedia(null);
          setTitle('');
          setAltText('');
        }}
      />
    </div>
  );
};

export default Media;
