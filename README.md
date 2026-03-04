# نشأة Nashet — Middle East Parenting Hub

A comprehensive, culturally-grounded parenting web application built for families across the Arab world. Every feature is backed by peer-reviewed research and adapted for Middle Eastern cultural values and Islamic parenting principles.

## Quick Start

```bash
cd nashet-parenting
npm install
npm run dev
# App runs at http://localhost:3000
```

## Activating the AI (Dr. Layla)

1. Go to **console.groq.com** and sign up for a free account
2. Create an API key (starts with `gsk_`)
3. In the app, navigate to **"Dr. Layla AI"** tab
4. Paste your key — it's saved locally in your browser only

Groq free tier: **14,400 requests/day**, ultra-fast LLaMA 3.3 70B responses.

## Features

| Feature | Description |
|---------|-------------|
| **Content Library** | 40+ books, movies, music, documentaries — age-filtered, culturally vetted |
| **ADHD Screening** | 18-question Conners-based parent-report screening tool |
| **Multiple Intelligences** | 40-question Gardner MI inventory with percentage bar chart results |
| **Developmental Milestones** | WHO/CDC milestone checklists for ages 18m–5y with domain analysis |
| **Parenting Guide** | 15 evidence-based techniques with Islamic context, age filter, firmness meter |
| **Community Forum** | Persistent forum with 8 seed discussions from MENA parents, reply/like |
| **Dr. Layla AI** | Groq-powered AI expert (LLaMA 3.3 70B) with rich cultural system prompt |

## Academic Sources

- World Health Organization (WHO) — Child Development Guidelines 2019
- American Academy of Pediatrics (AAP) — Pediatrics Journal
- Conners, C.K. (1997). Conners' Rating Scales-Revised. MHS.
- Gardner, H. (1983/2011). Frames of Mind. Basic Books.
- Baumrind, D. (1966, 1991). Authoritative Parenting. Child Development.
- Gottman, J.M. & DeClaire, J. (1997). Raising an Emotionally Intelligent Child.
- Dwairy & Menshar (2006). Arab parenting styles. Journal of Adolescence.
- CDC "Learn the Signs. Act Early." Developmental Milestones
- Arab Journal of Psychiatry — cross-cultural ADHD studies
- King Abdulaziz University language acquisition research
- Sahih Al-Bukhari, Sahih Muslim (Hadith on child-rearing)
- Ibn Qayyim Al-Jawziyyah — Tuhfat Al-Mawdud bi Ahkam Al-Mawlud
- Imam Al-Ghazali — Ihya Ulum al-Din (education of children chapter)

## Tech Stack

- React 18 + TypeScript + Vite
- Tailwind CSS (custom MENA-inspired color palette)
- Groq SDK (LLaMA 3.3 70B — ultra-fast free inference)
- React Hot Toast (notifications)
- LocalStorage persistence (forum, user profile, age selection, API key)
