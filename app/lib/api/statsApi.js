import { apiSlice } from './apiSlice';

export const statsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getStats: builder.query({
      query: () => '/api/stats',
      transformResponse: (response) => response.success ? response.data : response,
      providesTags: ['Stats'],
    }),
    getPerformance: builder.query({
      query: () => '/api/performance',
      transformResponse: (response) => response.success ? response.data : response,
      providesTags: ['Performance'],
    }),
    getSummary: builder.query({
      query: () => '/api/summary',
      transformResponse: (response) => response.success ? response.data : response,
      providesTags: ['Summary'],
    }),
    getDashboard: builder.query({
      query: () => '/api/dashboard',
      transformResponse: (response) => response.success ? response.data : response,
      providesTags: ['Dashboard'],
    }),
  }),
});

export const {
  useGetStatsQuery,
  useGetPerformanceQuery,
  useGetSummaryQuery,
  useGetDashboardQuery,
} = statsApi;
