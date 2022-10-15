import { createSlice } from "@reduxjs/toolkit";

export const loadingSlice = createSlice({
  name: "loading",
  initialState: {
    value: false,
  },
  reducers: {
    start: (state) => {
      state.value = true;
    },
    finish: (state) => {
      state.value = false;
    },
  },
});

export const { start, finish } = loadingSlice.actions;
export default loadingSlice.reducer;
