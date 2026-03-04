-- ============================================================
-- Nashet Parenting App — Supabase Setup SQL
-- Paste this entire file into the Supabase Dashboard → SQL Editor
-- and click "Run"
-- ============================================================

-- Forum posts table
CREATE TABLE IF NOT EXISTS forum_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  author_name text NOT NULL,
  author_city text DEFAULT '',
  author_initials text DEFAULT 'U',
  author_color text DEFAULT '#006D77',
  title text NOT NULL,
  body text NOT NULL,
  tags text[] DEFAULT '{}',
  age_group text,
  likes integer DEFAULT 0,
  liked_by text[] DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS forum_replies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id uuid REFERENCES forum_posts(id) ON DELETE CASCADE NOT NULL,
  author_name text NOT NULL,
  author_city text DEFAULT '',
  author_initials text DEFAULT 'U',
  author_color text DEFAULT '#006D77',
  body text NOT NULL,
  likes integer DEFAULT 0,
  liked_by text[] DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

-- Disable RLS (open community forum — no auth required)
ALTER TABLE forum_posts DISABLE ROW LEVEL SECURITY;
ALTER TABLE forum_replies DISABLE ROW LEVEL SECURITY;

-- Enable realtime for live updates
ALTER PUBLICATION supabase_realtime ADD TABLE forum_posts;
ALTER PUBLICATION supabase_realtime ADD TABLE forum_replies;

-- ============================================================
-- SEED DATA — 8 initial forum posts with replies
-- ============================================================

-- Post 1: Teaching Arabic
WITH inserted_post AS (
  INSERT INTO forum_posts (id, author_name, author_city, author_initials, author_color, title, body, tags, age_group, likes, liked_by, created_at)
  VALUES (
    'a0000001-0000-0000-0000-000000000001',
    'Mariam Al-Rashidi',
    'Dubai, UAE',
    'MA',
    '#006D77',
    'Teaching Arabic to my 3-year-old when we speak English at home?',
    'We''re an Emirati-British family. My husband and I mostly speak English at home since we met at university in London. My son Yousef is 3.5 years old and understands basic Arabic from his grandparents, but he answers everything in English. My mother-in-law is concerned. Any strategies that have actually worked for bilingual families in the UAE?',
    ARRAY['bilingual', 'Arabic', 'UAE', 'language-delay'],
    '3-4y',
    24,
    '{}',
    '2024-11-15T09:30:00Z'
  )
  RETURNING id
)
INSERT INTO forum_replies (post_id, author_name, author_city, author_initials, author_color, body, likes, liked_by, created_at)
SELECT
  inserted_post.id,
  reply.author_name,
  reply.author_city,
  reply.author_initials,
  reply.author_color,
  reply.body,
  reply.likes,
  reply.liked_by,
  reply.created_at
FROM inserted_post, (VALUES
  ('Nour Khalil', 'Abu Dhabi', 'NK', '#D4AF37',
   'Same situation here! What worked for us: we hired an Arabic-speaking babysitter 3 afternoons a week. My daughter Lina (now 5) speaks beautiful Arabic to her bibi but English to us. The key is consistent Arabic-only exposure with certain people. Baraem TV also helped a lot.',
   12, ARRAY[]::text[], '2024-11-15T11:15:00Z'::timestamptz),
  ('Dr. Salim Mansour', 'Dubai', 'SM', '#8B1A1A',
   'This is a very common concern in the Gulf. Research (including AUB studies) shows "language mixing" at this age is NORMAL and not confusion. The strategy most supported by evidence is "Minority Language at Home" — since Arabic is the minority language in your household, prioritize it at home. Arabic TV, Arabic books at bedtime, and most importantly: Arabic-speaking grandparent time is irreplaceable.',
   31, ARRAY[]::text[], '2024-11-15T14:00:00Z'::timestamptz)
) AS reply(author_name, author_city, author_initials, author_color, body, likes, liked_by, created_at);

