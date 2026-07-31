import { baseApi } from '../../app/baseApi';

export interface Role {
  id: string;
  name: string;
  description: string;
  status: boolean;
  permissions: {
    id: string;
    name: string;
    description: string;
    groupId: string;
  }[];
  _count: {
    users: number;
  };
}

interface RoleResponse {
  success: boolean;
  message: string;
  data: {
    items: Role[];
    total: number;
    page: number;
    limit: number;
  };
}

interface RoleDetailsResponse {
  success: boolean;
  message: string;
  data: Role;
}

interface CreateRoleRequest {
  name: string;
  description?: string;
  status: boolean;
  permissionIds: string[];
}

interface UpdateRoleRequest {
  id: string;
  description?: string;
  addPermissionIds?: string[];
  removePermissionIds?: string[];
}

export const roleApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getRoles: builder.query<RoleResponse, void>({
      query: () => ({
        url: '/roles',
        method: 'GET',
      }),
      providesTags: ['Role'],
    }),

    getRoleById: builder.query<RoleDetailsResponse, string>({
      query: (id) => ({
        url: `/roles/${id}`,
        method: 'GET',
      }),
      providesTags: (_result, _error, id) => [{ type: 'Role', id }],
    }),

    createRole: builder.mutation<unknown, CreateRoleRequest>({
      query: (body) => ({
        url: '/roles',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Role'],
    }),

    updateRole: builder.mutation<unknown, UpdateRoleRequest>({
      query: ({ id, ...body }) => ({
        url: `/roles/${id}`,
        method: 'PATCH',
        body,
      }),
      invalidatesTags: (_result, _error, arg) => [
        'Role',
        { type: 'Role', id: arg.id },
      ],
    }),

    deleteRole: builder.mutation<unknown, string>({
      query: (id) => ({
        url: `/roles/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Role'],
    }),
  }),
});

export const {
  useGetRolesQuery,
  useGetRoleByIdQuery,
  useCreateRoleMutation,
  useUpdateRoleMutation,
  useDeleteRoleMutation,
} = roleApi;
