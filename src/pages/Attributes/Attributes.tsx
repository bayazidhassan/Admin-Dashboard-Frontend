import { useState } from 'react';
import toast from 'react-hot-toast';
import AttributeModal from '../../components/attribute/AttributeModal';
import AttributeValuesModal from '../../components/attribute/AttributeValuesModal';
import ConfirmModal from '../../components/common/ConfirmModal';
import ErrorState from '../../components/common/ErrorState';
import LoadingState, { Spinner } from '../../components/common/LoadingState';
import {
  useCreateAttributeMutation,
  useDeleteAttributeMutation,
  useGetAttributesQuery,
  useUpdateAttributeMutation,
  type Attribute,
  type AttributeType,
} from '../../features/attribute/attributeApi';

const typeLabels: Record<AttributeType, string> = {
  dropdown: 'Dropdown',
  radio: 'Radio',
  checkbox: 'Checkbox',
  color_swatch: 'Color swatch',
  image_swatch: 'Image swatch',
};

const Attributes = () => {
  const [openModal, setOpenModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [selectedAttribute, setSelectedAttribute] = useState<Attribute | null>(
    null,
  );
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [type, setType] = useState<AttributeType>('dropdown');
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [attributeToDelete, setAttributeToDelete] = useState<Attribute | null>(
    null,
  );
  const [openValuesModal, setOpenValuesModal] = useState(false);

  const { data, isLoading, error } = useGetAttributesQuery();

  const [createAttribute, { isLoading: isCreating }] =
    useCreateAttributeMutation();
  const [updateAttribute, { isLoading: isUpdating }] =
    useUpdateAttributeMutation();
  const [deleteAttribute] = useDeleteAttributeMutation();

  const resetForm = () => {
    setName('');
    setSlug('');
    setType('dropdown');
  };

  const handleCreate = async () => {
    if (!name.trim() || !slug.trim()) {
      toast.error('Name and slug are required');
      return;
    }

    try {
      await createAttribute({ name, slug, type }).unwrap();
      toast.success('Attribute created');
      setOpenModal(false);
      resetForm();
    } catch (error) {
      console.error(error);
      toast.error('Failed to create attribute');
    }
  };

  const handleEdit = (attribute: Attribute) => {
    setSelectedAttribute(attribute);
    setName(attribute.name);
    setSlug(attribute.slug);
    setType(attribute.type);
    setIsEdit(true);
    setOpenModal(true);
  };

  const handleUpdate = async () => {
    if (!selectedAttribute) return;

    try {
      await updateAttribute({
        id: selectedAttribute.id,
        name,
        slug,
        type,
      }).unwrap();
      toast.success('Attribute updated');
      setOpenModal(false);
      setSelectedAttribute(null);
      setIsEdit(false);
      resetForm();
    } catch (error) {
      console.error(error);
      toast.error('Failed to update attribute');
    }
  };

  const handleConfirmDelete = async () => {
    if (!attributeToDelete) return;

    try {
      setDeletingId(attributeToDelete.id);
      await deleteAttribute(attributeToDelete.id).unwrap();
      toast.success('Attribute deleted');
    } catch (error) {
      console.error(error);
      toast.error('Failed to delete attribute');
    } finally {
      setDeletingId(null);
      setAttributeToDelete(null);
    }
  };

  const handleManageValues = (attribute: Attribute) => {
    setSelectedAttribute(attribute);
    setOpenValuesModal(true);
  };

  if (isLoading) {
    return <LoadingState />;
  }

  if (error) {
    return <ErrorState error={error} />;
  }

  const attributes = data?.data.items ?? [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Attributes</h1>
          <p className="mt-1 text-sm text-slate-500">
            Define the variant options products can be built from, like Color or
            Size.
          </p>
        </div>

        <button
          onClick={() => {
            setSelectedAttribute(null);
            setIsEdit(false);
            resetForm();
            setOpenModal(true);
          }}
          className="cursor-pointer rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-700"
        >
          Create attribute
        </button>
      </div>

      <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
        <table className="w-full text-sm">
          <thead className="bg-slate-50">
            <tr className="border-b border-slate-200 text-left text-xs font-semibold tracking-wide text-slate-500 uppercase">
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Slug</th>
              <th className="px-4 py-3">Type</th>
              <th className="px-4 py-3">Values</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {attributes.map((attribute) => (
              <tr
                key={attribute.id}
                className="transition-colors hover:bg-slate-50"
              >
                <td className="px-4 py-3 font-medium text-slate-900">
                  {attribute.name}
                </td>

                <td className="px-4 py-3 font-mono text-xs text-slate-500">
                  {attribute.slug}
                </td>

                <td className="px-4 py-3">
                  <span className="inline-flex items-center rounded-full bg-indigo-50 px-2.5 py-0.5 text-xs font-medium text-indigo-700">
                    {typeLabels[attribute.type]}
                  </span>
                </td>

                <td className="px-4 py-3">
                  <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-600">
                    {attribute._count.values}
                  </span>
                </td>

                <td className="px-4 py-3">
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => handleManageValues(attribute)}
                      className="cursor-pointer rounded-md border border-indigo-200 px-3 py-1 text-xs font-medium text-indigo-600 transition-colors hover:bg-indigo-50"
                    >
                      Manage values
                    </button>

                    <button
                      onClick={() => handleEdit(attribute)}
                      className="cursor-pointer rounded-md border border-slate-300 px-3 py-1 text-xs font-medium text-slate-700 transition-colors hover:bg-slate-100"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => setAttributeToDelete(attribute)}
                      disabled={deletingId === attribute.id}
                      className="inline-flex cursor-pointer items-center gap-1 rounded-md border border-red-200 px-3 py-1 text-xs font-medium text-red-600 transition-colors hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {deletingId === attribute.id && (
                        <Spinner className="h-3 w-3" />
                      )}
                      {deletingId === attribute.id ? 'Deleting...' : 'Delete'}
                    </button>
                  </div>
                </td>
              </tr>
            ))}

            {attributes.length === 0 && (
              <tr>
                <td
                  colSpan={5}
                  className="px-4 py-10 text-center text-sm text-slate-400"
                >
                  No attributes yet. Create one above to get started.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <AttributeModal
        open={openModal}
        isEdit={isEdit}
        name={name}
        setName={setName}
        slug={slug}
        setSlug={setSlug}
        type={type}
        setType={setType}
        isLoading={isEdit ? isUpdating : isCreating}
        onClose={() => {
          setOpenModal(false);
          setSelectedAttribute(null);
          setIsEdit(false);
          resetForm();
        }}
        onSave={isEdit ? handleUpdate : handleCreate}
      />

      <AttributeValuesModal
        open={openValuesModal}
        attribute={selectedAttribute}
        onClose={() => setOpenValuesModal(false)}
      />

      <ConfirmModal
        open={attributeToDelete !== null}
        title={`Delete "${attributeToDelete?.name}"?`}
        description="If any product variant uses this attribute, deletion will be blocked until it is removed from those variants."
        isLoading={deletingId === attributeToDelete?.id}
        onConfirm={handleConfirmDelete}
        onCancel={() => setAttributeToDelete(null)}
      />
    </div>
  );
};

export default Attributes;