-- Post 2: Picky eating
WITH inserted_post AS (
  INSERT INTO forum_posts (id, author_name, author_city, author_initials, author_color, title, body, tags, age_group, likes, liked_by, created_at)
  VALUES (
    'a0000002-0000-0000-0000-000000000002',
    'Fatima Al-Zahrani',
    'Riyadh, KSA',
    'FZ',
    '#8B1A1A',
    'My 4-year-old refuses all vegetables — screaming tantrums at meals',
    'My son Faisal (4 years 2 months) will scream and throw his plate if he sees any vegetables. We have tried hiding them in food, forcing him, rewarding him — nothing works. Mealtimes have become a battle every single day. His pediatrician says he''s healthy but I''m worried about nutrition. Anyone gone through this?',
    ARRAY['picky-eating', 'tantrums', 'mealtime', 'nutrition'],
    '3-4y',
    38,
    '{}',
    '2024-11-10T16:45:00Z'
  )
  RETURNING id
)
INSERT INTO forum_replies (post_id, author_name, author_city, author_initials, author_color, body, likes, liked_by, created_at)
SELECT
  inserted_post.id,
  reply.author_name,
  reply.author_city,
  reply.author_initials,
  reply.author_color,
  reply.body,
  reply.likes,
  reply.liked_by,
  reply.created_at
FROM inserted_post, (VALUES
  ('Rana Barakat', 'Amman, Jordan', 'RB', '#006D77',
   'Ellyn Satter''s "Division of Responsibility" model changed our lives! The parent decides WHAT and WHEN food is served. The child decides IF and HOW MUCH they eat. Stop the battles, serve one preferred food at every meal alongside new ones. It took 3 months but my daughter now eats salad. No pressure is the key.',
   19, ARRAY[]::text[], '2024-11-10T18:30:00Z'::timestamptz),
  ('Sara Al-Mutawa', 'Kuwait City', 'SA', '#D4AF37',
   'Try "food exposure therapy" — it takes 15–20 exposures to a new food before a child accepts it. Put a tiny amount on the plate, no pressure to eat it. Let them smell it, touch it, lick it. My twins are 5 now and eat zucchini! Patience is everything. Also try letting them help cook — kids eat what they make.',
   27, ARRAY[]::text[], '2024-11-11T09:00:00Z'::timestamptz)
) AS reply(author_name, author_city, author_initials, author_color, body, likes, liked_by, created_at);

-- Post 3: ADHD and Quran
WITH inserted_post AS (
  INSERT INTO forum_posts (id, author_name, author_city, author_initials, author_color, title, body, tags, age_group, likes, liked_by, created_at)
  VALUES (
    'a0000003-0000-0000-0000-000000000003',
    'Ahmed Saber',
    'Cairo, Egypt',
    'AS',
    '#D4AF37',
    'Teaching Quran to a child who may have ADHD — tips?',
    'My son Adam is 5 years old and the Quran teacher says he "can''t sit still and concentrate." We haven''t had a formal ADHD assessment yet but the description matches. He loves the Quran — he hums suras! — but traditional seated memorization doesn''t work. Has anyone found ways to make Quran memorization work for active/ADHD children?',
    ARRAY['ADHD', 'Quran', 'memorization', 'active-learner'],
    '4-5y',
    51,
    '{}',
    '2024-11-08T10:00:00Z'
  )
  RETURNING id
)
INSERT INTO forum_replies (post_id, author_name, author_city, author_initials, author_color, body, likes, liked_by, created_at)
SELECT
  inserted_post.id,
  reply.author_name,
  reply.author_city,
  reply.author_initials,
  reply.author_color,
  reply.body,
  reply.likes,
  reply.liked_by,
  reply.created_at
FROM inserted_post, (VALUES
  ('Layla Al-Nasser', 'Doha, Qatar', 'LN', '#006D77',
   'My son (diagnosed ADHD at 6) memorizes suras while jumping on the trampoline! We play the recording on repeat and he absorbs it during movement. He memorized Al-Baqarah''s first 10 ayat in a month this way. Movement and Quran can absolutely coexist.',
   44, ARRAY[]::text[], '2024-11-08T12:30:00Z'::timestamptz),
  ('Ustaz Bilal Hamdan', 'Beirut, Lebanon', 'BH', '#8B1A1A',
   'I''m a Quran teacher who specializes in children with learning differences. Key adaptations: (1) 5-minute sessions max, 3x daily instead of one long session. (2) Use hand motions with ayat. (3) Record the child reciting and play it back — children LOVE hearing themselves. (4) Never punish during hifz — it creates lifelong aversion.',
   67, ARRAY[]::text[], '2024-11-09T08:00:00Z'::timestamptz)
) AS reply(author_name, author_city, author_initials, author_color, body, likes, liked_by, created_at);

