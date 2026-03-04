import type { AssessmentDefinition, AssessmentResult } from '../types';

// ─────────────────────────────────────────────────────────────────────────────
// 1. ADHD SCREENING TOOL
//    Based on: Conners Parent Rating Scale – Revised Short Form (CPRS-R:S)
//    Validated for ages 3–17. 18 questions, 4-point Likert scale.
//    Source: Conners, C.K. (1997). Conners' Rating Scales—Revised. MHS.
// ─────────────────────────────────────────────────────────────────────────────
export const ADHD_ASSESSMENT: AssessmentDefinition = {
  id: 'adhd',
  title: 'ADHD Screening Tool',
  arabicTitle: 'أداة فحص اضطراب نقص الانتباه وفرط الحركة',
  description: 'A parent-report screening based on the Conners Parent Rating Scale (CPRS-R:S) — one of the most widely used and validated instruments for ADHD assessment. This screen covers inattention and hyperactivity-impulsivity across 18 items.',
  source: 'Based on Conners\' Rating Scales–Revised (Conners, 1997) — gold standard ADHD assessment used by clinicians worldwide, including Arab clinics affiliated with King Abdulaziz University and UAE SEHA hospitals.',
  disclaimer: '⚠️ This is a SCREENING tool only, not a diagnostic instrument. A score suggesting elevated concern should prompt consultation with a licensed child psychologist or developmental pediatrician. ADHD diagnosis requires comprehensive clinical evaluation. This screen has been adapted for cultural use with reference to the Arab Journal of Psychiatry (2012) cross-cultural ADHD studies.',
  ageRange: 'Ages 3–12 years (parent-report)',
  questions: [
    // Inattention subscale
    { id: 1,  subscale: 'Inattention', text: 'Has difficulty sustaining attention in tasks or play activities',           arabicText: 'يجد صعوبة في الحفاظ على الانتباه في المهام أو اللعب' },
    { id: 2,  subscale: 'Inattention', text: 'Does not seem to listen when spoken to directly',                           arabicText: 'لا يبدو أنه يستمع عند التحدث إليه مباشرة' },
    { id: 3,  subscale: 'Inattention', text: 'Fails to finish tasks or follow through on instructions',                   arabicText: 'لا يكمل المهام أو يتبع التعليمات حتى النهاية' },
    { id: 4,  subscale: 'Inattention', text: 'Has difficulty organizing tasks and activities',                            arabicText: 'يجد صعوبة في تنظيم المهام والأنشطة' },
    { id: 5,  subscale: 'Inattention', text: 'Avoids or dislikes tasks requiring sustained mental effort',                arabicText: 'يتجنب أو لا يحب المهام التي تتطلب جهدًا ذهنيًا مستمرًا' },
    { id: 6,  subscale: 'Inattention', text: 'Loses things necessary for tasks or activities (e.g., toys, shoes)',       arabicText: 'يضيع الأشياء الضرورية (مثل الألعاب والأحذية)' },
    { id: 7,  subscale: 'Inattention', text: 'Is easily distracted by external stimuli',                                 arabicText: 'يُشتت انتباهه بسهولة بالمحفزات الخارجية' },
    { id: 8,  subscale: 'Inattention', text: 'Is forgetful in daily activities',                                         arabicText: 'ينسى في الأنشطة اليومية' },
    { id: 9,  subscale: 'Inattention', text: 'Makes careless mistakes in activities (overlooks details)',                 arabicText: 'يرتكب أخطاء بسبب الإهمال في الأنشطة' },
    // Hyperactivity-Impulsivity subscale
    { id: 10, subscale: 'Hyperactivity', text: 'Fidgets with hands or feet or squirms in seat',                          arabicText: 'يتململ بيديه أو قدميه أو يتقلب في مكانه' },
    { id: 11, subscale: 'Hyperactivity', text: 'Leaves seat in situations when remaining seated is expected',            arabicText: 'يترك مقعده في مواقف يُتوقع فيها الجلوس' },
    { id: 12, subscale: 'Hyperactivity', text: 'Runs about or climbs excessively in inappropriate situations',           arabicText: 'يجري أو يتسلق بإفراط في مواقف غير ملائمة' },
    { id: 13, subscale: 'Hyperactivity', text: 'Has difficulty playing or engaging in activities quietly',               arabicText: 'يجد صعوبة في اللعب أو الانخراط في أنشطة بهدوء' },
    { id: 14, subscale: 'Hyperactivity', text: 'Is often "on the go" or acts as if "driven by a motor"',                arabicText: 'كثيرًا ما يكون "على الطريق" كأنه يعمله "محرك"' },
    { id: 15, subscale: 'Hyperactivity', text: 'Talks excessively',                                                       arabicText: 'يتكلم بإفراط' },
    { id: 16, subscale: 'Impulsivity',   text: 'Blurts out answers before questions have been completed',                arabicText: 'يبادر بالإجابة قبل اكتمال الأسئلة' },
    { id: 17, subscale: 'Impulsivity',   text: 'Has difficulty waiting turn',                                            arabicText: 'يجد صعوبة في انتظار دوره' },
    { id: 18, subscale: 'Impulsivity',   text: 'Interrupts or intrudes on others (e.g., butts into conversations)',      arabicText: 'يقاطع أو يتدخل في شؤون الآخرين' },
  ],
  scoring: {
    options: [
      { label: 'Never / Not at all',    value: 0 },
      { label: 'Just a little',         value: 1 },
      { label: 'Pretty much / Often',   value: 2 },
      { label: 'Very much / Very often',value: 3 },
    ],
    subscales: [
      { name: 'Inattention',           questionIds: [1,2,3,4,5,6,7,8,9],      maxScore: 27 },
      { name: 'Hyperactivity',         questionIds: [10,11,12,13,14,15],       maxScore: 18 },
      { name: 'Impulsivity',           questionIds: [16,17,18],                maxScore: 9  },
    ],
    interpret(scores) {
      const total = Object.values(scores).reduce((a, b) => a + b, 0);
      const inatt = [1,2,3,4,5,6,7,8,9].reduce((s,i)=> s+(scores[i]||0),0);
      const hyper = [10,11,12,13,14,15,16,17,18].reduce((s,i)=> s+(scores[i]||0),0);
      if (total <= 14) return {
        level:'low', color:'#16a34a',
        headline:'Low Concern — Typical Range',
        detail:`Total score: ${total}/54. Inattention: ${inatt}/27. Hyperactivity/Impulsivity: ${hyper}/27. The responses suggest behaviour within the typical range for children this age. Continue routine developmental monitoring.`,
        recommendations:[
          'Maintain consistent routines and structured environments.',
          'Encourage physical activity and outdoor play daily.',
          'Re-screen in 6–12 months or if concerns increase.',
          'Review WHO developmental milestones for your child\'s age.',
        ],
        seekHelp: false,
      };
      if (total <= 29) return {
        level:'moderate', color:'#d97706',
        headline:'Moderate Concern — Monitor Closely',
        detail:`Total score: ${total}/54. Inattention: ${inatt}/27. Hyperactivity/Impulsivity: ${hyper}/27. Some areas show scores above typical range. This warrants closer observation and targeted strategies. Not diagnostic of ADHD.`,
        recommendations:[
          'Implement structured daily routines with visual schedules.',
          'Use short-task intervals (5–10 minutes for ages 3–5).',
          'Reduce environmental distractors during focused tasks.',
          'Discuss concerns with your paediatrician at next well-child visit.',
          'Consider observing patterns across different settings (home, playgroup).',
        ],
        seekHelp: false,
      };
      if (total <= 40) return {
        level:'elevated', color:'#ea580c',
        headline:'Elevated Concern — Professional Evaluation Recommended',
        detail:`Total score: ${total}/54. Inattention: ${inatt}/27. Hyperactivity/Impulsivity: ${hyper}/27. Scores are in the elevated range. This does not confirm ADHD, but professional assessment is recommended. Several other conditions can produce similar scores.`,
        recommendations:[
          'Schedule a comprehensive evaluation with a licensed child psychologist.',
          'Consider ruling out: vision/hearing problems, sleep disorders, anxiety, learning difficulties.',
          'In UAE: SEHA Developmental Paediatrics; KSA: Ministry of Health Child Development Centers; Jordan: King Hussein Medical Center.',
          'Bring completed screen and behavioural observations to the appointment.',
          'Implement high-structure, positive-reinforcement strategies at home.',
        ],
        seekHelp: true,
      };
      return {
        level:'high', color:'#dc2626',
        headline:'High Concern — Seek Evaluation Promptly',
        detail:`Total score: ${total}/54. Inattention: ${inatt}/27. Hyperactivity/Impulsivity: ${hyper}/27. Scores suggest significant functional impairment in multiple domains. Prompt professional evaluation is strongly recommended. Early intervention significantly improves outcomes.`,
        recommendations:[
          'Schedule evaluation with a developmental paediatrician or child psychiatrist as soon as possible.',
          'Do not wait for school referral — seek private or government assessment.',
          'Keep a detailed behavioural diary for the next 2 weeks before the appointment.',
          'ADHD is highly treatable. With proper support, children thrive academically and socially.',
          'Contact: UAE SEHA, KSA MOH, Egypt CAPMAS child disability services, or AUB Medical Center (Lebanon).',
        ],
        seekHelp: true,
      };
    }
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// 2. MULTIPLE INTELLIGENCES INVENTORY
//    Based on: Howard Gardner's Theory of Multiple Intelligences (1983, updated 2011)
//    Source: Gardner, H. (1983/2011). Frames of Mind. Basic Books.
//    Adapted from: MIDAS assessment and Armstrong's MI inventory for parents
// ─────────────────────────────────────────────────────────────────────────────
export const MI_ASSESSMENT: AssessmentDefinition = {
  id: 'mi',
  title: 'Multiple Intelligences Inventory',
  arabicTitle: 'مخزون الذكاءات المتعددة',
  description: 'Based on Dr. Howard Gardner\'s groundbreaking Theory of Multiple Intelligences (Harvard University). Identifies your child\'s strongest learning styles and natural gifts across 8 intelligence domains. Helps tailor education, activities, and encouragement to your child\'s unique profile.',
  source: 'Howard Gardner (1983, updated 2011). Frames of Mind: The Theory of Multiple Intelligences. Basic Books. Validated adaptations used across Middle East schools including American University of Sharjah and SABIS International Schools.',
  disclaimer: '📌 This inventory identifies learning preferences and natural strengths — it is NOT an IQ test. Every child has ALL eight intelligences to varying degrees. Use results to celebrate strengths and support areas of growth, not to label or limit your child.',
  ageRange: 'Ages 3–10 years (parent-observation report)',
  questions: [
    // Linguistic
    { id: 1,  subscale: 'Linguistic',       text: 'Loves being read to and asks for stories repeatedly',           arabicText: 'يحب أن يُقرأ له ويطلب القصص مرارًا' },
    { id: 2,  subscale: 'Linguistic',       text: 'Enjoys wordplay, rhymes, songs, and tongue twisters',          arabicText: 'يستمتع بألعاب الكلمات والقوافي والأغاني' },
    { id: 3,  subscale: 'Linguistic',       text: 'Remembers names, places, and dates with ease',                 arabicText: 'يتذكر الأسماء والأماكن والتواريخ بسهولة' },
    { id: 4,  subscale: 'Linguistic',       text: 'Expresses themselves very clearly in speech',                  arabicText: 'يعبّر عن نفسه بوضوح شديد في الكلام' },
    { id: 5,  subscale: 'Linguistic',       text: 'Loves to tell stories or makes up imaginative narratives',     arabicText: 'يحب سرد القصص أو ابتكار روايات خيالية' },
    // Logical-Mathematical
    { id: 6,  subscale: 'Logical',          text: 'Asks "why?" and "how does that work?" constantly',             arabicText: 'يسأل "لماذا؟" و"كيف يعمل هذا؟" باستمرار' },
    { id: 7,  subscale: 'Logical',          text: 'Enjoys puzzles, building toys, and problem-solving games',     arabicText: 'يستمتع بالألغاز وألعاب البناء وحل المشكلات' },
    { id: 8,  subscale: 'Logical',          text: 'Is drawn to numbers, counting, and patterns',                  arabicText: 'ينجذب إلى الأرقام والعد والأنماط' },
    { id: 9,  subscale: 'Logical',          text: 'Likes to categorize and sort things by rules',                 arabicText: 'يحب تصنيف الأشياء وترتيبها وفق قواعد' },
    { id: 10, subscale: 'Logical',          text: 'Interested in science experiments — mixing, testing, observing',arabicText: 'مهتم بالتجارب العلمية — المزج والاختبار والملاحظة' },
    // Spatial
    { id: 11, subscale: 'Spatial',          text: 'Loves art, drawing, coloring, and painting',                   arabicText: 'يحب الفن والرسم والتلوين' },
    { id: 12, subscale: 'Spatial',          text: 'Builds elaborate structures with blocks/LEGO/clay',            arabicText: 'يبني هياكل متطورة بالمكعبات أو الليغو أو الصلصال' },
    { id: 13, subscale: 'Spatial',          text: 'Easily finds their way in new places; good sense of direction', arabicText: 'يجد طريقه بسهولة في أماكن جديدة' },
    { id: 14, subscale: 'Spatial',          text: 'Thinks in images and prefers illustrated books',               arabicText: 'يفكر بالصور ويفضل الكتب المصورة' },
    { id: 15, subscale: 'Spatial',          text: 'Fascinated by maps, blueprints, or diagrams',                 arabicText: 'مفتون بالخرائط والمخططات والرسوم التوضيحية' },
    // Musical
    { id: 16, subscale: 'Musical',          text: 'Responds strongly to music — moves, dances, or goes quiet',   arabicText: 'يستجيب بقوة للموسيقى — يتحرك أو يرقص أو يهدأ' },
    { id: 17, subscale: 'Musical',          text: 'Picks up tunes and melodies quickly',                          arabicText: 'يلتقط الألحان بسرعة' },
    { id: 18, subscale: 'Musical',          text: 'Taps rhythms spontaneously with hands/feet',                   arabicText: 'يقرع إيقاعات تلقائيًا بيديه أو قدميه' },
    { id: 19, subscale: 'Musical',          text: 'Notices subtle sounds others miss (birds, distant sounds)',    arabicText: 'يلاحظ أصواتًا خفيفة يفوتها الآخرون' },
    { id: 20, subscale: 'Musical',          text: 'Has favourite songs and asks to hear them repeatedly',         arabicText: 'لديه أغانٍ مفضلة ويطلب سماعها مرارًا' },
    // Bodily-Kinesthetic
    { id: 21, subscale: 'Kinesthetic',      text: 'Is physically active, coordinated, and athletic',             arabicText: 'نشيط جسديًا ومتناسق وموهوب رياضيًا' },
    { id: 22, subscale: 'Kinesthetic',      text: 'Learns best by touching, handling, and doing',                arabicText: 'يتعلم بشكل أفضل باللمس والتناول والفعل' },
    { id: 23, subscale: 'Kinesthetic',      text: 'Excels or shows keen interest in sports, dance, or gymnastics',arabicText: 'يتفوق أو يُظهر اهتمامًا كبيرًا بالرياضة أو الرقص' },
    { id: 24, subscale: 'Kinesthetic',      text: 'Fidgets, needs to move, struggles to sit still',              arabicText: 'يتململ ويحتاج للحركة ويعاني من الجلوس الثابت' },
    { id: 25, subscale: 'Kinesthetic',      text: 'Excellent at mimicking gestures and physical expressions',    arabicText: 'ممتاز في تقليد الإيماءات والتعبيرات الجسدية' },
    // Interpersonal
    { id: 26, subscale: 'Interpersonal',    text: 'Loves playing with other children and seeks social interaction',arabicText: 'يحب اللعب مع الأطفال ويسعى للتفاعل الاجتماعي' },
    { id: 27, subscale: 'Interpersonal',    text: 'Often takes on leadership roles in play',                     arabicText: 'يأخذ أدوار القيادة في اللعب كثيرًا' },
    { id: 28, subscale: 'Interpersonal',    text: 'Has many friends and is liked by peers',                      arabicText: 'لديه أصدقاء كثيرون ومحبوب من أقرانه' },
    { id: 29, subscale: 'Interpersonal',    text: 'Understands others\' feelings and shows empathy intuitively',  arabicText: 'يفهم مشاعر الآخرين ويُظهر التعاطف بشكل تلقائي' },
    { id: 30, subscale: 'Interpersonal',    text: 'Good at resolving conflicts between other children',          arabicText: 'جيد في حل النزاعات بين الأطفال الآخرين' },
    // Intrapersonal
    { id: 31, subscale: 'Intrapersonal',    text: 'Highly aware of own emotions and can name them',              arabicText: 'واعٍ جدًا بمشاعره الخاصة ويستطيع تسميتها' },
    { id: 32, subscale: 'Intrapersonal',    text: 'Needs and enjoys time alone; comfortable with solitude',     arabicText: 'يحتاج للوقت بمفرده ويستمتع به' },
    { id: 33, subscale: 'Intrapersonal',    text: 'Has a strong, clear sense of personal identity and preferences',arabicText: 'لديه إحساس قوي وواضح بالهوية الشخصية والتفضيلات' },
    { id: 34, subscale: 'Intrapersonal',    text: 'Sets personal goals and works towards them independently',    arabicText: 'يضع أهدافًا شخصية ويعمل نحوها باستقلالية' },
    { id: 35, subscale: 'Intrapersonal',    text: 'Prefers working independently rather than in groups',         arabicText: 'يفضل العمل باستقلالية بدلاً من المجموعات' },
    // Naturalist
    { id: 36, subscale: 'Naturalist',       text: 'Shows deep love and curiosity for animals, plants, and nature',arabicText: 'يُبدي حبًا وفضولًا عميقًا تجاه الحيوانات والنباتات والطبيعة' },
    { id: 37, subscale: 'Naturalist',       text: 'Loves outdoor activities — parks, hiking, the beach',        arabicText: 'يحب الأنشطة الخارجية — الحدائق والمشي والشاطئ' },
    { id: 38, subscale: 'Naturalist',       text: 'Notices changes in weather, seasons, and the environment',   arabicText: 'يلاحظ تغيرات الطقس والفصول والبيئة' },
    { id: 39, subscale: 'Naturalist',       text: 'Collects rocks, shells, leaves, insects, or other natural objects',arabicText: 'يجمع الصخور والأصداف والأوراق والحشرات والأشياء الطبيعية' },
    { id: 40, subscale: 'Naturalist',       text: 'Shows strong concern for the environment and creatures',     arabicText: 'يُظهر اهتمامًا قويًا بالبيئة والمخلوقات' },
  ],
  scoring: {
    options: [
      { label: 'Not at all like my child', value: 0 },
      { label: 'A little like my child',   value: 1 },
      { label: 'Pretty much like my child',value: 2 },
      { label: 'Very much like my child',  value: 3 },
    ],
    subscales: [
      { name: 'Linguistic',     questionIds: [1,2,3,4,5],       maxScore: 15 },
      { name: 'Logical',        questionIds: [6,7,8,9,10],      maxScore: 15 },
      { name: 'Spatial',        questionIds: [11,12,13,14,15],  maxScore: 15 },
      { name: 'Musical',        questionIds: [16,17,18,19,20],  maxScore: 15 },
      { name: 'Kinesthetic',    questionIds: [21,22,23,24,25],  maxScore: 15 },
      { name: 'Interpersonal',  questionIds: [26,27,28,29,30],  maxScore: 15 },
      { name: 'Intrapersonal',  questionIds: [31,32,33,34,35],  maxScore: 15 },
      { name: 'Naturalist',     questionIds: [36,37,38,39,40],  maxScore: 15 },
    ],
    interpret(scores) {
      const subscores: Record<string,number> = {
        'Linguistic':    [1,2,3,4,5].reduce((s,i)=>s+(scores[i]||0),0),
        'Logical':       [6,7,8,9,10].reduce((s,i)=>s+(scores[i]||0),0),
        'Spatial':       [11,12,13,14,15].reduce((s,i)=>s+(scores[i]||0),0),
        'Musical':       [16,17,18,19,20].reduce((s,i)=>s+(scores[i]||0),0),
        'Kinesthetic':   [21,22,23,24,25].reduce((s,i)=>s+(scores[i]||0),0),
        'Interpersonal': [26,27,28,29,30].reduce((s,i)=>s+(scores[i]||0),0),
        'Intrapersonal': [31,32,33,34,35].reduce((s,i)=>s+(scores[i]||0),0),
        'Naturalist':    [36,37,38,39,40].reduce((s,i)=>s+(scores[i]||0),0),
      };
      const sorted = Object.entries(subscores).sort((a,b)=>b[1]-a[1]);
      const top3 = sorted.slice(0,3).map(([name, score])=>`${name} (${Math.round((score/15)*100)}%)`).join(', ');
      const descriptions: Record<string,string> = {
        'Linguistic':    'Word Smart — thrives with reading, storytelling, poetry, debates. Nurture through books, writing, discussions.',
        'Logical':       'Number/Logic Smart — thrives with patterns, puzzles, science, math. Nurture through experiments, strategy games.',
        'Spatial':       'Picture Smart — thrives with art, building, navigation. Nurture through drawing, construction, maps.',
        'Musical':       'Music Smart — thrives with songs, rhythm, patterns in sound. Nurture through instruments, singing, music lessons.',
        'Kinesthetic':   'Body Smart — thrives with movement, sports, hands-on learning. Nurture through dance, crafts, sports.',
        'Interpersonal': 'People Smart — thrives socially, in teams, as a leader. Nurture through group activities, community service.',
        'Intrapersonal': 'Self Smart — thrives with independence, self-reflection. Nurture through journals, personal projects, alone time.',
        'Naturalist':    'Nature Smart — thrives outdoors, with animals and plants. Nurture through nature walks, gardening, animal care.',
      };
      return {
        level:'low', color:'#006D77',
        headline:`Dominant Intelligences: ${top3}`,
        detail: JSON.stringify({ subscores, descriptions, sorted }),
        recommendations: sorted.slice(0,3).map(([name])=> descriptions[name] || ''),
        seekHelp: false,
      };
    }
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// 3. DEVELOPMENTAL MILESTONES CHECKLIST
//    Based on: CDC "Learn the Signs. Act Early." + WHO Child Development Standards
//    Source: CDC.gov/ncbddd/actearly; WHO Multicentre Growth Reference Study
// ─────────────────────────────────────────────────────────────────────────────
export interface MilestoneItem { id: string; domain: string; text: string; arabicText?: string; }
export interface MilestoneAgeGroup { age: string; label: string; items: MilestoneItem[]; }

export const MILESTONES: MilestoneAgeGroup[] = [
  {
    age: '18m',
    label: '18 Months',
    items: [
      { id:'18-c1', domain:'Communication', text:'Says at least 3 words clearly besides "mama/dada"', arabicText:'يقول ما لا يقل عن 3 كلمات بوضوح غير "ماما/بابا"' },
      { id:'18-c2', domain:'Communication', text:'Points to show something interesting to caregiver', arabicText:'يشير ليُريك شيئًا مثيرًا للاهتمام' },
      { id:'18-c3', domain:'Communication', text:'Understands and follows simple 1-step instructions', arabicText:'يفهم ويتبع تعليمات بسيطة من خطوة واحدة' },
      { id:'18-m1', domain:'Movement',      text:'Walks without holding on', arabicText:'يمشي دون التمسك بشيء' },
      { id:'18-m2', domain:'Movement',      text:'Climbs onto furniture without help', arabicText:'يتسلق الأثاث دون مساعدة' },
      { id:'18-m3', domain:'Movement',      text:'Drinks from a cup; eats with a spoon', arabicText:'يشرب من كوب ويأكل بملعقة' },
      { id:'18-s1', domain:'Social',        text:'Shows affection to familiar people (hugs)', arabicText:'يُظهر المودة للأشخاص المألوفين (يحضن)' },
      { id:'18-s2', domain:'Social',        text:'Explores away from caregiver but looks back', arabicText:'يستكشف بعيدًا لكن يلتفت للمطمئن به' },
      { id:'18-cog1',domain:'Cognitive',    text:'Plays with toys in simple ways (banging, stacking)', arabicText:'يلعب بالألعاب بطرق بسيطة (يضرب، يكوم)' },
      { id:'18-cog2',domain:'Cognitive',    text:'Pretends to do things (pretend phone call, feed doll)', arabicText:'يتظاهر بفعل أشياء (مكالمة وهمية، تغذية دمية)' },
    ]
  },
  {
    age: '24m',
    label: '2 Years',
    items: [
      { id:'2y-c1', domain:'Communication', text:'Says 2–4 word sentences ("want more milk")', arabicText:'يقول جملاً من 2–4 كلمات ("عايز لبن أكتر")' },
      { id:'2y-c2', domain:'Communication', text:'Has more than 50 words in vocabulary', arabicText:'لديه أكثر من 50 كلمة في مفرداته' },
      { id:'2y-c3', domain:'Communication', text:'Follows 2-step instructions ("get your shoes and come here")', arabicText:'يتبع تعليمات من خطوتين' },
      { id:'2y-m1', domain:'Movement',      text:'Runs without frequently falling', arabicText:'يركض دون السقوط باستمرار' },
      { id:'2y-m2', domain:'Movement',      text:'Kicks a ball; jumps with both feet', arabicText:'يركل الكرة ويقفز بكلتا القدمين' },
      { id:'2y-m3', domain:'Movement',      text:'Turns book pages one at a time', arabicText:'يقلب صفحات الكتاب واحدة تلو الأخرى' },
      { id:'2y-s1', domain:'Social',        text:'Excited by presence of other children', arabicText:'يتحمس لوجود أطفال آخرين' },
      { id:'2y-s2', domain:'Social',        text:'Plays next to (parallel play) rather than with peers', arabicText:'يلعب بجانب الأطفال الآخرين (لعب متوازٍ)' },
      { id:'2y-cog1',domain:'Cognitive',    text:'Finds hidden objects under 2–3 covers', arabicText:'يجد الأشياء المخفية تحت 2–3 أغطية' },
      { id:'2y-cog2',domain:'Cognitive',    text:'Begins to sort shapes and colors', arabicText:'يبدأ في تصنيف الأشكال والألوان' },
    ]
  },
  {
    age: '3y',
    label: '3 Years',
    items: [
      { id:'3y-c1', domain:'Communication', text:'Talks in 2–3 sentence conversations', arabicText:'يتحدث في محادثات من 2–3 جمل' },
      { id:'3y-c2', domain:'Communication', text:'Names a friend by name', arabicText:'يُسمي صديقًا بالاسم' },
      { id:'3y-c3', domain:'Communication', text:'Can say first name, age, and gender', arabicText:'يستطيع قول اسمه الأول وعمره وجنسه' },
      { id:'3y-m1', domain:'Movement',      text:'Runs easily without falling', arabicText:'يركض بسهولة دون سقوط' },
      { id:'3y-m2', domain:'Movement',      text:'Walks up and down stairs alternating feet', arabicText:'يصعد وينزل الدرج بتبادل القدمين' },
      { id:'3y-m3', domain:'Movement',      text:'Pedals a tricycle or bicycle with training wheels', arabicText:'يدوس دراجة ثلاثية العجلات' },
      { id:'3y-s1', domain:'Social',        text:'Takes turns in simple games', arabicText:'يتبادل الأدوار في الألعاب البسيطة' },
      { id:'3y-s2', domain:'Social',        text:'Shows concern when someone is hurt or crying', arabicText:'يُظهر الاهتمام عندما يكون شخص ما مؤلمًا أو يبكي' },
      { id:'3y-cog1',domain:'Cognitive',    text:'Works toys with buttons, levers, and moving parts', arabicText:'يستخدم الألعاب ذات الأزرار والرافعات والأجزاء المتحركة' },
      { id:'3y-cog2',domain:'Cognitive',    text:'Plays make-believe with dolls, animals, and people', arabicText:'يلعب ألعاب التظاهر مع الدمى والحيوانات والناس' },
    ]
  },
  {
    age: '4y',
    label: '4 Years',
    items: [
      { id:'4y-c1', domain:'Communication', text:'Tells stories with beginning, middle, and end', arabicText:'يحكي قصصًا بها بداية ووسط ونهاية' },
      { id:'4y-c2', domain:'Communication', text:'Names colors and some numbers', arabicText:'يُسمي الألوان وبعض الأرقام' },
      { id:'4y-c3', domain:'Communication', text:'Uses "he/she/they" mostly correctly', arabicText:'يستخدم ضمائر الغائب بشكل صحيح في الغالب' },
      { id:'4y-m1', domain:'Movement',      text:'Hops on one foot for a few seconds', arabicText:'يقفز على قدم واحدة لثوانٍ' },
      { id:'4y-m2', domain:'Movement',      text:'Catches a slowly bounced ball', arabicText:'يمسك كرة تقفز ببطء' },
      { id:'4y-m3', domain:'Movement',      text:'Draws a person with 2–4 body parts', arabicText:'يرسم شخصًا بـ2–4 أجزاء من الجسم' },
      { id:'4y-s1', domain:'Social',        text:'Plays cooperatively with other children (not just parallel)', arabicText:'يلعب بشكل تعاوني مع أطفال آخرين' },
      { id:'4y-s2', domain:'Social',        text:'Pretends to be something (superhero, teacher, parent)', arabicText:'يتظاهر بأنه شخصية (بطل خارق، معلم، والد)' },
      { id:'4y-cog1',domain:'Cognitive',    text:'Understands counting concepts and sequences', arabicText:'يفهم مفاهيم العد والتسلسل' },
      { id:'4y-cog2',domain:'Cognitive',    text:'Understands "same" and "different"', arabicText:'يفهم "نفس" و"مختلف"' },
    ]
  },
  {
    age: '5y',
    label: '5 Years',
    items: [
      { id:'5y-c1', domain:'Communication', text:'Tells longer stories using full sentences', arabicText:'يحكي قصصًا أطول باستخدام جمل كاملة' },
      { id:'5y-c2', domain:'Communication', text:'Uses future tense ("I will go to school")', arabicText:'يستخدم المستقبل ("سأذهب إلى المدرسة")' },
      { id:'5y-c3', domain:'Communication', text:'Can say full name and home address', arabicText:'يستطيع قول اسمه الكامل وعنوانه المنزلي' },
      { id:'5y-m1', domain:'Movement',      text:'Stands on one foot for 10+ seconds', arabicText:'يقف على قدم واحدة لأكثر من 10 ثوانٍ' },
      { id:'5y-m2', domain:'Movement',      text:'Hops, skips, and can do somersaults', arabicText:'يقفز ويتخطى ويؤدي الشقلبة' },
      { id:'5y-m3', domain:'Movement',      text:'Uses fork and spoon well; may use table knife', arabicText:'يستخدم الشوكة والملعقة جيدًا' },
      { id:'5y-s1', domain:'Social',        text:'Wants to please friends; aware of social rules', arabicText:'يريد إرضاء الأصدقاء ويُدرك القواعد الاجتماعية' },
      { id:'5y-s2', domain:'Social',        text:'Shows concern for others in need; empathy grows', arabicText:'يُظهر القلق على الآخرين المحتاجين؛ التعاطف ينمو' },
      { id:'5y-cog1',domain:'Cognitive',    text:'Counts 10 or more things correctly', arabicText:'يعد 10 أشياء أو أكثر بشكل صحيح' },
      { id:'5y-cog2',domain:'Cognitive',    text:'Can print some letters, numbers, or own name', arabicText:'يستطيع رسم بعض الحروف أو الأرقام أو اسمه' },
    ]
  },
];

export const ASSESSMENTS = [ADHD_ASSESSMENT, MI_ASSESSMENT];
