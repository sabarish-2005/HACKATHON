#!/usr/bin/env bash

# Supabase Backend Setup Script
# This script helps set up the Supabase backend for the AI Hack Hub

echo "🚀 AI Hack Hub - Supabase Backend Setup"
echo "========================================"

# Check if .env.local exists
if [ ! -f ".env.local" ]; then
    echo ""
    echo "⚠️  .env.local file not found!"
    echo ""
    echo "Please create a .env.local file with the following variables:"
    echo ""
    echo "VITE_SUPABASE_URL=https://your-project.supabase.co"
    echo "VITE_SUPABASE_PUBLISHABLE_KEY=your-anon-key"
    echo ""
    echo "To get these values:"
    echo "1. Go to https://app.supabase.com"
    echo "2. Select your project"
    echo "3. Go to Settings → API"
    echo "4. Copy 'Project URL' and 'anon public' key"
    echo ""
    exit 1
fi

echo "✅ .env.local file found"
echo ""

# Check if Supabase CLI is installed
if ! command -v supabase &> /dev/null; then
    echo "⚠️  Supabase CLI is not installed"
    echo "Install it with: npm install -g supabase"
    echo ""
else
    echo "✅ Supabase CLI is installed"
    echo ""
    
    # List available commands
    echo "📋 Helpful Supabase Commands:"
    echo ""
    echo "   supabase db push      - Deploy migrations to your project"
    echo "   supabase db pull      - Pull latest schema from project"
    echo "   supabase start        - Start local Supabase instance"
    echo "   supabase stop         - Stop local Supabase instance"
    echo ""
fi

echo "✅ Setup check complete!"
echo ""
echo "Next steps:"
echo "1. Ensure .env.local has correct Supabase credentials"
echo "2. Run 'supabase db push' to deploy migrations"
echo "3. Start your dev server with 'npm run dev'"
echo "4. Navigate to http://localhost:5173"
echo ""
