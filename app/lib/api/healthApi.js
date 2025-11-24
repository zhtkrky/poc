import { apiSlice } from './apiSlice';

export const healthApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    checkHealth: builder.query({
      query: () => '/health',
    }),
  }),
});

export const {
  useCheckHealthQuery,
} = healthApi;
