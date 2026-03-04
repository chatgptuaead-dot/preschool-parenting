import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { Users, Heart, MessageCircle, Plus, Send, X, ChevronDown, ChevronUp, Search, Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useApp } from '../context/AppContext';
import toast from 'react-hot-toast';
import type { ForumPost, ForumReply, UserProfile } from '../types';

const COLORS = ['#006D77', '#D4AF37', '#8B1A1A', '#3B82F6', '#8B5CF6', '#EC4899', '#10B981', '#F59E0B'];
const ARAB_COUNTRIES = ['UAE', 'Saudi Arabia', 'Qatar', 'Kuwait', 'Bahrain', 'Oman', 'Jordan', 'Lebanon', 'Egypt', 'Palestine', 'Iraq', 'Syria', 'Morocco', 'Tunisia', 'Algeria', 'Libya', 'Yemen', 'Sudan'];
const AGE_TAGS = ['0-12m', '1-2y', '2-3y', '3-4y', '4-5y', '5-6y', '6-7y'];
const TOPIC_TAGS = ['bilingual', 'Arabic', 'ADHD', 'Quran', 'screen-time', 'sleep', 'nutrition', 'gifted', 'discipline', 'emotions', 'school-readiness', 'Islam'];

// Anonymous user ID persisted in localStorage
function getOrCreateUserId(): string {
  let uid = localStorage.getItem('nashet-anon-uid');
  if (!uid) {
    uid = 'anon_' + Math.random().toString(36).slice(2) + Date.now().toString(36);
    localStorage.setItem('nashet-anon-uid', uid);
  }
  return uid;
}

// Convert Supabase snake_case row to ForumPost camelCase
function rowToPost(row: Record<string, unknown>): ForumPost {
  const repliesRaw = (row.replies as Record<string, unknown>[] | null) ?? [];
  return {
    id: row.id as string,
    authorName: row.author_name as string,
    authorCity: row.author_city as string,
    authorInitials: row.author_initials as string,
    authorColor: row.author_color as string,
    title: row.title as string,
    body: row.body as string,
    tags: (row.tags as string[]) ?? [],
    ageGroup: (row.age_group as import('../types').AgeGroup | undefined) ?? undefined,
    createdAt: row.created_at as string,
    likes: (row.likes as number) ?? 0,
    likedBy: (row.liked_by as string[]) ?? [],
    replies: repliesRaw.map(r => ({
      id: r.id as string,
      authorName: r.author_name as string,
      authorCity: r.author_city as string,
      authorInitials: r.author_initials as string,
      authorColor: r.author_color as string,
      body: r.body as string,
      createdAt: r.created_at as string,
      likes: (r.likes as number) ?? 0,
      likedBy: (r.liked_by as string[]) ?? [],
    } as ForumReply)),
  };
}

