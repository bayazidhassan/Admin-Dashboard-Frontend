import { useState } from 'react';
import AttributeModal from '../../components/attribute/AttributeModal';
import AttributeValuesModal from '../../components/attribute/AttributeValuesModal';
import {
  useCreateAttributeMutation,
  useDeleteAttributeMutation,
  useGetAttributesQuery,
  useUpdateAttributeMutation,
  type Attribute,
  type AttributeType,
} from '../../features/attribute/attributeApi';

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
  const [openValuesModal, setOpenValuesModal] = useState(false);

  const { data, isLoading, error } = useGetAttributesQuery();

  const [createAttribute, { isLoading: isCreating }] =
    useCreateAttributeMutation();
  const [updateAttribute, { isLoading: isUpdating }] =
    useUpdateAttributeMutation();
  const [deleteAttribute] = useDeleteAttributeMutation();

  const handleCreate = async () => {
    try {
      await createAttribute({
        name,
        slug,
        type,
      }).unwrap();

      setOpenModal(false);

      setName('');
      setSlug('');
      setType('dropdown');
    } catch (error) {
      console.error(error);
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

      setOpenModal(false);

      setSelectedAttribute(null);

      setIsEdit(false);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (id: string) => {
    const ok = confirm('Delete this attribute?');

    if (!ok) return;

    setDeletingId(id);

    try {
      await deleteAttribute(id).unwrap();
    } catch (error) {
      console.error(error);
    } finally {
      setDeletingId(null);
    }
  };

  const handleManageValues = (attribute: Attribute) => {
    setSelectedAttribute(attribute);

    setOpenValuesModal(true);
  };

  if (isLoading) return <h2>Loading...</h2>;

  if (error) return <h2>Something went wrong.</h2>;

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Attributes</h1>

        <button
          onClick={() => {
            setSelectedAttribute(null);
            setIsEdit(false);

            setName('');
            setSlug('');
            setType('dropdown');

            setOpenModal(true);
          }}
          className="cursor-pointer rounded bg-blue-600 px-4 py-2 text-white"
        >
          Create Attribute
        </button>
      </div>

      <table className="w-full border">
        <thead>
          <tr className="border-b">
            <th className="p-3 text-left">Name</th>
            <th className="p-3 text-left">Slug</th>
            <th className="p-3 text-left">Type</th>
            <th className="p-3 text-left">Values</th>
            <th className="p-3 text-left">Actions</th>
          </tr>
        </thead>

        <tbody>
          {data?.data.items.map((attribute) => (
            <tr key={attribute.id} className="border-b">
              <td className="p-3">{attribute.name}</td>

              <td className="p-3">{attribute.slug}</td>

              <td className="p-3">{attribute.type}</td>

              <td className="p-3">{attribute._count.values}</td>

              <td className="space-x-2 p-3">
                <button
                  onClick={() => handleManageValues(attribute)}
                  className="cursor-pointer rounded bg-indigo-600 px-3 py-1 text-white"
                >
                  Manage Values
                </button>

                <button
                  onClick={() => handleEdit(attribute)}
                  className="cursor-pointer rounded bg-yellow-500 px-3 py-1 text-white"
                >
                  Edit
                </button>

                <button
                  onClick={() => handleDelete(attribute.id)}
                  disabled={deletingId === attribute.id}
                  className="cursor-pointer rounded bg-red-500 px-3 py-1 text-white disabled:opacity-50"
                >
                  {deletingId === attribute.id ? 'Deleting...' : 'Delete'}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

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
        onClose={() => setOpenModal(false)}
        onSave={isEdit ? handleUpdate : handleCreate}
      />

      <AttributeValuesModal
        open={openValuesModal}
        attribute={selectedAttribute}
        onClose={() => setOpenValuesModal(false)}
      />
    </div>
  );
};

export default Attributes;
