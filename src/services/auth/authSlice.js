import { createSlice } from "@reduxjs/toolkit";

export const authSlice = createSlice({
  name: "auth",
  initialState: { access_token: null },
  reducers: {
    setToken: (state, { payload: access_token }) => {
      state.access_token = access_token;
    },
  },
});

export const { setToken } = authSlice.actions;
