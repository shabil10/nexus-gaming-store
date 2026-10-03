import { createSlice } from "@reduxjs/toolkit";

const savedAdmin = JSON.parse(
  localStorage.getItem("admin")
);

const initialState = {
  admin: savedAdmin || null,
  isAdminAuthenticated: !!savedAdmin
};

const adminAuthSlice = createSlice({
  name: "adminAuth",

  initialState,

  reducers: {
    login: (state, action) => {
      state.admin = action.payload;
      state.isAdminAuthenticated = true;

      localStorage.setItem(
        "admin",
        JSON.stringify(action.payload)
      );
    },

    logout: (state) => {
      state.admin = null;
      state.isAdminAuthenticated = false;

      localStorage.removeItem("admin");
    }
  }
});

export const {
  login,
  logout
} = adminAuthSlice.actions;

export default adminAuthSlice.reducer;