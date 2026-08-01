import {
  createApi,
  fetchBaseQuery,
  type BaseQueryFn,
  type FetchArgs,
  type FetchBaseQueryError,
} from '@reduxjs/toolkit/query/react';
import { Mutex } from 'async-mutex';
import { logout, setCredentials } from '../features/auth/authSlice';
import type { RootState } from './storeTypes';

// Prevents multiple simultaneous requests from all triggering their own
// refresh call at once — only one refresh happens at a time, the rest wait.
const mutex = new Mutex();

const rawBaseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_API_URL,
  credentials: 'include',
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth.accessToken;

    if (token) {
      headers.set('authorization', `Bearer ${token}`);
    }

    return headers;
  },
});

const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  await mutex.waitForUnlock();

  let result = await rawBaseQuery(args, api, extraOptions);

  if (result.error && result.error.status === 401) {
    // Don't try to refresh if the failing request WAS the refresh call itself
    const isRefreshCall =
      typeof args !== 'string' && args.url === '/auth/refresh';

    if (!isRefreshCall) {
      if (!mutex.isLocked()) {
        const release = await mutex.acquire();

        try {
          const refreshResult = await rawBaseQuery(
            { url: '/auth/refresh', method: 'POST' },
            api,
            extraOptions,
          );

          if (refreshResult.data) {
            const { data } = refreshResult.data as {
              data: { accessToken: string };
            };

            api.dispatch(setCredentials({ accessToken: data.accessToken }));

            // retry the original request with the new access token
            result = await rawBaseQuery(args, api, extraOptions);
          } else {
            api.dispatch(logout());
          }
        } finally {
          release();
        }
      } else {
        // another request already triggered the refresh; wait, then retry
        await mutex.waitForUnlock();
        result = await rawBaseQuery(args, api, extraOptions);
      }
    }
  }

  return result;
};

export const baseApi = createApi({
  reducerPath: 'baseApi',

  tagTypes: [
    'Permission',
    'Role',
    'User',
    'Category',
    'Brand',
    'Attribute',
    'Media',
    'Product',
  ],

  baseQuery: baseQueryWithReauth,

  endpoints: () => ({}),
});
