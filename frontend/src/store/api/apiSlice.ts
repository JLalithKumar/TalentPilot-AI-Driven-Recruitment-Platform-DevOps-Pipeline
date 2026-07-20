import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { RootState } from '../index';

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: '/api/v1',
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.token;
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['Job', 'Company', 'Application', 'Profile'],
  endpoints: (builder) => ({
    // Jobs
    getJobs: builder.query<any[], void>({
      query: () => '/jobs',
      providesTags: ['Job']
    }),
    
    // Resumes
    uploadResume: builder.mutation<any, FormData>({
      query: (formData) => ({
        url: '/resumes/upload',
        method: 'POST',
        body: formData,
      }),
      invalidatesTags: ['Profile']
    }),
    getProfile: builder.query<any, void>({
      query: () => '/resumes/profile',
      providesTags: ['Profile']
    }),
    
    // Applications
    applyForJob: builder.mutation<any, number>({
      query: (jobId) => ({
        url: `/applications/job/${jobId}`,
        method: 'POST',
      }),
      invalidatesTags: ['Application']
    }),
    getMyApplications: builder.query<any[], void>({
      query: () => '/applications/my',
      providesTags: ['Application']
    }),
    
    // Recruiter Jobs
    createJob: builder.mutation<any, Partial<any>>({
      query: (job) => ({
        url: '/jobs',
        method: 'POST',
        body: job,
      }),
      invalidatesTags: ['Job']
    }),
    getApplicationsForJob: builder.query<any[], number>({
      query: (jobId) => `/applications/job/${jobId}`,
      providesTags: ['Application']
    }),
    updateApplicationStatus: builder.mutation<any, { id: number; status: string }>({
      query: ({ id, status }) => ({
        url: `/applications/${id}/status?status=${status}`,
        method: 'PUT',
      }),
      invalidatesTags: ['Application']
    })
  }),
});

export const { 
  useGetJobsQuery, 
  useUploadResumeMutation, 
  useGetProfileQuery,
  useApplyForJobMutation, 
  useGetMyApplicationsQuery,
  useCreateJobMutation,
  useGetApplicationsForJobQuery,
  useUpdateApplicationStatusMutation
} = apiSlice;
