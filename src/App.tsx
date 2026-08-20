import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store/index.js';
import { Layout } from './components/layout/Layout.js';
import { Home } from './pages/Home.js';
import { Movies } from './pages/Movies.js';
import { MovieDetails } from './pages/MovieDetails.js';
import { WatchPage } from './pages/WatchPage.js';
import { SearchPage } from './pages/Search.js';
import { GenrePage } from './pages/Genre.js';
import { CategoryPage } from './pages/CategoryPage.js';
import { Watchlist } from './pages/Watchlist.js';
import { Favorites } from './pages/Favorites.js';
import { Profile } from './pages/Profile.js';
import { Login } from './pages/Login.js';
import { Register } from './pages/Register.js';
import { AdminDashboard } from './pages/AdminDashboard.js';
import { NotFound } from './pages/NotFound.js';
import { ProtectedRoute } from './components/common/ProtectedRoute.js';

export default function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="movies" element={<Movies />} />
            <Route path="movie/:id" element={<MovieDetails />} />
            <Route path="watch/:movieId" element={<WatchPage />} />
            <Route path="watch" element={<WatchPage />} />
            <Route path="search" element={<SearchPage />} />
            <Route path="genre/:genre" element={<GenrePage />} />
            <Route path="category/:category" element={<CategoryPage />} />
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />

            {/* Protected User Routes */}
            <Route element={<ProtectedRoute />}>
              <Route path="watchlist" element={<Watchlist />} />
              <Route path="favorites" element={<Favorites />} />
              <Route path="profile" element={<Profile />} />
            </Route>

            {/* Protected Admin Routes */}
            <Route element={<ProtectedRoute adminOnly />}>
              <Route path="admin" element={<AdminDashboard />} />
              <Route path="admin/movies" element={<AdminDashboard />} />
              <Route path="admin/movies/new" element={<AdminDashboard />} />
              <Route path="admin/movies/:id/edit" element={<AdminDashboard />} />
              <Route path="admin/movies/:id/video" element={<AdminDashboard />} />
              <Route path="admin/genres" element={<AdminDashboard />} />
              <Route path="admin/users" element={<AdminDashboard />} />
              <Route path="admin/settings" element={<AdminDashboard />} />
            </Route>

            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </Provider>
  );
}
