import { useState } from 'react';
import ProductModal from '../../components/product/ProductModal';
import { useGetBrandsQuery } from '../../features/brand/brandApi';
import { useGetCategoriesQuery } from '../../features/category/categoryApi';
import {
  useCreateProductMutation,
  useDeleteProductMutation,
  useGetProductsQuery,
  useUpdateProductMutation,
  type Product,
} from '../../features/product/productApi';

const Product = () => {
  const { data, isLoading, error } = useGetProductsQuery();

  const [openModal, setOpenModal] = useState(false);
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [sku, setSku] = useState('');
  const [shortDescription, setShortDescription] = useState('');
  const [longDescription, setLongDescription] = useState('');
  const [price, setPrice] = useState(0);
  const [salePrice, setSalePrice] = useState(0);
  const [stock, setStock] = useState(0);
  const [weight, setWeight] = useState(0);
  const [active, setActive] = useState(true);
  const [featured, setFeatured] = useState(false);
  const [sortOrder, setSortOrder] = useState(0);
  const [brandId, setBrandId] = useState('');
  const [categoryIds, setCategoryIds] = useState<string[]>([]);
  const [deleteProduct, { isLoading: isDeleting }] = useDeleteProductMutation();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isEdit, setIsEdit] = useState(false);

  const { data: brandsData } = useGetBrandsQuery();
  const { data: categoriesData } = useGetCategoriesQuery();

  const [createProduct, { isLoading: isCreating }] = useCreateProductMutation();
  const [updateProduct, { isLoading: isUpdating }] = useUpdateProductMutation();

  const handleCreateProduct = async () => {
    try {
      await createProduct({
        name,
        slug,
        sku,
        shortDescription,
        longDescription,
        price,
        salePrice,
        stock,
        weight,
        active,
        featured,
        sortOrder,
        brandId: brandId || undefined,
        categoryIds,
      }).unwrap();

      setOpenModal(false);

      setName('');
      setSlug('');
      setSku('');
      setShortDescription('');
      setLongDescription('');
      setPrice(0);
      setSalePrice(0);
      setStock(0);
      setWeight(0);
      setActive(true);
      setFeatured(false);
      setSortOrder(0);
      setBrandId('');
      setCategoryIds([]);
    } catch (error) {
      console.log(error);
    }
  };

  const handleEditProduct = (product: Product) => {
    setSelectedProduct(product);

    setName(product.name);
    setSlug(product.slug);
    setSku(product.sku);

    setShortDescription(product.shortDescription ?? '');
    setLongDescription(product.longDescription ?? '');

    setPrice(product.price);
    setSalePrice(product.salePrice ?? 0);
    setStock(product.stock);
    setWeight(product.weight ?? 0);

    setActive(product.active);
    setFeatured(product.featured);
    setSortOrder(product.sortOrder);

    setBrandId(product.brandId ?? '');

    setCategoryIds(product.categories.map((category) => category.id));

    setIsEdit(true);
    setOpenModal(true);
  };

  const handleUpdateProduct = async () => {
    if (!selectedProduct) return;

    try {
      await updateProduct({
        id: selectedProduct.id,
        body: {
          name,
          slug,
          sku,
          shortDescription,
          longDescription,
          price,
          salePrice,
          stock,
          weight,
          active,
          featured,
          sortOrder,
          brandId: brandId || undefined,
          categoryIds,
        },
      }).unwrap();

      setOpenModal(false);
      setSelectedProduct(null);
      setIsEdit(false);
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeleteProduct = async (id: string) => {
    const confirmDelete = window.confirm(
      'Are you sure you want to delete this product?',
    );

    if (!confirmDelete) return;

    try {
      setDeletingId(id);

      await deleteProduct(id).unwrap();
    } catch (error) {
      console.log(error);
    } finally {
      setDeletingId(null);
    }
  };

  if (isLoading) return <h2>Loading...</h2>;
  if (error) return <h2>Something went wrong.</h2>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Products</h1>

        <button
          onClick={() => {
            setIsEdit(false);
            setSelectedProduct(null);

            setName('');
            setSlug('');
            setSku('');
            setShortDescription('');
            setLongDescription('');

            setPrice(0);
            setSalePrice(0);
            setStock(0);
            setWeight(0);

            setActive(true);
            setFeatured(false);
            setSortOrder(0);

            setBrandId('');
            setCategoryIds([]);

            setOpenModal(true);
          }}
          className="cursor-pointer rounded bg-black px-4 py-2 text-white"
        >
          Create Product
        </button>
      </div>

      <div className="overflow-x-auto rounded-lg border bg-white">
        <table className="min-w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-3 text-left">Name</th>
              <th className="px-4 py-3 text-left">SKU</th>
              <th className="px-4 py-3 text-left">Brand</th>
              <th className="px-4 py-3 text-left">Price</th>
              <th className="px-4 py-3 text-left">Stock</th>
              <th className="px-4 py-3 text-left">Status</th>
              <th className="px-4 py-3 text-left">Actions</th>
            </tr>
          </thead>

          <tbody>
            {data?.data.items.map((product) => (
              <tr key={product.id} className="border-t">
                <td className="px-4 py-3">{product.name}</td>

                <td className="px-4 py-3">{product.sku}</td>

                <td className="px-4 py-3">{product.brand?.name ?? '-'}</td>

                <td className="px-4 py-3">${product.price}</td>

                <td className="px-4 py-3">{product.stock}</td>

                <td className="px-4 py-3">
                  {product.active ? 'Active' : 'Inactive'}
                </td>

                <td className="space-x-2 px-4 py-3">
                  <button
                    onClick={() => handleEditProduct(product)}
                    className="cursor-pointer rounded bg-blue-500 px-3 py-1 text-white"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => handleDeleteProduct(product.id)}
                    disabled={isDeleting && deletingId === product.id}
                    className="cursor-pointer rounded bg-red-500 px-3 py-1 text-white disabled:opacity-50"
                  >
                    {isDeleting && deletingId === product.id
                      ? 'Deleting...'
                      : 'Delete'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ProductModal
        open={openModal}
        name={name}
        setName={setName}
        slug={slug}
        setSlug={setSlug}
        sku={sku}
        setSku={setSku}
        shortDescription={shortDescription}
        setShortDescription={setShortDescription}
        longDescription={longDescription}
        setLongDescription={setLongDescription}
        price={price}
        setPrice={setPrice}
        salePrice={salePrice}
        setSalePrice={setSalePrice}
        stock={stock}
        setStock={setStock}
        weight={weight}
        setWeight={setWeight}
        active={active}
        setActive={setActive}
        featured={featured}
        setFeatured={setFeatured}
        sortOrder={sortOrder}
        setSortOrder={setSortOrder}
        brandId={brandId}
        setBrandId={setBrandId}
        categoryIds={categoryIds}
        setCategoryIds={setCategoryIds}
        brands={brandsData?.data.items ?? []}
        categories={categoriesData?.data.items ?? []}
        isLoading={isCreating || isUpdating}
        isEdit={false}
        onClose={() => setOpenModal(false)}
        onSave={isEdit ? handleUpdateProduct : handleCreateProduct}
      />
    </div>
  );
};

export default Product;
