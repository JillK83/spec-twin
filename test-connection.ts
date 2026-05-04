// Temporary connection test — not part of the app build.
// Run: npm run test:connection
import { createClient } from '@supabase/supabase-js'
import type { Database } from './src/lib/database.types'

const supabaseUrl = process.env.VITE_SUPABASE_URL
const supabaseKey = process.env.VITE_SUPABASE_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing VITE_SUPABASE_URL or VITE_SUPABASE_KEY in .env')
  process.exit(1)
}

const supabase = createClient<Database>(supabaseUrl, supabaseKey)

const { data, error } = await supabase
  .from('brand_offsets')
  .select('brand_name, category, gender, tier, weighted_offset, fit_tag')
  .limit(1)
  .single()

if (error) {
  console.error('Connection failed:', error.message)
  process.exit(1)
}

console.log('Connection successful.')
console.log(JSON.stringify(data, null, 2))
