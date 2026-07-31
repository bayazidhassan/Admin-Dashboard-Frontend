import { useGetProductsQuery } from '../../features/product/productApi';

const Product = () => {
  const { data, isLoading, error } = useGetProductsQuery();

  if (isLoading) return <h2>Loading...</h2>;

  if (error) return <h2>Something went wrong.</h2>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Products</h1>

        <button className="cursor-pointer rounded bg-black px-4 py-2 text-white">
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
                  <button className="cursor-pointer rounded bg-blue-500 px-3 py-1 text-white">
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
      </div>
    </div>
  );
};

export default Product;
