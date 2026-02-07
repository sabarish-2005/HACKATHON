# Supabase Setup Instructions

## Setting Up Your Supabase Database

### 1. Create a Supabase Project

1. Go to [https://supabase.com](https://supabase.com) and sign up/login
2. Click "New Project"
3. Fill in the project details:
   - Project name: `ai-hack-hub`
   - Database password: (create a strong password and save it)
   - Region: Choose closest to your location
4. Click "Create new project" and wait for it to initialize

### 2. Run the Database Migration

1. In your Supabase dashboard, click on "SQL Editor" in the left sidebar
2. Click "New Query"
3. Copy the entire contents of `supabase/migrations/20260204_create_registrations_table.sql`
4. Paste it into the SQL editor
5. Click "Run" to execute the migration
6. You should see a success message

### 3. Configure Environment Variables

1. In your Supabase dashboard, click on "Settings" (gear icon) in the left sidebar
2. Click on "API" under Project Settings
3. Copy the following values:
   - **Project URL** (looks like: `https://xxxxx.supabase.co`)
   - **anon public** key (under Project API keys)

4. Create a `.env` file in the root of your project:

```bash
VITE_SUPABASE_URL=your_project_url_here
VITE_SUPABASE_PUBLISHABLE_KEY=your_anon_key_here
```

### 4. Verify the Setup

1. Go to "Table Editor" in your Supabase dashboard
2. You should see a `registrations` table with 6 sample records
3. The table should have the following columns:
   - id
   - team_name
   - leader_name
   - email
   - mobile
   - college
   - leader_dept
   - member2_name
   - member2_dept
   - status
   - created_at

### 5. Test the Application

1. Start your development server: `npm run dev`
2. Login to admin panel at `/admin` (default password: admin123)
3. You should see the 6 sample teams in the dashboard
4. Try registering a new team at `/register`
5. The new registration should appear in the admin dashboard

## Without Supabase (Mock Data Mode)

If you don't want to set up Supabase yet, the application will automatically fall back to using mock data. The dashboard will show the 6 sample teams, but:
- New registrations won't be saved
- Status updates won't persist
- A warning toast will appear indicating mock data is being used

## Troubleshooting

### "Using Mock Data" message appears
- Check that your `.env` file exists and has the correct values
- Verify the Supabase URL and API key are correct
- Make sure the migration has been run successfully

### Can't see registrations in dashboard
- Check the browser console for errors
- Verify the Row Level Security policies are set up correctly
- Make sure you've run the migration SQL script

### Registration form doesn't work
- Check the browser console for errors
- Verify the insert policy allows public inserts
- Make sure the `.env` variables are loaded (restart dev server after creating .env)
