import { createApi } from "@reduxjs/toolkit/query/react";
import axios from "axios";

import { setToken } from "../auth/authSlice";
import DeviceStorage from "../storage/storage";

const localStorage = new DeviceStorage("@tracks");

const axiosBaseQuery =
  ({ baseUrl } = { baseUrl: "" }) =>
  async (request, api) => {
    const {
      url = request,
      method = "GET",
      data,
      params,
    } = typeof request === "object" ? request : {};

    const headers = { "Content-Type": "application/json" };

    const token = api.getState().auth?.access_token;

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    try {
      const result = await axios({
        url: baseUrl + url,
        method,
        data,
        params,
        headers,
      });

      return { data: result.data };
    } catch (error) {
      const isAuthError =
        error.response.status === 401 &&
        error.response.data.code === "Unauthorized";

      isAuthError && api.dispatch(setToken(null));

      return {
        error: {
          status: error.response?.status,
          data: error.response?.data || error.message,
        },
      };
    }
  };

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: axiosBaseQuery({
    baseUrl: "http://BACHU-600.local:3000/api/v0",
  }),
  tagTypes: ["Tracks"],
  endpoints: (builder) => ({
    tryLocalLogin: builder.mutation({
      queryFn: async (_, api) => {
        try {
          // await new Promise((resolve) => setTimeout(resolve, 15000));
          const token = await localStorage.get("accessToken");
          token && api.dispatch(setToken(token));

          return { data: { success: !!token } };
        } catch (error) {
          return { error };
        }
      },
    }),
    login: builder.mutation({
      queryFn: async (data, api, _, baseQuery) => {
        try {
          const response = await baseQuery({
            url: "/login",
            method: "POST",
            data,
          });

          if (response?.data?.access_token) {
            await localStorage.store("accessToken", response.data.access_token);
            api.dispatch(setToken(response.data.access_token));
          }

          return response;
        } catch (error) {
          return { error };
        }
      },
      invalidatesTags: ["Tracks"],
    }),
    logout: builder.mutation({
      queryFn: async (_, api) => {
        try {
          await localStorage.clearAll();
          api.dispatch(setToken(null));

          return { data: { success: true } };
        } catch (error) {
          return { error };
        }
      },
      invalidatesTags: ["Tracks"],
    }),
    signup: builder.mutation({
      queryFn: async (data, api, _, baseQuery) => {
        try {
          const response = await baseQuery({
            url: "/signup",
            method: "POST",
            data,
          });

          if (response?.data?.access_token) {
            await localStorage.store("accessToken", response.data.access_token);
            api.dispatch(setToken(response.data.access_token));
          }

          return response;
        } catch (error) {
          return { error };
        }
      },
    }),
    getTracks: builder.query({
      query: () => "/tracks",
      providesTags: ["Tracks"],
    }),
    getTrack: builder.query({
      query: (id) => `/tracks/${id}`,
      providesTags: ["Tracks"],
    }),
    postTracks: builder.mutation({
      query: (data) => ({ url: "/tracks", method: "POST", data }),
      invalidatesTags: ["Tracks"],
    }),
  }),
});

// Export the auto-generated hook for the `postLogin` query endpoint
export const {
  useTryLocalLoginMutation,
  useLoginMutation,
  useLogoutMutation,
  useSignupMutation,
  useGetTracksQuery,
  useGetTrackQuery,
  usePostTracksMutation,
} = apiSlice;
