import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath, URL } from 'node:url';

const SUPABASE_URL = 'https://grhljhackmnbbglnbkks.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdyaGxqaGFja21uYmJnbG5ia2tzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUyMjM2ODUsImV4cCI6MjA5MDc5OTY4NX0.rkPd_1JGwA9ebxljDlJ1u4pX0eG8ZwCqjW85q6bfI-8';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), 'VITE_');

  return {
    plugins: [react()],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
    server: {
      port: 3000,
      strictPort: false,
      host: '0.0.0.0',
    },
    define: {
      'import.meta.env.VITE_SUPABASE_URL': JSON.stringify(env.VITE_SUPABASE_URL || SUPABASE_URL),
      'import.meta.env.VITE_SUPABASE_ANON_KEY': JSON.stringify(env.VITE_SUPABASE_ANON_KEY || SUPABASE_ANON_KEY),
    },
  };
});
