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
  useLogoutMutation,
} = authApi;
