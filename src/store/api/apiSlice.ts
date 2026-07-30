import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl,
    prepareHeaders: (headers) => {
      const token = localStorage.getItem('admin_token');
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['Profile', 'Repos', 'Experience', 'Education', 'Skills', 'Settings'],
  endpoints: (builder) => ({
    // Public endpoints
    getProfile: builder.query({
      query: () => '/profile',
      providesTags: ['Profile'],
    }),
    getRepos: builder.query({
      query: () => '/repos',
      providesTags: ['Repos'],
    }),
    getExperience: builder.query({
      query: () => '/experience',
      providesTags: ['Experience'],
    }),
    getEducation: builder.query({
      query: () => '/education',
      providesTags: ['Education'],
    }),
    getSkills: builder.query({
      query: () => '/skills',
      providesTags: ['Skills'],
    }),

    // Admin endpoints
    syncGitHub: builder.mutation({
      query: () => ({
        url: '/admin/sync/github',
        method: 'POST',
      }),
      invalidatesTags: ['Repos'],
    }),
    syncLinkedIn: builder.mutation({
      query: (data) => ({
        url: '/admin/sync/linkedin',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Profile', 'Experience', 'Education', 'Skills'],
    }),
    updateProfile: builder.mutation({
      query: (data) => ({
        url: '/admin/profile',
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Profile'],
    }),
    login: builder.mutation({
      query: (credentials) => ({
        url: '/admin/auth/login',
        method: 'POST',
        body: credentials,
      }),
    }),
  }),
});

export const {
  useGetProfileQuery,
  useGetReposQuery,
  useGetExperienceQuery,
  useGetEducationQuery,
  useGetSkillsQuery,
  useSyncGitHubMutation,
  useSyncLinkedInMutation,
  useUpdateProfileMutation,
  useLoginMutation,
} = apiSlice;
