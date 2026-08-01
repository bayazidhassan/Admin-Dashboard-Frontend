import { baseApi } from '../../app/baseApi';
import type { Brand } from '../brand/brandApi';
import type { Category } from '../category/categoryApi';

export interface ProductThumbnail {
  id: string;
  mediaId: string;
  isThumbnail: boolean;
  isGallery: boolean;
  sortOrder: number;
  media: {
    id: string;
    publicUrl: string;
    thumbnail?: string | null;
    fileName: string;
    altText?: string | null;
    title?: string | null;
  };
}

export type Product = {
  id: string;
  name: string;
  slug: string;

  sku: string | null;

  shortDescription: string | null;
  longDescription: string | null;

  hasVariants: boolean;

  price: number | null;
  salePrice: number | null;
  stock: number | null;

  stockStatus: string | null;

  weight: number | null;

  active: boolean;
  featured: boolean;
  sortOrder: number;

  brandId: string | null;

  brand?: Brand | null;

  categories: Category[];

  variants: {
    id?: string;
    sku: string;
    price: number;
    salePrice: number | null;
    stock: number;
    stockStatus?: string | null;
    weight: number | null;
    active?: boolean;

    attributeValues: {
      id: string;
    }[];
  }[];

  _count: {
    variants: number;
  };

  minPrice?: number | null;
  maxPrice?: number | null;

  minSalePrice?: number | null;
  maxSalePrice?: number | null;

  thumbnail?: ProductThumbnail | null;
};

export interface GetProductsParams {
  page?: number;
  limit?: number;
  search?: string;
  brandId?: string;
  categoryId?: string;
  active?: boolean;
  stockStatus?: string;
  sortBy?:
    | 'createdAt'
    | 'updatedAt'
    | 'name'
    | 'price'
    | 'salePrice'
    | 'stock'
    | 'sortOrder';
  sortOrder?: 'asc' | 'desc';
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

export interface UpdateVariableProductDto {
  name?: string;
  slug?: string;

  shortDescription?: string;
  longDescription?: string;

  weight?: number;

  active?: boolean;
  featured?: boolean;
  sortOrder?: number;

  brandId?: string;
  categoryIds?: string[];
}

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

export interface CreateVariableProductDto {
  name: string;
  slug: string;
  hasVariants: true;
  shortDescription?: string;
  longDescription?: string;
  weight?: number;
  active?: boolean;
  featured?: boolean;
  sortOrder?: number;
  brandId?: string;
  categoryIds: string[];

  variants: {
    sku: string;
    price: number;
    salePrice?: number;
    stock: number;
    lowStockThreshold?: number;
    weight?: number;
    active?: boolean;
    attributeValueIds: string[];
  }[];
}

// --- Variant management ---

export interface AddVariantDto {
  sku: string;
  price: number;
  salePrice?: number;
  stock: number;
  lowStockThreshold?: number;
  weight?: number;
  active?: boolean;
  attributeValueIds: string[];
}

export type UpdateVariantDto = Partial<AddVariantDto>;

export interface VariantResponse {
  success: boolean;
  message: string;
  data: Product['variants'][number];
}

// --- Product media (attachments on the single-product fetch) ---

export interface ProductMediaAttachment {
  id: string;
  mediaId: string;
  isThumbnail: boolean;
  isGallery: boolean;
  sortOrder: number;
  media: {
    id: string;
    publicUrl: string;
    thumbnail?: string | null;
    fileName: string;
    altText?: string | null;
    title?: string | null;
  };
}

export interface ProductDetail extends Product {
  mediaAttachments: ProductMediaAttachment[];
}

export interface ProductDetailResponse {
  success: boolean;
  message: string;
  data: ProductDetail;
}

export interface ReorderMediaItem {
  mediaId: string;
  sortOrder: number;
}

export interface AttachVariantMediaDto {
  mediaId: string;
  isThumbnail?: boolean;
  isGallery?: boolean;
  sortOrder?: number;
}

export interface AttachAttributeValueMediaDto {
  mediaId: string;
  isThumbnail?: boolean;
  isGallery?: boolean;
  sortOrder?: number;
}

export interface AttributeValueMediaResponse {
  success: boolean;
  message: string;
  data: {
    id: string;
    value: string;
    mediaAttachments: ProductMediaAttachment[];
  };
}

const buildProductsQuery = (params?: GetProductsParams) => {
  const searchParams = new URLSearchParams();

  if (params?.page) searchParams.set('page', String(params.page));
  if (params?.limit) searchParams.set('limit', String(params.limit));
  if (params?.search) searchParams.set('search', params.search);
  if (params?.brandId) searchParams.set('brandId', params.brandId);
  if (params?.categoryId) searchParams.set('categoryId', params.categoryId);
  if (params?.active !== undefined)
    searchParams.set('active', String(params.active));
  if (params?.stockStatus) searchParams.set('stockStatus', params.stockStatus);
  if (params?.sortBy) searchParams.set('sortBy', params.sortBy);
  if (params?.sortOrder) searchParams.set('sortOrder', params.sortOrder);

  const qs = searchParams.toString();
  return qs ? `/products?${qs}` : '/products';
};

export const productApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getProducts: builder.query<ProductsResponse, GetProductsParams | void>({
      query: (params) => buildProductsQuery(params ?? undefined),
      providesTags: ['Product'],
    }),

