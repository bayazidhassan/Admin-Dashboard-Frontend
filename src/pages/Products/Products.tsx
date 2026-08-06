import { useState } from 'react';
import toast from 'react-hot-toast';
import ConfirmModal from '../../components/common/ConfirmModal';
import ProductModal from '../../components/product/ProductModal';
import { getMediaUrl } from '../../lib/media';

import { useGetAttributesQuery } from '../../features/attribute/attributeApi';
import { useGetBrandsQuery } from '../../features/brand/brandApi';
import { useGetCategoriesQuery } from '../../features/category/categoryApi';

import ErrorState from '../../components/common/ErrorState';
import LoadingState, { Spinner } from '../../components/common/LoadingState';
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
  id?: string;
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
  const [productToDelete, setProductToDelete] = useState<ProductItem | null>(
    null,
  );
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
  const [deleteProduct] = useDeleteProductMutation();

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

  const validateForm = () => {
    if (productType === 'variable' && variants.length === 0) {
      const msg = 'A variable product must have at least one variant.';
      setFormError(msg);
      toast.error(msg);
      return false;
    }

    for (const variant of variants) {
      if (variant.salePrice > 0 && variant.salePrice > variant.price) {
        const msg = `Sale price cannot be greater than price for SKU: ${variant.sku || '(empty)'}`;
        setFormError(msg);
        toast.error(msg);
        return false;
      }
    }

    if (salePrice > 0 && salePrice > price) {
      const msg = 'Sale price cannot be greater than price.';
      setFormError(msg);
      toast.error(msg);
      return false;
    }

    return true;
  };

  const handleCreateProduct = async () => {
    setFormError(null);
    if (!validateForm()) return;

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

      toast.success('Product created');
      setOpenModal(false);
      resetProductForm();
      setSelectedProduct(null);
      setIsEdit(false);
    } catch (error) {
      console.error(error);
      const msg =
        'Something went wrong while saving. Check your input and try again.';
      setFormError(msg);
      toast.error(msg);
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
    if (!validateForm()) return;

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

      toast.success('Product updated');
      setOpenModal(false);
      resetProductForm();
      setSelectedProduct(null);
      setIsEdit(false);
    } catch (error) {
      console.error(error);
      const msg =
        'Something went wrong while saving. Check your input and try again.';
      setFormError(msg);
      toast.error(msg);
    }
  };

  const handleConfirmDelete = async () => {
    if (!productToDelete) return;

    try {
      setDeletingId(productToDelete.id);
      await deleteProduct(productToDelete.id).unwrap();
      toast.success('Product deleted');
    } catch (error) {
      console.error(error);
      toast.error('Failed to delete product');
    } finally {
      setDeletingId(null);
      setProductToDelete(null);
    }
  };

  if (isLoading) {
    return <LoadingState />;
  }

  if (error) {
    return <ErrorState error={error} />;
  }

  const products = data?.data.items ?? [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Products</h1>
          <p className="mt-1 text-sm text-slate-500">
            Manage simple and variable products, with variants and media.
          </p>
        </div>

        <button
          onClick={() => {
            resetProductForm();
            setSelectedProduct(null);
            setIsEdit(false);
            setOpenModal(true);
          }}
          className="cursor-pointer rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-700"
        >
          Create product
        </button>
      </div>

      <div className="flex flex-wrap items-center gap-3 rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
        <form onSubmit={handleSearchSubmit} className="flex gap-2">
          <input
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search by name or SKU"
            className="rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none"
          />
          <button
            type="submit"
            className="cursor-pointer rounded-md border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
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
          className="cursor-pointer rounded-md border border-slate-300 px-3 py-2 text-sm"
        >
          <option value="">All brands</option>
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
          className="cursor-pointer rounded-md border border-slate-300 px-3 py-2 text-sm"
        >
          <option value="">All categories</option>
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
          className="cursor-pointer rounded-md border border-slate-300 px-3 py-2 text-sm"
        >
          <option value="">All status</option>
          <option value="true">Active</option>
          <option value="false">Inactive</option>
        </select>

        <select
          value={`${sortBy}:${sortOrder}`}
          onChange={(e) => handleSortChange(e.target.value)}
          className="cursor-pointer rounded-md border border-slate-300 px-3 py-2 text-sm"
        >
          <option value="createdAt:desc">Newest first</option>
          <option value="createdAt:asc">Oldest first</option>
          <option value="name:asc">Name A-Z</option>
          <option value="name:desc">Name Z-A</option>
          <option value="price:asc">Price low-high</option>
          <option value="price:desc">Price high-low</option>
          <option value="stock:asc">Stock low-high</option>
          <option value="stock:desc">Stock high-low</option>
        </select>
      </div>

      <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
        <table className="w-full text-sm">
          <thead className="bg-slate-50">
            <tr className="border-b border-slate-200 text-left text-xs font-semibold tracking-wide text-slate-500 uppercase">
              <th className="px-4 py-3">Product</th>
              <th className="px-4 py-3">Brand</th>
              <th className="px-4 py-3">Categories</th>
              <th className="px-4 py-3">Price</th>
              <th className="px-4 py-3">Stock</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {products.map((product) => (
              <tr
                key={product.id}
                className="transition-colors hover:bg-slate-50"
              >
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    {product.thumbnail?.media ? (
                      <img
                        src={getMediaUrl(
                          product.thumbnail.media.thumbnail ??
                            product.thumbnail.media.publicUrl,
                        )}
                        alt={product.name}
                        className="h-10 w-10 shrink-0 rounded object-cover"
                      />
                    ) : (
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded bg-slate-100 text-xs text-slate-400">
                        No image
                      </div>
                    )}
                    <div>
                      <p className="font-medium text-slate-900">
                        {product.name}
                      </p>
                      <p className="text-xs text-slate-400">
                        {product.hasVariants
                          ? `${product._count.variants} variants`
                          : product.sku}
                      </p>
                    </div>
                  </div>
                </td>

                <td className="px-4 py-3 text-slate-500">
                  {product.brand?.name ?? '—'}
                </td>

                <td className="px-4 py-3 text-slate-500">
                  {product.categories.length > 0
                    ? product.categories.map((c) => c.name).join(', ')
                    : '—'}
                </td>

                <td className="px-4 py-3 font-medium text-slate-900">
                  {product.hasVariants
                    ? product.minPrice === product.maxPrice
                      ? `$${product.minPrice}`
                      : `$${product.minPrice} - $${product.maxPrice}`
                    : `$${product.price}`}
                </td>

                <td className="px-4 py-3 text-slate-500">
                  {product.hasVariants
                    ? `${product._count.variants} variants`
                    : product.stock}
                </td>

                <td className="px-4 py-3">
                  <span
                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      product.active
                        ? 'bg-emerald-50 text-emerald-700'
                        : 'bg-slate-100 text-slate-500'
                    }`}
                  >
                    {product.active ? 'Active' : 'Inactive'}
                  </span>
                </td>

                <td className="px-4 py-3">
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => handleEditProduct(product)}
                      className="cursor-pointer rounded-md border border-slate-300 px-3 py-1 text-xs font-medium text-slate-700 transition-colors hover:bg-slate-100"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => setProductToDelete(product)}
                      disabled={deletingId === product.id}
                      className="inline-flex cursor-pointer items-center gap-1 rounded-md border border-red-200 px-3 py-1 text-xs font-medium text-red-600 transition-colors hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {deletingId === product.id && (
                        <Spinner className="h-3 w-3" />
                      )}
                      {deletingId === product.id ? 'Deleting...' : 'Delete'}
                    </button>
                  </div>
                </td>
              </tr>
            ))}

            {products.length === 0 && (
              <tr>
                <td
                  colSpan={7}
                  className="px-4 py-10 text-center text-sm text-slate-400"
                >
                  No products found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {data && data.data.total > PAGE_SIZE && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-slate-500">
            Page {data.data.page} of {totalPages} — {data.data.total} products
          </p>

          <div className="flex gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1}
              className="cursor-pointer rounded-md border border-slate-300 px-3 py-1 text-sm disabled:cursor-not-allowed disabled:opacity-50"
            >
              Previous
            </button>

            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page >= totalPages}
              className="cursor-pointer rounded-md border border-slate-300 px-3 py-1 text-sm disabled:cursor-not-allowed disabled:opacity-50"
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

      <ConfirmModal
        open={productToDelete !== null}
        title={`Delete "${productToDelete?.name}"?`}
        description="This will permanently remove the product and its variants. This cannot be undone."
        isLoading={deletingId === productToDelete?.id}
        onConfirm={handleConfirmDelete}
        onCancel={() => setProductToDelete(null)}
      />
    </div>
  );
};

export default Product;
