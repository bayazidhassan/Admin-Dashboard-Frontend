interface Props {
  open: boolean;

  isEdit: boolean;

  name: string;
  setName: React.Dispatch<React.SetStateAction<string>>;

  slug: string;
  setSlug: React.Dispatch<React.SetStateAction<string>>;

  logo: string;
  setLogo: React.Dispatch<React.SetStateAction<string>>;

  description: string;
  setDescription: React.Dispatch<React.SetStateAction<string>>;

  status: boolean;
  setStatus: React.Dispatch<React.SetStateAction<boolean>>;

  isLoading: boolean;

  onClose: () => void;
  onSave: () => void;
}

const BrandModal = ({
  open,

  isEdit,

  name,
  setName,

  slug,
  setSlug,

  logo,
  setLogo,

  description,
  setDescription,

  status,
  setStatus,

  isLoading,

  onClose,
  onSave,
}: Props) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50">
      <div className="w-[600px] rounded bg-white p-6">
        <h2 className="mb-6 text-2xl font-bold">
          {isEdit ? 'Edit Brand' : 'Create Brand'}
        </h2>

        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Name"
          className="mb-4 w-full rounded border p-2"
        />

        <input
          value={slug}
          readOnly={isEdit}
          onChange={(e) => setSlug(e.target.value)}
          placeholder="Slug"
          className={`mb-4 w-full rounded border p-2 ${
            isEdit ? 'cursor-not-allowed bg-gray-100' : ''
          }`}
        />

        <input
          value={logo}
          onChange={(e) => setLogo(e.target.value)}
          placeholder="Logo URL"
          className="mb-4 w-full rounded border p-2"
        />

        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description"
          className="mb-4 w-full rounded border p-2"
        />

        <label className="mb-6 flex items-center gap-2">
          <input
            type="checkbox"
            checked={status}
            onChange={(e) => setStatus(e.target.checked)}
          />
          Active
        </label>

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="cursor-pointer rounded border px-4 py-2"
          >
            Cancel
          </button>

          <button
            disabled={isLoading}
            onClick={onSave}
            className="cursor-pointer rounded bg-blue-600 px-4 py-2 text-white disabled:opacity-50"
          >
            {isLoading ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default BrandModal;
