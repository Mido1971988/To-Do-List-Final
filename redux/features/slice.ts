import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

type InitialState = {
  optionsValue: boolean;
  moveValue: boolean;
  detailsValue: boolean;
  // listOfUsers: Array<{ id: string; name: string; password: string }>;
};
const initialState = {
  optionsValue: false,
  moveValue: false,
  detailsValue: false,
  // listOfUsers: [{ id: "", name: "", password: "" }],
};

// this just an Example to try Async Reducer
// export const fetchUsers = createAsyncThunk(
//   "mySlice/fetchUsers",
//   async (users, ThunkAPI) => {
//     const response = await fetch("api/listOfUsers");
//     const listOfUsersusers = await response.json();
//     return listOfUsersusers;
//   }
// );

export const mySlice = createSlice({
  name: "mySlice",
  initialState,
  reducers: {
    setOptionsValue: (state, action: PayloadAction<InitialState>) => {
      return {
        optionsValue: action.payload.optionsValue,
        moveValue: action.payload.moveValue,
        detailsValue: action.payload.detailsValue,
        // listOfUsers: [],
      };
    },
  },
  // extraReducers: (builder) => {
  //   builder.addCase(fetchUsers.fulfilled, (state, action) => {
  //     console.log(action.type); // mySlice/fetchUsers/fulfilled => the 1st argument passed to createAsyncThunk
  //     state.listOfUsers = [...action.payload];
  //   });
  //   builder.addCase(fetchUsers.pending, (state, action) => {
  //     console.log(action.type); // mySlice/fetchUsers/pending => the 1st argument passed to createAsyncThunk
  //     console.log("Loading");
  //   });
  // },
});

export const { setOptionsValue } = mySlice.actions;
export default mySlice.reducer;
