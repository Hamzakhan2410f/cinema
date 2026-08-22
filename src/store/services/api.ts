import { createApi, fetchBaseQuery, BaseQueryFn, FetchArgs, FetchBaseQueryError } from '@reduxjs/toolkit/query/react';
import { Movie, Review, User } from '../../types/index.js';
import { getApiUrl, getAuthToken, clearAuthTokens } from '../../utils/api.js';

const apiRootUrl = getApiUrl('/api');

const rawBaseQuery = fetchBaseQuery({
  baseUrl: apiRootUrl,
  prepareHeaders: (headers) => {
    const token = getAuthToken();
    if (token) {
      headers.set('authorization', `Bearer ${token}`);
    }
    return headers;
  },
});

const customBaseQuery: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async (
  args,
  api,
  extraOptions
) => {
  const result = await rawBaseQuery(args, api, extraOptions);
  if (result.error && result.error.status === 401) {
    clearAuthTokens();
    if (typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent('cinema:session-expired', {
          detail: 'Your session has expired. Please log in again.',
        })
      );
    }
  }
  return result;
};

export const cinemaApi = createApi({
  reducerPath: 'cinemaApi',
  baseQuery: customBaseQuery,
  tagTypes: ['Movie', 'Watchlist', 'Review', 'User'],
  endpoints: (builder) => ({
    getTrendingMovies: builder.query<{ success: boolean; data: Movie[] }, void>({
      query: () => '/movies/trending',
      providesTags: ['Movie'],
    }),
    getPopularMovies: builder.query<{ success: boolean; data: Movie[] }, void>({
      query: () => '/movies/popular',
      providesTags: ['Movie'],
    }),
    getTopRatedMovies: builder.query<{ success: boolean; data: Movie[] }, void>({
      query: () => '/movies/top-rated',
      providesTags: ['Movie'],
    }),
    getUpcomingMovies: builder.query<{ success: boolean; data: Movie[] }, void>({
      query: () => '/movies/upcoming',
      providesTags: ['Movie'],
    }),
    getHollywoodMovies: builder.query<{ success: boolean; data: Movie[] }, void>({
      query: () => '/movies/hollywood',
      providesTags: ['Movie'],
    }),
    getBollywoodMovies: builder.query<{ success: boolean; data: Movie[] }, void>({
      query: () => '/movies/bollywood',
      providesTags: ['Movie'],
    }),
    getMovieDetails: builder.query<{ success: boolean; data: Movie }, string>({
      query: (id) => `/movies/${id}`,
      providesTags: (result, error, id) => [{ type: 'Movie', id }],
    }),
    getMovieTrailer: builder.query<{
      success: boolean;
      movieId: string;
      trailerKey: string | null;
      trailerUrl: string | null;
      videos: { key: string; name: string; site: string; type: string; official: boolean }[];
    }, string>({
      query: (id) => `/movies/${id}/videos`,
    }),
    getMovieFullVideo: builder.query<{
      success: boolean;
      data: {
        hasVideo: boolean;
        movieId: string;
        videoUrl: string | null;
        videoType: 'mp4' | 'hls' | 'embed' | null;
        quality?: string;
        notes?: string;
      };
    }, string>({
      query: (id) => `/movies/${id}/video`,
    }),
    getWatchlist: builder.query<{ success: boolean; data: Movie[] }, void>({
      query: () => '/watchlist',
      providesTags: ['Watchlist'],
    }),
    addToWatchlist: builder.mutation<{ success: boolean; message: string }, string>({
      query: (movieId) => ({
        url: `/watchlist/${movieId}`,
        method: 'POST',
      }),
      invalidatesTags: ['Watchlist'],
    }),
    removeFromWatchlist: builder.mutation<{ success: boolean; message: string }, string>({
      query: (movieId) => ({
        url: `/watchlist/${movieId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Watchlist'],
    }),
    getMovieReviews: builder.query<{ success: boolean; data: Review[] }, string>({
      query: (movieId) => `/reviews/${movieId}`,
      providesTags: ['Review'],
    }),
    createReview: builder.mutation<{ success: boolean; data: Review }, { movieId: string; rating: number; comment: string }>({
      query: ({ movieId, rating, comment }) => ({
        url: `/reviews/${movieId}`,
        method: 'POST',
        body: { rating, comment },
      }),
      invalidatesTags: ['Review'],
    }),
  }),
});

export const {
  useGetTrendingMoviesQuery,
  useGetPopularMoviesQuery,
  useGetTopRatedMoviesQuery,
  useGetUpcomingMoviesQuery,
  useGetHollywoodMoviesQuery,
  useGetBollywoodMoviesQuery,
  useGetMovieDetailsQuery,
  useGetMovieTrailerQuery,
  useLazyGetMovieTrailerQuery,
  useGetMovieFullVideoQuery,
  useGetWatchlistQuery,
  useAddToWatchlistMutation,
  useRemoveFromWatchlistMutation,
  useGetMovieReviewsQuery,
  useCreateReviewMutation,
} = cinemaApi;
