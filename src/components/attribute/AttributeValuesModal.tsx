import { useState } from 'react';

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

import AttributeValueMediaManager from './AttributeValueMediaManager';

interface Props {
  open: boolean;
  attribute: Attribute | null;
  onClose: () => void;
}

const AttributeValuesModal = ({ open, attribute, onClose }: Props) => {
  const [value, setValue] = useState('');
  const [slug, setSlug] = useState('');
  const [referenceValue, setReferenceValue] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

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

  const handleSaveValue = async () => {
    try {
      if (editingId) {
        await updateAttributeValue({
          valueId: editingId,
          value,
          slug,
          referenceValue,
        }).unwrap();
      } else {
        await addAttributeValue({
          id: currentAttribute.id,
          value,
          slug,
          referenceValue,
        }).unwrap();
      }

      setEditingId(null);
      setValue('');
      setSlug('');
      setReferenceValue('');
    } catch (error) {
      console.error(error);
    }
  };

  const handleEditValue = (item: AttributeValue) => {
    setEditingId(item.id);

    setValue(item.value);

    setSlug(item.slug);

    setReferenceValue(item.referenceValue ?? '');
  };

  const handleDeleteValue = async (id: string) => {
    const ok = confirm('Delete this value?');

    if (!ok) return;

    setDeletingId(id);

    try {
      await deleteAttributeValue(id).unwrap();
    } catch (error) {
      console.error(error);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-187.5 rounded-lg bg-white p-6 shadow-lg">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold">{currentAttribute.name} Values</h2>

          <button
            onClick={handleClose}
            className="cursor-pointer rounded border px-3 py-1"
          >
            Close
          </button>
        </div>

        <div className="mb-6 space-y-3 rounded border p-4">
          <input
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="Value"
            className="w-full rounded border p-2"
          />

          <input
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            placeholder="Slug"
            readOnly={editingId !== null}
            className={`w-full rounded border p-2 ${
              editingId !== null ? 'cursor-not-allowed bg-gray-100' : ''
            }`}
          />

          <input
            value={referenceValue}
            onChange={(e) => setReferenceValue(e.target.value)}
            placeholder="Reference Value (#FFFFFF)"
            className="w-full rounded border p-2"
          />

          <button
            onClick={handleSaveValue}
            disabled={isAdding || isUpdating}
            className="cursor-pointer rounded bg-blue-600 px-4 py-2 text-white disabled:opacity-50"
          >
            {isAdding
              ? 'Adding...'
              : isUpdating
                ? 'Updating...'
                : editingId
                  ? 'Update Value'
                  : 'Add Value'}
          </button>
        </div>

        <table className="w-full border">
          <thead>
            <tr className="border-b">
              <th className="p-3 text-left">Value</th>
              <th className="p-3 text-left">Slug</th>
              <th className="p-3 text-left">Reference</th>
              <th className="p-3 text-left">Photos</th>
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>

          <tbody>
            {currentAttribute.values.map((item) => (
              <tr key={item.id} className="border-b">
                <td className="p-3">{item.value}</td>

                <td className="p-3">{item.slug}</td>

                <td className="p-3">{item.referenceValue ?? '-'}</td>

                <td className="p-3">
                  <AttributeValueMediaManager attributeValue={item} />
                </td>

                <td className="space-x-2 p-3">
                  <button
                    onClick={() => handleEditValue(item)}
                    className="cursor-pointer rounded bg-yellow-500 px-3 py-1 text-white"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => handleDeleteValue(item.id)}
                    disabled={deletingId === item.id}
                    className="cursor-pointer rounded bg-red-500 px-3 py-1 text-white disabled:opacity-50"
                  >
                    {deletingId === item.id ? 'Deleting...' : 'Delete'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AttributeValuesModal;
