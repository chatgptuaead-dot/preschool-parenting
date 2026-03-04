import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://saqtuoztysqlzrdfjjvq.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNhcXR1b3p0eXNxbHpyZGZqanZxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI1NDc3NzUsImV4cCI6MjA4ODEyMzc3NX0.mSS7T3X9HyaC8K3L2EQWE19Wj4IhURBwHh8yUKJUaV0'

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
export const isSupabaseConfigured = true
