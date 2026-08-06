import { useState } from 'react';
import toast from 'react-hot-toast';
import ConfirmModal from '../../components/common/ConfirmModal';
import ErrorState from '../../components/common/ErrorState';
import LoadingState, { Spinner } from '../../components/common/LoadingState';
import EditMediaModal from '../../components/media/EditMediaModal';
import UploadMediaModal from '../../components/media/UploadMediaModal';
import {
  useDeleteMediaMutation,
  useGetMediaQuery,
  type Media as MediaItem,
} from '../../features/media/mediaApi';
import { getMediaUrl } from '../../lib/media';

const Media = () => {
  const { data, isLoading, error } = useGetMediaQuery();
  const [openUploadModal, setOpenUploadModal] = useState(false);
  const [deleteMedia] = useDeleteMediaMutation();
  const [selectedMedia, setSelectedMedia] = useState<MediaItem | null>(null);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [title, setTitle] = useState('');
  const [altText, setAltText] = useState('');
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [mediaToDelete, setMediaToDelete] = useState<MediaItem | null>(null);

  const handleConfirmDelete = async () => {
    if (!mediaToDelete) return;

    try {
      setDeletingId(mediaToDelete.id);
      await deleteMedia(mediaToDelete.id).unwrap();
      toast.success('Media deleted');
    } catch (err) {
      console.error(err);
      toast.error('Failed to delete media');
    } finally {
      setDeletingId(null);
      setMediaToDelete(null);
    }
  };

  if (isLoading) {
    return <LoadingState />;
  }

  if (error) {
    return <ErrorState error={error} />;
  }

  const items = data?.data.items ?? [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Media library</h1>
          <p className="mt-1 text-sm text-slate-500">
            Upload and reuse images across categories, brands, and products.
          </p>
        </div>

        <button
          onClick={() => setOpenUploadModal(true)}
          className="cursor-pointer rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-700"
        >
          Upload
        </button>
      </div>

      {items.length === 0 ? (
        <div className="rounded-lg border border-dashed border-slate-300 bg-white py-16 text-center">
          <p className="text-sm text-slate-500">No media uploaded yet.</p>
          <button
            onClick={() => setOpenUploadModal(true)}
            className="mt-3 text-sm font-medium text-indigo-600 hover:underline"
          >
            Upload your first file
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {items.map((media) => (
            <div
              key={media.id}
              className="group overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="relative">
                <img
                  src={getMediaUrl(media.thumbnail ?? media.publicUrl)}
                  alt={media.altText ?? media.fileName}
                  className="h-36 w-full object-cover"
                />

                <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
                  <button
                    onClick={() => {
                      setSelectedMedia(media);
                      setTitle(media.title ?? '');
                      setAltText(media.altText ?? '');
                      setOpenEditModal(true);
                    }}
                    className="cursor-pointer rounded-md bg-white px-3 py-1.5 text-xs font-medium text-slate-700 transition-colors hover:bg-slate-100"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => setMediaToDelete(media)}
                    disabled={deletingId === media.id}
                    className="inline-flex cursor-pointer items-center gap-1 rounded-md bg-red-600 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {deletingId === media.id && <Spinner className="h-3 w-3" />}
                    {deletingId === media.id ? '...' : 'Delete'}
                  </button>
                </div>
              </div>

              <div className="space-y-1 p-3">
                <p className="truncate text-sm font-medium text-slate-900">
                  {media.title || media.fileName}
                </p>
                <p className="text-xs text-slate-400">
                  {(media.size / 1024 / 1024).toFixed(2)} MB · {media.width}×
                  {media.height}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

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

      <ConfirmModal
        open={mediaToDelete !== null}
        title="Delete this media?"
        description="If this image is attached to any product, category, or brand, deletion may be blocked until it is detached."
        isLoading={deletingId === mediaToDelete?.id}
        onConfirm={handleConfirmDelete}
        onCancel={() => setMediaToDelete(null)}
      />
    </div>
  );
};

export default Media;
