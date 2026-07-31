import { baseApi } from '../../app/baseApi';

interface LoginRequest {
  email: string;
  password: string;
}

export interface User {
  id: string;
  email: string;
  active: boolean;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  data: {
    accessToken: string;
    user: User;
  };
}

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<LoginResponse, LoginRequest>({
      query: (body) => ({
        url: '/auth/login',
        method: 'POST',
        body,
      }),
    }),

    logout: builder.mutation({
      query: () => ({
        url: '/auth/logout',
        method: 'POST',
      }),
    }),

    session: builder.query<User, void>({
      query: () => '/auth/session',
    }),
  }),
});

export const { useLoginMutation, useLogoutMutation, useSessionQuery } = authApi;
