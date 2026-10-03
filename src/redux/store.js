import { configureStore } from "@reduxjs/toolkit";

import productReducer from "./slices/productSlice";

import cartReducer, {
  setCart
} from "./slices/cartSlice";

import wishlistReducer, {
  setWishlist
} from "./slices/wishlistSlice";

import orderReducer from "./slices/orderSlice";

import authReducer from "./slices/authSlice";

import adminAuthReducer from "./slices/adminAuthSlice";

import adminDashboardReducer from "./slices/adminDashboardSlice";

import userReducer from "./slices/userSlice";

import toastReducer from "./slices/toastSlice";

const savedUser = JSON.parse(
  localStorage.getItem("user")
);

export const store = configureStore({
  reducer: {
    products: productReducer,
    cart: cartReducer,
    wishlist: wishlistReducer,
    orders: orderReducer,
    auth: authReducer,
    adminAuth: adminAuthReducer,
    adminDashboard: adminDashboardReducer,
    users: userReducer,
    toast: toastReducer
  }
});

if (savedUser?.id) {
  const savedCart =
    JSON.parse(
      localStorage.getItem(`cart_${savedUser.id}`)
    ) || [];

  const savedWishlist =
    JSON.parse(
      localStorage.getItem(`wishlist_${savedUser.id}`)
    ) || [];

  store.dispatch(
    setCart(savedCart)
  );

  store.dispatch(
    setWishlist(savedWishlist)
  );
}

store.subscribe(() => {
  const state = store.getState();

  const user = state.auth.user;

  if (!user?.id) {
    return;
  }

  const userId = user.id;

  localStorage.setItem(
    `cart_${userId}`,
    JSON.stringify(state.cart.items)
  );

  localStorage.setItem(
    `wishlist_${userId}`,
    JSON.stringify(state.wishlist.items)
  );
});