import { createSlice } from "@reduxjs/toolkit";

export const collapsedSlice = createSlice({
  name: "collapsed",
  initialState: {
    value: false,
  },
  // 写成reducers了，js中属性写错很容易造成undefined
  // 换句话说undefined了最好回去看看是不是属性名写错了
  reducers: {
    reverse: (state) => {
      state.value = !state.value;
    },
  },
});

export const { reverse } = collapsedSlice.actions;
export default collapsedSlice.reducer;
