import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  message: "",
  type: "success",
  visible: false
};

const toastSlice = createSlice({
  name: "toast",
  initialState,
  reducers: {
    showToast: (state, action) => {
      state.message = action.payload.message;
      state.type = action.payload.type || "success";
      state.visible = true;
    },
    hideToast: (state) => {
      state.message = "";
      state.visible = false;
    }
  }
});

export const {
  showToast,
  hideToast
} = toastSlice.actions;

export default toastSlice.reducer;