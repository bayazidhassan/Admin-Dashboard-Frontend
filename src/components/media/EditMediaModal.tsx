import toast from 'react-hot-toast';
import {
  type Media,
  useUpdateMediaMutation,
} from '../../features/media/mediaApi';

interface Props {
  title: string;
  setTitle: React.Dispatch<React.SetStateAction<string>>;
  altText: string;
  setAltText: React.Dispatch<React.SetStateAction<string>>;
  open: boolean;
  media: Media | null;
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

const EditMediaModal = ({
  open,
  media,
  title,
  setTitle,
  altText,
  setAltText,
  onClose,
}: Props) => {
  const [updateMedia, { isLoading }] = useUpdateMediaMutation();

  if (!open || !media) return null;

  const handleSave = async () => {
    try {
      await updateMedia({ id: media.id, title, altText }).unwrap();
      toast.success('Media updated');
      onClose();
    } catch (err) {
      console.error(err);
      toast.error('Failed to update media');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-lg bg-white shadow-lg">
        <div className="border-b border-slate-200 px-6 py-4">
          <h2 className="text-lg font-semibold text-slate-900">Edit media</h2>
          <p className="mt-0.5 truncate text-sm text-slate-500">
            {media.fileName}
          </p>
        </div>

        <div className="space-y-4 px-6 py-5">
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-500">
              Title
            </label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="A short, descriptive title"
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-slate-500">
              Alt text
            </label>
            <input
              value={altText}
              onChange={(e) => setAltText(e.target.value)}
              placeholder="Describes the image for accessibility"
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none"
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 border-t border-slate-200 px-6 py-4">
          <button
            onClick={onClose}
            className="cursor-pointer rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
          >
            Cancel
          </button>

          <button
            disabled={isLoading}
            onClick={handleSave}
            className="inline-flex cursor-pointer items-center gap-2 rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isLoading && <Spinner />}
            {isLoading ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditMediaModal;
