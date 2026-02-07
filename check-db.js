import { supabase } from './src/integrations/supabase/client';

async function checkDatabaseSetup() {
  console.log('🔍 Checking Supabase Database Setup...\n');

  try {
    // Test connection
    console.log('📡 Testing connection to Supabase...');
    const { data: connectionTest, error: connError } = await supabase
      .from('registrations')
      .select('count(*)', { count: 'exact', head: true });

    if (connError) {
      console.error('❌ Connection Failed:', connError.message);
      console.log('\n⚠️ Tables may not exist. Run mutations in Supabase SQL Editor:');
      console.log('1. Go to https://app.supabase.com');
      console.log('2. Select your project');
      console.log('3. Go to SQL Editor');
      console.log('4. Copy and paste content from supabase/migrations/');
      return false;
    }

    console.log('✅ Connection Successful!\n');

    // Check tables
    console.log('📋 Checking database tables...');
    const tables = ['registrations', 'admin_users', 'events', 'audit_logs'];
    
    for (const table of tables) {
      try {
        const { count, error } = await supabase
          .from(table)
          .select('*', { count: 'exact', head: true });
        
        if (!error) {
          console.log(`  ✅ ${table}: ${count || 0} records`);
        } else {
          console.log(`  ❌ ${table}: Not found`);
        }
      } catch (err) {
        console.log(`  ❌ ${table}: Error checking`);
      }
    }

    console.log('\n✨ Database setup check complete!');
    return true;
  } catch (error) {
    console.error('Error:', error);
    return false;
  }
}

checkDatabaseSetup();
