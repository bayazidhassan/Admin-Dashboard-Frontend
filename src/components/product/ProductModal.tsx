import type { Attribute } from '../../features/attribute/attributeApi';
import type { Brand } from '../../features/brand/brandApi';
import type { Category } from '../../features/category/categoryApi';
import ProductMediaManager from './ProductMediaManager';

type VariantForm = {
  id?: string;
  sku: string;
  price: number;
  salePrice: number;
  stock: number;
  weight: number;
  attributeValueIds: string[];
};

type CategoryWithParent = {
  id: string;
  name: string;
  parentId?: string | null;
};

function sortCategoriesAsTree<T extends CategoryWithParent>(
  categories: T[],
): { category: T; depth: number }[] {
  const byParent = new Map<string | null, T[]>();

  for (const cat of categories) {
    const key = cat.parentId ?? null;
    if (!byParent.has(key)) byParent.set(key, []);
    byParent.get(key)!.push(cat);
  }

  const result: { category: T; depth: number }[] = [];

  const walk = (parentId: string | null, depth: number) => {
    const children = byParent.get(parentId) ?? [];
    for (const child of children) {
      result.push({ category: child, depth });
      walk(child.id, depth + 1);
    }
  };

  walk(null, 0);
  return result;
}

interface Props {
  open: boolean;
  productId?: string;
  name: string;
  setName: React.Dispatch<React.SetStateAction<string>>;
  slug: string;
  setSlug: React.Dispatch<React.SetStateAction<string>>;
  sku: string;
  setSku: React.Dispatch<React.SetStateAction<string>>;
  shortDescription: string;
  setShortDescription: React.Dispatch<React.SetStateAction<string>>;
  longDescription: string;
  setLongDescription: React.Dispatch<React.SetStateAction<string>>;
  price: number;
  setPrice: React.Dispatch<React.SetStateAction<number>>;
  salePrice: number;
  setSalePrice: React.Dispatch<React.SetStateAction<number>>;
  stock: number;
  setStock: React.Dispatch<React.SetStateAction<number>>;
  weight: number;
  setWeight: React.Dispatch<React.SetStateAction<number>>;
  active: boolean;
  setActive: React.Dispatch<React.SetStateAction<boolean>>;
  featured: boolean;
  setFeatured: React.Dispatch<React.SetStateAction<boolean>>;
  sortOrder: number;
  setSortOrder: React.Dispatch<React.SetStateAction<number>>;
  brandId: string;
  setBrandId: React.Dispatch<React.SetStateAction<string>>;
  categoryIds: string[];
  setCategoryIds: React.Dispatch<React.SetStateAction<string[]>>;
  brands: Brand[];
  categories: Category[];
  productType: 'simple' | 'variable';
  setProductType: React.Dispatch<React.SetStateAction<'simple' | 'variable'>>;
  variants: VariantForm[];
  setVariants: React.Dispatch<React.SetStateAction<VariantForm[]>>;
  attributes: Attribute[];
  formError?: string | null;
  isLoading: boolean;
  isEdit: boolean;
  onClose: () => void;
  onSave: () => void;
}

const Spinner = ({ className = 'h-4 w-4' }: { className?: string }) => (
  <svg className={`${className} animate-spin`} viewBox="0 0 24 24" fill="none">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 0 1 8-8V0C5.4 0 0 5.4 0 12h4Z" />
  </svg>
);

const inputClass =
  'w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none';
const labelClass = 'mb-1 block text-xs font-medium text-slate-500';

