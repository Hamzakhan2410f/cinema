export interface MovieItem {
  externalId: string;
  title: string;
  originalTitle?: string;
  overview: string;
  posterPath: string;
  backdropPath: string;
  releaseDate: string;
  genres: string[];
  languages: string[];
  countries: string[];
  runtime: number;
  rating: number;
  voteCount: number;
  cast: { id: number; name: string; character: string; profilePath?: string }[];
  directors: string[];
  trailerUrl: string;
  industry: 'Hollywood' | 'Bollywood' | 'Korean' | 'Japanese' | 'International';
  trending?: boolean;
  popular?: boolean;
  topRated?: boolean;
  upcoming?: boolean;
}

export const MOCK_MOVIES: MovieItem[] = [
  {
    externalId: '693134',
    title: 'Dune: Part Two',
    originalTitle: 'Dune: Part Two',
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
      { id: 2, name: 'Zendaya', character: 'Chani', profilePath: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200' },
      { id: 3, name: 'Rebecca Ferguson', character: 'Lady Jessica Atreides', profilePath: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200' },
      { id: 4, name: 'Austin Butler', character: 'Feyd-Rautha Harkonnen', profilePath: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200' }
    ],
    directors: ['Denis Villeneuve'],
    trailerUrl: 'https://www.youtube.com/watch?v=Way9Dexny3w',
    industry: 'Hollywood',
    trending: true,
    popular: true,
    topRated: true,
    upcoming: false
  },
  {
    externalId: '872585',
    title: 'Oppenheimer',
    originalTitle: 'Oppenheimer',
    overview: 'The story of J. Robert Oppenheimer’s role in the development of the atomic bomb during World War II and the intense political aftermath.',
    posterPath: 'https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?auto=format&fit=crop&q=80&w=600',
    backdropPath: 'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?auto=format&fit=crop&q=80&w=1600',
    releaseDate: '2023-07-21',
    genres: ['Drama', 'History', 'War'],
    languages: ['English'],
    countries: ['USA', 'UK'],
    runtime: 180,
    rating: 8.9,
    voteCount: 12400,
    cast: [
      { id: 5, name: 'Cillian Murphy', character: 'J. Robert Oppenheimer', profilePath: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200' },
      { id: 6, name: 'Emily Blunt', character: 'Katherine Oppenheimer', profilePath: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200' },
      { id: 7, name: 'Matt Damon', character: 'Leslie Groves', profilePath: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200' }
    ],
    directors: ['Christopher Nolan'],
    trailerUrl: 'https://www.youtube.com/watch?v=uYPbbksJxIg',
    industry: 'Hollywood',
    trending: true,
    popular: true,
    topRated: true,
    upcoming: false
  },
  {
    externalId: '572802',
    title: 'RRR',
    originalTitle: 'RRR (Rise Roar Revolt)',
    overview: 'A fearless revolutionary and an officer in the British force meet and form an unshakeable bond before discovering each other’s secret identities in 1920s India.',
    posterPath: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&q=80&w=600',
    backdropPath: 'https://images.unsplash.com/photo-1485846234645-a62644efbd47?auto=format&fit=crop&q=80&w=1600',
    releaseDate: '2022-03-25',
    genres: ['Action', 'Adventure', 'Drama'],
    languages: ['Telugu', 'Hindi', 'Tamil'],
    countries: ['India'],
    runtime: 187,
    rating: 8.8,
    voteCount: 9500,
    cast: [
      { id: 8, name: 'N. T. Rama Rao Jr.', character: 'Komaram Bheem', profilePath: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200' },
      { id: 9, name: 'Ram Charan', character: 'Alluri Sitarama Raju', profilePath: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200' }
    ],
    directors: ['S. S. Rajamouli'],
    trailerUrl: 'https://www.youtube.com/watch?v=f_vbAtFSEc0',
    industry: 'Bollywood',
    trending: true,
    popular: true,
    topRated: true,
    upcoming: false
  },
  {
    externalId: '496243',
    title: 'Parasite',
    originalTitle: '기생충 (Gisaengchung)',
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
      { id: 10, name: 'Song Kang-ho', character: 'Kim Ki-taek', profilePath: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200' },
      { id: 11, name: 'Choi Woo-shik', character: 'Kim Ki-woo', profilePath: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200' }
    ],
    directors: ['Bong Joon-ho'],
    trailerUrl: 'https://www.youtube.com/watch?v=5xH0HfJHsaY',
    industry: 'Korean',
    trending: true,
    popular: true,
    topRated: true,
    upcoming: false
  },
  {
    externalId: '372058',
    title: 'Your Name.',
    originalTitle: '君の名は。 (Kimi no Na wa.)',
    overview: 'Two strangers find themselves linked in a bizarre way. When a connection forms, will distance be the only thing to keep them apart?',
    posterPath: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&q=80&w=600',
    backdropPath: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&q=80&w=1600',
    releaseDate: '2016-08-26',
    genres: ['Animation', 'Romance', 'Fantasy', 'Drama'],
    languages: ['Japanese'],
    countries: ['Japan'],
    runtime: 106,
    rating: 8.6,
    voteCount: 11200,
    cast: [
      { id: 12, name: 'Ryunosuke Kamiki', character: 'Taki Tachibana (voice)', profilePath: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200' },
      { id: 13, name: 'Mone Kamishibaiashi', character: 'Mitsuha Miyamizu (voice)', profilePath: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200' }
    ],
    directors: ['Makoto Shinkai'],
    trailerUrl: 'https://www.youtube.com/watch?v=xU47nhruN-Q',
    industry: 'Japanese',
    trending: true,
    popular: true,
    topRated: true,
    upcoming: false
  },
  {
    externalId: '1050035',
    title: 'Jawan',
    originalTitle: 'Jawan',
    overview: 'A high-octane action thriller highlighting the emotional journey of a man who is set to rectify the wrongs in society.',
    posterPath: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&q=80&w=600',
    backdropPath: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&q=80&w=1600',
    releaseDate: '2023-09-07',
    genres: ['Action', 'Thriller', 'Crime'],
    languages: ['Hindi', 'Tamil'],
    countries: ['India'],
    runtime: 169,
    rating: 8.1,
    voteCount: 5400,
    cast: [
      { id: 14, name: 'Shah Rukh Khan', character: 'Vikram Rathore / Azad', profilePath: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200' },
      { id: 15, name: 'Nayanthara', character: 'Narmada Rai', profilePath: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200' }
    ],
    directors: ['Atlee'],
    trailerUrl: 'https://www.youtube.com/watch?v=COv52Qyctws',
    industry: 'Bollywood',
    trending: false,
    popular: true,
    topRated: false,
    upcoming: false
  },
  {
    externalId: '980489',
    title: 'Exhuma',
    originalTitle: '파묘 (Pamyo)',
    overview: 'The process of excavating an ominous grave unleashes dreadful consequences buried underneath for a wealthy family living in LA.',
    posterPath: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&q=80&w=600',
    backdropPath: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&q=80&w=1600',
    releaseDate: '2024-02-22',
    genres: ['Horror', 'Mystery', 'Thriller'],
    languages: ['Korean'],
    countries: ['South Korea'],
    runtime: 134,
    rating: 8.3,
    voteCount: 3100,
    cast: [
      { id: 16, name: 'Choi Min-sik', character: 'Kim Sang-deok', profilePath: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200' },
      { id: 17, name: 'Kim Go-eun', character: 'Lee Hwa-rim', profilePath: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200' }
    ],
    directors: ['Jang Jae-hyun'],
    trailerUrl: 'https://www.youtube.com/watch?v=1bXy2F4L9x0',
    industry: 'Korean',
    trending: true,
    popular: true,
    topRated: false,
    upcoming: false
  },
  {
    externalId: '1011985',
    title: 'Kung Fu Panda 4',
    originalTitle: 'Kung Fu Panda 4',
    overview: 'Po must train a new warrior when he is chosen to become the Spiritual Leader of the Valley of Peace and faces a powerful shape-shifting sorceress.',
    posterPath: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&q=80&w=600',
    backdropPath: 'https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?auto=format&fit=crop&q=80&w=1600',
    releaseDate: '2024-03-08',
    genres: ['Animation', 'Action', 'Family', 'Comedy'],
    languages: ['English'],
    countries: ['USA'],
    runtime: 94,
    rating: 7.7,
    voteCount: 2900,
    cast: [
      { id: 18, name: 'Jack Black', character: 'Po (voice)', profilePath: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200' },
      { id: 19, name: 'Awkwafina', character: 'Zhen (voice)', profilePath: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200' }
    ],
    directors: ['Mike Mitchell'],
    trailerUrl: 'https://www.youtube.com/watch?v=_inKs4eeHiI',
    industry: 'Hollywood',
    trending: false,
    popular: true,
    topRated: false,
    upcoming: false
  },
  {
    externalId: '940551',
    title: 'Anatomy of a Fall',
    originalTitle: 'Anatomie d’une chute',
    overview: 'A woman is suspected of her husband’s murder, and their blind son faces a moral dilemma as the sole witness.',
    posterPath: 'https://images.unsplash.com/photo-1485846234645-a62644efbd47?auto=format&fit=crop&q=80&w=600',
    backdropPath: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&q=80&w=1600',
    releaseDate: '2023-08-23',
    genres: ['Drama', 'Crime', 'Mystery'],
    languages: ['French', 'English'],
    countries: ['France'],
    runtime: 151,
    rating: 8.2,
    voteCount: 4100,
    cast: [
      { id: 20, name: 'Sandra Hüller', character: 'Sandra Voyter', profilePath: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200' },
      { id: 21, name: 'Swann Arlaud', character: 'Vincent Renzi', profilePath: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200' }
    ],
    directors: ['Justine Triet'],
    trailerUrl: 'https://www.youtube.com/watch?v=fTrsp5BMloA',
    industry: 'International',
    trending: false,
    popular: true,
    topRated: true,
    upcoming: false
  },
  {
    externalId: '823464',
    title: 'Godzilla Minus One',
    originalTitle: 'ゴジラ-1.0 (Gojira Mainasu Wan)',
    overview: 'Post-war Japan is at its lowest point when a new giant crisis emerges in the form of a giant monster powered by atomic radiation.',
    posterPath: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&q=80&w=600',
    backdropPath: 'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?auto=format&fit=crop&q=80&w=1600',
    releaseDate: '2023-11-03',
    genres: ['Action', 'Science Fiction', 'Horror'],
    languages: ['Japanese'],
    countries: ['Japan'],
    runtime: 125,
    rating: 8.4,
    voteCount: 6800,
    cast: [
      { id: 22, name: 'Ryunosuke Kamiki', character: 'Koichi Shikishima', profilePath: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200' },
      { id: 23, name: 'Minami Hamabe', character: 'Noriko Oishi', profilePath: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200' }
    ],
    directors: ['Takashi Yamazaki'],
    trailerUrl: 'https://www.youtube.com/watch?v=x7Krla_UxRg',
    industry: 'Japanese',
    trending: true,
    popular: true,
    topRated: true,
    upcoming: false
  },
  {
    externalId: '1022789',
    title: 'Inside Out 2',
    originalTitle: 'Inside Out 2',
    overview: 'Teenager Riley’s mind headquarters is undergoing a sudden demolition to make room for unexpected new Emotions: Anxiety, Envy, Ennui, and Embarrassment.',
    posterPath: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&q=80&w=600',
    backdropPath: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&q=80&w=1600',
    releaseDate: '2024-06-14',
    genres: ['Animation', 'Family', 'Comedy', 'Drama'],
    languages: ['English'],
    countries: ['USA'],
    runtime: 96,
    rating: 8.1,
    voteCount: 5100,
    cast: [
      { id: 24, name: 'Amy Poehler', character: 'Joy (voice)', profilePath: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200' },
      { id: 25, name: 'Maya Hawke', character: 'Anxiety (voice)', profilePath: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200' }
    ],
    directors: ['Kelsey Mann'],
    trailerUrl: 'https://www.youtube.com/watch?v=LEjhY15eCx0',
    industry: 'Hollywood',
    trending: true,
    popular: true,
    topRated: true,
    upcoming: false
  },
  {
    externalId: '519182',
    title: 'Despicable Me 4',
    originalTitle: 'Despicable Me 4',
    overview: 'Gru and Lucy and their girls welcome a new member to the Gru family, Gru Jr., who is intent on tormenting his dad.',
    posterPath: 'https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?auto=format&fit=crop&q=80&w=600',
    backdropPath: 'https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?auto=format&fit=crop&q=80&w=1600',
    releaseDate: '2024-07-03',
    genres: ['Animation', 'Comedy', 'Family'],
    languages: ['English'],
    countries: ['USA'],
    runtime: 95,
    rating: 7.3,
    voteCount: 2100,
    cast: [
      { id: 26, name: 'Steve Carell', character: 'Gru (voice)', profilePath: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200' },
      { id: 27, name: 'Kristen Wiig', character: 'Lucy (voice)', profilePath: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200' }
    ],
    directors: ['Chris Renaud'],
    trailerUrl: 'https://www.youtube.com/watch?v=qQlr9-rF32E',
    industry: 'Hollywood',
    trending: false,
    popular: true,
    topRated: false,
    upcoming: true
  }
];
