import { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import LoadingSpinner from './components/LoadingSpinner';

const PokemonsView = lazy(() => import('./pages/PokemonsView'));
const DetailPage = lazy(() => import('./pages/DetailPage'));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 2,
      networkMode: 'offlineFirst',
      staleTime: 1000 * 5,
      gcTime: 1000 * 60 * 10,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Suspense
          fallback={
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-lavender-100">
              <LoadingSpinner />
            </div>
          }
        >
          <Routes>
            <Route path="/" element={<Navigate to="/pokemons" replace />} />
            <Route path="/pokemons" element={<PokemonsView />} />
            <Route path="/pokemon/:id" element={<DetailPage />} />
            <Route path="*" element={<Navigate to="/pokemons" replace />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
