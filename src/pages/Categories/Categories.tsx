import { useState } from 'react';
import toast from 'react-hot-toast';
import CategoryModal from '../../components/category/CategoryModal';
import ConfirmModal from '../../components/common/ConfirmModal';
import ErrorState from '../../components/common/ErrorState';
import LoadingState, { Spinner } from '../../components/common/LoadingState';
import {
  useCreateCategoryMutation,
  useDeleteCategoryMutation,
  useGetCategoriesQuery,
  useGetCategoryTreeQuery,
  useUpdateCategoryMutation,
  type Category,
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
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null,
  );
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(
    null,
  );

  const { data, isLoading, error } = useGetCategoriesQuery();
  const { data: categoryTree } = useGetCategoryTreeQuery();

  const [createCategory, { isLoading: isCreating }] =
    useCreateCategoryMutation();
  const [updateCategory, { isLoading: isUpdating }] =
    useUpdateCategoryMutation();
  const [deleteCategory] = useDeleteCategoryMutation();

  const resetForm = () => {
    setName('');
    setSlug('');
    setDescription('');
    setImage('');
    setParentId('');
    setActive(true);
    setSortOrder(1);
  };

  const handleCreate = async () => {
    if (!name || !slug) {
      toast.error('Name and slug are required');
      return;
    }

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

      toast.success('Category created');
      setOpenModal(false);
      resetForm();
    } catch (error) {
      console.error(error);
      toast.error('Failed to create category');
    }
  };

  const handleEdit = (category: Category) => {
    setSelectedCategory(category);
    setName(category.name);
    setSlug(category.slug);
    setDescription(category.description ?? '');
    setImage(category.image ?? '');
    setParentId(category.parentId ?? '');
    setActive(category.active);
    setSortOrder(category.sortOrder);
    setIsEdit(true);
    setOpenModal(true);
  };

  const handleUpdate = async () => {
    if (!selectedCategory) return;

    try {
      await updateCategory({
        id: selectedCategory.id,
        name,
        slug,
        description,
        image,
        parentId: parentId || undefined,
        active,
        sortOrder,
      }).unwrap();

      toast.success('Category updated');
      setOpenModal(false);
      setSelectedCategory(null);
      setIsEdit(false);
      resetForm();
    } catch (error) {
      console.error(error);
      toast.error('Failed to update category');
    }
  };

  const handleConfirmDelete = async () => {
    if (!categoryToDelete) return;

    try {
      setDeletingId(categoryToDelete.id);
      await deleteCategory(categoryToDelete.id).unwrap();
      toast.success('Category deleted');
    } catch (error) {
      console.error(error);
      toast.error('Failed to delete category');
    } finally {
      setDeletingId(null);
      setCategoryToDelete(null);
    }
  };

  if (isLoading) {
    return <LoadingState />;
  }

  if (error) {
    return <ErrorState error={error} />;
  }

  const categories = data?.data.items ?? [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Categories</h1>
          <p className="mt-1 text-sm text-slate-500">
            Organize products into a nested category tree.
          </p>
        </div>

        <button
          onClick={() => {
            setSelectedCategory(null);
            setIsEdit(false);
            resetForm();
            setOpenModal(true);
          }}
          className="cursor-pointer rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-700"
        >
          Create category
        </button>
      </div>

      <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
        <table className="w-full text-sm">
          <thead className="bg-slate-50">
            <tr className="border-b border-slate-200 text-left text-xs font-semibold tracking-wide text-slate-500 uppercase">
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Slug</th>
              <th className="px-4 py-3">Parent</th>
              <th className="px-4 py-3">Children</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {categories.map((category) => (
              <tr
                key={category.id}
                className="transition-colors hover:bg-slate-50"
              >
                <td className="px-4 py-3 font-medium text-slate-900">
                  {category.name}
                </td>

                <td className="px-4 py-3 font-mono text-xs text-slate-500">
                  {category.slug}
                </td>

                <td className="px-4 py-3 text-slate-500">
                  {category.parent?.name ?? (
                    <span className="text-slate-300">—</span>
                  )}
                </td>

                <td className="px-4 py-3">
                  <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-600">
                    {category._count?.children ?? 0}
                  </span>
                </td>

                <td className="px-4 py-3">
                  <span
                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      category.active
                        ? 'bg-emerald-50 text-emerald-700'
                        : 'bg-slate-100 text-slate-500'
                    }`}
                  >
                    {category.active ? 'Active' : 'Inactive'}
                  </span>
                </td>

                <td className="px-4 py-3">
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => handleEdit(category)}
                      className="cursor-pointer rounded-md border border-slate-300 px-3 py-1 text-xs font-medium text-slate-700 transition-colors hover:bg-slate-100"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => setCategoryToDelete(category)}
                      disabled={deletingId === category.id}
                      className="inline-flex cursor-pointer items-center gap-1 rounded-md border border-red-200 px-3 py-1 text-xs font-medium text-red-600 transition-colors hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {deletingId === category.id && (
                        <Spinner className="h-3 w-3" />
                      )}
                      {deletingId === category.id ? 'Deleting...' : 'Delete'}
                    </button>
                  </div>
                </td>
              </tr>
            ))}

            {categories.length === 0 && (
              <tr>
                <td
                  colSpan={6}
                  className="px-4 py-10 text-center text-sm text-slate-400"
                >
                  No categories yet. Create one above to get started.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <CategoryModal
        open={openModal}
        isEdit={isEdit}
        currentCategoryId={selectedCategory?.id}
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
        onClose={() => {
          setOpenModal(false);
          setSelectedCategory(null);
          setIsEdit(false);
          resetForm();
        }}
        isLoading={isEdit ? isUpdating : isCreating}
        onSave={isEdit ? handleUpdate : handleCreate}
      />

      <ConfirmModal
        open={categoryToDelete !== null}
        title={`Delete "${categoryToDelete?.name}"?`}
        description={
          categoryToDelete && (categoryToDelete._count?.children ?? 0) > 0
            ? 'This category has child categories. Deletion may be blocked until they are moved or removed.'
            : 'This will permanently remove the category. This cannot be undone.'
        }
        isLoading={deletingId === categoryToDelete?.id}
        onConfirm={handleConfirmDelete}
        onCancel={() => setCategoryToDelete(null)}
      />
    </div>
  );
};

export default Categories;
