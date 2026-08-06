import type { CategoryTree } from '../../features/category/categoryApi';

interface Props {
  open: boolean;
  isEdit: boolean;
  currentCategoryId?: string;
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

const inputClass =
  'w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none';
const labelClass = 'mb-1 block text-xs font-medium text-slate-500';

// Flattens the nested category tree into a depth-aware list for the
// dropdown, and excludes the category being edited plus all of its
// descendants — picking either as a new parent would create a cycle.
const flattenSelectable = (
  nodes: CategoryTree[],
  excludeId?: string,
  depth = 0,
): { id: string; name: string; depth: number }[] => {
  const result: { id: string; name: string; depth: number }[] = [];

  for (const node of nodes) {
    if (node.id === excludeId) continue;

    result.push({ id: node.id, name: node.name, depth });

    if (node.children?.length) {
      result.push(...flattenSelectable(node.children, excludeId, depth + 1));
    }
  }

  return result;
};

const CategoryModal = ({
  open,
  isEdit,
  currentCategoryId,
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

  const options = flattenSelectable(categories, currentCategoryId);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-lg bg-white shadow-lg">
        <div className="border-b border-slate-200 px-6 py-4">
          <h2 className="text-lg font-semibold text-slate-900">
            {isEdit ? 'Edit category' : 'Create category'}
          </h2>
        </div>

        <div className="space-y-4 px-6 py-5">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelClass}>Name</label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Electronics"
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>Slug</label>
              <input
                value={slug}
                readOnly={isEdit}
                placeholder="electronics"
                onChange={(e) => setSlug(e.target.value)}
                className={`${inputClass} ${
                  isEdit
                    ? 'cursor-not-allowed border-slate-200 bg-slate-50 text-slate-500'
                    : ''
                }`}
              />
            </div>
          </div>

          <div>
            <label className={labelClass}>Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Optional description"
              rows={2}
              className={`${inputClass} resize-none`}
            />
          </div>

          <div>
            <label className={labelClass}>Image URL</label>
            <div className="flex items-center gap-3">
              {image ? (
                <img
                  src={image}
                  alt="Category preview"
                  className="h-10 w-10 shrink-0 rounded object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
              ) : (
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded bg-slate-100 text-xs text-slate-400">
                  —
                </div>
              )}

              <input
                value={image}
                onChange={(e) => setImage(e.target.value)}
                placeholder="https://..."
                className={inputClass}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelClass}>Parent category</label>
              <select
                value={parentId}
                onChange={(e) => setParentId(e.target.value)}
                className={`${inputClass} cursor-pointer`}
              >
                <option value="">No parent (top level)</option>
                {options.map((category) => (
                  <option key={category.id} value={category.id}>
                    {'—'.repeat(category.depth)} {category.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className={labelClass}>Sort order</label>
              <input
                type="number"
                value={sortOrder}
                onChange={(e) => setSortOrder(Number(e.target.value))}
                className={inputClass}
              />
            </div>
          </div>

          <label className="flex w-fit cursor-pointer items-center gap-2 rounded-md border border-slate-200 px-3 py-2 text-sm text-slate-700">
            <input
              type="checkbox"
              checked={active}
              onChange={(e) => setActive(e.target.checked)}
              className="accent-indigo-600"
            />
            Active
          </label>
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
            onClick={onSave}
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

export default CategoryModal;
