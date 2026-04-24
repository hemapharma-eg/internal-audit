import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://vaunczqqddwpwowjamdy.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZhdW5jenFxZGR3cHdvd2phbWR5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY5NTg2MTksImV4cCI6MjA5MjUzNDYxOX0.KH7N1SzIEYSQOsZzXLeNkFh5kkfpGoZkbT2kanG2Ey4'

export const supabase = createClient(supabaseUrl, supabaseKey)
