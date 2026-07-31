import { baseApi } from '../../app/baseApi';

export interface PermissionGroup {
  id: string;
  name: string;
  description: string;
  permissions: {
    id: string;
    name: string;
    description: string;
  }[];
}

interface PermissionResponse {
  success: boolean;
  message: string;
  data: {
    items: PermissionGroup[];
    total: number;
    page: number;
    limit: number;
  };
}

interface CreatePermissionGroupRequest {
  name: string;
  description?: string;
  actions: string[];
}

export const permissionApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getPermissionGroups: builder.query<PermissionResponse, void>({
      query: () => ({
        url: '/permissions/groups',
        method: 'GET',
      }),
      providesTags: ['Permission'],
    }),
    createPermissionGroup: builder.mutation<
      unknown,
      CreatePermissionGroupRequest
    >({
      query: (body) => ({
        url: '/permissions/groups',
        method: 'POST',
        body,
      }),

      invalidatesTags: ['Permission'],
    }),
    deletePermissionGroup: builder.mutation<
      { success: boolean; message: string },
      string
    >({
      query: (id) => ({
        url: `/permissions/groups/${id}`,
        method: 'DELETE',
      }),

      invalidatesTags: ['Permission'],
    }),
  }),
});

export const {
  useGetPermissionGroupsQuery,
  useCreatePermissionGroupMutation,
  useDeletePermissionGroupMutation,
} = permissionApi;