// ── Profile Modal ─────────────────────────────────────────────────────────────
const ProfileModal: React.FC<{ onClose: () => void; onSave: (p: UserProfile) => void }> = ({ onClose, onSave }) => {
  const [name, setName] = useState('');
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('UAE');
  const [childrenAges, setChildrenAges] = useState('');

  const save = () => {
    if (!name.trim()) { toast.error('Please enter a name.'); return; }
    const initials = name.trim().split(' ').map(n => n[0].toUpperCase()).join('').slice(0, 2);
    const color = COLORS[Math.floor(Math.random() * COLORS.length)];
    onSave({
      id: getOrCreateUserId(),
      name: name.trim(),
      city: city.trim() || country,
      country,
      childrenAges: childrenAges.trim(),
      initials,
      color,
      joinedAt: new Date().toISOString(),
    });
    toast.success('Profile created! Welcome to the community.');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl p-7 max-w-md w-full shadow-2xl animate-slideUp">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-display text-xl font-bold text-gray-800">Create Your Profile</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
        </div>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">Name (Nickname) *</label>
            <input className="input-field" placeholder="e.g. Fatima or Umm Yusuf" value={name} onChange={e => setName(e.target.value)} />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">City</label>
            <input className="input-field" placeholder="e.g. Dubai" value={city} onChange={e => setCity(e.target.value)} />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">Country</label>
            <select className="input-field" value={country} onChange={e => setCountry(e.target.value)}>
              {ARAB_COUNTRIES.map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">Children's Ages (optional)</label>
            <input className="input-field" placeholder="e.g. 2 years, 5 years" value={childrenAges} onChange={e => setChildrenAges(e.target.value)} />
          </div>
        </div>
        <button onClick={save} className="btn-primary w-full justify-center mt-6 py-3">
          Join Community
        </button>
      </div>
    </div>
  );
};

// ── New Post Modal ────────────────────────────────────────────────────────────
const NewPostModal: React.FC<{ user: UserProfile; onClose: () => void; onPosted: () => void }> = ({ user, onClose, onPosted }) => {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [ageGroup, setAgeGroup] = useState('');
  const [saving, setSaving] = useState(false);

  const toggleTag = (t: string) => setSelectedTags(prev => prev.includes(t) ? prev.filter(x => x !== t) : [...prev, t]);

  const submit = async () => {
    if (!title.trim() || !body.trim()) { toast.error('Please fill in title and message.'); return; }
    setSaving(true);
    const { error } = await supabase.from('forum_posts').insert({
      author_name: user.name,
      author_city: `${user.city}, ${user.country}`,
      author_initials: user.initials,
      author_color: user.color,
      title: title.trim(),
      body: body.trim(),
      tags: selectedTags,
      age_group: ageGroup || null,
    });
    setSaving(false);
    if (error) {
      toast.error('Failed to post. Please try again.');
      console.error(error);
    } else {
      toast.success('Post published!');
      onPosted();
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl p-7 max-w-xl w-full shadow-2xl animate-slideUp my-4">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-display text-xl font-bold text-gray-800">Ask the Community</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
        </div>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">Question / Title *</label>
            <input className="input-field" placeholder="What's your question?" value={title} onChange={e => setTitle(e.target.value)} />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">Details *</label>
            <textarea className="textarea-field" rows={5} placeholder="Share context, what you've tried, your child's age..." value={body} onChange={e => setBody(e.target.value)} />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-2">Child's Age Group</label>
            <div className="flex flex-wrap gap-2">
              {AGE_TAGS.map(a => (
                <button key={a} onClick={() => setAgeGroup(a === ageGroup ? '' : a)}
                  className={`px-3 py-1 rounded-full text-xs font-medium border transition-all ${ageGroup === a ? 'bg-teal-500 text-white border-teal-500' : 'bg-white text-gray-500 border-sand-300 hover:border-teal-300'}`}>
                  {a}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-2">Topics (select up to 4)</label>
            <div className="flex flex-wrap gap-2">
              {TOPIC_TAGS.map(t => (
                <button key={t} onClick={() => toggleTag(t)} disabled={!selectedTags.includes(t) && selectedTags.length >= 4}
                  className={`px-3 py-1 rounded-full text-xs font-medium border transition-all ${selectedTags.includes(t) ? 'bg-teal-500 text-white border-teal-500' : 'bg-white text-gray-400 border-sand-300 hover:border-teal-300 disabled:opacity-40'}`}>
                  {t}
                </button>
              ))}
            </div>
          </div>
        </div>
        <button onClick={submit} disabled={saving} className="btn-gold w-full justify-center mt-6 py-3">
          {saving ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
          {saving ? 'Posting…' : 'Post Question'}
        </button>
      </div>
    </div>
  );
};

// ── Post Card ─────────────────────────────────────────────────────────────────
const PostCard: React.FC<{
  post: ForumPost;
  user: UserProfile | null;
  userId: string;
  onRefresh: () => void;
}> = ({ post, user, userId, onRefresh }) => {
  const [open, setOpen] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [showReplyBox, setShowReplyBox] = useState(false);
  const [liking, setLiking] = useState(false);
  const [replying, setReplying] = useState(false);

  const submitReply = async () => {
    if (!replyText.trim() || !user) return;
    setReplying(true);
    const { error } = await supabase.from('forum_replies').insert({
      post_id: post.id,
      author_name: user.name,
      author_city: `${user.city}, ${user.country}`,
      author_initials: user.initials,
      author_color: user.color,
      body: replyText.trim(),
    });
    setReplying(false);
    if (error) {
      toast.error('Failed to post reply.');
      console.error(error);
    } else {
      setReplyText('');
      setShowReplyBox(false);
      toast.success('Reply posted!');
      onRefresh();
    }
  };

  const handleLike = async () => {
    if (!user) { toast.error('Create a profile to like posts.'); return; }
    if (liking) return;
    setLiking(true);
    const liked = post.likedBy.includes(userId);
    const newLikedBy = liked
      ? post.likedBy.filter(id => id !== userId)
      : [...post.likedBy, userId];
    const { error } = await supabase.from('forum_posts').update({
      likes: liked ? post.likes - 1 : post.likes + 1,
      liked_by: newLikedBy,
    }).eq('id', post.id);
    setLiking(false);
    if (error) {
      toast.error('Failed to update like.');
      console.error(error);
    } else {
      onRefresh();
    }
  };

  const timeAgo = (iso: string) => {
    const diff = Date.now() - new Date(iso).getTime();
    const d = Math.floor(diff / 86400000);
    if (d > 30) return `${Math.floor(d / 30)}mo ago`;
    if (d > 0) return `${d}d ago`;
    const h = Math.floor(diff / 3600000);
    if (h > 0) return `${h}h ago`;
    return 'just now';
  };

  const liked = post.likedBy.includes(userId);

  return (
    <div className="card overflow-hidden animate-fadeIn">
      <div className="p-5">
        <div className="flex items-start gap-3 mb-3">
          <div className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0"
            style={{ backgroundColor: post.authorColor }}>
            {post.authorInitials}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-semibold text-gray-800 text-sm">{post.authorName}</span>
              <span className="text-xs text-gray-400">{post.authorCity}</span>
              <span className="text-xs text-gray-300">·</span>
              <span className="text-xs text-gray-400">{timeAgo(post.createdAt)}</span>
            </div>
            {post.ageGroup && <span className="badge bg-teal-50 text-teal-600 text-xs mt-1">{post.ageGroup}</span>}
          </div>
        </div>

        <h3 className="font-display font-bold text-gray-800 mb-2 leading-snug">{post.title}</h3>
        <p className={`text-sm text-gray-500 leading-relaxed ${!open ? 'line-clamp-3' : ''}`}>{post.body}</p>
        {post.body.length > 200 && (
          <button className="text-xs text-teal-500 mt-1 hover:text-teal-700" onClick={() => setOpen(!open)}>
            {open ? 'Show less' : 'Read more'}
          </button>
        )}

        <div className="flex flex-wrap gap-1 mt-3">
          {post.tags.map(t => <span key={t} className="badge bg-sand-100 text-gray-500 text-xs">#{t}</span>)}
        </div>

        <div className="flex items-center gap-4 mt-4 pt-3 border-t border-sand-100">
          <button
            onClick={handleLike}
            disabled={liking}
            className={`flex items-center gap-1.5 text-sm transition-colors ${liked ? 'text-red-500' : 'text-gray-400 hover:text-red-400'}`}
          >
            <Heart size={15} fill={liked ? 'currentColor' : 'none'} /> {post.likes}
          </button>
          <button
            onClick={() => setShowReplyBox(!showReplyBox)}
            className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-teal-500 transition-colors"
          >
            <MessageCircle size={15} /> {post.replies.length} {post.replies.length === 1 ? 'reply' : 'replies'}
          </button>
          {post.replies.length > 0 && (
            <button onClick={() => setOpen(!open)} className="flex items-center gap-1 text-xs text-gray-400 hover:text-teal-500 transition-colors ml-auto">
              {open ? <><ChevronUp size={14} /> Hide</> : <><ChevronDown size={14} /> Replies</>}
            </button>
          )}
        </div>
      </div>

      {/* Reply input */}
      {showReplyBox && (
        <div className="border-t border-sand-200 p-4 bg-sand-50 animate-fadeIn">
          {user ? (
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                style={{ backgroundColor: user.color }}>
                {user.initials}
              </div>
              <div className="flex-1">
                <textarea
                  className="textarea-field text-sm"
                  rows={3}
                  placeholder="Share your experience or advice..."
                  value={replyText}
                  onChange={e => setReplyText(e.target.value)}
                />
                <div className="flex justify-end gap-2 mt-2">
                  <button onClick={() => setShowReplyBox(false)} className="btn-secondary text-xs px-3 py-1.5">Cancel</button>
                  <button onClick={submitReply} disabled={!replyText.trim() || replying} className="btn-primary text-xs px-3 py-1.5">
                    {replying ? <Loader2 size={12} className="animate-spin" /> : <Send size={12} />}
                    Reply
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-sm text-gray-500 text-center">
              <button className="text-teal-500 font-medium hover:underline" onClick={() => toast('Scroll up to create a profile.')}>Create a profile</button> to reply.
            </p>
          )}
        </div>
      )}

      {/* Replies */}
      {open && post.replies.length > 0 && (
        <div className="border-t border-sand-200 bg-sand-50 divide-y divide-sand-200 animate-fadeIn">
          {post.replies.map(reply => (
            <div key={reply.id} className="p-4 pl-14">
              <div className="flex items-center gap-2 mb-1.5">
                <div className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                  style={{ backgroundColor: reply.authorColor }}>
                  {reply.authorInitials}
                </div>
                <span className="font-semibold text-gray-700 text-sm">{reply.authorName}</span>
                <span className="text-xs text-gray-400">{reply.authorCity}</span>
                <span className="text-xs text-gray-300 ml-auto">{timeAgo(reply.createdAt)}</span>
              </div>
              <p className="text-sm text-gray-600 leading-relaxed ml-9">{reply.body}</p>
              <div className="flex items-center gap-2 mt-2 ml-9">
                <button className="flex items-center gap-1 text-xs text-gray-400 hover:text-red-400 transition-colors">
                  <Heart size={12} /> {reply.likes}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// ── Main Forum ────────────────────────────────────────────────────────────────
export const Forum: React.FC = () => {
  const { userProfile, setUserProfile } = useApp();
  const [posts, setPosts] = useState<ForumPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showNewPost, setShowNewPost] = useState(false);
  const [search, setSearch] = useState('');
  const [tagFilter, setTagFilter] = useState('');
  const userId = getOrCreateUserId();

  const loadPosts = useCallback(async () => {
    const { data, error } = await supabase
      .from('forum_posts')
      .select(`*, replies:forum_replies(*)`)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Failed to load posts:', error);
      toast.error('Failed to load posts.');
    } else if (data) {
      setPosts((data as Record<string, unknown>[]).map(rowToPost));
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    loadPosts();

    // Realtime subscription
    const channel = supabase
      .channel('forum-realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'forum_posts' }, () => loadPosts())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'forum_replies' }, () => loadPosts())
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [loadPosts]);

  const filtered = useMemo(() => {
    return posts.filter(p => {
      const q = search.toLowerCase();
      const searchOk = !q || p.title.toLowerCase().includes(q) || p.body.toLowerCase().includes(q);
      const tagOk = !tagFilter || p.tags.includes(tagFilter);
      return searchOk && tagOk;
    });
  }, [posts, search, tagFilter]);

  const totalReplies = posts.reduce((s, p) => s + p.replies.length, 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      {showProfileModal && <ProfileModal onClose={() => setShowProfileModal(false)} onSave={setUserProfile} />}
      {showNewPost && userProfile && (
        <NewPostModal
          user={userProfile}
          onClose={() => setShowNewPost(false)}
          onPosted={loadPosts}
        />
      )}

      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-6">
        <div>
          <h2 className="section-title">Community Forum</h2>
          <p className="text-sm text-gray-500">
            Connect with parents across the MENA region. Share experiences, ask questions, find your tribe.
          </p>
        </div>
        <div className="flex gap-2 flex-shrink-0">
          {userProfile ? (
            <>
              <div className="flex items-center gap-2 px-3 py-2 bg-white border border-sand-300 rounded-xl text-sm text-gray-600">
                <div className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold"
                  style={{ backgroundColor: userProfile.color }}>
                  {userProfile.initials}
                </div>
                <span className="hidden sm:block">{userProfile.name}</span>
              </div>
              <button onClick={() => setShowNewPost(true)} className="btn-primary">
                <Plus size={16} /> Ask
              </button>
            </>
          ) : (
            <button onClick={() => setShowProfileModal(true)} className="btn-primary">
              <Users size={16} /> Join Community
            </button>
          )}
        </div>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input className="input-field pl-10" placeholder="Search discussions..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <select className="input-field sm:w-48" value={tagFilter} onChange={e => setTagFilter(e.target.value)}>
          <option value="">All Topics</option>
          {TOPIC_TAGS.map(t => <option key={t} value={t}>#{t}</option>)}
        </select>
      </div>

      {/* Stats bar */}
      <div className="flex items-center gap-6 text-sm text-gray-400 mb-6 px-1">
        <span>{filtered.length} discussion{filtered.length !== 1 ? 's' : ''}</span>
        <span>{totalReplies} total replies</span>
        <span className="ml-auto flex items-center gap-1">
          <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          Live · Real-time
        </span>
      </div>

      {/* Posts */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-24 text-gray-400">
          <Loader2 size={32} className="animate-spin mb-4 text-teal-400" />
          <p>Loading community posts…</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <Users size={40} className="mx-auto mb-4 opacity-30" />
          {posts.length === 0 ? (
            <>
              <p className="font-medium text-gray-500 mb-2">Be the first to post!</p>
              <p className="text-sm">Create a profile and ask the community your first question.</p>
            </>
          ) : (
            <p>No discussions found for this filter.</p>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map(post => (
            <PostCard
              key={post.id}
              post={post}
              user={userProfile}
              userId={userId}
              onRefresh={loadPosts}
            />
          ))}
        </div>
      )}

      {/* Community guidelines */}
      <div className="mt-10 p-6 bg-teal-50 border border-teal-200 rounded-2xl">
        <h4 className="font-semibold text-teal-700 mb-3 flex items-center gap-2">
          <Users size={16} /> Community Guidelines
        </h4>
        <ul className="text-sm text-teal-600 space-y-1 leading-relaxed">
          <li>• Be kind and respectful — we all want the best for our children</li>
          <li>• Share from personal experience; always recommend professional help for serious concerns</li>
          <li>• No judgment about parenting styles or family structures</li>
          <li>• Protect children's privacy — avoid sharing identifying details about your child</li>
          <li>• Cultural diversity is celebrated — Gulf, Levant, North Africa, and diaspora all welcome</li>
        </ul>
      </div>
    </div>
  );
};
