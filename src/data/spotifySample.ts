import rawData from './spotify_sample.json';

export interface RawTrackRow {
  id: number;
  track_uri: string;
  track_name: string;
  artist_uris: string;
  artist_names: string;
  album_uri: string;
  album_name: string;
  album_artist_uris: string;
  album_artist_names: string;
  release_date: string;
  album_image_url: string;
  disc_number: number;
  track_number: number;
  duration_ms: number;
  track_preview_url: string;
  explicit: boolean;
  popularity: number;
  isrc: string;
  added_by: string;
  added_at: string;
  artist_genres: string;
  danceability: number;
  energy: number;
  key: number;
  loudness: number;
  mode: number;
  speechiness: number;
  acousticness: number;
  instrumentalness: number;
  liveness: number;
  valence: number;
  tempo: number;
  time_signature: number;
  album_genres: string;
  label: string;
  copyrights: string;
  is_collab: boolean;
}

export interface TokenStreamRow {
  id: number;
  orig_row: number;
  track_name: string;
  artist_name: string;
  artist_uri: string;
  album_name: string;
  release_date: string;
  popularity: number;
  duration_ms?: number;
  danceability?: number;
  tempo?: number;
  energy?: number;
  acousticness?: number;
  is_collab: boolean;
}

export interface SpotifyDataset {
  totalRawObs: number;
  totalStreamTokens: number;
  totalDistinctArtists: number;
  columns: string[];
  rawRows: RawTrackRow[];
  tokenRows: TokenStreamRow[];
}

export const spotifyDataset = rawData as SpotifyDataset;
