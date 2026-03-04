import React, { useState, useMemo } from 'react';
import { BookOpen, Film, Music, Video, Activity, Filter, ExternalLink, Info, Sparkles, RefreshCw, Star, Loader2 } from 'lucide-react';
import { CONTENT } from '../data/content';
import { AgeSelector } from './AgeSelector';
import { useApp } from '../context/AppContext';
import { useLiveBooks, useLiveMovies } from '../hooks/useLiveContent';
import type { ContentType } from '../types';

// ── Icon / colour maps ───────────────────────────────────────────────────────

const TYPE_ICONS: Record<ContentType, React.ReactNode> = {
  book:         <BookOpen  size={16} />,
  movie:        <Film      size={16} />,
  music:        <Music     size={16} />,
  documentary:  <Video     size={16} />,
  activity:     <Activity  size={16} />,
};

const TYPE_COLORS: Record<ContentType, string> = {
  book:         'bg-blue-50 text-blue-600 border-blue-200',
  movie:        'bg-purple-50 text-purple-600 border-purple-200',
  music:        'bg-pink-50 text-pink-600 border-pink-200',
  documentary:  'bg-orange-50 text-orange-600 border-orange-200',
  activity:     'bg-green-50 text-green-600 border-green-200',
};

const LANG_COLORS: Record<string, string> = {
  Arabic:   'bg-teal-50 text-teal-700',
  English:  'bg-indigo-50 text-indigo-700',
  Bilingual:'bg-gold-50 text-gold-700',
  Various:  'bg-gray-100 text-gray-600',
};

const FILTERS: { id: ContentType | 'all'; label: string; icon?: React.ReactNode }[] = [
  { id: 'all',         label: 'All Content' },
  { id: 'book',        label: 'Books',         icon: <BookOpen size={14} /> },
  { id: 'movie',       label: 'Movies & TV',   icon: <Film     size={14} /> },
  { id: 'music',       label: 'Music',         icon: <Music    size={14} /> },
  { id: 'documentary', label: 'Documentaries', icon: <Video    size={14} /> },
];

// ── Discover tab presets ─────────────────────────────────────────────────────

const BOOK_PRESETS = [
  { label: 'Arabic Children', query: 'arabic children picture book' },
  { label: 'Islamic Parenting', query: 'islamic parenting guide' },
  { label: 'Bilingual', query: 'bilingual arabic english children' },
  { label: 'Arab World', query: 'middle east arab culture children' },
  { label: 'Quran Stories', query: 'quran stories children' },
  { label: 'Parenting Science', query: 'child development parenting research' },
];

const MOVIE_PRESETS: { label: string; category: 'documentaries' | 'arabic-kids' | 'family' }[] = [
  { label: 'Documentaries', category: 'documentaries' },
  { label: 'Arabic Animation', category: 'arabic-kids' },
  { label: 'Family Films', category: 'family' },
];

// ── Curated Library tab ──────────────────────────────────────────────────────

