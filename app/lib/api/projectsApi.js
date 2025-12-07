import { apiSlice } from './apiSlice';

export const projectsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getProjects: builder.query({
      query: (search) => ({
        url: '/api/projects',
        params: search ? { search } : undefined,
      }),
      transformResponse: (response) => response.success ? response.data : response,
      providesTags: ['Projects'],
    }),
    getProject: builder.query({
      query: (id) => `/api/projects/${id}`,
      transformResponse: (response) => response.success ? response.data : response,
      providesTags: (result, error, id) => [{ type: 'Projects', id }],
    }),
    createProject: builder.mutation({
      query: (newProject) => ({
        url: '/api/projects',
        method: 'POST',
        body: newProject,
      }),
      invalidatesTags: ['Projects'],
    }),
    updateProject: builder.mutation({
      query: ({ id, ...patch }) => ({
        url: `/api/projects/${id}`,
        method: 'PUT',
        body: patch,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Projects', id }],
    }),
    deleteProject: builder.mutation({
      query: (id) => ({
        url: `/api/projects/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Projects'],
    }),
  }),
});

export const {
  useGetProjectsQuery,
  useGetProjectQuery,
  useCreateProjectMutation,
  useUpdateProjectMutation,
  useDeleteProjectMutation,
} = projectsApi;
