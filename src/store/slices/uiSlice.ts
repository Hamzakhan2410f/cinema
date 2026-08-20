import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { extractYouTubeId } from '../../utils/youtube.js';

interface UIState {
  activeMovieId: string | null;
  activeMovieTitle: string | null;
  activeTrailerUrl: string | null;
  activeTrailerKey: string | null;
  candidateKeys: string[];
  isTrailerOpen: boolean;
  searchQuery: string;
}

const initialState: UIState = {
  activeMovieId: null,
  activeMovieTitle: null,
  activeTrailerUrl: null,
  activeTrailerKey: null,
  candidateKeys: [],
  isTrailerOpen: false,
  searchQuery: '',
};

export type OpenTrailerPayload =
  | string
  | {
      movieId?: string;
      movieTitle?: string;
      trailerUrl?: string;
      trailerKey?: string;
    };

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    openTrailer: (state, action: PayloadAction<OpenTrailerPayload>) => {
      state.isTrailerOpen = true;
      if (typeof action.payload === 'string') {
        const key = extractYouTubeId(action.payload);
        state.activeMovieId = null;
        state.activeMovieTitle = null;
        state.activeTrailerKey = key;
        state.activeTrailerUrl = key ? `https://www.youtube.com/embed/${key}` : action.payload;
        state.candidateKeys = key ? [key] : [];
      } else {
        const { movieId, movieTitle, trailerUrl, trailerKey } = action.payload;
        const key = trailerKey || extractYouTubeId(trailerUrl);
        state.activeMovieId = movieId || null;
        state.activeMovieTitle = movieTitle || null;
        state.activeTrailerKey = key || null;
        state.activeTrailerUrl = key
          ? `https://www.youtube.com/embed/${key}`
          : trailerUrl || null;
        state.candidateKeys = key ? [key] : [];
      }
    },
    setTrailerKey: (
      state,
      action: PayloadAction<{ key: string; candidates?: string[] }>
    ) => {
      const { key, candidates } = action.payload;
      state.activeTrailerKey = key;
      state.activeTrailerUrl = `https://www.youtube.com/embed/${key}`;
      if (candidates && candidates.length > 0) {
        state.candidateKeys = candidates;
      } else if (!state.candidateKeys.includes(key)) {
        state.candidateKeys = [key, ...state.candidateKeys];
      }
    },
    closeTrailer: (state) => {
      state.activeMovieId = null;
      state.activeMovieTitle = null;
      state.activeTrailerUrl = null;
      state.activeTrailerKey = null;
      state.candidateKeys = [];
      state.isTrailerOpen = false;
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
  },
});

export const { openTrailer, setTrailerKey, closeTrailer, setSearchQuery } = uiSlice.actions;
export default uiSlice.reducer;

