import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// TMDB free read-only API — v3 — get your free key at https://www.themoviedb.org/settings/api
const TMDB_KEY = Deno.env.get('TMDB_API_KEY') ?? '';
const TMDB = 'https://api.themoviedb.org/3';

// ── Category presets ──────────────────────────────────────────────────────────

type Category = 'documentaries' | 'arabic-kids' | 'family';

interface TmdbParams {
  path: string;
  params: Record<string, string>;
  mediaType: 'movie' | 'tv';
}

function getCategoryConfig(category: Category): TmdbParams {
  switch (category) {
    case 'documentaries':
      // Educational/nature documentaries for children
      // TV genre 10762 = Kids, genre 99 = Documentary
      return {
        path: '/discover/tv',
        params: {
          with_genres: '10762,99',   // Kids AND Documentary
          sort_by: 'popularity.desc',
          'vote_count.gte': '5',
          include_adult: 'false',
        },
        mediaType: 'tv',
      };

    case 'arabic-kids':
      // Arabic-language kids animation TV shows
      // TV genre 16 = Animation, 10762 = Kids
      return {
        path: '/discover/tv',
        params: {
          with_original_language: 'ar',
          with_genres: '16|10762',   // Animation OR Kids
          sort_by: 'popularity.desc',
          include_adult: 'false',
        },
        mediaType: 'tv',
      };

    case 'family':
    default:
      // Popular G/PG animated and family movies — classics and recent releases
      return {
        path: '/discover/movie',
        params: {
          with_genres: '16,10751',   // Animation AND Family
          sort_by: 'popularity.desc',
          'vote_count.gte': '200',
          certification_country: 'US',
          'certification.lte': 'PG',
          include_adult: 'false',
        },
        mediaType: 'movie',
      };
  }
}

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: CORS });
  }

  try {
    if (!TMDB_KEY) {
      return new Response(
        JSON.stringify({ error: 'TMDB_API_KEY not configured. Add it in Supabase Secrets.' }),
        { status: 503, headers: { ...CORS, 'Content-Type': 'application/json' } },
      );
    }

    const url = new URL(req.url);
    const category = (url.searchParams.get('category') ?? 'documentaries') as Category;
    const page = url.searchParams.get('page') ?? '1';

    const { path, params, mediaType } = getCategoryConfig(category);

    const tmdbParams = new URLSearchParams({
      api_key: TMDB_KEY,
      language: 'en-US',
      page,
      ...params,
    });

    const tmdbRes = await fetch(`${TMDB}${path}?${tmdbParams}`);
    if (!tmdbRes.ok) {
      throw new Error(`TMDB error: ${tmdbRes.status}`);
    }
    const data = await tmdbRes.json();

    return new Response(
      JSON.stringify({ ...data, mediaType }),
      { headers: { ...CORS, 'Content-Type': 'application/json' } },
    );
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: msg }),
      { status: 500, headers: { ...CORS, 'Content-Type': 'application/json' } },
    );
  }
});
