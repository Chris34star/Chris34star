import { useEffect, useState } from 'react';
import { AuthProvider } from '@/lib/auth';
import { PublicSite } from '@/components/PublicSite';
import { Admin } from '@/admin/Admin';

function isAdminRoute() {
  const p = window.location.pathname;
  return p.startsWith('/admin') || window.location.hash.startsWith('#/admin');
}

function Router() {
  const [path, setPath] = useState(window.location.pathname + window.location.hash);

  useEffect(() => {
    const onPop = () => setPath(window.location.pathname + window.location.hash);
    window.addEventListener('popstate', onPop);
    window.addEventListener('hashchange', onPop);
    return () => {
      window.removeEventListener('popstate', onPop);
      window.removeEventListener('hashchange', onPop);
    };
  }, []);

  if (isAdminRoute()) return <Admin />;
  return <PublicSite />;
}

export default function App() {
  return (
    <AuthProvider>
      <Router />
    </AuthProvider>
  );
}
