import type { Brand } from '../../features/brand/brandApi';
import type { Category } from '../../features/category/categoryApi';

interface Props {
  open: boolean;

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

  isLoading: boolean;
  isEdit: boolean;

  onClose: () => void;
  onSave: () => void;
}

const ProductModal = ({
  open,

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

  isLoading,
  isEdit,

  onClose,
  onSave,
}: Props) => {
  if (!open) return null;

  const toggleCategory = (id: string) => {
    setCategoryIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="max-h-[90vh] w-200 overflow-y-auto rounded bg-white p-6">
        <h2 className="mb-6 text-2xl font-bold">
          {isEdit ? 'Edit Product' : 'Create Product'}
        </h2>

        <div className="grid grid-cols-2 gap-4">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Name"
            className="rounded border p-2"
          />

          <input
            value={slug}
            readOnly={isEdit}
            onChange={(e) => setSlug(e.target.value)}
            placeholder="Slug"
            className={`rounded border p-2 ${
              isEdit ? 'cursor-not-allowed bg-gray-100' : ''
            }`}
          />

          <input
            value={sku}
            onChange={(e) => setSku(e.target.value)}
            placeholder="SKU"
            className="rounded border p-2"
          />

          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(Number(e.target.value))}
            placeholder="Price"
            className="rounded border p-2"
          />

          <input
            type="number"
            value={salePrice}
            onChange={(e) => setSalePrice(Number(e.target.value))}
            placeholder="Sale Price"
            className="rounded border p-2"
          />

          <input
            type="number"
            value={stock}
            onChange={(e) => setStock(Number(e.target.value))}
            placeholder="Stock"
            className="rounded border p-2"
          />

          <input
            type="number"
            value={weight}
            onChange={(e) => setWeight(Number(e.target.value))}
            placeholder="Weight"
            className="rounded border p-2"
          />

          <input
            type="number"
            value={sortOrder}
            onChange={(e) => setSortOrder(Number(e.target.value))}
            placeholder="Sort Order"
            className="rounded border p-2"
          />
        </div>

        <textarea
          value={shortDescription}
          onChange={(e) => setShortDescription(e.target.value)}
          placeholder="Short Description"
          className="mt-4 w-full rounded border p-2"
        />

        <textarea
          value={longDescription}
          onChange={(e) => setLongDescription(e.target.value)}
          placeholder="Long Description"
          rows={5}
          className="mt-4 w-full rounded border p-2"
        />

        <select
          value={brandId}
          onChange={(e) => setBrandId(e.target.value)}
          className="mt-4 w-full rounded border p-2"
        >
          <option value="">Select Brand</option>

          {brands.map((brand) => (
            <option key={brand.id} value={brand.id}>
              {brand.name}
            </option>
          ))}
        </select>

        <div className="mt-6 rounded border p-4">
          <h3 className="mb-3 font-semibold">Categories</h3>

          <div className="grid grid-cols-2 gap-2">
            {categories.map((category) => (
              <label key={category.id} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={categoryIds.includes(category.id)}
                  onChange={() => toggleCategory(category.id)}
                />

                {category.name}
              </label>
            ))}
          </div>
        </div>

        <div className="mt-6 flex gap-6">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={active}
              onChange={(e) => setActive(e.target.checked)}
            />
            Active
          </label>

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={featured}
              onChange={(e) => setFeatured(e.target.checked)}
            />
            Featured
          </label>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="cursor-pointer rounded border px-4 py-2"
          >
            Cancel
          </button>

          <button
            disabled={isLoading}
            onClick={onSave}
            className="cursor-pointer rounded bg-blue-600 px-4 py-2 text-white disabled:opacity-50"
          >
            {isLoading ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductModal;
