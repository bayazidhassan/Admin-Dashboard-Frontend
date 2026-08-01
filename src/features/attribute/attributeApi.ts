import { baseApi } from '../../app/baseApi';

export type AttributeType =
  | 'dropdown'
  | 'radio'
  | 'checkbox'
  | 'color_swatch'
  | 'image_swatch';

export interface AttributeValue {
  id: string;
  value: string;
  slug: string;
  referenceValue: string | null;
  attributeId: string;
  mediaAttachments: {
    id: string;
    mediaId: string;
    isThumbnail: boolean;
    isGallery: boolean;
    sortOrder: number;
    media: {
      id: string;
      publicUrl: string;
      thumbnail?: string | null;
      fileName: string;
      altText?: string | null;
      title?: string | null;
    };
  }[];
}

export interface Attribute {
  id: string;
  name: string;
  slug: string;
  type: AttributeType;
  values: AttributeValue[];
  _count: {
    values: number;
  };
}

interface AttributesResponse {
  success: boolean;
  message: string;
  data: {
    items: Attribute[];
    total: number;
    page: number;
    limit: number;
  };
}

interface AttributeResponse {
  success: boolean;
  message: string;
  data: Attribute;
}

interface CreateAttributeRequest {
  name: string;
  slug: string;
  type: AttributeType;
}

interface UpdateAttributeRequest {
  id: string;
  name?: string;
  slug?: string;
  type?: AttributeType;
}

interface AddAttributeValueRequest {
  id: string;
  value: string;
  slug: string;
  referenceValue?: string;
}

interface UpdateAttributeValueRequest {
  valueId: string;
  value?: string;
  slug?: string;
  referenceValue?: string;
}

export const attributeApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAttributes: builder.query<AttributesResponse, void>({
      query: () => ({
        url: '/attributes',
      }),
      providesTags: ['Attribute'],
    }),

    getAttributeById: builder.query<AttributeResponse, string>({
      query: (id) => ({
        url: `/attributes/${id}`,
      }),
      providesTags: (_r, _e, id) => [{ type: 'Attribute', id }],
    }),

    createAttribute: builder.mutation<
      AttributeResponse,
      CreateAttributeRequest
    >({
      query: (body) => ({
        url: '/attributes',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Attribute'],
    }),

    updateAttribute: builder.mutation<
      AttributeResponse,
      UpdateAttributeRequest
    >({
      query: ({ id, ...body }) => ({
        url: `/attributes/${id}`,
        method: 'PATCH',
        body,
      }),
      invalidatesTags: (_r, _e, arg) => [
        'Attribute',
        { type: 'Attribute', id: arg.id },
      ],
    }),

    deleteAttribute: builder.mutation<void, string>({
      query: (id) => ({
        url: `/attributes/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Attribute'],
    }),

    addAttributeValue: builder.mutation<
      AttributeResponse,
      AddAttributeValueRequest
    >({
      query: ({ id, ...body }) => ({
        url: `/attributes/${id}/values`,
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Attribute'],
    }),

    updateAttributeValue: builder.mutation<
      AttributeResponse,
      UpdateAttributeValueRequest
    >({
      query: ({ valueId, ...body }) => ({
        url: `/attributes/values/${valueId}`,
        method: 'PATCH',
        body,
      }),
      invalidatesTags: ['Attribute'],
    }),

    deleteAttributeValue: builder.mutation<void, string>({
      query: (valueId) => ({
        url: `/attributes/values/${valueId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Attribute'],
    }),
  }),
});

export const {
  useGetAttributesQuery,
  useGetAttributeByIdQuery,
  useCreateAttributeMutation,
  useUpdateAttributeMutation,
  useDeleteAttributeMutation,
  useAddAttributeValueMutation,
  useUpdateAttributeValueMutation,
  useDeleteAttributeValueMutation,
} = attributeApi;
