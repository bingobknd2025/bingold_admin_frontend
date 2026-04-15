import { createSlice } from "@reduxjs/toolkit";

const permissionSlice = createSlice({
  name: "permissions",
  initialState: {
    permissions: [],
    modules: [],
  },
  reducers: {
    setPermissions(state, action) {
      state.permissions = action.payload;
    },
    setModules(state, action) {
      state.modules = action.payload;
    },
  },
});
export const { setPermissions, setModules } = permissionSlice.actions;
export default permissionSlice.reducer;
