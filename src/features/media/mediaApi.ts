import { baseApi } from '../../app/baseApi';

export interface Media {
  id: string;

  fileName: string;

  storedPath: string;

  publicUrl: string;

  mimeType: string;

  type: string;

  size: number;

  width: number | null;

  height: number | null;

  thumbnail: string | null;

  altText: string | null;

  title: string | null;

  uploadedById: string;

  createdAt: string;

  updatedAt: string;

  uploadedBy: {
    id: string;
    name: string;
    email: string;
  };
}

interface MediaResponse {
  success: boolean;
  message: string;
  data: {
    items: Media[];
    total: number;
    page: number;
    limit: number;
  };
}

interface SingleMediaResponse {
  success: boolean;
  message: string;
  data: Media;
}

interface UpdateMediaRequest {
  id: string;
  title?: string;
  altText?: string;
}

export const mediaApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getMedia: builder.query<MediaResponse, void>({
      query: () => ({
        url: '/media',
      }),
      providesTags: ['Media'],
    }),

    getMediaById: builder.query<SingleMediaResponse, string>({
      query: (id) => ({
        url: `/media/${id}`,
      }),
      providesTags: ['Media'],
    }),

    uploadMedia: builder.mutation<unknown, FormData>({
      query: (body) => ({
        url: '/media/upload',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Media'],
    }),

    updateMedia: builder.mutation<unknown, UpdateMediaRequest>({
      query: ({ id, ...body }) => ({
        url: `/media/${id}`,
        method: 'PATCH',
        body,
      }),
      invalidatesTags: ['Media'],
    }),

    deleteMedia: builder.mutation<unknown, string>({
      query: (id) => ({
        url: `/media/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Media'],
    }),
  }),
});

export const {
  useGetMediaQuery,
  useGetMediaByIdQuery,
  useUploadMediaMutation,
  useUpdateMediaMutation,
  useDeleteMediaMutation,
} = mediaApi;
