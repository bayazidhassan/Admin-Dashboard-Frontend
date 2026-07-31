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

export const permissionApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getPermissionGroups: builder.query<PermissionResponse, void>({
      query: () => ({
        url: '/permissions/groups',
        method: 'GET',
      }),
    }),
  }),
});

export const { useGetPermissionGroupsQuery } = permissionApi;
