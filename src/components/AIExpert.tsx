import React, { useState, useRef, useEffect } from 'react';
import { Send, RotateCcw, AlertCircle, Loader2, Copy, Check } from 'lucide-react';
import toast from 'react-hot-toast';
import type { ChatMessage } from '../types';

const EDGE_FUNCTION_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/chat`
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY

const STARTER_PROMPTS = [
  { ar: 'كيف أعلم ابني العربية وهو يعيش في بيئة إنجليزية؟', en: 'How do I teach my child Arabic when we live in an English-speaking environment?' },
  { ar: 'ما هي علامات موهبة الطفل في عمر 3 سنوات؟', en: 'What are signs of giftedness in a 3-year-old?' },
  { ar: 'ابني عنده 4 سنوات ويضرب أخاه — كيف أتعامل معه؟', en: 'My 4-year-old hits his sibling — how do I handle this?' },
  { ar: 'كم ساعة شاشة مناسبة لطفل في عمر سنتين؟', en: 'How much screen time is appropriate for a 2-year-old?' },
  { ar: 'كيف أبدأ بتحفيظ القرآن لابنتي (٣ سنوات)؟', en: 'How do I start Quran memorization with my 3-year-old daughter?' },
  { ar: 'أعراض ADHD عند طفل في مرحلة الروضة', en: 'ADHD symptoms in a preschool-age child — what should I watch for?' },
];

export const AIExpert: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [edgeFunctionReady, setEdgeFunctionReady] = useState<boolean | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  useEffect(() => { scrollToBottom(); }, [messages]);

  // Check if the edge function is deployed
  useEffect(() => {
    if (!import.meta.env.VITE_SUPABASE_URL) {
      setEdgeFunctionReady(false);
      return;
    }
    // We assume it's ready if the env vars are set; actual check happens on first message
    setEdgeFunctionReady(true);
  }, []);

  const sendMessage = async (text?: string) => {
    const msg = (text || input).trim();
    if (!msg || loading) return;
    setInput('');

    const userMsg: ChatMessage = { role: 'user', content: msg, timestamp: new Date().toISOString() };
    const history = [...messages, userMsg].slice(-10);
    setMessages(prev => [...prev, userMsg]);
    setLoading(true);

    try {
      const res = await fetch(EDGE_FUNCTION_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({ messages: history.map(m => ({ role: m.role, content: m.content })) }),
      });

      if (!res.ok) {
        if (res.status === 404 || res.status === 503) {
          // Edge function not deployed yet
          setEdgeFunctionReady(false);
          setMessages(prev => [...prev, {
            role: 'assistant',
            content: 'The AI Expert feature needs a quick one-time setup. Please follow the instructions in deploy-edge-function.sh to activate Dr. Layla.',
            timestamp: new Date().toISOString(),
          }]);
          return;
        }
        throw new Error(`Server error: ${res.status}`);
      }

      const data = await res.json();
      if (data.error) throw new Error(data.error);

      const reply = data.choices?.[0]?.message?.content || 'I apologize — please try again.';
      setMessages(prev => [...prev, { role: 'assistant', content: reply, timestamp: new Date().toISOString() }]);
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : 'Unknown error';
      if (errMsg.includes('Failed to fetch') || errMsg.includes('NetworkError')) {
        toast.error('Connection error. Please check your internet connection.');
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: 'I couldn\'t connect to the server. Please check your internet connection and try again.',
          timestamp: new Date().toISOString(),
        }]);
      } else {
        toast.error(`Error: ${errMsg}`);
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: `I encountered an error: ${errMsg}. Please try again.`,
          timestamp: new Date().toISOString(),
        }]);
      }
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  };

  const copyMessage = (content: string, id: string) => {
    navigator.clipboard.writeText(content);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  };

  // ── Setup Banner (shown when edge function not yet deployed) ──────────────
  const SetupBanner = () => (
    <div className="mx-4 sm:mx-6 mt-4 p-4 bg-amber-50 border border-amber-200 rounded-xl text-sm text-amber-700 flex items-start gap-3">
      <AlertCircle size={18} className="flex-shrink-0 mt-0.5 text-amber-500" />
      <div>
        <p className="font-semibold mb-1">AI Expert is almost ready!</p>
        <p className="leading-relaxed">
          Follow the setup instructions in <code className="bg-amber-100 px-1 rounded text-xs">deploy-edge-function.sh</code> to activate Dr. Layla. Once deployed, return here — no page refresh needed.
        </p>
      </div>
    </div>
  );

  // ── Chat Interface ─────────────────────────────────────────────────────────
  return (
    <div className="flex flex-col h-[calc(100vh-64px)]">
      {/* Chat Header */}
      <div className="bg-white border-b border-sand-200 px-4 sm:px-6 py-3 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-teal-500 flex items-center justify-center text-white text-xl shadow-sm">
            🌙
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-gray-800">Dr. Layla Hassan</span>
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <span className="text-xs text-green-500">Online</span>
            </div>
            <p className="text-xs text-gray-400">Child Psychologist · Arab World Specialist</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => { setMessages([]); toast.success('Chat cleared.'); }}
            className="flex items-center gap-1 text-xs text-gray-400 hover:text-gray-600 px-3 py-1.5 rounded-lg hover:bg-sand-100 transition-colors"
          >
            <RotateCcw size={13} /> New Chat
          </button>
        </div>
      </div>

      {/* Setup banner if edge function not deployed */}
      {edgeFunctionReady === false && <SetupBanner />}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
        {messages.length === 0 && (
          <div className="animate-fadeIn">
            {/* Welcome message */}
            <div className="max-w-2xl mx-auto">
              <div className="flex items-start gap-3 mb-8">
                <div className="w-9 h-9 rounded-xl bg-teal-500 flex items-center justify-center text-white text-lg flex-shrink-0">🌙</div>
                <div className="chat-bubble-ai px-4 py-3 max-w-lg shadow-sm">
                  <p className="text-sm leading-relaxed text-gray-800 mb-2">
                    <strong>Ahlan wa sahlan!</strong> أهلًا وسهلًا 🌙
                  </p>
                  <p className="text-sm leading-relaxed text-gray-600 mb-2">
                    I'm Dr. Layla Hassan — a child psychologist with 20 years of experience with Arab families from Riyadh to Beirut to Cairo. I'm here to help you navigate parenting with evidence-based guidance that respects your cultural values.
                  </p>
                  <p className="text-sm text-gray-500">
                    You can ask me in <strong>Arabic or English</strong> — about anything from ADHD to Quran memorization, bilingual development to bedtime routines. What's on your mind today?
                  </p>
                </div>
              </div>

              {/* Starter prompts */}
              <div>
                <p className="text-xs text-gray-400 text-center mb-3 uppercase tracking-wide">Try asking:</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {STARTER_PROMPTS.map((p, i) => (
                    <button
                      key={i}
                      onClick={() => sendMessage(p.en)}
                      className="text-left p-3 bg-white rounded-xl border border-sand-200 hover:border-teal-300 hover:bg-teal-50 transition-all text-sm group"
                    >
                      <p className="text-gray-700 group-hover:text-teal-700 leading-snug">{p.en}</p>
                      <p className="arabic text-xs text-gray-400 mt-1 group-hover:text-teal-500">{p.ar}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Capabilities preview */}
              <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { icon: '🧠', title: 'ADHD & Learning', desc: 'Culturally-adapted guidance on assessment and support in Arab educational contexts.' },
                  { icon: '🌙', title: 'Islamic Parenting', desc: 'Evidence-based techniques woven with Hadith, Quranic wisdom, and Arab cultural values.' },
                  { icon: '📚', title: 'Bilingual Development', desc: 'Arabic heritage language preservation + English/French fluency strategies.' },
                  { icon: '💬', title: 'Arabic & English', desc: 'Ask in Arabic or English — Dr. Layla responds in your language.' },
                ].map((f, i) => (
                  <div key={i} className="card p-4 flex items-start gap-3">
                    <span className="text-2xl">{f.icon}</span>
                    <div>
                      <p className="font-semibold text-gray-700 text-sm">{f.title}</p>
                      <p className="text-xs text-gray-400 leading-relaxed mt-0.5">{f.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {messages.map((msg, i) => {
          const isUser = msg.role === 'user';
          const msgId = `msg_${i}`;
          return (
            <div key={i} className={`flex items-start gap-3 animate-fadeIn ${isUser ? 'flex-row-reverse' : ''}`}>
              {isUser ? (
                <div className="w-8 h-8 rounded-full bg-gold-400 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">You</div>
              ) : (
                <div className="w-8 h-8 rounded-xl bg-teal-500 flex items-center justify-center text-white text-base flex-shrink-0">🌙</div>
              )}

              <div className={`group relative max-w-[75%] sm:max-w-[65%] ${isUser ? 'items-end' : 'items-start'} flex flex-col`}>
                <div className={isUser ? 'chat-bubble-user px-4 py-3' : 'chat-bubble-ai px-4 py-3 shadow-sm'}>
                  <p className={`text-sm leading-relaxed whitespace-pre-wrap ${isUser ? 'text-white' : 'text-gray-800'}`}>
                    {msg.content}
                  </p>
                </div>

                <div className={`flex items-center gap-2 mt-1.5 ${isUser ? 'flex-row-reverse' : ''}`}>
                  <span className="text-xs text-gray-300">
                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                  {!isUser && (
                    <button
                      onClick={() => copyMessage(msg.content, msgId)}
                      className="opacity-0 group-hover:opacity-100 text-gray-300 hover:text-gray-500 transition-all"
                    >
                      {copiedId === msgId ? <Check size={12} className="text-green-500" /> : <Copy size={12} />}
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {loading && (
          <div className="flex items-start gap-3 animate-fadeIn">
            <div className="w-8 h-8 rounded-xl bg-teal-500 flex items-center justify-center text-white text-base flex-shrink-0">🌙</div>
            <div className="chat-bubble-ai px-4 py-3 shadow-sm">
              <div className="flex items-center gap-2 text-gray-400 text-sm">
                <Loader2 size={14} className="animate-spin text-teal-500" />
                <span>Dr. Layla is preparing her response…</span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Bar */}
      <div className="bg-white border-t border-sand-200 px-4 sm:px-6 py-4 flex-shrink-0">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-end gap-3">
            <textarea
              ref={inputRef}
              className="textarea-field flex-1 min-h-[48px] max-h-32 resize-none"
              rows={1}
              placeholder="Ask Dr. Layla anything… اسألي الدكتورة ليلى أي سؤال"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              onInput={e => {
                const el = e.currentTarget;
                el.style.height = 'auto';
                el.style.height = Math.min(el.scrollHeight, 128) + 'px';
              }}
            />
            <button
              onClick={() => sendMessage()}
              disabled={!input.trim() || loading}
              className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 transition-all ${
                input.trim() && !loading ? 'bg-teal-500 text-white hover:bg-teal-600 shadow-sm' : 'bg-sand-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              {loading ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
            </button>
          </div>
          <div className="flex items-center gap-3 mt-2 text-xs text-gray-300">
            <span>Dr. Layla Hassan · Child Psychology Expert</span>
            <span>·</span>
            <span className="flex items-center gap-1"><AlertCircle size={10} /> For serious concerns always consult a professional</span>
          </div>
        </div>
      </div>
    </div>
  );
};
