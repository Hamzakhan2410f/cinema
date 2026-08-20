import { Movie } from '../types/index.js';

export type MovieItem = Movie;

export const CLIENT_FALLBACK_MOVIES: Movie[] = [
  {
    externalId: '693134',
    title: 'Dune: Part Two',
    overview: 'Follow the mythic journey of Paul Atreides as he unites with Chani and the Fremen while on a path of revenge against the conspirators who destroyed his family.',
    posterPath: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&q=80&w=600',
    backdropPath: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&q=80&w=1600',
    releaseDate: '2024-03-01',
    genres: ['Science Fiction', 'Adventure', 'Action', 'Drama'],
    languages: ['English'],
    countries: ['USA'],
    runtime: 166,
    rating: 8.5,
    voteCount: 4820,
    cast: [
      { id: 1, name: 'Timothée Chalamet', character: 'Paul Atreides', profilePath: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200' },
      { id: 2, name: 'Zendaya', character: 'Chani', profilePath: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200' }
    ],
    directors: ['Denis Villeneuve'],
    trailerUrl: 'https://www.youtube.com/watch?v=Way9Dexny3w',
    industry: 'Hollywood'
  },
  {
    externalId: '872585',
    title: 'Oppenheimer',
    overview: 'The story of J. Robert Oppenheimer’s role in the development of the atomic bomb during World War II and the intense political aftermath.',
    posterPath: 'https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?auto=format&fit=crop&q=80&w=600',
    backdropPath: 'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?auto=format&fit=crop&q=80&w=1600',
    releaseDate: '2023-07-21',
    genres: ['Drama', 'History', 'War'],
    languages: ['English'],
    countries: ['USA'],
    runtime: 180,
    rating: 8.9,
    voteCount: 12400,
    cast: [
      { id: 3, name: 'Cillian Murphy', character: 'J. Robert Oppenheimer', profilePath: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200' }
    ],
    directors: ['Christopher Nolan'],
    trailerUrl: 'https://www.youtube.com/watch?v=uYPbbksJxIg',
    industry: 'Hollywood'
  },
  {
    externalId: '572802',
    title: 'RRR',
    overview: 'A fearless revolutionary and an officer in the British force meet and form an unshakeable bond before discovering each other’s secret identities in 1920s India.',
    posterPath: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&q=80&w=600',
    backdropPath: 'https://images.unsplash.com/photo-1485846234645-a62644efbd47?auto=format&fit=crop&q=80&w=1600',
    releaseDate: '2022-03-25',
    genres: ['Action', 'Adventure', 'Drama'],
    languages: ['Telugu', 'Hindi'],
    countries: ['India'],
    runtime: 187,
    rating: 8.8,
    voteCount: 9500,
    cast: [
      { id: 4, name: 'N. T. Rama Rao Jr.', character: 'Komaram Bheem', profilePath: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200' }
    ],
    directors: ['S. S. Rajamouli'],
    trailerUrl: 'https://www.youtube.com/watch?v=f_vbAtFSEc0',
    industry: 'Bollywood'
  },
  {
    externalId: '496243',
    title: 'Parasite',
    overview: 'Greed and class discrimination threaten the newly formed symbiotic relationship between the wealthy Park family and the destitute Kim clan.',
    posterPath: 'https://images.unsplash.com/photo-1594909122845-11baa439b7bf?auto=format&fit=crop&q=80&w=600',
    backdropPath: 'https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?auto=format&fit=crop&q=80&w=1600',
    releaseDate: '2019-05-30',
    genres: ['Thriller', 'Drama', 'Comedy'],
    languages: ['Korean'],
    countries: ['South Korea'],
    runtime: 132,
    rating: 8.5,
    voteCount: 17800,
    cast: [
      { id: 5, name: 'Song Kang-ho', character: 'Kim Ki-taek', profilePath: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200' }
    ],
    directors: ['Bong Joon-ho'],
    trailerUrl: 'https://www.youtube.com/watch?v=5xH0HfJHsaY',
    industry: 'Korean'
  },
  {
    externalId: '372058',
    title: 'Your Name.',
    overview: 'Two strangers find themselves linked in a bizarre way. When a connection forms, will distance be the only thing to keep them apart?',
    posterPath: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&q=80&w=600',
    backdropPath: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&q=80&w=1600',
    releaseDate: '2016-08-26',
    genres: ['Animation', 'Romance', 'Fantasy'],
    languages: ['Japanese'],
    countries: ['Japan'],
    runtime: 106,
    rating: 8.6,
    voteCount: 11200,
    cast: [
      { id: 6, name: 'Ryunosuke Kamiki', character: 'Taki Tachibana (voice)', profilePath: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200' }
    ],
    directors: ['Makoto Shinkai'],
    trailerUrl: 'https://www.youtube.com/watch?v=xU47nhruN-Q',
    industry: 'Japanese'
  },
  {
    externalId: '1022789',
    title: 'Inside Out 2',
    overview: 'Teenager Riley’s mind headquarters is undergoing a sudden demolition to make room for unexpected new Emotions.',
    posterPath: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&q=80&w=600',
    backdropPath: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&q=80&w=1600',
    releaseDate: '2024-06-14',
    genres: ['Animation', 'Family', 'Comedy'],
    languages: ['English'],
    countries: ['USA'],
    runtime: 96,
    rating: 8.1,
    voteCount: 5100,
    cast: [
      { id: 7, name: 'Amy Poehler', character: 'Joy (voice)', profilePath: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200' }
    ],
    directors: ['Kelsey Mann'],
    trailerUrl: 'https://www.youtube.com/watch?v=LEjhY15eCx0',
    industry: 'Hollywood'
  }
];
