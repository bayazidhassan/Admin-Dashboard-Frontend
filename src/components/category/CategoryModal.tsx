import type { CategoryTree } from '../../features/category/categoryApi';

interface Props {
  open: boolean;

  isEdit: boolean;

  name: string;
  setName: React.Dispatch<React.SetStateAction<string>>;

  slug: string;
  setSlug: React.Dispatch<React.SetStateAction<string>>;

  description: string;
  setDescription: React.Dispatch<React.SetStateAction<string>>;

  image: string;
  setImage: React.Dispatch<React.SetStateAction<string>>;

  parentId: string;
  setParentId: React.Dispatch<React.SetStateAction<string>>;

  active: boolean;
  setActive: React.Dispatch<React.SetStateAction<boolean>>;

  sortOrder: number;
  setSortOrder: React.Dispatch<React.SetStateAction<number>>;

  categories: CategoryTree[];

  isLoading: boolean;

  onClose: () => void;
  onSave: () => void;
}

const CategoryModal = ({
  open,

  isEdit,

  name,
  setName,

  slug,
  setSlug,

  description,
  setDescription,

  image,
  setImage,

  parentId,
  setParentId,

  active,
  setActive,

  sortOrder,
  setSortOrder,

  categories,

  isLoading,

  onClose,
  onSave,
}: Props) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50">
      <div className="max-h-[90vh] w-175 overflow-y-auto rounded bg-white p-6">
        <h2 className="mb-6 text-2xl font-bold">
          {isEdit ? 'Edit Category' : 'Create Category'}
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
          placeholder="Slug"
          onChange={(e) => setSlug(e.target.value)}
          className={`mb-4 w-full rounded border p-2 ${
            isEdit ? 'cursor-not-allowed bg-gray-100' : ''
          }`}
        />

        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description"
          className="mb-4 w-full rounded border p-2"
        />

        <input
          value={image}
          onChange={(e) => setImage(e.target.value)}
          placeholder="Image URL"
          className="mb-4 w-full rounded border p-2"
        />

        <select
          value={parentId}
          onChange={(e) => setParentId(e.target.value)}
          className="mb-4 w-full cursor-pointer rounded border p-2"
        >
          <option value="">No Parent</option>

          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>

        <input
          type="number"
          value={sortOrder}
          onChange={(e) => setSortOrder(Number(e.target.value))}
          className="mb-4 w-full rounded border p-2"
        />

        <label className="mb-6 flex items-center gap-2">
          <input
            type="checkbox"
            checked={active}
            onChange={(e) => setActive(e.target.checked)}
          />
          Active
        </label>

        <div className="mt-6 flex justify-end gap-3">
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

export default CategoryModal;
