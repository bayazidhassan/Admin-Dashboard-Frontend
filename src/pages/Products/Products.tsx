import { useState } from 'react';
import ProductModal from '../../components/product/ProductModal';

import { useGetAttributesQuery } from '../../features/attribute/attributeApi';
import { useGetBrandsQuery } from '../../features/brand/brandApi';
import { useGetCategoriesQuery } from '../../features/category/categoryApi';

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
  const [productType, setProductType] = useState<'simple' | 'variable'>(
    'simple',
  );
  const [variants, setVariants] = useState<VariantForm[]>([emptyVariant]);
  // track ids that existed on load, so we know what was removed on save
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

  // ===============================
  // RESET FORM
  // ===============================

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
    setSortOrder(0);

    setBrandId('');
    setCategoryIds([]);

    setVariants([{ ...emptyVariant }]);
    setOriginalVariantIds([]);
    setFormError(null);
  };

  // ===============================
  // CREATE PRODUCT
  // ===============================

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
          sortOrder,

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
          sortOrder,

          brandId: brandId || undefined,

          categoryIds,

          variants,
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

  // ===============================
  // EDIT PRODUCT
  // ===============================

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
    setSortOrder(product.sortOrder);

    setBrandId(product.brandId ?? '');

    setCategoryIds(product.categories.map((category) => category.id));

    // IMPORTANT FOR VARIABLE PRODUCT
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

  // ===============================
  // UPDATE PRODUCT
  // ===============================

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
        // 1. Update product-level fields only (backend ignores variants here)
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

            sortOrder,

            brandId: brandId || undefined,

            categoryIds,
          },
        }).unwrap();

        // 2. Reconcile variants against what existed before
        const currentIds = variants
          .map((v) => v.id)
          .filter((id): id is string => Boolean(id));

        const removedIds = originalVariantIds.filter(
          (id) => !currentIds.includes(id),
        );

        // Delete variants that were removed from the form
        for (const id of removedIds) {
          await deleteVariant(id).unwrap();
        }

        // Update existing / add new variants
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

            sortOrder,

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

  // ===============================
  // DELETE PRODUCT
  // ===============================

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

                <td className="px-4 py-3">
                  {product.hasVariants
                    ? `${product._count.variants} Variants`
                    : product.sku}
                </td>

                <td className="px-4 py-3">{product.brand?.name ?? '-'}</td>

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
          </tbody>
        </table>
      </div>

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
        sortOrder={sortOrder}
        setSortOrder={setSortOrder}
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
