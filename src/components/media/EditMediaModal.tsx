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
      await updateMedia({
        id: media.id,
        title,
        altText,
      }).unwrap();

      onClose();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-125 rounded bg-white p-6">
        <h2 className="mb-6 text-2xl font-bold">Edit Media</h2>

        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title"
          className="mb-4 w-full rounded border p-2"
        />

        <input
          value={altText}
          onChange={(e) => setAltText(e.target.value)}
          placeholder="Alt Text"
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
            disabled={isLoading}
            onClick={handleSave}
            className="cursor-pointer rounded bg-blue-600 px-4 py-2 text-white disabled:opacity-50"
          >
            {isLoading ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditMediaModal;
