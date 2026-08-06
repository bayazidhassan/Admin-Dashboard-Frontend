import { useState } from 'react';
import toast from 'react-hot-toast';

import {
  useAddAttributeValueMutation,
  useDeleteAttributeValueMutation,
  useGetAttributeByIdQuery,
  useUpdateAttributeValueMutation,
} from '../../features/attribute/attributeApi';

import type {
  Attribute,
  AttributeValue,
} from '../../features/attribute/attributeApi';

import ConfirmModal from '../common/ConfirmModal';
import AttributeValueMediaManager from './AttributeValueMediaManager';

interface Props {
  open: boolean;
  attribute: Attribute | null;
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

const inputClass =
  'w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none';

const AttributeValuesModal = ({ open, attribute, onClose }: Props) => {
  const [value, setValue] = useState('');
  const [slug, setSlug] = useState('');
  const [referenceValue, setReferenceValue] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [valueToDelete, setValueToDelete] = useState<AttributeValue | null>(
    null,
  );

  const attributeId = attribute?.id ?? '';
  const { data } = useGetAttributeByIdQuery(attributeId, {
    skip: !attributeId,
  });
  const currentAttribute = data?.data;

  const [addAttributeValue, { isLoading: isAdding }] =
    useAddAttributeValueMutation();
  const [updateAttributeValue, { isLoading: isUpdating }] =
    useUpdateAttributeValueMutation();
  const [deleteAttributeValue] = useDeleteAttributeValueMutation();

  const resetForm = () => {
    setEditingId(null);
    setValue('');
    setSlug('');
    setReferenceValue('');
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  if (!open || !currentAttribute) return null;

  const isColorSwatch = currentAttribute.type === 'color_swatch';

  const handleSaveValue = async () => {
    if (!value.trim() || !slug.trim()) {
      toast.error('Value and slug are required');
      return;
    }

    try {
      if (editingId) {
        await updateAttributeValue({
          valueId: editingId,
          value,
          slug,
          referenceValue,
        }).unwrap();
        toast.success('Value updated');
      } else {
        await addAttributeValue({
          id: currentAttribute.id,
          value,
          slug,
          referenceValue,
        }).unwrap();
        toast.success('Value added');
      }

      resetForm();
    } catch (error) {
      console.error(error);
      toast.error(editingId ? 'Failed to update value' : 'Failed to add value');
    }
  };

  const handleEditValue = (item: AttributeValue) => {
    setEditingId(item.id);
    setValue(item.value);
    setSlug(item.slug);
    setReferenceValue(item.referenceValue ?? '');
  };

  const handleConfirmDelete = async () => {
    if (!valueToDelete) return;

    try {
      setDeletingId(valueToDelete.id);
      await deleteAttributeValue(valueToDelete.id).unwrap();
      toast.success('Value deleted');
    } catch (error) {
      console.error(error);
      toast.error('Failed to delete value');
    } finally {
      setDeletingId(null);
      setValueToDelete(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-lg bg-white shadow-lg">
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">
              {currentAttribute.name} values
            </h2>
            <p className="mt-0.5 text-sm text-slate-500">
              {currentAttribute.values.length} value(s)
            </p>
          </div>

          <button
            onClick={handleClose}
            className="cursor-pointer rounded-md border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
          >
            Close
          </button>
        </div>

        <div className="border-b border-slate-200 bg-slate-50 px-6 py-4">
          <h3 className="mb-3 text-xs font-semibold tracking-wide text-slate-500 uppercase">
            {editingId ? 'Edit value' : 'Add a value'}
          </h3>

          <div className="grid gap-3 sm:grid-cols-4">
            <input
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="Value (e.g. Red)"
              className={inputClass}
            />

            <input
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="Slug"
              readOnly={editingId !== null}
              className={`${inputClass} ${
                editingId !== null
                  ? 'cursor-not-allowed border-slate-200 bg-slate-100 text-slate-500'
                  : ''
              }`}
            />

            <div className="flex items-center gap-2">
              {isColorSwatch && (
                <span
                  className="h-8 w-8 shrink-0 rounded-full border border-slate-300"
                  style={{ backgroundColor: referenceValue || '#ffffff' }}
                />
              )}
              <input
                value={referenceValue}
                onChange={(e) => setReferenceValue(e.target.value)}
                placeholder={isColorSwatch ? '#FFFFFF' : 'Reference value'}
                className={inputClass}
              />
            </div>

            <div className="flex gap-2">
              <button
                onClick={handleSaveValue}
                disabled={isAdding || isUpdating}
                className="inline-flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-md bg-indigo-600 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {(isAdding || isUpdating) && <Spinner />}
                {isAdding
                  ? 'Adding...'
                  : isUpdating
                    ? 'Updating...'
                    : editingId
                      ? 'Update'
                      : 'Add'}
              </button>

              {editingId && (
                <button
                  onClick={resetForm}
                  className="cursor-pointer rounded-md border border-slate-300 px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100"
                >
                  Cancel
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="px-6 py-4">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-left text-xs font-semibold tracking-wide text-slate-500 uppercase">
                <th className="py-2 pr-3">Value</th>
                <th className="py-2 pr-3">Slug</th>
                <th className="py-2 pr-3">Reference</th>
                <th className="py-2 pr-3">Photos</th>
                <th className="py-2 text-right">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {currentAttribute.values.map((item) => (
                <tr key={item.id}>
                  <td className="py-2.5 pr-3 font-medium text-slate-900">
                    {item.value}
                  </td>

                  <td className="py-2.5 pr-3 font-mono text-xs text-slate-500">
                    {item.slug}
                  </td>

                  <td className="py-2.5 pr-3">
                    {item.referenceValue ? (
                      <div className="flex items-center gap-2">
                        {isColorSwatch && (
                          <span
                            className="h-4 w-4 rounded-full border border-slate-300"
                            style={{ backgroundColor: item.referenceValue }}
                          />
                        )}
                        <span className="text-xs text-slate-500">
                          {item.referenceValue}
                        </span>
                      </div>
                    ) : (
                      <span className="text-slate-300">—</span>
                    )}
                  </td>

                  <td className="py-2.5 pr-3">
                    <AttributeValueMediaManager attributeValue={item} />
                  </td>

                  <td className="py-2.5">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => handleEditValue(item)}
                        className="cursor-pointer rounded-md border border-slate-300 px-3 py-1 text-xs font-medium text-slate-700 transition-colors hover:bg-slate-100"
                      >
                        Edit
                      </button>

                      <button
                        onClick={() => setValueToDelete(item)}
                        disabled={deletingId === item.id}
                        className="inline-flex cursor-pointer items-center gap-1 rounded-md border border-red-200 px-3 py-1 text-xs font-medium text-red-600 transition-colors hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {deletingId === item.id && (
                          <Spinner className="h-3 w-3" />
                        )}
                        {deletingId === item.id ? '...' : 'Delete'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {currentAttribute.values.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    className="py-8 text-center text-sm text-slate-400"
                  >
                    No values yet. Add one above.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <ConfirmModal
        open={valueToDelete !== null}
        title={`Delete "${valueToDelete?.value}"?`}
        description="If any product variant uses this value, deletion will be blocked until it is removed from those variants."
        isLoading={deletingId === valueToDelete?.id}
        onConfirm={handleConfirmDelete}
        onCancel={() => setValueToDelete(null)}
      />
    </div>
  );
};

export default AttributeValuesModal;