    getProductById: builder.query<ProductDetailResponse, string>({
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

    updateVariableProduct: builder.mutation<
      ProductResponse,
      { id: string; body: UpdateVariableProductDto }
    >({
      query: ({ id, body }) => ({
        url: `/products/variable/${id}`,
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

    reorderProductMedia: builder.mutation<
      ProductDetailResponse,
      { productId: string; items: ReorderMediaItem[] }
    >({
      query: ({ productId, items }) => ({
        url: `/products/${productId}/media/reorder`,
        method: 'PATCH',
        body: { items },
      }),
      invalidatesTags: ['Product'],
    }),

    createVariableProduct: builder.mutation<
      ProductResponse,
      CreateVariableProductDto
    >({
      query: (body) => ({
        url: '/products/variable',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Product'],
    }),

    addVariant: builder.mutation<
      VariantResponse,
      { productId: string; body: AddVariantDto }
    >({
      query: ({ productId, body }) => ({
        url: `/products/${productId}/variants`,
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Product'],
    }),

    updateVariant: builder.mutation<
      VariantResponse,
      { variantId: string; body: UpdateVariantDto }
    >({
      query: ({ variantId, body }) => ({
        url: `/products/variants/${variantId}`,
        method: 'PATCH',
        body,
      }),
      invalidatesTags: ['Product'],
    }),

    deleteVariant: builder.mutation<
      { success: boolean; message: string },
      string
    >({
      query: (variantId) => ({
        url: `/products/variants/${variantId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Product'],
    }),
    attachVariantMedia: builder.mutation<
      ProductMediaResponse,
      { variantId: string; body: AttachVariantMediaDto }
    >({
      query: ({ variantId, body }) => ({
        url: `/products/variants/${variantId}/media`,
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Product'],
    }),

    detachVariantMedia: builder.mutation<
      ProductMediaResponse,
      { variantId: string; mediaId: string }
    >({
      query: ({ variantId, mediaId }) => ({
        url: `/products/variants/${variantId}/media/${mediaId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Product'],
    }),

    attachAttributeValueMedia: builder.mutation<
      AttributeValueMediaResponse,
      { valueId: string; body: AttachAttributeValueMediaDto }
    >({
      query: ({ valueId, body }) => ({
        url: `/products/attribute-values/${valueId}/media`,
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Product'],
    }),

    detachAttributeValueMedia: builder.mutation<
      AttributeValueMediaResponse,
      { valueId: string; mediaId: string }
    >({
      query: ({ valueId, mediaId }) => ({
        url: `/products/attribute-values/${valueId}/media/${mediaId}`,
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
  useUpdateVariableProductMutation,
  useDeleteProductMutation,
  useAttachProductMediaMutation,
  useDetachProductMediaMutation,
  useReorderProductMediaMutation,
  useCreateVariableProductMutation,
  useAddVariantMutation,
  useUpdateVariantMutation,
  useDeleteVariantMutation,
  useAttachVariantMediaMutation,
  useDetachVariantMediaMutation,
  useAttachAttributeValueMediaMutation,
  useDetachAttributeValueMediaMutation,
} = productApi;
