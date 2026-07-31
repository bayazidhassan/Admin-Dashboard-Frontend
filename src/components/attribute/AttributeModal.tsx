import type { AttributeType } from '../../features/attribute/attributeApi';

interface Props {
  open: boolean;

  isEdit: boolean;

  name: string;
  setName: React.Dispatch<React.SetStateAction<string>>;

  slug: string;
  setSlug: React.Dispatch<React.SetStateAction<string>>;

  type: AttributeType;
  setType: React.Dispatch<React.SetStateAction<AttributeType>>;

  isLoading: boolean;

  onClose: () => void;
  onSave: () => void;
}

const AttributeModal = ({
  open,

  isEdit,

  name,
  setName,

  slug,
  setSlug,

  type,
  setType,

  isLoading,

  onClose,
  onSave,
}: Props) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50">
      <div className="w-125 rounded bg-white p-6">
        <h2 className="mb-6 text-2xl font-bold">
          {isEdit ? 'Edit Attribute' : 'Create Attribute'}
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

        <select
          value={type}
          disabled={isEdit}
          onChange={(e) => setType(e.target.value as AttributeType)}
          className={`mb-6 w-full rounded border p-2 ${
            isEdit ? 'cursor-not-allowed bg-gray-100' : ''
          }`}
        >
          <option value="dropdown">Dropdown</option>
          <option value="radio">Radio</option>
          <option value="checkbox">Checkbox</option>
          <option value="color_swatch">Color Swatch</option>
          <option value="image_swatch">Image Swatch</option>
        </select>

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

export default AttributeModal;