-- Post 4: Fear of the dark
WITH inserted_post AS (
  INSERT INTO forum_posts (id, author_name, author_city, author_initials, author_color, title, body, tags, age_group, likes, liked_by, created_at)
  VALUES (
    'a0000004-0000-0000-0000-000000000004',
    'Khalid Al-Kuwari',
    'Doha, Qatar',
    'KK',
    '#006D77',
    'My 5-year-old is terrified of the dark — how do I help without dismissing the fear?',
    'Rashid has been afraid of the dark since he was 3. Now at 5 it''s getting more complicated — he won''t go to his room alone, needs the door open, and wakes crying. We''ve tried nightlights, Islamic dua before bed, and "there''s nothing there" — nothing works for long. Is this still normal? When should I be concerned?',
    ARRAY['fear', 'anxiety', 'sleep', 'nighttime', 'Islamic-dua'],
    '4-5y',
    33,
    '{}',
    '2024-11-05T20:00:00Z'
  )
  RETURNING id
)
INSERT INTO forum_replies (post_id, author_name, author_city, author_initials, author_color, body, likes, liked_by, created_at)
SELECT
  inserted_post.id,
  reply.author_name,
  reply.author_city,
  reply.author_initials,
  reply.author_color,
  reply.body,
  reply.likes,
  reply.liked_by,
  reply.created_at
FROM inserted_post, (VALUES
  ('Dr. Hind Al-Amin', 'Riyadh', 'HA', '#D4AF37',
   'Completely normal up to age 6. The fear of dark peaks at 5–6 years. Important: validate the feeling ("It feels scary — that makes sense") before problem-solving. "There''s nothing there" dismisses the emotion. For the dua: Ayat Al-Kursi + Al-Muawwidhatain blown on the hands and wiped on the body is the Sunnah bedtime routine — do this WITH him, not for him, so he feels protected.',
   29, ARRAY[]::text[], '2024-11-05T21:30:00Z'::timestamptz),
  ('Mona Hijazi', 'Amman', 'MH', '#8B1A1A',
   'Graduated exposure worked for my daughter. Start by spending time together in the dark (playing flashlight games), then gradually reduce light. "Brave Night" game: each night, be brave for 5 more minutes with less light. Celebrate each success. Avoid rushing — forcing increases anxiety.',
   18, ARRAY[]::text[], '2024-11-06T09:15:00Z'::timestamptz)
) AS reply(author_name, author_city, author_initials, author_color, body, likes, liked_by, created_at);

-- Post 5: Screen time and grandparents
WITH inserted_post AS (
  INSERT INTO forum_posts (id, author_name, author_city, author_initials, author_color, title, body, tags, age_group, likes, liked_by, created_at)
  VALUES (
    'a0000005-0000-0000-0000-000000000005',
    'Rima Nassar',
    'Beirut, Lebanon',
    'RN',
    '#D4AF37',
    'Screen time boundaries when grandparents use phone to "entertain" baby',
    'My in-laws (who live with us, very common in Lebanon!) give my 18-month-old daughter Lara their phone the moment she fusses. They say "one YouTube won''t hurt." I''ve shared the WHO guidelines but they say "we raised 6 children without these rules and they''re fine." How do families navigate this respectfully without creating family conflict?',
    ARRAY['screen-time', 'grandparents', 'boundaries', 'extended-family', 'Lebanon'],
    '1-2y',
    47,
    '{}',
    '2024-11-01T11:00:00Z'
  )
  RETURNING id
)
INSERT INTO forum_replies (post_id, author_name, author_city, author_initials, author_color, body, likes, liked_by, created_at)
SELECT
  inserted_post.id,
  reply.author_name,
  reply.author_city,
  reply.author_initials,
  reply.author_color,
  reply.body,
  reply.likes,
  reply.liked_by,
  reply.created_at
