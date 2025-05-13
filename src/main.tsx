
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Check if Supabase environment variables are set
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  const rootElement = document.getElementById("root");
  if (rootElement) {
    rootElement.innerHTML = `
      <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh; font-family: system-ui, sans-serif; color: #1e293b; padding: 20px; text-align: center;">
        <h1 style="color: #7c3aed; margin-bottom: 16px;">Configuration Error</h1>
        <p style="max-width: 500px; margin-bottom: 24px;">
          Missing Supabase environment variables. Please make sure the Supabase integration is properly set up and that VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY environment variables are configured.
        </p>
        <p style="font-size: 14px; color: #64748b;">
          If you're using the Lovable Supabase integration, please make sure you've connected your project by clicking the Supabase button in the top right corner.
        </p>
      </div>
    `;
    console.error('Missing Supabase environment variables. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.');
  }
} else {
  createRoot(document.getElementById("root")!).render(<App />);
}
