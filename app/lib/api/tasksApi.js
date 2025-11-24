import { apiSlice } from './apiSlice';

export const tasksApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getTasks: builder.query({
      query: () => '/api/tasks',
      transformResponse: (response) => response.success ? response.data : response,
      providesTags: ['Tasks'],
    }),
  }),
});

export const {
  useGetTasksQuery,
} = tasksApi;
