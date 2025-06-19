import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://qewouoycizkpdberkgpe.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFld291b3ljaXprcGRiZXJrZ3BlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAxODc5NzYsImV4cCI6MjA2NTc2Mzk3Nn0.-fvRx3Gpoy7KYupSFFgLkHjQMIqWg6KZGpU2kcOOOEs';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY); 