import { createRoot } from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'; // ✅ Only once
import App from './App.tsx';
import { GlobalErrorBoundary } from './components/Common/GlobalErrorBoundary';
import './index.css';

const queryClient = new QueryClient();

createRoot(document.getElementById('root')!).render(
  <GlobalErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </GlobalErrorBoundary>
);
