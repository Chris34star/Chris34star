import { useState } from 'react';
import { Lock, Mail, ArrowLeft } from 'lucide-react';
import { useAuth } from '@/lib/auth';

export function AdminLogin() {
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const { error: err } = await signIn(email, password);
    if (err) setError(err);
    setLoading(false);
  };

  const inputCls = 'w-full pl-11 pr-4 py-3 rounded-glass-sm bg-white/[0.03] border border-white/[0.08] text-text-primary text-sm focus:outline-none focus:border-mint/30 transition-all placeholder:text-text-muted';

  return (
    <div className="min-h-screen bg-ink-base flex items-center justify-center px-6">
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-96 h-96 bg-mint-glow rounded-full blur-[140px] opacity-40" />
      <div className="relative w-full max-w-md">
        <a href="/" className="inline-flex items-center gap-2 text-text-secondary hover:text-text-primary text-sm mb-8 transition-colors font-body">
          <ArrowLeft size={16} /> Back to site
        </a>
        <div className="glass-card rounded-glass p-8">
          <div className="w-14 h-14 rounded-2xl bg-mint flex items-center justify-center mb-6">
            <Lock size={24} className="text-mint-dark" />
          </div>
          <h1 className="font-display font-semibold text-2xl text-text-primary mb-1">Admin Login</h1>
          <p className="text-text-secondary text-sm mb-6 font-body">Sign in to manage your portfolio.</p>

          <form onSubmit={submit} className="space-y-4">
            <div>
              <label className="mono-label block mb-2">Email</label>
              <div className="relative">
                <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted" />
                <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className={inputCls} placeholder="admin@example.com" />
              </div>
            </div>
            <div>
              <label className="mono-label block mb-2">Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted" />
                <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className={inputCls} placeholder="••••••••" />
              </div>
            </div>

            {error && (
              <p className="text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-glass-sm px-4 py-2.5">{error}</p>
            )}

            <button type="submit" disabled={loading} className="btn-mint w-full px-5 py-3 text-sm font-semibold disabled:opacity-50">
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
