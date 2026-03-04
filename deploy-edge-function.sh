#!/bin/bash

# ============================================================
# Nashet Parenting App — Deploy Supabase Edge Functions
# Activates: Dr. Layla AI Expert + Live Content Discovery
# ============================================================
#
# PREREQUISITES:
# 1. Install Supabase CLI: brew install supabase/tap/supabase
# 2. Get a free TMDB API key at: https://www.themoviedb.org/settings/api
#
# STEPS TO RUN:
# Open Terminal in the nashet-parenting directory and run:
#   chmod +x deploy-edge-function.sh
#   ./deploy-edge-function.sh
# ============================================================

set -e  # Exit on any error

echo "============================================================"
echo "Nashet Parenting — Edge Function Deployment"
echo "============================================================"
echo ""

# Step 1: Login to Supabase (opens browser)
echo "Step 1: Logging in to Supabase..."
echo "This will open your browser. Sign in with your Supabase account."
echo ""
supabase login

echo ""
echo "Step 2: Linking project to your Supabase instance..."
supabase link --project-ref saqtuoztysqlzrdfjjvq

echo ""
echo "Step 3: Setting secrets..."

# Groq API key for Dr. Layla AI
read -p "Paste your Groq API key (starts with gsk_): " GROQ_KEY
supabase secrets set GROQ_API_KEY="$GROQ_KEY"

# TMDB API key for live movie/documentary discovery
# Get a free key at https://www.themoviedb.org/settings/api
echo ""
echo ">>> TMDB API Key Setup <<<"
echo "Get a FREE key at: https://www.themoviedb.org/settings/api (takes 2 minutes)"
read -p "Paste your TMDB API key here (or press Enter to skip): " TMDB_KEY

if [ -n "$TMDB_KEY" ]; then
  supabase secrets set TMDB_API_KEY="$TMDB_KEY"
  echo "✅ TMDB API key saved."
else
  echo "⚠ Skipped TMDB — live movie discovery won't be available until you add it."
fi

echo ""
echo "Step 4: Deploying edge functions..."

# Deploy AI chat function (Dr. Layla)
echo "  → Deploying chat function (Dr. Layla AI)..."
supabase functions deploy chat --no-verify-jwt

# Deploy movies function (TMDB proxy)
echo "  → Deploying movies function (live content discovery)..."
supabase functions deploy movies --no-verify-jwt

echo ""
echo "============================================================"
echo "Deployment complete!"
echo ""
echo "  ✅ Dr. Layla Hassan AI Expert:"
echo "     https://saqtuoztysqlzrdfjjvq.supabase.co/functions/v1/chat"
echo ""
if [ -n "$TMDB_KEY" ]; then
  echo "  ✅ Live Content Discovery (TMDB):"
  echo "     https://saqtuoztysqlzrdfjjvq.supabase.co/functions/v1/movies"
else
  echo "  ⚠ Live Movie Discovery: Add TMDB_API_KEY to enable"
fi
echo ""
echo "============================================================"
echo ""
echo "NEXT: Set up the community forum database"
echo "  1. Go to: https://supabase.com/dashboard/project/saqtuoztysqlzrdfjjvq/sql"
echo "  2. Paste the contents of setup.sql"
echo "  3. Click Run"
echo "============================================================"
