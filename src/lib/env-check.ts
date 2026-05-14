// Validate required environment variables at build time
const required = [
  'DATABASE_URL',
  'NEXT_PUBLIC_SUPABASE_URL',
  'NEXT_PUBLIC_SUPABASE_ANON_KEY',
  'TOKEN_SECRET',
];

const missing = required.filter(key => !process.env[key]);

if (missing.length > 0) {
  if (process.env.NODE_ENV === 'production') {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }
  console.warn(`Warning: Missing recommended environment variables: ${missing.join(', ')}`);
}
