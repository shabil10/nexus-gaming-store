import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  items: []
};

const wishlistSlice = createSlice({
  name: "wishlist",

  initialState,

  reducers: {
    addToWishlist: (state, action) => {
      const product = action.payload;

      const existingItem = state.items.find(
        (item) => String(item.id) === String(product.id)
      );

      if (!existingItem) {
        state.items.push(product);
      }
    },

    removeFromWishlist: (state, action) => {
      state.items = state.items.filter(
        (item) => String(item.id) !== String(action.payload)
      );
    },

    clearWishlist: (state) => {
      state.items = [];
    },

    setWishlist: (state, action) => {
      state.items = action.payload || [];
    }
  }
});

export const {
  addToWishlist,
  removeFromWishlist,
  clearWishlist,
  setWishlist
} = wishlistSlice.actions;

export default wishlistSlice.reducer;