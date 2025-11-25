import { apiSlice } from './apiSlice';

export const diagnosisApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllDiagnoses: builder.query({
      query: () => '/api/diagnosis',
      transformResponse: (response) => response.success ? response.data : response,
      providesTags: ['Diagnosis'],
    }),
    getDiagnosis: builder.query({
      query: (id = 1) => `/api/diagnosis/${id}`,
      transformResponse: (response) => response.success ? response.data : response,
      providesTags: (result, error, id) => [{ type: 'Diagnosis', id }],
    }),
    createDiagnosis: builder.mutation({
      query: (vehicleInfo) => ({
        url: '/api/diagnosis',
        method: 'POST',
        body: vehicleInfo,
      }),
      transformResponse: (response) => response.success ? response.data : response,
      invalidatesTags: ['Diagnosis'],
    }),
    updateDiagnosis: builder.mutation({
      query: ({ id, vehicleInfo }) => ({
        url: `/api/diagnosis/${id}`,
        method: 'PUT',
        body: vehicleInfo,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Diagnosis', id }, 'Diagnosis'],
    }),
    updatePart: builder.mutation({
      query: ({ diagnosisId = 1, part }) => ({
        url: `/api/diagnosis/${diagnosisId}/parts/${part.id}`,
        method: 'PUT',
        body: part,
      }),
      invalidatesTags: (result, error, { diagnosisId }) => [{ type: 'Diagnosis', id: diagnosisId }, 'Diagnosis'],
    }),
    deleteDiagnosis: builder.mutation({
      query: (id) => ({
        url: `/api/diagnosis/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Diagnosis'],
    }),
  }),
});

export const {
  useGetAllDiagnosesQuery,
  useGetDiagnosisQuery,
  useCreateDiagnosisMutation,
  useUpdateDiagnosisMutation,
  useUpdatePartMutation,
  useDeleteDiagnosisMutation,
} = diagnosisApi;
