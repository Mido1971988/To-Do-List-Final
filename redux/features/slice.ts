import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type InitialState = {
  optionsValue: boolean;
  moveValue: boolean;
  detailsValue: boolean;
};
const initialState = {
  optionsValue: false,
  moveValue: false,
  detailsValue: false,
};

export const mySlice = createSlice({
  name: "mySlice",
  initialState,
  reducers: {
    setOptionsValue: (state, action: PayloadAction<InitialState>) => {
      return {
        optionsValue: action.payload.optionsValue,
        moveValue: action.payload.moveValue,
        detailsValue: action.payload.detailsValue,
      };
    },
  },
});

export const { setOptionsValue } = mySlice.actions;
export default mySlice.reducer;
