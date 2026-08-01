import { baseApi } from '../../app/baseApi';

interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  data: {
    accessToken: string;
  };
}

export interface SessionResponse {
  success: boolean;
  message: string;
  data: {
    id: string;
    email: string;
    active: boolean;
    role: string;
    permissions: string[];
  };
}

export interface RefreshResponse {
  success: boolean;
  message: string;
  data: {
    accessToken: string;
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

    session: builder.query<SessionResponse, void>({
      query: () => ({
        url: '/auth/session',
        method: 'GET',
      }),
    }),

    refresh: builder.mutation<RefreshResponse, void>({
      query: () => ({
        url: '/auth/refresh',
        method: 'POST',
      }),
    }),

    logout: builder.mutation<{ success: boolean; message: string }, void>({
      query: () => ({
        url: '/auth/logout',
        method: 'POST',
      }),
    }),
  }),
});

export const {
  useLoginMutation,
  useLazySessionQuery,
  useSessionQuery,
  useRefreshMutation,
  useLogoutMutation,
} = authApi;
