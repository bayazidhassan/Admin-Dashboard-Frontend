import { baseApi } from '../../app/baseApi';

export interface Brand {
  id: string;
  name: string;
  slug: string;
  logo: string | null;
  status: boolean;
  description: string | null;
}

interface BrandsResponse {
  success: boolean;
  message: string;
  data: {
    items: Brand[];
    total: number;
    page: number;
    limit: number;
  };
}

interface BrandResponse {
  success: boolean;
  message: string;
  data: Brand;
}

interface CreateBrandRequest {
  name: string;
  slug: string;
  logo?: string;
  status: boolean;
  description?: string;
}

interface UpdateBrandRequest {
  id: string;

  name?: string;
  slug?: string;
  logo?: string;
  status?: boolean;
  description?: string;
}

export const brandApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getBrands: builder.query<BrandsResponse, void>({
      query: () => ({
        url: '/brands',
      }),
      providesTags: ['Brand'],
    }),

    getBrandById: builder.query<BrandResponse, string>({
      query: (id) => ({
        url: `/brands/${id}`,
      }),
      providesTags: (_r, _e, id) => [{ type: 'Brand', id }],
    }),

    createBrand: builder.mutation<BrandResponse, CreateBrandRequest>({
      query: (body) => ({
        url: '/brands',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Brand'],
    }),

    updateBrand: builder.mutation<BrandResponse, UpdateBrandRequest>({
      query: ({ id, ...body }) => ({
        url: `/brands/${id}`,
        method: 'PATCH',
        body,
      }),
      invalidatesTags: (_r, _e, arg) => [
        'Brand',
        { type: 'Brand', id: arg.id },
      ],
    }),

    deleteBrand: builder.mutation<unknown, string>({
      query: (id) => ({
        url: `/brands/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Brand'],
    }),
  }),
});

export const {
  useGetBrandsQuery,
  useGetBrandByIdQuery,
  useCreateBrandMutation,
  useUpdateBrandMutation,
  useDeleteBrandMutation,
} = brandApi;
