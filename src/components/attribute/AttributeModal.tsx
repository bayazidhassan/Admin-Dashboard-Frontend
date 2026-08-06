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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-lg bg-white shadow-lg">
        <div className="border-b border-slate-200 px-6 py-4">
          <h2 className="text-lg font-semibold text-slate-900">
            {isEdit ? 'Edit attribute' : 'Create attribute'}
          </h2>
        </div>

        <div className="space-y-4 px-6 py-5">
          <div>
            <label className={labelClass}>Name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Color"
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass}>Slug</label>
            <input
              value={slug}
              readOnly={isEdit}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="color"
              className={`${inputClass} ${
                isEdit
                  ? 'cursor-not-allowed border-slate-200 bg-slate-50 text-slate-500'
                  : ''
              }`}
            />
          </div>

          <div>
            <label className={labelClass}>Type</label>
            <select
              value={type}
              disabled={isEdit}
              onChange={(e) => setType(e.target.value as AttributeType)}
              className={`${inputClass} cursor-pointer ${
                isEdit
                  ? 'cursor-not-allowed border-slate-200 bg-slate-50 text-slate-500'
                  : ''
              }`}
            >
              <option value="dropdown">Dropdown</option>
              <option value="radio">Radio</option>
              <option value="checkbox">Checkbox</option>
              <option value="color_swatch">Color swatch</option>
              <option value="image_swatch">Image swatch</option>
            </select>
            {isEdit && (
              <p className="mt-1 text-xs text-slate-400">
                Type cannot be changed after creation.
              </p>
            )}
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

export default AttributeModal;
