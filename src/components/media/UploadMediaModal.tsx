import { useState } from 'react';
import { useUploadMediaMutation } from '../../features/media/mediaApi';

interface Props {
  open: boolean;
  onClose: () => void;
}

const UploadMediaModal = ({ open, onClose }: Props) => {
  const [files, setFiles] = useState<FileList | null>(null);

  const [uploadMedia, { isLoading }] = useUploadMediaMutation();

  if (!open) return null;

  const handleUpload = async () => {
    if (!files?.length) return;

    const formData = new FormData();

    Array.from(files).forEach((file) => {
      formData.append('files', file);
    });

    try {
      await uploadMedia(formData).unwrap();

      setFiles(null);

      onClose();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-125 rounded bg-white p-6">
        <h2 className="mb-6 text-2xl font-bold">Upload Media</h2>

        <input
          multiple
          type="file"
          accept="image/*"
          onChange={(e) => setFiles(e.target.files)}
          className="mb-6 w-full rounded border p-2"
        />

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="cursor-pointer rounded border px-4 py-2"
          >
            Cancel
          </button>

          <button
            disabled={isLoading || !files?.length}
            onClick={handleUpload}
            className="cursor-pointer rounded bg-blue-600 px-4 py-2 text-white disabled:opacity-50"
          >
            {isLoading ? 'Uploading...' : 'Upload'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UploadMediaModal;
