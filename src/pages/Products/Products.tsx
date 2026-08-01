import { useState } from 'react';
import ProductModal from '../../components/product/ProductModal';
import { getMediaUrl } from '../../lib/media';

import { useGetAttributesQuery } from '../../features/attribute/attributeApi';
import { useGetBrandsQuery } from '../../features/brand/brandApi';
import { useGetCategoriesQuery } from '../../features/category/categoryApi';

import { toast } from 'react-hot-toast';
import {
  useAddVariantMutation,
  useCreateProductMutation,
  useCreateVariableProductMutation,
  useDeleteProductMutation,
  useDeleteVariantMutation,
  useGetProductsQuery,
  useUpdateProductMutation,
  useUpdateVariableProductMutation,
  useUpdateVariantMutation,
  type GetProductsParams,
  type Product as ProductItem,
} from '../../features/product/productApi';

type VariantForm = {
  id?: string; // present for existing variants, absent for new ones
  sku: string;
  price: number;
  salePrice: number;
  stock: number;
  weight: number;
  attributeValueIds: string[];
};

const emptyVariant: VariantForm = {
  sku: '',
  price: 0,
  salePrice: 0,
  stock: 0,
  weight: 0,
  attributeValueIds: [],
};

const PAGE_SIZE = 10;

const Product = () => {
  // ===============================
  // LIST CONTROLS
  // ===============================
  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const [filterBrandId, setFilterBrandId] = useState('');
  const [filterCategoryId, setFilterCategoryId] = useState('');
  const [filterStatus, setFilterStatus] = useState<'' | 'true' | 'false'>('');
  const [sortBy, setSortBy] =
    useState<GetProductsParams['sortBy']>('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const queryParams: GetProductsParams = {
    page,
    limit: PAGE_SIZE,
    search: search || undefined,
    brandId: filterBrandId || undefined,
    categoryId: filterCategoryId || undefined,
    active: filterStatus === '' ? undefined : filterStatus === 'true',
    sortBy,
    sortOrder,
  };

  const { data, isLoading, error } = useGetProductsQuery(queryParams);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    setSearch(searchInput.trim());
  };

  const handleSortChange = (value: string) => {
    const [field, order] = value.split(':') as [
      GetProductsParams['sortBy'],
      'asc' | 'desc',
    ];
    setSortBy(field);
    setSortOrder(order);
    setPage(1);
  };

  const totalPages = data ? Math.ceil(data.data.total / PAGE_SIZE) : 1;

  // ===============================
  // MODAL / FORM STATE
  // ===============================
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
  const [sortOrderField, setSortOrderField] = useState(0);
  const [brandId, setBrandId] = useState('');
  const [categoryIds, setCategoryIds] = useState<string[]>([]);
  const [productType, setProductType] = useState<'simple' | 'variable'>(
    'simple',
  );
  const [variants, setVariants] = useState<VariantForm[]>([emptyVariant]);
  const [originalVariantIds, setOriginalVariantIds] = useState<string[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<ProductItem | null>(
    null,
  );
  const [isEdit, setIsEdit] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  const { data: brandsData } = useGetBrandsQuery();
  const { data: categoriesData } = useGetCategoriesQuery();
  const { data: attributeData } = useGetAttributesQuery();

  const [createProduct, { isLoading: isCreating }] = useCreateProductMutation();
  const [createVariableProduct, { isLoading: isCreatingVariable }] =
    useCreateVariableProductMutation();
  const [updateProduct, { isLoading: isUpdating }] = useUpdateProductMutation();
  const [updateVariableProduct, { isLoading: isUpdatingVariable }] =
    useUpdateVariableProductMutation();
  const [deleteProduct, { isLoading: isDeleting }] = useDeleteProductMutation();

  const [addVariant, { isLoading: isAddingVariant }] = useAddVariantMutation();
  const [updateVariant, { isLoading: isUpdatingVariant }] =
    useUpdateVariantMutation();
  const [deleteVariant] = useDeleteVariantMutation();

  const resetProductForm = () => {
    setProductType('simple');

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
    setSortOrderField(0);

    setBrandId('');
    setCategoryIds([]);

    setVariants([{ ...emptyVariant }]);
    setOriginalVariantIds([]);
    setFormError(null);
  };

  const handleCreateProduct = async () => {
    setFormError(null);

    if (productType === 'variable' && variants.length === 0) {
      setFormError('A variable product must have at least one variant.');
      return;
    }

    for (const variant of variants) {
      if (variant.salePrice > 0 && variant.salePrice > variant.price) {
        setFormError(
          `Sale price cannot be greater than price for SKU: ${variant.sku || '(empty)'}`,
        );
        return;
      }
    }

    if (salePrice > 0 && salePrice > price) {
      setFormError('Sale price cannot be greater than price.');
      return;
    }

    try {
      if (productType === 'simple') {
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
          sortOrder: sortOrderField,

          brandId: brandId || undefined,
          categoryIds,
        }).unwrap();
      } else {
        await createVariableProduct({
          name,
          slug,

          hasVariants: true,

          shortDescription,
          longDescription,

          weight,

          active,
          featured,
          sortOrder: sortOrderField,

          brandId: brandId || undefined,

          categoryIds,

          variants,
        }).unwrap();
      }

      toast.success('Product created successfully!');

      setOpenModal(false);

      resetProductForm();

      setSelectedProduct(null);
      setIsEdit(false);
    } catch (error) {
      console.log(error);
      setFormError(
        'Something went wrong while saving. Check your input and try again.',
      );
    }
  };

  const handleEditProduct = (product: ProductItem) => {
    setSelectedProduct(product);

    setProductType(product.hasVariants ? 'variable' : 'simple');

    setName(product.name);
    setSlug(product.slug);
    setSku(product.sku ?? '');

    setShortDescription(product.shortDescription ?? '');
    setLongDescription(product.longDescription ?? '');

    setPrice(product.price ?? 0);
    setSalePrice(product.salePrice ?? 0);
    setStock(product.stock ?? 0);
    setWeight(product.weight ?? 0);

    setActive(product.active);
    setFeatured(product.featured);
    setSortOrderField(product.sortOrder);

    setBrandId(product.brandId ?? '');

    setCategoryIds(product.categories.map((category) => category.id));

    if (product.hasVariants) {
      const existingVariants =
        product.variants?.map((variant) => ({
          id: variant.id,
          sku: variant.sku,
          price: variant.price,
          salePrice: variant.salePrice ?? 0,
          stock: variant.stock,
          weight: variant.weight ?? 0,
          attributeValueIds:
            variant.attributeValues?.map((value) => value.id) ?? [],
        })) ?? [];

      setVariants(existingVariants);
      setOriginalVariantIds(
        existingVariants
          .map((v) => v.id)
          .filter((id): id is string => Boolean(id)),
      );
    } else {
      setVariants([{ ...emptyVariant }]);
      setOriginalVariantIds([]);
    }

    setFormError(null);
    setIsEdit(true);
    setOpenModal(true);
  };

  const handleUpdateProduct = async () => {
    if (!selectedProduct) return;

    setFormError(null);

    if (productType === 'variable' && variants.length === 0) {
      setFormError('A variable product must have at least one variant.');
      return;
    }

    for (const variant of variants) {
      if (variant.salePrice > 0 && variant.salePrice > variant.price) {
        setFormError(
          `Sale price cannot be greater than price for SKU: ${variant.sku || '(empty)'}`,
        );
        return;
      }
    }

    if (salePrice > 0 && salePrice > price) {
      setFormError('Sale price cannot be greater than price.');
      return;
    }

    try {
      if (productType === 'variable') {
        await updateVariableProduct({
          id: selectedProduct.id,

          body: {
            name,
            slug,

            shortDescription,
            longDescription,

            weight,

            active,
            featured,

            sortOrder: sortOrderField,

            brandId: brandId || undefined,

            categoryIds,
          },
        }).unwrap();

        const currentIds = variants
          .map((v) => v.id)
          .filter((id): id is string => Boolean(id));

        const removedIds = originalVariantIds.filter(
          (id) => !currentIds.includes(id),
        );

        for (const id of removedIds) {
          await deleteVariant(id).unwrap();
        }

        for (const variant of variants) {
          const payload = {
            sku: variant.sku,
            price: variant.price,
            salePrice: variant.salePrice || undefined,
            stock: variant.stock,
            weight: variant.weight || undefined,
            attributeValueIds: variant.attributeValueIds,
          };

          if (variant.id) {
            await updateVariant({
              variantId: variant.id,
              body: payload,
            }).unwrap();
          } else {
            await addVariant({
              productId: selectedProduct.id,
              body: payload,
            }).unwrap();
          }
        }
      } else {
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

            sortOrder: sortOrderField,

            brandId: brandId || undefined,

            categoryIds,
          },
        }).unwrap();
      }

      setOpenModal(false);

      resetProductForm();

      setSelectedProduct(null);

      setIsEdit(false);
    } catch (error) {
      console.log(error);
      setFormError(
        'Something went wrong while saving. Check your input and try again.',
      );
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
            resetProductForm();

            setSelectedProduct(null);

            setIsEdit(false);

            setOpenModal(true);
          }}
          className="cursor-pointer rounded bg-black px-4 py-2 text-white"
        >
          Create Product
        </button>
      </div>

      <div className="flex flex-wrap items-center gap-3 rounded-lg border bg-white p-4">
        <form onSubmit={handleSearchSubmit} className="flex gap-2">
          <input
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search by name or SKU"
            className="rounded border p-2"
          />
          <button
            type="submit"
            className="rounded border bg-gray-100 px-3 py-2 text-sm"
          >
            Search
          </button>
        </form>

        <select
          value={filterBrandId}
          onChange={(e) => {
            setFilterBrandId(e.target.value);
            setPage(1);
          }}
          className="rounded border p-2 text-sm"
        >
          <option value="">All Brands</option>
          {(brandsData?.data.items ?? []).map((brand) => (
            <option key={brand.id} value={brand.id}>
              {brand.name}
            </option>
          ))}
        </select>

        <select
          value={filterCategoryId}
          onChange={(e) => {
            setFilterCategoryId(e.target.value);
            setPage(1);
          }}
          className="rounded border p-2 text-sm"
        >
          <option value="">All Categories</option>
          {(categoriesData?.data.items ?? []).map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>

        <select
          value={filterStatus}
          onChange={(e) => {
            setFilterStatus(e.target.value as '' | 'true' | 'false');
            setPage(1);
          }}
          className="rounded border p-2 text-sm"
        >
          <option value="">All Status</option>
          <option value="true">Active</option>
          <option value="false">Inactive</option>
        </select>

        <select
          value={`${sortBy}:${sortOrder}`}
          onChange={(e) => handleSortChange(e.target.value)}
          className="rounded border p-2 text-sm"
        >
          <option value="createdAt:desc">Newest First</option>
          <option value="createdAt:asc">Oldest First</option>
          <option value="name:asc">Name A-Z</option>
          <option value="name:desc">Name Z-A</option>
          <option value="price:asc">Price Low-High</option>
          <option value="price:desc">Price High-Low</option>
          <option value="stock:asc">Stock Low-High</option>
          <option value="stock:desc">Stock High-Low</option>
        </select>
      </div>

      <div className="overflow-x-auto rounded-lg border bg-white">
        <table className="min-w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-3 text-left">Image</th>
              <th className="px-4 py-3 text-left">Name</th>
              <th className="px-4 py-3 text-left">SKU</th>
              <th className="px-4 py-3 text-left">Brand</th>
              <th className="px-4 py-3 text-left">Categories</th>
              <th className="px-4 py-3 text-left">Price</th>
              <th className="px-4 py-3 text-left">Stock</th>
              <th className="px-4 py-3 text-left">Status</th>
              <th className="px-4 py-3 text-left">Actions</th>
            </tr>
          </thead>

          <tbody>
            {data?.data.items.map((product) => (
              <tr key={product.id} className="border-t">
                <td className="px-4 py-3">
                  {product.thumbnail?.media ? (
                    <img
                      src={getMediaUrl(
                        product.thumbnail.media.thumbnail ??
                          product.thumbnail.media.publicUrl,
                      )}
                      alt={product.name}
                      className="h-12 w-12 rounded object-cover"
                    />
                  ) : (
                    <div className="flex h-12 w-12 items-center justify-center rounded bg-gray-100 text-xs text-gray-400">
                      No image
                    </div>
                  )}
                </td>

                <td className="px-4 py-3">{product.name}</td>

                <td className="px-4 py-3">
                  {product.hasVariants
                    ? `${product._count.variants} Variants`
                    : product.sku}
                </td>

                <td className="px-4 py-3">{product.brand?.name ?? '-'}</td>

                <td className="px-4 py-3">
                  {product.categories.length > 0
                    ? product.categories.map((c) => c.name).join(', ')
                    : '-'}
                </td>

                <td className="px-4 py-3">
                  {product.hasVariants
                    ? product.minPrice === product.maxPrice
                      ? `$${product.minPrice}`
                      : `$${product.minPrice} - $${product.maxPrice}`
                    : `$${product.price}`}
                </td>

                <td className="px-4 py-3">
                  {product.hasVariants
                    ? `${product._count.variants} Variants`
                    : product.stock}
                </td>

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

            {data?.data.items.length === 0 && (
              <tr>
                <td colSpan={9} className="px-4 py-8 text-center text-gray-500">
                  No products found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {data && data.data.total > PAGE_SIZE && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-500">
            Page {data.data.page} of {totalPages} — {data.data.total} products
          </p>

          <div className="flex gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1}
              className="rounded border px-3 py-1 text-sm disabled:opacity-50"
            >
              Previous
            </button>

            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page >= totalPages}
              className="rounded border px-3 py-1 text-sm disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      )}

      <ProductModal
        open={openModal}
        productId={selectedProduct?.id}
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
        sortOrder={sortOrderField}
        setSortOrder={setSortOrderField}
        brandId={brandId}
        setBrandId={setBrandId}
        categoryIds={categoryIds}
        setCategoryIds={setCategoryIds}
        brands={brandsData?.data.items ?? []}
        categories={categoriesData?.data.items ?? []}
        productType={productType}
        setProductType={setProductType}
        variants={variants}
        setVariants={setVariants}
        attributes={attributeData?.data.items ?? []}
        formError={formError}
        isLoading={
          isCreating ||
          isCreatingVariable ||
          isUpdating ||
          isUpdatingVariable ||
          isAddingVariant ||
          isUpdatingVariant
        }
        isEdit={isEdit}
        onClose={() => {
          setOpenModal(false);

          resetProductForm();

          setSelectedProduct(null);

          setIsEdit(false);
        }}
        onSave={isEdit ? handleUpdateProduct : handleCreateProduct}
      />
    </div>
  );
};

export default Product;