FROM inserted_post, (VALUES
  ('Hana Al-Qasemi', 'Dubai', 'HQ', '#006D77',
   'This is SO common in Arab extended family homes. What worked: I framed it as "the pediatrician said" rather than "I think." Grandparents often accept medical authority more readily than parenting books. I printed the UAE MOH child development guidelines and shared them as "what Lara''s doctor gave us."',
   35, ARRAY[]::text[], '2024-11-01T13:45:00Z'::timestamptz),
  ('Tariq Osman', 'Cairo', 'TO', '#8B1A1A',
   'Give grandparents ALTERNATIVES to offer. Stock a basket with simple toys: stacking cups, soft balls, board books, fabric scraps. When Lara fusses, say "Teta, can you try the cups first?" Give grandparents the joy of engagement WITHOUT the phone. They usually prefer this once they see the child responds.',
   41, ARRAY[]::text[], '2024-11-01T17:00:00Z'::timestamptz)
) AS reply(author_name, author_city, author_initials, author_color, body, likes, liked_by, created_at);

-- Post 6: Giftedness in Jordan
WITH inserted_post AS (
  INSERT INTO forum_posts (id, author_name, author_city, author_initials, author_color, title, body, tags, age_group, likes, liked_by, created_at)
  VALUES (
    'a0000006-0000-0000-0000-000000000006',
    'Yasmin Al-Sharif',
    'Amman, Jordan',
    'YS',
    '#8B1A1A',
    'My 6-year-old shows signs of giftedness — what do I do in Jordan?',
    'My daughter Jenna has been reading since age 4 (Arabic AND English), does mental arithmetic that surprises her teachers, and asks questions we can''t answer. Her school says she is "advanced" but they can''t accommodate her specially. We don''t want to push her too hard but also don''t want her to be bored. What are our options in Jordan?',
    ARRAY['gifted', 'advanced', 'Jordan', 'education', 'talent'],
    '5-6y',
    29,
    '{}',
    '2024-10-28T14:00:00Z'
  )
  RETURNING id
)
INSERT INTO forum_replies (post_id, author_name, author_city, author_initials, author_color, body, likes, liked_by, created_at)
SELECT
  inserted_post.id,
  reply.author_name,
  reply.author_city,
  reply.author_initials,
  reply.author_color,
  reply.body,
  reply.likes,
  reply.liked_by,
  reply.created_at
FROM inserted_post, (VALUES
  ('Dr. Randa Tawfiq', 'Amman', 'RT', '#006D77',
   'Jordan has the National Center for Gifted and Creative Students under the Ministry of Education — worth contacting. Also look at INJAZ Al-Arab programs and STEM enrichment at University of Jordan. Important: gifted children need DEPTH not just acceleration. Let Jenna dive deeply into her interests rather than just moving ahead in the curriculum.',
   22, ARRAY[]::text[], '2024-10-28T16:30:00Z'::timestamptz),
  ('Lana Hatoum', 'Beirut', 'LH', '#D4AF37',
   'My gifted daughter''s teacher recommended "enrichment not acceleration" as the primary strategy. We found a chess club, a science Olympiad group, and Arabic poetry competitions. The social-emotional needs of gifted children are often overlooked — Jenna may also feel "different" and need peer groups of other curious kids.',
   17, ARRAY[]::text[], '2024-10-29T10:00:00Z'::timestamptz)
) AS reply(author_name, author_city, author_initials, author_color, body, likes, liked_by, created_at);

-- Post 7: Daycare transition and clinginess
WITH inserted_post AS (
  INSERT INTO forum_posts (id, author_name, author_city, author_initials, author_color, title, body, tags, age_group, likes, liked_by, created_at)
  VALUES (
    'a0000007-0000-0000-0000-000000000007',
    'Omar Al-Hajri',
    'Muscat, Oman',
    'OH',
    '#006D77',
    'Transitioning from daycare to home mom — my 2-year-old is clingy and regressing',
    'My wife Amal left her job to be home with our son Saif (2y 4m). He was in daycare for a year and was happy there. Since the transition 3 months ago he clings to her, has started thumb-sucking again (had stopped), and screams when she leaves the room for a minute. We thought being home would make him more secure, not less!',
    ARRAY['regression', 'separation-anxiety', 'transition', 'daycare', 'Oman'],
    '2-3y',
    21,
    '{}',
    '2024-10-20T08:30:00Z'
  )
  RETURNING id
)
INSERT INTO forum_replies (post_id, author_name, author_city, author_initials, author_color, body, likes, liked_by, created_at)
SELECT
  inserted_post.id,
  reply.author_name,
  reply.author_city,
  reply.author_initials,
  reply.author_color,
  reply.body,
  reply.likes,
  reply.liked_by,
  reply.created_at
