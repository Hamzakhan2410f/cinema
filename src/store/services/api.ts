import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { Movie, Review, User } from '../../types/index.js';

export const cinemaApi = createApi({
  reducerPath: 'cinemaApi',
  baseQuery: fetchBaseQuery({
    baseUrl: '/api',
    prepareHeaders: (headers) => {
      const token = localStorage.getItem('cinema_token');
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
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
  useGetWatchlistQuery,
  useAddToWatchlistMutation,
  useRemoveFromWatchlistMutation,
  useGetMovieReviewsQuery,
  useCreateReviewMutation,
} = cinemaApi;
