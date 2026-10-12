export interface MovieEpisode {
  serverName: string;
  name: string;
  slug: string;
  filename?: string;
  linkEmbed: string;
  linkM3u8?: string;
}

export interface MovieServer {
  serverName: string;
  episodes: MovieEpisode[];
}

export interface Movie {
  id: string;
  slug: string;
  title: string;
  originalTitle: string;
  description: string;
  poster: string;
  backdrop: string;
  releaseYear: number | string;
  genres: string[];
  country: string;
  duration: string;
  rating?: number | string;
  type: 'single' | 'series' | 'anime' | 'tvshows';
  status?: string;
  currentEpisode?: string;
  totalEpisodes?: string;
  quality?: string;
  lang?: string;
  actors?: string[];
  directors?: string[];
  trailerUrl?: string;
  servers?: MovieServer[];
}

export interface WatchHistoryItem {
  movieId: string;
  movieSlug: string;
  title: string;
  poster: string;
  backdrop: string;
  episodeSlug?: string;
  episodeName?: string;
  serverName?: string;
  currentTime: number;
  duration: number;
  updatedAt: number;
}

export interface FilterParams {
  category?: string;
  genre?: string;
  country?: string;
  year?: string;
  sort?: string;
  keyword?: string;
  page?: number;
}
