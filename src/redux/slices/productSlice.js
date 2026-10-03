import {
  createAsyncThunk,
  createSlice
} from "@reduxjs/toolkit";

import {
  getProducts,
  createProduct,
  updateProduct
} from "../../services/productService";

export const fetchProducts =
  createAsyncThunk(
    "products/fetchProducts",
    async () => {
      const data =
        await getProducts();

      return data;
    }
  );

export const addProduct =
  createAsyncThunk(
    "products/addProduct",
    async (productData) => {
      const data =
        await createProduct(
          productData
        );

      return data;
    }
  );

export const editProduct =
  createAsyncThunk(
    "products/editProduct",
    async ({
      id,
      productData
    }) => {
      const data =
        await updateProduct(
          id,
          productData
        );

      return data;
    }
  );

const initialState = {
  products: [],
  loading: false,
  error: null
};

const productSlice =
  createSlice({
    name: "products",

    initialState,

    reducers: {},

    extraReducers: (builder) => {
      builder
        .addCase(
          fetchProducts.pending,
          (state) => {
            state.loading = true;
            state.error = null;
          }
        )

        .addCase(
          fetchProducts.fulfilled,
          (state, action) => {
            state.loading = false;

            const activeProducts =
              action.payload.filter(
                (product) =>
                  product.isDeleted !== true
              );

            state.products =
              [...activeProducts].reverse();
          }
        )

        .addCase(
          fetchProducts.rejected,
          (state, action) => {
            state.loading = false;
            state.error =
              action.error.message;
          }
        )

        .addCase(
          addProduct.fulfilled,
          (state, action) => {
            state.products.unshift(
              action.payload
            );
          }
        )

        .addCase(
          editProduct.fulfilled,
          (state, action) => {
            const index =
              state.products.findIndex(
                (product) =>
                  String(
                    product.id
                  ) ===
                  String(
                    action.payload.id
                  )
              );

            if (index !== -1) {
              state.products[index] =
                action.payload;
            }
          }
        );
    }
  });

export default productSlice.reducer;