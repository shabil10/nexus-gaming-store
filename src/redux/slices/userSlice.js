import {
  createAsyncThunk,
  createSlice
} from "@reduxjs/toolkit";

import {
  getAdminUsers,
  updateAdminUser
} from "../../services/adminUserService";

export const fetchUsers =
  createAsyncThunk(
    "users/fetchUsers",
    async () => {
      const data =
        await getAdminUsers();

      return data;
    }
  );

export const editUser =
  createAsyncThunk(
    "users/editUser",
    async ({
      id,
      userData
    }) => {
      const data =
        await updateAdminUser(
          id,
          userData
        );

      return data;
    }
  );

export const softDeleteUser =
  createAsyncThunk(
    "users/softDeleteUser",
    async (id) => {
      const data =
        await updateAdminUser(
          id,
          {
            isDeleted: true
          }
        );

      return data;
    }
  );

export const restoreUser =
  createAsyncThunk(
    "users/restoreUser",
    async (id) => {
      const data =
        await updateAdminUser(
          id,
          {
            isDeleted: false
          }
        );

      return data;
    }
  );

const initialState = {
  users: [],
  loading: false,
  error: null
};

const userSlice =
  createSlice({
    name: "users",

    initialState,

    reducers: {},

    extraReducers: (builder) => {
      builder

        .addCase(
          fetchUsers.pending,
          (state) => {
            state.loading = true;
            state.error = null;
          }
        )

        .addCase(
          fetchUsers.fulfilled,
          (state, action) => {
            state.loading = false;

            state.users = [
              ...action.payload
            ].reverse();
          }
        )

        .addCase(
          fetchUsers.rejected,
          (state, action) => {
            state.loading = false;

            state.error =
              action.error.message;
          }
        )

        .addCase(
          editUser.pending,
          (state) => {
            state.error = null;
          }
        )

        .addCase(
          editUser.fulfilled,
          (state, action) => {
            const index =
              state.users.findIndex(
                (user) =>
                  String(
                    user.id
                  ) ===
                  String(
                    action.payload.id
                  )
              );

            if (index !== -1) {
              state.users[index] =
                action.payload;
            }
          }
        )

        .addCase(
          editUser.rejected,
          (state, action) => {
            state.error =
              action.error.message;
          }
        )

        .addCase(
          softDeleteUser.pending,
          (state) => {
            state.error = null;
          }
        )

        .addCase(
          softDeleteUser.fulfilled,
          (state, action) => {
            const index =
              state.users.findIndex(
                (user) =>
                  String(
                    user.id
                  ) ===
                  String(
                    action.payload.id
                  )
              );

            if (index !== -1) {
              state.users[index] =
                action.payload;
            }
          }
        )

        .addCase(
          softDeleteUser.rejected,
          (state, action) => {
            state.error =
              action.error.message;
          }
        )

        .addCase(
          restoreUser.pending,
          (state) => {
            state.error = null;
          }
        )

        .addCase(
          restoreUser.fulfilled,
          (state, action) => {
            const index =
              state.users.findIndex(
                (user) =>
                  String(
                    user.id
                  ) ===
                  String(
                    action.payload.id
                  )
              );

            if (index !== -1) {
              state.users[index] =
                action.payload;
            }
          }
        )

        .addCase(
          restoreUser.rejected,
          (state, action) => {
            state.error =
              action.error.message;
          }
        );
    }
  });

export default userSlice.reducer;