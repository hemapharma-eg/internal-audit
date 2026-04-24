import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://vaunczqqddwpwowjamdy.supabase.co'
const supabaseKey = 'sb_publishable_a_u0zpA9-tNUhP06kTLIgQ_mOF6GfQl'

export const supabase = createClient(supabaseUrl, supabaseKey)
