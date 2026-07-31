import { useState } from 'react';
import CategoryModal from '../../components/category/CategoryModal';
import {
  useCreateCategoryMutation,
  useGetCategoriesQuery,
  useGetCategoryTreeQuery,
} from '../../features/category/categoryApi';

const Categories = () => {
  const [openModal, setOpenModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');
  const [parentId, setParentId] = useState('');
  const [active, setActive] = useState(true);
  const [sortOrder, setSortOrder] = useState(1);

  const { data, isLoading, error } = useGetCategoriesQuery();
  const { data: categoryTree } = useGetCategoryTreeQuery();

  const [createCategory, { isLoading: isCreating }] =
    useCreateCategoryMutation();

  const handleCreate = async () => {
    if (!name || !slug) return;

    try {
      await createCategory({
        name,
        slug,
        description,
        image,
        parentId: parentId || undefined,
        active,
        sortOrder,
      }).unwrap();

      setOpenModal(false);

      setName('');
      setSlug('');
      setDescription('');
      setImage('');
      setParentId('');
      setActive(true);
      setSortOrder(1);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Categories</h1>

        <button
          onClick={() => {
            setIsEdit(false);

            setName('');
            setSlug('');
            setDescription('');
            setImage('');
            setParentId('');
            setActive(true);
            setSortOrder(1);

            setOpenModal(true);
          }}
          className="cursor-pointer rounded bg-blue-600 px-4 py-2 text-white"
        >
          Create Category
        </button>
      </div>

      <table className="w-full border">
        <thead>
          <tr className="border-b">
            <th className="p-3 text-left">Name</th>
            <th className="p-3 text-left">Slug</th>
            <th className="p-3 text-left">Parent</th>
            <th className="p-3 text-left">Children</th>
            <th className="p-3 text-left">Status</th>
            <th className="p-3 text-left">Actions</th>
          </tr>
        </thead>

        <tbody>
          {data?.data.items.map((category) => (
            <tr key={category.id} className="border-b">
              <td className="p-3">{category.name}</td>

              <td className="p-3">{category.slug}</td>

              <td className="p-3">{category.parent?.name ?? '-'}</td>

              <td className="p-3">{category._count?.children ?? 0}</td>

              <td className="p-3">{category.active ? 'Active' : 'Inactive'}</td>

              <td className="space-x-2 p-3">
                <button className="cursor-pointer rounded bg-yellow-500 px-3 py-1 text-white">
                  Edit
                </button>

                <button className="cursor-pointer rounded bg-red-500 px-3 py-1 text-white">
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <CategoryModal
        open={openModal}
        isEdit={isEdit}
        name={name}
        setName={setName}
        slug={slug}
        setSlug={setSlug}
        description={description}
        setDescription={setDescription}
        image={image}
        setImage={setImage}
        parentId={parentId}
        setParentId={setParentId}
        active={active}
        setActive={setActive}
        sortOrder={sortOrder}
        setSortOrder={setSortOrder}
        categories={categoryTree?.data ?? []}
        isLoading={isCreating}
        onClose={() => setOpenModal(false)}
        onSave={handleCreate}
      />
    </div>
  );
};

export default Categories;
