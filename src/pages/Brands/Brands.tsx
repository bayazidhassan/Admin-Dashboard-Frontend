import { useState } from 'react';
import BrandModal from '../../components/brand/BrandModal';
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

  const { data, isLoading, error } = useGetBrandsQuery();

  const [createBrand, { isLoading: isCreating }] = useCreateBrandMutation();
  const [updateBrand, { isLoading: isUpdating }] = useUpdateBrandMutation();
  const [deleteBrand] = useDeleteBrandMutation();

  const handleCreate = async () => {
    try {
      await createBrand({
        name,
        slug,
        logo,
        description,
        status,
      }).unwrap();

      setOpenModal(false);

      setName('');
      setSlug('');
      setLogo('');
      setDescription('');
      setStatus(true);
    } catch (error) {
      console.error(error);
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

      setOpenModal(false);

      setSelectedBrand(null);

      setIsEdit(false);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (id: string) => {
    const ok = confirm('Delete this brand?');

    if (!ok) return;

    setDeletingId(id);

    try {
      await deleteBrand(id).unwrap();
    } catch (error) {
      console.error(error);
    } finally {
      setDeletingId(null);
    }
  };

  if (isLoading) return <h2>Loading...</h2>;

  if (error) return <h2>Something went wrong.</h2>;

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Brands</h1>

        <button
          onClick={() => {
            setSelectedBrand(null);
            setIsEdit(false);

            setName('');
            setSlug('');
            setLogo('');
            setDescription('');
            setStatus(true);

            setOpenModal(true);
          }}
          className="cursor-pointer rounded bg-blue-600 px-4 py-2 text-white"
        >
          Create Brand
        </button>
      </div>

      <table className="w-full border">
        <thead>
          <tr className="border-b">
            <th className="p-3 text-left">Name</th>
            <th className="p-3 text-left">Slug</th>
            <th className="p-3 text-left">Logo</th>
            <th className="p-3 text-left">Status</th>
            <th className="p-3 text-left">Actions</th>
          </tr>
        </thead>

        <tbody>
          {data?.data.items.map((brand) => (
            <tr key={brand.id} className="border-b">
              <td className="p-3">{brand.name}</td>

              <td className="p-3">{brand.slug}</td>

              <td className="p-3">
                {brand.logo ? (
                  <img
                    src={brand.logo}
                    alt={brand.name}
                    className="h-10 w-10 rounded object-cover"
                  />
                ) : (
                  '-'
                )}
              </td>

              <td className="p-3">{brand.status ? 'Active' : 'Inactive'}</td>

              <td className="space-x-2 p-3">
                <button
                  onClick={() => handleEdit(brand)}
                  className="cursor-pointer rounded bg-yellow-500 px-3 py-1 text-white"
                >
                  Edit
                </button>

                <button
                  onClick={() => handleDelete(brand.id)}
                  disabled={deletingId === brand.id}
                  className="cursor-pointer rounded bg-red-500 px-3 py-1 text-white disabled:opacity-50"
                >
                  {deletingId === brand.id ? 'Deleting...' : 'Delete'}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

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
        onClose={() => setOpenModal(false)}
        onSave={isEdit ? handleUpdate : handleCreate}
      />
    </div>
  );
};

export default Brands;
