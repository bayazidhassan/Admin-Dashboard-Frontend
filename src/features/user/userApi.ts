import { baseApi } from '../../app/baseApi';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  avatar: string | null;
  gender: string | null;
  active: boolean;
  roleId: string;

  role: {
    id: string;
    name: string;
    status: boolean;
  };
}

interface UsersResponse {
  success: boolean;
  message: string;
  data: {
    items: User[];
    total: number;
    page: number;
    limit: number;
  };
}

interface UserResponse {
  success: boolean;
  message: string;
  data: User;
}

interface CreateUserRequest {
  name: string;
  email: string;
  password: string;
  roleId: string;
}

interface UpdateUserRequest {
  id: string;

  name?: string;
  email?: string;
  phone?: string;
  gender?: string;
  avatar?: string;
  active?: boolean;
  roleId?: string;
}

interface UpdateUserStatusRequest {
  id: string;
  active: boolean;
}

export const userApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getUsers: builder.query<UsersResponse, void>({
      query: () => ({
        url: '/users',
        method: 'GET',
      }),
      providesTags: ['User'],
    }),

    getUserById: builder.query<UserResponse, string>({
      query: (id) => ({
        url: `/users/${id}`,
        method: 'GET',
      }),
      providesTags: (_result, _error, id) => [{ type: 'User', id }],
    }),

    createUser: builder.mutation<UserResponse, CreateUserRequest>({
      query: (body) => ({
        url: '/users',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['User'],
    }),

    updateUser: builder.mutation<UserResponse, UpdateUserRequest>({
      query: ({ id, ...body }) => ({
        url: `/users/${id}`,
        method: 'PATCH',
        body,
      }),
      invalidatesTags: (_result, _error, arg) => [
        'User',
        { type: 'User', id: arg.id },
      ],
    }),

    updateUserStatus: builder.mutation<UserResponse, UpdateUserStatusRequest>({
      query: ({ id, active }) => ({
        url: `/users/${id}/status`,
        method: 'PATCH',
        body: { active },
      }),
      invalidatesTags: (_result, _error, arg) => [
        'User',
        { type: 'User', id: arg.id },
      ],
    }),

    deleteUser: builder.mutation<unknown, string>({
      query: (id) => ({
        url: `/users/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['User'],
    }),
  }),
});

export const {
  useGetUsersQuery,
  useGetUserByIdQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useUpdateUserStatusMutation,
  useDeleteUserMutation,
} = userApi;
