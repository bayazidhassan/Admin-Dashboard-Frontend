import { baseApi } from '../../app/baseApi';

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (data) => ({
        url: '/auth/login',
        method: 'POST',
        body: data,
      }),
    }),

    getSession: builder.query({
      query: () => ({
        url: '/auth/session',
        method: 'GET',
      }),
    }),

    logout: builder.mutation({
      query: () => ({
        url: '/auth/logout',
        method: 'POST',
      }),
    }),
  }),
});

export const { useLoginMutation, useGetSessionQuery, useLogoutMutation } =
  authApi;