const CuratedLibrary: React.FC = () => {
  const { selectedAge } = useApp();
  const [typeFilter, setTypeFilter] = useState<ContentType | 'all'>('all');
  const [search, setSearch] = useState('');
  const [expanded, setExpanded] = useState<string | null>(null);

  const filtered = useMemo(() => {
    return CONTENT.filter(c => {
      const ageOk  = selectedAge === 'all' || (c.ageGroups as string[]).includes(selectedAge);
      const typeOk = typeFilter === 'all' || c.type === typeFilter;
      const q      = search.toLowerCase();
      const searchOk = !q || c.title.toLowerCase().includes(q) || c.creator.toLowerCase().includes(q) ||
                        c.description.toLowerCase().includes(q) || c.tags.some(t => t.includes(q));
      return ageOk && typeOk && searchOk;
    });
  }, [selectedAge, typeFilter, search]);

  const counts = useMemo(() => {
    const all = CONTENT.filter(c => selectedAge === 'all' || (c.ageGroups as string[]).includes(selectedAge));
    return {
      all: all.length,
      book: all.filter(c => c.type === 'book').length,
      movie: all.filter(c => c.type === 'movie').length,
      music: all.filter(c => c.type === 'music').length,
      documentary: all.filter(c => c.type === 'documentary').length,
    };
  }, [selectedAge]);

  return (
    <div>
      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Filter size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search titles, creators, topics..."
            className="input-field pl-10"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Type filter pills */}
      <div className="flex flex-wrap gap-2 mb-8">
        {FILTERS.map(f => {
          const count = counts[f.id as keyof typeof counts] ?? 0;
          return (
            <button
              key={f.id}
              onClick={() => setTypeFilter(f.id as ContentType | 'all')}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all border ${
                typeFilter === f.id
                  ? 'bg-teal-500 text-white border-teal-500 shadow-sm'
                  : 'bg-white text-gray-500 border-sand-300 hover:border-teal-300 hover:text-teal-600'
              }`}
            >
              {f.icon}
              {f.label}
              <span className={`text-xs px-1.5 py-0.5 rounded-full ${typeFilter === f.id ? 'bg-white/20' : 'bg-sand-100'}`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <BookOpen size={40} className="mx-auto mb-4 opacity-30" />
          <p className="font-medium">No content found for this filter combination.</p>
          <p className="text-sm mt-1">Try adjusting the age group or type filter.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map(item => (
            <div
              key={item.id}
              className="card p-0 flex flex-col cursor-pointer"
              onClick={() => setExpanded(expanded === item.id ? null : item.id)}
            >
              {/* Card Header */}
              <div className="p-5 flex-1">
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${TYPE_COLORS[item.type]}`}>
                    {TYPE_ICONS[item.type]}
                    <span className="capitalize">{item.type === 'movie' ? 'Movie/TV' : item.type}</span>
                  </div>
                  <span className={`badge ${LANG_COLORS[item.language]}`}>{item.language}</span>
                </div>

                <h3 className="font-display font-semibold text-gray-800 text-base mb-0.5 leading-snug">
                  {item.title}
                </h3>
                {item.arabicTitle && (
                  <p className="arabic text-sm text-gray-500 mb-2">{item.arabicTitle}</p>
                )}
                <p className="text-xs text-gold-600 font-medium mb-3">{item.creator}</p>
                <p className="text-sm text-gray-500 leading-relaxed line-clamp-3">{item.description}</p>

                {/* Age badges */}
                <div className="flex flex-wrap gap-1 mt-3">
                  {item.ageGroups.slice(0, 3).map(a => (
                    <span key={a} className="badge bg-teal-50 text-teal-600 text-xs">{a}</span>
                  ))}
                  {item.ageGroups.length > 3 && (
                    <span className="badge bg-gray-100 text-gray-500 text-xs">+{item.ageGroups.length - 3}</span>
                  )}
                </div>
              </div>

              {/* Expand toggle */}
              <div className="border-t border-sand-100 px-5 py-3 flex items-center justify-between text-xs text-gray-400 hover:bg-sand-50 transition-colors">
                <span>{item.year ? `${item.year} · ` : ''}{item.source}</span>
                <Info size={14} className={`transition-transform ${expanded === item.id ? 'text-teal-500 rotate-180' : ''}`} />
              </div>

              {/* Expanded details */}
              {expanded === item.id && (
                <div className="border-t border-sand-200 bg-sand-50 p-5 animate-fadeIn space-y-4">
                  <div className="source-card pl-4 py-1">
                    <p className="text-xs font-semibold text-gold-600 uppercase tracking-wide mb-1">Cultural Relevance</p>
                    <p className="text-sm text-gray-600 leading-relaxed">{item.culturalNote}</p>
                  </div>

                  {item.peerReviewedBasis && (
                    <div>
                      <p className="text-xs font-semibold text-teal-600 uppercase tracking-wide mb-1">Peer-Reviewed Basis</p>
                      <p className="text-sm text-gray-500 leading-relaxed">{item.peerReviewedBasis}</p>
                    </div>
                  )}

                  <div className="flex flex-wrap gap-1">
                    {item.tags.map(t => (
                      <span key={t} className="badge bg-white border border-sand-300 text-gray-500 text-xs">#{t}</span>
                    ))}
                  </div>

                  {item.available && (
                    <div className="flex items-start gap-2 text-xs text-gray-500">
                      <ExternalLink size={12} className="mt-0.5 flex-shrink-0 text-teal-400" />
                      <span>{item.available}</span>
                    </div>
                  )}

                  {item.link && (
                    <a
                      href={item.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={e => e.stopPropagation()}
                      className="btn-primary text-xs px-4 py-2 inline-flex items-center gap-1.5"
                    >
                      <ExternalLink size={13} /> View / Buy / Watch
                    </a>
                  )}

                  {item.rating && (
                    <span className="badge bg-yellow-50 text-yellow-700 border border-yellow-200">
                      Rating: {item.rating}
                    </span>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// ── Live Book Card ────────────────────────────────────────────────────────────

const LiveBookCard: React.FC<{ book: import('../hooks/useLiveContent').LiveBook }> = ({ book }) => {
  const link = book.buyLink ?? book.previewLink ?? `https://books.google.com/books?id=${book.id}`;
  const year = book.publishedDate ? new Date(book.publishedDate).getFullYear() : null;

  return (
    <div className="card p-0 flex flex-col group">
      <div className="flex gap-4 p-4 flex-1">
        {book.thumbnail ? (
          <img
            src={book.thumbnail}
            alt={book.title}
            className="w-16 h-24 object-cover rounded-lg flex-shrink-0 shadow-sm"
            onError={e => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
          />
        ) : (
          <div className="w-16 h-24 bg-blue-50 rounded-lg flex-shrink-0 flex items-center justify-center">
            <BookOpen size={24} className="text-blue-300" />
          </div>
        )}
        <div className="flex-1 min-w-0">
          <div className="flex items-start gap-2 mb-1">
            <span className="badge bg-blue-50 text-blue-600 border border-blue-200 text-xs">Book</span>
            {book.language === 'ar' && <span className="badge bg-teal-50 text-teal-700 text-xs">Arabic</span>}
            <span className="badge bg-gray-50 text-gray-500 text-xs">New</span>
          </div>
          <h3 className="font-semibold text-gray-800 text-sm leading-snug mb-1 line-clamp-2">{book.title}</h3>
          <p className="text-xs text-gold-600 font-medium mb-1">{book.authors.join(', ')}</p>
          {book.publisher && <p className="text-xs text-gray-400 mb-1">{book.publisher}{year ? ` · ${year}` : ''}</p>}
          {book.averageRating && (
            <div className="flex items-center gap-1 text-xs text-yellow-600 mb-1">
              <Star size={10} className="fill-yellow-400" />
              <span>{book.averageRating.toFixed(1)}</span>
              {book.ratingsCount && <span className="text-gray-400">({book.ratingsCount})</span>}
            </div>
          )}
          {book.description && (
            <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">{book.description}</p>
          )}
        </div>
      </div>

      <div className="border-t border-sand-100 px-4 py-3 flex items-center gap-2">
        <a
          href={link}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 btn-primary text-xs py-2 inline-flex items-center justify-center gap-1.5"
        >
          <ExternalLink size={12} /> {book.buyLink ? 'Buy on Google Play' : 'Preview / Read'}
        </a>
        <a
          href={`https://www.amazon.com/s?k=${encodeURIComponent(book.title + ' ' + (book.authors[0] ?? ''))}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 text-xs px-3 py-2 border border-sand-300 rounded-lg text-gray-600 hover:border-gold-400 hover:text-gold-600 transition-colors"
        >
          Amazon
        </a>
      </div>
    </div>
  );
};

// ── Live Movie Card ───────────────────────────────────────────────────────────

const LiveMovieCard: React.FC<{ movie: import('../hooks/useLiveContent').LiveMovie }> = ({ movie }) => {
  const year = movie.releaseDate ? new Date(movie.releaseDate).getFullYear() : null;
  const rating = movie.voteAverage > 0 ? movie.voteAverage.toFixed(1) : null;

  return (
    <div className="card p-0 flex flex-col group">
      {movie.posterPath ? (
        <img
          src={movie.posterPath}
          alt={movie.title}
          className="w-full h-48 object-cover rounded-t-xl"
          onError={e => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
        />
      ) : (
        <div className="w-full h-48 bg-purple-50 rounded-t-xl flex items-center justify-center">
          <Film size={40} className="text-purple-200" />
        </div>
      )}

      <div className="p-4 flex-1 flex flex-col">
        <div className="flex items-center gap-2 mb-2">
          <span className={`badge text-xs ${movie.mediaType === 'tv' ? 'bg-indigo-50 text-indigo-600 border border-indigo-200' : 'bg-purple-50 text-purple-600 border border-purple-200'}`}>
            {movie.mediaType === 'tv' ? 'TV Series' : 'Film'}
          </span>
          {rating && (
            <span className="flex items-center gap-0.5 text-xs text-yellow-600">
              <Star size={10} className="fill-yellow-400" /> {rating}
            </span>
          )}
          {year && <span className="text-xs text-gray-400">{year}</span>}
        </div>

        <h3 className="font-semibold text-gray-800 text-sm mb-2 leading-snug line-clamp-2">{movie.title}</h3>
        {movie.overview && (
          <p className="text-xs text-gray-500 line-clamp-3 leading-relaxed flex-1">{movie.overview}</p>
        )}
      </div>

      <div className="border-t border-sand-100 px-4 py-3 flex items-center gap-2">
        <a
          href={movie.streamLink}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 btn-primary text-xs py-2 inline-flex items-center justify-center gap-1.5"
        >
          <ExternalLink size={12} /> View on TMDB
        </a>
        <a
          href={`https://www.justwatch.com/us/search?q=${encodeURIComponent(movie.title)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 text-xs px-3 py-2 border border-sand-300 rounded-lg text-gray-600 hover:border-teal-400 hover:text-teal-600 transition-colors"
        >
          Where to Watch
        </a>
      </div>
    </div>
  );
};

// ── Discover Live Tab ─────────────────────────────────────────────────────────

const DiscoverTab: React.FC = () => {
  const [bookPreset, setBookPreset] = useState(0);
  const [moviePreset, setMoviePreset] = useState(0);

  const { books, loading: loadingBooks, error: errorBooks, refetch: refetchBooks } = useLiveBooks(BOOK_PRESETS[bookPreset].query);
  const { movies, loading: loadingMovies, error: errorMovies, refetch: refetchMovies } = useLiveMovies(MOVIE_PRESETS[moviePreset].category);

  const handleBookPreset = (idx: number) => {
    setBookPreset(idx);
    refetchBooks(BOOK_PRESETS[idx].query);
  };

  const handleMoviePreset = (idx: number) => {
    setMoviePreset(idx);
    refetchMovies(MOVIE_PRESETS[idx].category);
  };

  return (
    <div className="space-y-12">
      {/* Live Books */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-display text-lg font-semibold text-gray-800 flex items-center gap-2">
              <BookOpen size={20} className="text-blue-500" /> New & Trending Books
              <span className="text-xs font-normal bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full">Live · Google Books</span>
            </h3>
            <p className="text-xs text-gray-400 mt-0.5">Real-time results — updated daily from Google Books API</p>
          </div>
          <button
            onClick={() => refetchBooks(BOOK_PRESETS[bookPreset].query)}
            disabled={loadingBooks}
            className="flex items-center gap-1 text-xs text-gray-400 hover:text-teal-600 transition-colors"
          >
            <RefreshCw size={13} className={loadingBooks ? 'animate-spin' : ''} /> Refresh
          </button>
        </div>

        {/* Book category pills */}
        <div className="flex flex-wrap gap-2 mb-5">
          {BOOK_PRESETS.map((p, i) => (
            <button
              key={i}
              onClick={() => handleBookPreset(i)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                bookPreset === i
                  ? 'bg-blue-500 text-white'
                  : 'bg-white border border-sand-300 text-gray-500 hover:border-blue-300 hover:text-blue-600'
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>

        {loadingBooks && (
          <div className="flex items-center justify-center py-16 text-gray-400">
            <Loader2 size={24} className="animate-spin mr-2 text-teal-400" />
            <span className="text-sm">Fetching latest books…</span>
          </div>
        )}
        {errorBooks && !loadingBooks && (
          <div className="text-center py-10 text-gray-400">
            <p className="text-sm">Couldn't load books. {errorBooks}</p>
            <button onClick={() => refetchBooks()} className="mt-2 text-xs text-teal-500 underline">Retry</button>
          </div>
        )}
        {!loadingBooks && !errorBooks && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {books.map(book => <LiveBookCard key={book.id} book={book} />)}
            {books.length === 0 && (
              <p className="text-sm text-gray-400 col-span-3 text-center py-8">No books found for this search.</p>
            )}
          </div>
        )}
      </section>

      {/* Live Movies / Documentaries */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-display text-lg font-semibold text-gray-800 flex items-center gap-2">
              <Film size={20} className="text-purple-500" /> New Releases — Films & Docs
              <span className="text-xs font-normal bg-purple-50 text-purple-600 px-2 py-0.5 rounded-full">Live · TMDB</span>
            </h3>
            <p className="text-xs text-gray-400 mt-0.5">
              {errorMovies?.includes('not configured')
                ? '⚠ Deploy the movies edge function to enable live TMDB results.'
                : 'Real-time results from The Movie Database (TMDB)'}
            </p>
          </div>
          <button
            onClick={() => refetchMovies(MOVIE_PRESETS[moviePreset].category)}
            disabled={loadingMovies}
            className="flex items-center gap-1 text-xs text-gray-400 hover:text-teal-600 transition-colors"
          >
            <RefreshCw size={13} className={loadingMovies ? 'animate-spin' : ''} /> Refresh
          </button>
        </div>

        {/* Movie category pills */}
        <div className="flex flex-wrap gap-2 mb-5">
          {MOVIE_PRESETS.map((p, i) => (
            <button
              key={i}
              onClick={() => handleMoviePreset(i)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                moviePreset === i
                  ? 'bg-purple-500 text-white'
                  : 'bg-white border border-sand-300 text-gray-500 hover:border-purple-300 hover:text-purple-600'
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>

        {loadingMovies && (
          <div className="flex items-center justify-center py-16 text-gray-400">
            <Loader2 size={24} className="animate-spin mr-2 text-purple-400" />
            <span className="text-sm">Fetching latest releases…</span>
          </div>
        )}
        {errorMovies && !loadingMovies && (
          <div className="text-center py-10 rounded-xl border border-dashed border-sand-300 bg-sand-50">
            {errorMovies.includes('not configured') ? (
              <div className="p-6">
                <Film size={32} className="mx-auto mb-3 text-gray-300" />
                <p className="font-medium text-gray-600 mb-1">TMDB not yet connected</p>
                <p className="text-xs text-gray-400 mb-3 max-w-sm mx-auto">
                  Get a free API key at <strong>themoviedb.org/settings/api</strong>, then add it as <code className="bg-gray-100 px-1 rounded">TMDB_API_KEY</code> in your Supabase Edge Function secrets, and deploy the <code className="bg-gray-100 px-1 rounded">movies</code> function.
                </p>
                <a href="https://www.themoviedb.org/settings/api" target="_blank" rel="noopener noreferrer" className="btn-primary text-xs px-4 py-2 inline-flex items-center gap-1.5">
                  <ExternalLink size={12} /> Get Free TMDB API Key
                </a>
              </div>
            ) : (
              <div>
                <p className="text-sm text-gray-400">Couldn't load movies. {errorMovies}</p>
                <button onClick={() => refetchMovies()} className="mt-2 text-xs text-teal-500 underline">Retry</button>
              </div>
            )}
          </div>
        )}
        {!loadingMovies && !errorMovies && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {movies.slice(0, 12).map(movie => <LiveMovieCard key={movie.id} movie={movie} />)}
            {movies.length === 0 && (
              <p className="text-sm text-gray-400 col-span-4 text-center py-8">No results found.</p>
            )}
          </div>
        )}
      </section>

      <p className="text-xs text-center text-gray-300 pt-4 border-t border-sand-100">
        Live content powered by Google Books API &amp; The Movie Database (TMDB). Results update daily. Curated recommendations always available in the Library tab.
      </p>
    </div>
  );
};

// ── Main Export ───────────────────────────────────────────────────────────────

export const ContentLibrary: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'curated' | 'discover'>('curated');

  return (
    <div>
      <AgeSelector />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        {/* Header */}
        <div className="mb-8">
          <h2 className="section-title">Content Library</h2>
          <p className="section-subtitle">
            Curated books, films, music, and documentaries — each vetted for cultural relevance, educational value, and age-appropriateness for families in the Middle East. Plus live new-release discovery.
          </p>
        </div>

        {/* Tab switcher */}
        <div className="flex gap-2 mb-8 border-b border-sand-200 pb-0">
          <button
            onClick={() => setActiveTab('curated')}
            className={`flex items-center gap-2 px-5 py-3 text-sm font-medium border-b-2 transition-all -mb-px ${
              activeTab === 'curated'
                ? 'border-teal-500 text-teal-600'
                : 'border-transparent text-gray-400 hover:text-gray-600'
            }`}
          >
            <BookOpen size={15} />
            Curated Library
            <span className="text-xs bg-teal-50 text-teal-600 px-1.5 py-0.5 rounded-full">{CONTENT.length}</span>
          </button>
          <button
            onClick={() => setActiveTab('discover')}
            className={`flex items-center gap-2 px-5 py-3 text-sm font-medium border-b-2 transition-all -mb-px ${
              activeTab === 'discover'
                ? 'border-teal-500 text-teal-600'
                : 'border-transparent text-gray-400 hover:text-gray-600'
            }`}
          >
            <Sparkles size={15} />
            Discover New Releases
            <span className="text-xs bg-purple-50 text-purple-600 px-1.5 py-0.5 rounded-full">Live</span>
          </button>
        </div>

        {activeTab === 'curated' ? <CuratedLibrary /> : <DiscoverTab />}

        {/* Attribution */}
        {activeTab === 'curated' && (
          <p className="text-xs text-center text-gray-400 mt-12">
            All content recommendations reference peer-reviewed sources and have been selected for cultural alignment with Middle Eastern values.
            Sources include WHO, AAP, Arab Reading Challenge, and MENA education research.
          </p>
        )}
      </div>
    </div>
  );
};
