import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState = {
  value: "999",
};

export const mySlice = createSlice({
  name: "mySlice",
  initialState,
  reducers: {
    setValue: (state, action: PayloadAction<string>) => {
      return { value: action.payload };
    },
  },
});

export const { setValue } = mySlice.actions;
export default mySlice.reducer;
