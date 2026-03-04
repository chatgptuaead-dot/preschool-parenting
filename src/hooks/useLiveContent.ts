import { useState, useEffect, useCallback } from 'react';

// ── Types ────────────────────────────────────────────────────────────────────

export interface LiveBook {
  id: string;
  title: string;
  authors: string[];
  description: string;
  thumbnail: string | null;
  publishedDate: string;
  pageCount: number | null;
  categories: string[];
  language: string;
  buyLink: string | null;
  previewLink: string | null;
  publisher: string;
  ratingsCount: number | null;
  averageRating: number | null;
  source: 'google-books';
}

export interface LiveMovie {
  id: number;
  title: string;
  overview: string;
  posterPath: string | null;
  backdropPath: string | null;
  releaseDate: string;
  voteAverage: number;
  voteCount: number;
  genres: { id: number; name: string }[];
  streamLink: string;
  source: 'tmdb';
  mediaType: 'movie' | 'tv';
}

export interface LiveContentState {
  books: LiveBook[];
  movies: LiveMovie[];
  loadingBooks: boolean;
  loadingMovies: boolean;
  errorBooks: string | null;
  errorMovies: string | null;
  refetchBooks: (query?: string) => void;
  refetchMovies: (query?: string) => void;
}

// ── Google Books API ─────────────────────────────────────────────────────────
// Free tier: up to 1,000 requests/day, no API key required for basic queries

const BOOKS_BASE = 'https://www.googleapis.com/books/v1/volumes';

const BOOK_QUERIES = [
  'arabic children book',
  'islamic parenting',
  'bilingual arabic english children',
  'middle east children picture book',
  'quran children story',
  'arab culture children book',
];

function parseGoogleBook(item: Record<string, unknown>): LiveBook {
  const info = (item.volumeInfo as Record<string, unknown>) ?? {};
  const sale = (item.saleInfo as Record<string, unknown>) ?? {};
  const access = (item.accessInfo as Record<string, unknown>) ?? {};

  const imgLinks = info.imageLinks as Record<string, string> | undefined;
  let thumbnail = imgLinks?.thumbnail ?? imgLinks?.smallThumbnail ?? null;
  // Upgrade to HTTPS and request larger image
  if (thumbnail) {
    thumbnail = thumbnail.replace('http://', 'https://').replace('zoom=1', 'zoom=2');
  }

  const buyLinks = (sale.buyLink as string | undefined) ?? null;
  const webReader = (access.webReaderLink as string | undefined) ??
    ((access.accessViewStatus === 'FULL_PUBLIC_DOMAIN' || access.viewability === 'ALL_PAGES')
      ? `https://books.google.com/books?id=${item.id}`
      : null);

  return {
    id: item.id as string,
    title: (info.title as string) ?? 'Unknown Title',
    authors: (info.authors as string[]) ?? ['Unknown Author'],
    description: ((info.description as string) ?? '').slice(0, 400),
    thumbnail,
    publishedDate: (info.publishedDate as string) ?? '',
    pageCount: (info.pageCount as number | null) ?? null,
    categories: (info.categories as string[]) ?? [],
    language: (info.language as string) ?? 'en',
    buyLink: buyLinks,
    previewLink: webReader ?? (info.previewLink as string | null) ?? null,
    publisher: (info.publisher as string) ?? '',
    ratingsCount: (info.ratingsCount as number | null) ?? null,
    averageRating: (info.averageRating as number | null) ?? null,
    source: 'google-books',
  };
}

export function useLiveBooks(initialQuery?: string) {
  const [books, setBooks] = useState<LiveBook[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async (query?: string) => {
    setLoading(true);
    setError(null);

    const q = query ?? initialQuery ?? BOOK_QUERIES[Math.floor(Math.random() * BOOK_QUERIES.length)];
    const params = new URLSearchParams({
      q,
      orderBy: 'newest',
      maxResults: '20',
      printType: 'books',
    });

    try {
      const res = await window.fetch(`${BOOKS_BASE}?${params}`);
      if (!res.ok) throw new Error(`Google Books API ${res.status}`);
      const data = await res.json() as { items?: Record<string, unknown>[] };
      const items = (data.items ?? []).filter(item => {
        const info = (item.volumeInfo as Record<string, unknown>) ?? {};
        return info.title && info.authors;
      });
      setBooks(items.map(parseGoogleBook));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load books');
    } finally {
      setLoading(false);
    }
  }, [initialQuery]);

  useEffect(() => { fetch(); }, [fetch]);

  return { books, loading, error, refetch: fetch };
}

// ── TMDB Movies / Documentaries API ─────────────────────────────────────────
// Routes through our Supabase edge function to keep the TMDB read-only API key server-side

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON = import.meta.env.VITE_SUPABASE_ANON_KEY;
const MOVIES_EDGE = `${SUPABASE_URL}/functions/v1/movies`;

function parseTmdbItem(item: Record<string, unknown>, mediaType: 'movie' | 'tv'): LiveMovie {
  const title = (item.title ?? item.name ?? 'Unknown') as string;
  const poster = item.poster_path ? `https://image.tmdb.org/t/p/w500${item.poster_path}` : null;
  const backdrop = item.backdrop_path ? `https://image.tmdb.org/t/p/w780${item.backdrop_path}` : null;
  const tmdbId = item.id as number;

  return {
    id: tmdbId,
    title,
    overview: ((item.overview as string) ?? '').slice(0, 400),
    posterPath: poster,
    backdropPath: backdrop,
    releaseDate: (item.release_date ?? item.first_air_date ?? '') as string,
    voteAverage: (item.vote_average as number) ?? 0,
    voteCount: (item.vote_count as number) ?? 0,
    genres: (item.genres as { id: number; name: string }[]) ?? [],
    streamLink: `https://www.themoviedb.org/${mediaType}/${tmdbId}`,
    source: 'tmdb',
    mediaType,
  };
}

export function useLiveMovies(category: 'documentaries' | 'arabic-kids' | 'family' = 'documentaries') {
  const [movies, setMovies] = useState<LiveMovie[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async (cat?: string) => {
    if (!SUPABASE_URL || !SUPABASE_ANON) {
      setError('Supabase not configured');
      return;
    }
    setLoading(true);
    setError(null);

    try {
      const res = await window.fetch(`${MOVIES_EDGE}?category=${cat ?? category}`, {
        headers: {
          'Authorization': `Bearer ${SUPABASE_ANON}`,
        },
      });
      if (!res.ok) throw new Error(`Movies API ${res.status}`);
      const data = await res.json() as { results?: Record<string, unknown>[]; mediaType?: 'movie' | 'tv' };
      const mediaType = data.mediaType ?? 'movie';
      setMovies((data.results ?? []).map(item => parseTmdbItem(item, mediaType)));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load movies');
    } finally {
      setLoading(false);
    }
  }, [category]);

  useEffect(() => { fetch(); }, [fetch]);

  return { movies, loading, error, refetch: fetch };
}
