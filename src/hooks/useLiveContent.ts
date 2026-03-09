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
  source: 'open-library';
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

// ── Simple localStorage cache ─────────────────────────────────────────────────
const CACHE_TTL_MS = 60 * 60 * 1000; // 1 hour

function getCached<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    const { data, ts } = JSON.parse(raw) as { data: T; ts: number };
    if (Date.now() - ts > CACHE_TTL_MS) return null;
    return data;
  } catch {
    return null;
  }
}

function setCache<T>(key: string, data: T): void {
  try {
    localStorage.setItem(key, JSON.stringify({ data, ts: Date.now() }));
  } catch {
    // localStorage full or unavailable — silently ignore
  }
}

// ── Open Library API ──────────────────────────────────────────────────────────
// Completely free, no API key required, no rate limits

const OL_SEARCH = 'https://openlibrary.org/search.json';
const OL_COVERS = 'https://covers.openlibrary.org/b/id';

const BOOK_QUERIES = [
  'arabic children picture book',
  'islamic parenting guide',
  'bilingual arabic english children',
  'middle east arab culture children',
  'quran stories children',
  'child development parenting research',
];

interface OLDoc {
  key: string;
  title: string;
  author_name?: string[];
  first_publish_year?: number;
  cover_i?: number;
  publisher?: string[];
  language?: string[];
  ratings_average?: number;
  ratings_count?: number;
  number_of_pages_median?: number;
  subject?: string[];
}

function parseOLBook(doc: OLDoc): LiveBook {
  const thumbnail = doc.cover_i ? `${OL_COVERS}/${doc.cover_i}-M.jpg` : null;
  const previewLink = `https://openlibrary.org${doc.key}`;

  return {
    id: doc.key,
    title: doc.title ?? 'Unknown Title',
    authors: doc.author_name ?? ['Unknown Author'],
    description: doc.subject?.slice(0, 4).join(', ') ?? '',
    thumbnail,
    publishedDate: doc.first_publish_year ? String(doc.first_publish_year) : '',
    pageCount: doc.number_of_pages_median ?? null,
    categories: doc.subject?.slice(0, 3) ?? [],
    language: doc.language?.[0] ?? 'en',
    buyLink: null,
    previewLink,
    publisher: doc.publisher?.[0] ?? '',
    ratingsCount: doc.ratings_count ?? null,
    averageRating: doc.ratings_average ?? null,
    source: 'open-library',
  };
}

export function useLiveBooks(initialQuery?: string) {
  const [books, setBooks] = useState<LiveBook[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async (query?: string) => {
    const q = query ?? initialQuery ?? BOOK_QUERIES[Math.floor(Math.random() * BOOK_QUERIES.length)];

    // Serve from cache immediately if available
    const cacheKey = `nashet_books_ol_${q}`;
    const cached = getCached<LiveBook[]>(cacheKey);
    if (cached && cached.length > 0) {
      setBooks(cached);
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);

    const params = new URLSearchParams({
      q,
      limit: '20',
      sort: 'new',
      fields: 'key,title,author_name,first_publish_year,cover_i,publisher,language,ratings_average,ratings_count,number_of_pages_median,subject',
    });

    try {
      const res = await window.fetch(`${OL_SEARCH}?${params}`);
      if (!res.ok) throw new Error(`Open Library API ${res.status}`);
      const data = await res.json() as { docs?: OLDoc[] };
      const result = (data.docs ?? [])
        .filter(doc => doc.title && (doc.author_name?.length ?? 0) > 0)
        .map(parseOLBook);
      setCache(cacheKey, result);
      setBooks(result);
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
// Routes through the Supabase edge function to keep the TMDB API key server-side
// Credentials are public (anon key) — same values used in src/lib/supabase.ts

const SUPABASE_URL = 'https://saqtuoztysqlzrdfjjvq.supabase.co';
const SUPABASE_ANON = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNhcXR1b3p0eXNxbHpyZGZqanZxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI1NDc3NzUsImV4cCI6MjA4ODEyMzc3NX0.mSS7T3X9HyaC8K3L2EQWE19Wj4IhURBwHh8yUKJUaV0';
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
