import { createSlice } from "@reduxjs/toolkit";

const theatresSlice = createSlice({
  name: "theatres",
  initialState: {
    theatres: [],
  },
  reducers: {
    setTheatres: (state, action) => {
      state.theatres = action.payload;
    },
  },
});

export const { setTheatres } = theatresSlice.actions;
export default theatresSlice.reducer;