const ProductModal = ({
  open,
  productId,
  name,
  setName,
  slug,
  setSlug,
  sku,
  setSku,
  shortDescription,
  setShortDescription,
  longDescription,
  setLongDescription,
  price,
  setPrice,
  salePrice,
  setSalePrice,
  stock,
  setStock,
  weight,
  setWeight,
  active,
  setActive,
  featured,
  setFeatured,
  sortOrder,
  setSortOrder,
  brandId,
  setBrandId,
  categoryIds,
  setCategoryIds,
  brands,
  categories,
  productType,
  setProductType,
  variants,
  setVariants,
  attributes,
  formError,
  isLoading,
  isEdit,
  onClose,
  onSave,
}: Props) => {
  if (!open) return null;

  const toggleCategory = (id: string) => {
    setCategoryIds((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]));
  };

  const handleRemoveVariant = (index: number) => {
    if (variants.length <= 1) return;
    setVariants((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-lg bg-white shadow-lg">
        <div className="sticky top-0 z-10 border-b border-slate-200 bg-white px-6 py-4">
          <h2 className="text-lg font-semibold text-slate-900">
            {isEdit ? 'Edit product' : 'Create product'}
          </h2>
        </div>

        <div className="space-y-5 px-6 py-5">
          {formError && (
            <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
              {formError}
            </div>
          )}

          <div>
            <label className={labelClass}>Product type</label>
            <select
              value={productType}
              disabled={isEdit}
              onChange={(e) => setProductType(e.target.value as 'simple' | 'variable')}
              className={`${inputClass} cursor-pointer ${
                isEdit ? 'cursor-not-allowed border-slate-200 bg-slate-50 text-slate-500' : ''
              }`}
            >
              <option value="simple">Simple product</option>
              <option value="variable">Variable product</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelClass}>Name</label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Product name"
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>Slug</label>
              <input
                value={slug}
                readOnly={isEdit}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="product-name"
                className={`${inputClass} ${
                  isEdit ? 'cursor-not-allowed border-slate-200 bg-slate-50 text-slate-500' : ''
                }`}
              />
            </div>
          </div>

          {productType === 'simple' && (
            <div className="grid grid-cols-2 gap-3 rounded-lg border border-slate-200 p-4 sm:grid-cols-4">
              <div className="col-span-2 sm:col-span-1">
                <label className={labelClass}>SKU</label>
                <input
                  value={sku}
                  readOnly={isEdit}
                  onChange={(e) => setSku(e.target.value)}
                  placeholder="SKU-001"
                  className={`${inputClass} ${
                    isEdit ? 'cursor-not-allowed border-slate-200 bg-slate-50 text-slate-500' : ''
                  }`}
                />
              </div>

              <div>
                <label className={labelClass}>Price</label>
                <input
                  type="number"
                  value={price || ''}
                  onChange={(e) => setPrice(Number(e.target.value))}
                  placeholder="0.00"
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>Sale price</label>
                <input
                  type="number"
                  value={salePrice || ''}
                  onChange={(e) => setSalePrice(Number(e.target.value))}
                  placeholder="0.00"
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>Stock</label>
                <input
                  type="number"
                  value={stock || ''}
                  onChange={(e) => setStock(Number(e.target.value))}
                  placeholder="0"
                  className={inputClass}
                />
              </div>
            </div>
          )}

          {productType === 'variable' && (
            <div className="rounded-lg border border-slate-200 p-4">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-sm font-semibold text-slate-800">Variants</h3>

                <button
                  type="button"
                  onClick={() =>
                    setVariants((prev) => [
                      ...prev,
                      { sku: '', price: 0, salePrice: 0, stock: 0, weight: 0, attributeValueIds: [] },
                    ])
                  }
                  className="cursor-pointer rounded-md bg-indigo-600 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-indigo-700"
                >
                  + Add variant
                </button>
              </div>

              {variants.map((variant, index) => (
                <div key={index} className="mb-4 rounded-md border border-slate-200 p-4">
                  <div className="mb-3 flex items-center justify-between">
                    <h4 className="text-sm font-medium text-slate-700">Variant #{index + 1}</h4>

                    <button
                      type="button"
                      onClick={() => handleRemoveVariant(index)}
                      disabled={variants.length <= 1}
                      className="cursor-pointer rounded-md border border-red-200 px-2 py-1 text-xs font-medium text-red-600 transition-colors hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                      title={variants.length <= 1 ? 'At least one variant is required' : 'Remove this variant'}
                    >
                      Remove
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
                    <input
                      value={variant.sku}
                      onChange={(e) =>
                        setVariants((prev) => {
                          const copy = [...prev];
                          copy[index] = { ...copy[index], sku: e.target.value };
                          return copy;
                        })
                      }
                      placeholder="SKU"
                      className={inputClass}
                    />

                    <input
                      type="number"
                      value={variant.price || ''}
                      onChange={(e) =>
                        setVariants((prev) => {
                          const copy = [...prev];
                          copy[index] = { ...copy[index], price: Number(e.target.value) };
                          return copy;
                        })
                      }
                      placeholder="Price"
                      className={inputClass}
                    />

                    <input
                      type="number"
                      value={variant.salePrice || ''}
                      onChange={(e) =>
                        setVariants((prev) => {
                          const copy = [...prev];
                          copy[index] = { ...copy[index], salePrice: Number(e.target.value) };
                          return copy;
                        })
                      }
                      placeholder="Sale price"
                      className={inputClass}
                    />

                    <input
                      type="number"
                      value={variant.stock || ''}
                      onChange={(e) =>
                        setVariants((prev) => {
                          const copy = [...prev];
                          copy[index] = { ...copy[index], stock: Number(e.target.value) };
                          return copy;
                        })
                      }
                      placeholder="Stock"
                      className={inputClass}
                    />

                    <input
                      type="number"
                      value={variant.weight || ''}
                      onChange={(e) =>
                        setVariants((prev) => {
                          const copy = [...prev];
                          copy[index] = { ...copy[index], weight: Number(e.target.value) };
                          return copy;
                        })
                      }
                      placeholder="Weight"
                      className={inputClass}
                    />

                    <div className="col-span-2 mt-2 sm:col-span-5">
                      <p className="mb-2 text-xs font-semibold tracking-wide text-slate-500 uppercase">
                        Attribute values
                      </p>

                      {attributes.map((attribute) => (
                        <div key={attribute.id} className="mb-2">
                          <p className="mb-1.5 text-xs font-medium text-slate-600">{attribute.name}</p>

                          <div className="flex flex-wrap gap-2">
                            {attribute.values.map((value) => {
                              const checked = variant.attributeValueIds.includes(value.id);
                              return (
                                <button
                                  key={value.id}
                                  type="button"
                                  onClick={() =>
                                    setVariants((prev) =>
                                      prev.map((v, i) => {
                                        if (i !== index) return v;
                                        return {
                                          ...v,
                                          attributeValueIds: checked
                                            ? v.attributeValueIds.filter((id) => id !== value.id)
                                            : [...new Set([...v.attributeValueIds, value.id])],
                                        };
                                      }),
                                    )
                                  }
                                  className={`rounded-full border px-2.5 py-1 text-xs font-medium transition-colors ${
                                    checked
                                      ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                                      : 'border-slate-300 text-slate-600 hover:border-slate-400'
                                  }`}
                                >
                                  {value.value}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelClass}>Weight</label>
              <input
                type="number"
                value={weight || ''}
                onChange={(e) => setWeight(Number(e.target.value))}
                placeholder="Optional"
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>Sort order</label>
              <input
                type="number"
                value={sortOrder || ''}
                onChange={(e) => setSortOrder(Number(e.target.value))}
                placeholder="0"
                className={inputClass}
              />
            </div>
          </div>

          <div>
            <label className={labelClass}>Short description</label>
            <textarea
              value={shortDescription}
              onChange={(e) => setShortDescription(e.target.value)}
              placeholder="A brief summary"
              rows={2}
              className={`${inputClass} resize-none`}
            />
          </div>

          <div>
            <label className={labelClass}>Long description</label>
            <textarea
              value={longDescription}
              onChange={(e) => setLongDescription(e.target.value)}
              placeholder="Full product details"
              rows={4}
              className={`${inputClass} resize-none`}
            />
          </div>

          <div>
            <label className={labelClass}>Brand</label>
            <select
              value={brandId}
              onChange={(e) => setBrandId(e.target.value)}
              className={`${inputClass} cursor-pointer`}
            >
              <option value="">Select brand</option>
              {brands.map((brand) => (
                <option key={brand.id} value={brand.id}>
                  {brand.name}
                </option>
              ))}
            </select>
          </div>

          <div className="rounded-lg border border-slate-200 p-4">
            <h3 className="mb-3 text-sm font-semibold text-slate-800">Categories</h3>

            <div className="flex flex-col gap-1.5">
              {sortCategoriesAsTree(categories).map(({ category, depth }) => (
                <label
                  key={category.id}
                  className="flex items-center gap-2 text-sm text-slate-700"
                  style={{ paddingLeft: `${depth * 20}px` }}
                >
                  <input
                    type="checkbox"
                    checked={categoryIds.includes(category.id)}
                    onChange={() => toggleCategory(category.id)}
                    className="accent-indigo-600"
                  />
                  {depth > 0 && <span className="text-slate-400">└</span>}
                  {category.name}
                </label>
              ))}
            </div>
          </div>

          {isEdit && productId && <ProductMediaManager productId={productId} />}

          <div className="flex gap-6">
            <label className="flex items-center gap-2 text-sm text-slate-700">
              <input
                type="checkbox"
                checked={active}
                onChange={(e) => setActive(e.target.checked)}
                className="accent-indigo-600"
              />
              Active
            </label>

            <label className="flex items-center gap-2 text-sm text-slate-700">
              <input
                type="checkbox"
                checked={featured}
                onChange={(e) => setFeatured(e.target.checked)}
                className="accent-indigo-600"
              />
              Featured
            </label>
          </div>
        </div>

        <div className="sticky bottom-0 flex justify-end gap-3 border-t border-slate-200 bg-white px-6 py-4">
          <button
            onClick={onClose}
            className="cursor-pointer rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
          >
            Cancel
          </button>

          <button
            disabled={isLoading}
            onClick={onSave}
            className="inline-flex cursor-pointer items-center gap-2 rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isLoading && <Spinner />}
            {isLoading ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductModal;
