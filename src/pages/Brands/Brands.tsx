import { useState } from 'react';
import toast from 'react-hot-toast';
import BrandModal from '../../components/brand/BrandModal';
import ConfirmModal from '../../components/common/ConfirmModal';
import ErrorState from '../../components/common/ErrorState';
import LoadingState, { Spinner } from '../../components/common/LoadingState';
import {
  useCreateBrandMutation,
  useDeleteBrandMutation,
  useGetBrandsQuery,
  useUpdateBrandMutation,
  type Brand,
} from '../../features/brand/brandApi';

const Brands = () => {
  const [openModal, setOpenModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [selectedBrand, setSelectedBrand] = useState<Brand | null>(null);
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [logo, setLogo] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [brandToDelete, setBrandToDelete] = useState<Brand | null>(null);

  const { data, isLoading, error } = useGetBrandsQuery();

  const [createBrand, { isLoading: isCreating }] = useCreateBrandMutation();
  const [updateBrand, { isLoading: isUpdating }] = useUpdateBrandMutation();
  const [deleteBrand] = useDeleteBrandMutation();

  const resetForm = () => {
    setName('');
    setSlug('');
    setLogo('');
    setDescription('');
    setStatus(true);
  };

  const handleCreate = async () => {
    if (!name.trim() || !slug.trim()) {
      toast.error('Name and slug are required');
      return;
    }

    try {
      await createBrand({ name, slug, logo, description, status }).unwrap();
      toast.success('Brand created');
      setOpenModal(false);
      resetForm();
    } catch (error) {
      console.error(error);
      toast.error('Failed to create brand');
    }
  };

  const handleEdit = (brand: Brand) => {
    setSelectedBrand(brand);
    setName(brand.name);
    setSlug(brand.slug);
    setLogo(brand.logo ?? '');
    setDescription(brand.description ?? '');
    setStatus(brand.status);
    setIsEdit(true);
    setOpenModal(true);
  };

  const handleUpdate = async () => {
    if (!selectedBrand) return;

    try {
      await updateBrand({
        id: selectedBrand.id,
        name,
        logo,
        description,
        status,
      }).unwrap();

      toast.success('Brand updated');
      setOpenModal(false);
      setSelectedBrand(null);
      setIsEdit(false);
      resetForm();
    } catch (error) {
      console.error(error);
      toast.error('Failed to update brand');
    }
  };

  const handleConfirmDelete = async () => {
    if (!brandToDelete) return;

    try {
      setDeletingId(brandToDelete.id);
      await deleteBrand(brandToDelete.id).unwrap();
      toast.success('Brand deleted');
    } catch (error) {
      console.error(error);
      toast.error('Failed to delete brand');
    } finally {
      setDeletingId(null);
      setBrandToDelete(null);
    }
  };

  if (isLoading) {
    return <LoadingState />;
  }

  if (error) {
    return <ErrorState error={error} />;
  }

  const brands = data?.data.items ?? [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Brands</h1>
          <p className="mt-1 text-sm text-slate-500">
            Manage the brands your products belong to.
          </p>
        </div>

        <button
          onClick={() => {
            setSelectedBrand(null);
            setIsEdit(false);
            resetForm();
            setOpenModal(true);
          }}
          className="cursor-pointer rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-700"
        >
          Create brand
        </button>
      </div>

      <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
        <table className="w-full text-sm">
          <thead className="bg-slate-50">
            <tr className="border-b border-slate-200 text-left text-xs font-semibold tracking-wide text-slate-500 uppercase">
              <th className="px-4 py-3">Brand</th>
              <th className="px-4 py-3">Slug</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {brands.map((brand) => (
              <tr
                key={brand.id}
                className="transition-colors hover:bg-slate-50"
              >
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2.5">
                    {brand.logo ? (
                      <img
                        src={brand.logo}
                        alt={brand.name}
                        className="h-8 w-8 rounded object-cover"
                      />
                    ) : (
                      <div className="flex h-8 w-8 items-center justify-center rounded bg-slate-100 text-xs font-semibold text-slate-400">
                        {brand.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <span className="font-medium text-slate-900">
                      {brand.name}
                    </span>
                  </div>
                </td>

                <td className="px-4 py-3 font-mono text-xs text-slate-500">
                  {brand.slug}
                </td>

                <td className="px-4 py-3">
                  <span
                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      brand.status
                        ? 'bg-emerald-50 text-emerald-700'
                        : 'bg-slate-100 text-slate-500'
                    }`}
                  >
                    {brand.status ? 'Active' : 'Inactive'}
                  </span>
                </td>

                <td className="px-4 py-3">
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => handleEdit(brand)}
                      className="cursor-pointer rounded-md border border-slate-300 px-3 py-1 text-xs font-medium text-slate-700 transition-colors hover:bg-slate-100"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => setBrandToDelete(brand)}
                      disabled={deletingId === brand.id}
                      className="inline-flex cursor-pointer items-center gap-1 rounded-md border border-red-200 px-3 py-1 text-xs font-medium text-red-600 transition-colors hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {deletingId === brand.id && (
                        <Spinner className="h-3 w-3" />
                      )}
                      {deletingId === brand.id ? 'Deleting...' : 'Delete'}
                    </button>
                  </div>
                </td>
              </tr>
            ))}

            {brands.length === 0 && (
              <tr>
                <td
                  colSpan={4}
                  className="px-4 py-10 text-center text-sm text-slate-400"
                >
                  No brands yet. Create one above to get started.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <BrandModal
        open={openModal}
        isEdit={isEdit}
        name={name}
        setName={setName}
        slug={slug}
        setSlug={setSlug}
        logo={logo}
        setLogo={setLogo}
        description={description}
        setDescription={setDescription}
        status={status}
        setStatus={setStatus}
        isLoading={isEdit ? isUpdating : isCreating}
        onClose={() => {
          setOpenModal(false);
          setSelectedBrand(null);
          setIsEdit(false);
          resetForm();
        }}
        onSave={isEdit ? handleUpdate : handleCreate}
      />

      <ConfirmModal
        open={brandToDelete !== null}
        title={`Delete "${brandToDelete?.name}"?`}
        description="If products reference this brand, deletion may be blocked until they are reassigned."
        isLoading={deletingId === brandToDelete?.id}
        onConfirm={handleConfirmDelete}
        onCancel={() => setBrandToDelete(null)}
      />
    </div>
  );
};

export default Brands;
