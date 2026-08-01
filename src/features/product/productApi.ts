import { baseApi } from '../../app/baseApi';

export interface Product {
  id: string;
  name: string;
  slug: string;
  sku: string;
  shortDescription?: string;
  longDescription?: string;
  hasVariants: boolean;
  price: number;
  salePrice?: number;
  stock: number;
  stockStatus: string;
  weight?: number;
  active: boolean;
  featured: boolean;
  sortOrder: number;
  brandId?: string;

  brand?: {
    id: string;
    name: string;
  };

  categories: {
    id: string;
    name: string;
  }[];

  thumbnail?: string | null;

  createdAt: string;
  updatedAt: string;
}

export interface ProductsResponse {
  success: boolean;
  message: string;
  data: {
    items: Product[];
    total: number;
    page: number;
    limit: number;
  };
}

export interface ProductResponse {
  success: boolean;
  message: string;
  data: Product;
}

export interface CreateProductDto {
  name: string;
  slug: string;
  sku: string;
  shortDescription?: string;
  longDescription?: string;
  price: number;
  salePrice?: number;
  stock: number;
  weight?: number;
  active?: boolean;
  featured?: boolean;
  sortOrder?: number;
  brandId?: string;
  categoryIds: string[];
}

export type UpdateProductDto = Partial<CreateProductDto>;

export interface AttachProductMediaDto {
  mediaId: string;
  isThumbnail?: boolean;
  isGallery?: boolean;
  sortOrder?: number;
}

export interface ProductMediaResponse {
  success: boolean;
  message: string;
}

export const productApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getProducts: builder.query<ProductsResponse, void>({
      query: () => '/products',
      providesTags: ['Product'],
    }),

    getProductById: builder.query<ProductResponse, string>({
      query: (id) => `/products/${id}`,
      providesTags: ['Product'],
    }),

    createProduct: builder.mutation<ProductResponse, CreateProductDto>({
      query: (body) => ({
        url: '/products',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Product'],
    }),

    updateProduct: builder.mutation<
      ProductResponse,
      { id: string; body: UpdateProductDto }
    >({
      query: ({ id, body }) => ({
        url: `/products/${id}`,
        method: 'PATCH',
        body,
      }),
      invalidatesTags: ['Product'],
    }),

    deleteProduct: builder.mutation<
      { success: boolean; message: string },
      string
    >({
      query: (id) => ({
        url: `/products/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Product'],
    }),

    attachProductMedia: builder.mutation<
      ProductMediaResponse,
      {
        productId: string;
        body: AttachProductMediaDto;
      }
    >({
      query: ({ productId, body }) => ({
        url: `/products/${productId}/media`,
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Product'],
    }),

    detachProductMedia: builder.mutation<
      ProductMediaResponse,
      {
        productId: string;
        mediaId: string;
      }
    >({
      query: ({ productId, mediaId }) => ({
        url: `/products/${productId}/media/${mediaId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Product'],
    }),
  }),
});

export const {
  useGetProductsQuery,
  useGetProductByIdQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
  useAttachProductMediaMutation,
  useDetachProductMediaMutation,
} = productApi;