FROM inserted_post, (VALUES
  ('Sara Al-Balushi', 'Muscat', 'SB', '#D4AF37',
   'This is completely expected! Regression and clinginess after a major transition is normal attachment behavior. Saif is re-calibrating — he lost his predictable daycare environment AND gained a new (amazing!) primary attachment figure at home. It should resolve in 4–8 weeks if you maintain a new consistent home routine.',
   15, ARRAY[]::text[], '2024-10-20T10:00:00Z'::timestamptz),
  ('Noura Khalfan', 'Dubai', 'NK', '#8B1A1A',
   'Key tip: practice SHORT separations and JOYFUL reunions. Leave for 2 minutes, come back happy. Then 5 minutes. Then 10. Always say goodbye — never sneak out. Sneaking causes much worse anxiety. The goal is teaching: "Mama leaves AND comes back." Thumb-sucking at this age is also completely normal self-regulation.',
   19, ARRAY[]::text[], '2024-10-21T09:15:00Z'::timestamptz)
) AS reply(author_name, author_city, author_initials, author_color, body, likes, liked_by, created_at);

-- Post 8: Hitting behavior
WITH inserted_post AS (
  INSERT INTO forum_posts (id, author_name, author_city, author_initials, author_color, title, body, tags, age_group, likes, liked_by, created_at)
  VALUES (
    'a0000008-0000-0000-0000-000000000008',
    'Hala Mansouri',
    'Casablanca, Morocco',
    'HM',
    '#D4AF37',
    'How strict should I be with a 3-year-old who hits other children?',
    'My son Karim (3 years 1 month) hits other children when frustrated, particularly at playgroup. He hit a girl last week hard enough that she cried. I feel embarrassed and unsure how to respond in the moment. Harsh punishment feels wrong but being too gentle isn''t working either. What does research say about this?',
    ARRAY['aggression', 'hitting', 'discipline', '3-year-old', 'behavior'],
    '3-4y',
    44,
    '{}',
    '2024-10-15T15:00:00Z'
  )
  RETURNING id
)
INSERT INTO forum_replies (post_id, author_name, author_city, author_initials, author_color, body, likes, liked_by, created_at)
SELECT
  inserted_post.id,
  reply.author_name,
  reply.author_city,
  reply.author_initials,
  reply.author_color,
  reply.body,
  reply.likes,
  reply.liked_by,
  reply.created_at
FROM inserted_post, (VALUES
  ('Amal Zahir', 'Rabat, Morocco', 'AZ', '#006D77',
   'Hitting at 3 is developmentally common but absolutely needs clear, immediate response. Research recommends: (1) Immediate, calm but FIRM: "Hitting hurts. We do not hit." (2) Remove from situation — not as punishment but as reality: "When you hit, we leave." (3) Check the TRIGGER — hitting is almost always frustration from not having language. Teach words: "Use your words: I''m angry!"',
   38, ARRAY[]::text[], '2024-10-15T17:30:00Z'::timestamptz),
  ('Fatima Benali', 'Casablanca', 'FB', '#8B1A1A',
   'Never hit back or spank to "teach them hitting is wrong" — the research on this is unambiguous, it makes aggression worse. Also check: is he overtired? Hungry? Overstimulated? 3-year-old hitting spikes when basic needs aren''t met. Prevention (snacks, rest) before playgroup helps enormously.',
   27, ARRAY[]::text[], '2024-10-16T08:45:00Z'::timestamptz)
) AS reply(author_name, author_city, author_initials, author_color, body, likes, liked_by, created_at);
