import { baseApi } from '../../app/baseApi';

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image: string | null;
  parentId: string | null;
  active: boolean;
  sortOrder: number;

  parent: {
    id: string;
    name: string;
  } | null;

  _count?: {
    children: number;
  };
}

export interface CategoryTree {
  id: string;
  name: string;
  slug: string;
  parentId: string | null;

  children: CategoryTree[];
}

interface CategoriesResponse {
  success: boolean;
  message: string;
  data: {
    items: Category[];
    total: number;
    page: number;
    limit: number;
  };
}

interface CategoryResponse {
  success: boolean;
  message: string;
  data: Category;
}

interface CategoryTreeResponse {
  success: boolean;
  message: string;
  data: CategoryTree[];
}

interface CreateCategoryRequest {
  name: string;
  slug: string;
  description?: string;
  image?: string;
  parentId?: string;
  active: boolean;
  sortOrder: number;
}

interface UpdateCategoryRequest {
  id: string;

  name?: string;
  slug?: string;
  description?: string;
  image?: string;
  parentId?: string;
  active?: boolean;
  sortOrder?: number;
}

export const categoryApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCategories: builder.query<CategoriesResponse, void>({
      query: () => ({
        url: '/categories',
      }),
      providesTags: ['Category'],
    }),

    getCategoryTree: builder.query<CategoryTreeResponse, void>({
      query: () => ({
        url: '/categories/tree',
      }),
      providesTags: ['Category'],
    }),

    getCategoryById: builder.query<CategoryResponse, string>({
      query: (id) => ({
        url: `/categories/${id}`,
      }),
      providesTags: (_r, _e, id) => [{ type: 'Category', id }],
    }),

    createCategory: builder.mutation<CategoryResponse, CreateCategoryRequest>({
      query: (body) => ({
        url: '/categories',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Category'],
    }),

    updateCategory: builder.mutation<CategoryResponse, UpdateCategoryRequest>({
      query: ({ id, ...body }) => ({
        url: `/categories/${id}`,
        method: 'PATCH',
        body,
      }),
      invalidatesTags: (_r, _e, arg) => [
        'Category',
        { type: 'Category', id: arg.id },
      ],
    }),

    deleteCategory: builder.mutation<unknown, string>({
      query: (id) => ({
        url: `/categories/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Category'],
    }),
  }),
});

export const {
  useGetCategoriesQuery,
  useGetCategoryTreeQuery,
  useGetCategoryByIdQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
} = categoryApi;
