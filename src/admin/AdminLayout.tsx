import { type ReactNode } from 'react';
import { LayoutDashboard, FolderKanban, Wrench, FileText, Inbox, LogOut, ExternalLink, Users } from 'lucide-react';
import { useAuth } from '@/lib/auth';

export type AdminTab = 'overview' | 'projects' | 'services' | 'content' | 'messages' | 'members';

export function AdminLayout({
  tab,
  setTab,
  children,
}: {
  tab: AdminTab;
  setTab: (t: AdminTab) => void;
  children: ReactNode;
}) {
  const { signOut } = useAuth();

  const nav: { id: AdminTab; label: string; icon: typeof LayoutDashboard }[] = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'projects', label: 'Projects', icon: FolderKanban },
    { id: 'services', label: 'Services', icon: Wrench },
    { id: 'content', label: 'Homepage Text', icon: FileText },
    { id: 'messages', label: 'Messages', icon: Inbox },
    { id: 'members', label: 'Members', icon: Users },
  ];

  return (
    <div className="min-h-screen bg-ink-base flex">
      <aside className="w-64 shrink-0 border-r border-white/[0.04] bg-ink-elevated flex flex-col">
        <div className="h-14 flex items-center gap-2.5 px-5 border-b border-white/[0.04]">
          <div className="w-7 h-7 rounded-lg bg-mint flex items-center justify-center font-mono font-bold text-mint-dark text-xs">
            C
          </div>
          <span className="font-display font-semibold text-text-primary text-sm">chris34star</span>
        </div>

        <nav className="flex-1 py-4 px-3 space-y-0.5">
          {nav.map((n) => (
            <button
              key={n.id}
              onClick={() => setTab(n.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-glass-sm text-[13px] font-medium transition-all ${
                tab === n.id
                  ? 'bg-mint-dim text-mint border border-mint/15'
                  : 'text-text-secondary hover:text-text-primary hover:bg-white/[0.04] border border-transparent'
              }`}
            >
              <n.icon size={17} />
              {n.label}
            </button>
          ))}
        </nav>

        <div className="p-3 border-t border-white/[0.04] space-y-0.5">
          <a
            href="/"
            target="_blank"
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-glass-sm text-[13px] text-text-secondary hover:text-text-primary hover:bg-white/[0.04] transition-colors"
          >
            <ExternalLink size={17} />
            View site
          </a>
          <button
            onClick={signOut}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-glass-sm text-[13px] text-text-secondary hover:text-red-400 hover:bg-red-500/5 transition-colors"
          >
            <LogOut size={17} />
            Sign out
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto">
        <div className="max-w-5xl mx-auto px-8 py-8">{children}</div>
      </main>
    </div>
  );
}
