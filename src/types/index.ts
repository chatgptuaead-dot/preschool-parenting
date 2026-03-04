export type AgeGroup =
  | '0-12m'
  | '1-2y'
  | '2-3y'
  | '3-4y'
  | '4-5y'
  | '5-6y'
  | '6-7y';

export interface AgeGroupInfo {
  id: AgeGroup;
  label: string;
  arabicLabel: string;
  description: string;
  months: [number, number]; // [min, max] months
}

export type ContentType = 'book' | 'movie' | 'music' | 'documentary' | 'activity';
export type Language = 'Arabic' | 'English' | 'Bilingual' | 'Various';

export interface ContentItem {
  id: string;
  type: ContentType;
  title: string;
  arabicTitle?: string;
  creator: string;
  description: string;
  culturalNote: string;
  ageGroups: AgeGroup[];
  language: Language;
  tags: string[];
  year?: number;
  source?: string;       // publisher / platform
  available?: string;    // where to find it
  rating?: string;       // age rating
  peerReviewedBasis?: string;
  link?: string;         // external URL to find/purchase/watch
}

export interface AssessmentQuestion {
  id: number;
  text: string;
  arabicText?: string;
  subscale?: string;
}

export interface AssessmentDefinition {
  id: string;
  title: string;
  arabicTitle: string;
  description: string;
  source: string;         // academic basis
  disclaimer: string;
  ageRange: string;
  questions: AssessmentQuestion[];
  scoring: ScoringGuide;
}

export interface ScoringGuide {
  options: { label: string; value: number }[];
  subscales?: { name: string; questionIds: number[]; maxScore: number }[];
  interpret: (scores: { [key: string]: number }) => AssessmentResult;
}

export interface AssessmentResult {
  level: 'low' | 'moderate' | 'elevated' | 'high';
  color: string;
  headline: string;
  detail: string;
  recommendations: string[];
  seekHelp: boolean;
}

export interface Technique {
  id: string;
  title: string;
  arabicTitle?: string;
  summary: string;
  description: string;
  ageGroups: AgeGroup[];
  strictnessLevel: 1 | 2 | 3 | 4 | 5; // 1=gentle, 5=structured
  researchBasis: string;
  islamicContext?: string;
  steps: string[];
  tags: string[];
  category: 'discipline' | 'communication' | 'learning' | 'emotional' | 'social' | 'spiritual';
}

export interface ForumPost {
  id: string;
  authorName: string;
  authorCity: string;
  authorInitials: string;
  authorColor: string;
  title: string;
  body: string;
  tags: string[];
  ageGroup?: AgeGroup;
  createdAt: string; // ISO date string
  likes: number;
  replies: ForumReply[];
  likedBy: string[]; // user IDs
}

export interface ForumReply {
  id: string;
  authorName: string;
  authorCity: string;
  authorInitials: string;
  authorColor: string;
  body: string;
  createdAt: string;
  likes: number;
  likedBy: string[];
}

export interface UserProfile {
  id: string;
  name: string;
  city: string;
  country: string;
  childrenAges: string;
  initials: string;
  color: string;
  joinedAt: string;
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export type AppTab =
  | 'home'
  | 'content'
  | 'assessments'
  | 'guide'
  | 'forum'
  | 'expert';
