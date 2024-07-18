import { createSlice } from "@reduxjs/toolkit";

export const { actions: authActions, reducer: authReducer } = createSlice({
  name: "auth",
  initialState: {
    isAuth: true,
    token: null,
  },
  reducers: {
    login: (state) => {
      state.isAuth = true;
    },
    logout: (state) => {
      state.isAuth = false;
    },
    saveToken: (state, { payload }) => {
      state.token = payload;
    },
  },
});
