import { configureStore } from "@reduxjs/toolkit";
import permissionReducer from "./slice/permissionSlice";
import userReducer from "./slice/userSlice";

export const store = configureStore({
  reducer: {
    permission: permissionReducer,
    user: userReducer,
  },
});
