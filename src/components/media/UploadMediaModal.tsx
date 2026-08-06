import { useState } from 'react';
import toast from 'react-hot-toast';
import { useUploadMediaMutation } from '../../features/media/mediaApi';

interface Props {
  open: boolean;
  onClose: () => void;
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

const formatSize = (bytes: number) => `${(bytes / 1024 / 1024).toFixed(2)} MB`;

const UploadMediaModal = ({ open, onClose }: Props) => {
  const [files, setFiles] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState(false);

  const [uploadMedia, { isLoading }] = useUploadMediaMutation();

  if (!open) return null;

  const addFiles = (list: FileList | null) => {
    if (!list?.length) return;
    setFiles((prev) => [...prev, ...Array.from(list)]);
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleDrop = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    setIsDragging(false);
    addFiles(e.dataTransfer.files);
  };

  const handleUpload = async () => {
    if (!files.length) return;

    const formData = new FormData();
    files.forEach((file) => formData.append('files', file));

    try {
      await uploadMedia(formData).unwrap();
      toast.success(
        `${files.length} file${files.length === 1 ? '' : 's'} uploaded`,
      );
      setFiles([]);
      onClose();
    } catch (err) {
      console.error(err);
      toast.error('Upload failed. Please try again.');
    }
  };

  const handleClose = () => {
    setFiles([]);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-lg bg-white shadow-lg">
        <div className="border-b border-slate-200 px-6 py-4">
          <h2 className="text-lg font-semibold text-slate-900">Upload media</h2>
        </div>

        <div className="px-6 py-5">
          <label
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            className={`flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed px-4 py-8 text-center transition-colors ${
              isDragging
                ? 'border-indigo-500 bg-indigo-50'
                : 'border-slate-300 hover:border-slate-400'
            }`}
          >
            <p className="text-sm font-medium text-slate-700">
              Drop images here or click to browse
            </p>
            <p className="mt-1 text-xs text-slate-400">
              JPEG, PNG, WEBP, or MP4
            </p>
            <input
              multiple
              type="file"
              accept="image/*,video/mp4"
              onChange={(e) => addFiles(e.target.files)}
              className="hidden"
            />
          </label>

          {files.length > 0 && (
            <ul className="mt-4 max-h-48 space-y-2 overflow-y-auto">
              {files.map((file, index) => (
                <li
                  key={`${file.name}-${index}`}
                  className="flex items-center justify-between rounded-md border border-slate-200 px-3 py-2 text-sm"
                >
                  <div className="min-w-0">
                    <p className="truncate font-medium text-slate-800">
                      {file.name}
                    </p>
                    <p className="text-xs text-slate-400">
                      {formatSize(file.size)}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => removeFile(index)}
                    className="ml-2 cursor-pointer text-xs font-medium text-red-500 hover:underline"
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="flex justify-end gap-3 border-t border-slate-200 px-6 py-4">
          <button
            onClick={handleClose}
            className="cursor-pointer rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
          >
            Cancel
          </button>

          <button
            disabled={isLoading || files.length === 0}
            onClick={handleUpload}
            className="inline-flex cursor-pointer items-center gap-2 rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isLoading && <Spinner />}
            {isLoading
              ? 'Uploading...'
              : `Upload${files.length ? ` (${files.length})` : ''}`}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UploadMediaModal;
