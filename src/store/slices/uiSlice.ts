import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UIState {
  activeTrailerUrl: string | null;
  isTrailerOpen: boolean;
  searchQuery: string;
}

const initialState: UIState = {
  activeTrailerUrl: null,
  isTrailerOpen: false,
  searchQuery: '',
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    openTrailer: (state, action: PayloadAction<string>) => {
      state.activeTrailerUrl = action.payload;
      state.isTrailerOpen = true;
    },
    closeTrailer: (state) => {
      state.activeTrailerUrl = null;
      state.isTrailerOpen = false;
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
  },
});

export const { openTrailer, closeTrailer, setSearchQuery } = uiSlice.actions;
export default uiSlice.reducer;
