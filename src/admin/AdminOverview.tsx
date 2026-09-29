import { useEffect, useState } from 'react';
import { FolderKanban, Wrench, Inbox, FileText, ArrowRight, Users } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import type { AdminTab } from '@/admin/AdminLayout';

export function AdminOverview({ setTab }: { setTab: (t: AdminTab) => void }) {
  const [counts, setCounts] = useState({ projects: 0, services: 0, messages: 0, unread: 0, members: 0, activeMembers: 0 });

  useEffect(() => {
    (async () => {
      const [p, s, m, u, mem, memActive] = await Promise.all([
        supabase.from('projects').select('*', { count: 'exact', head: true }),
        supabase.from('services').select('*', { count: 'exact', head: true }),
        supabase.from('contact_messages').select('*', { count: 'exact', head: true }),
        supabase.from('contact_messages').select('*', { count: 'exact', head: true }).eq('read', false),
        supabase.from('members').select('*', { count: 'exact', head: true }),
        supabase.from('members').select('*', { count: 'exact', head: true }).eq('subscription_status', 'active'),
      ]);
      setCounts({
        projects: p.count ?? 0,
        services: s.count ?? 0,
        messages: m.count ?? 0,
        unread: u.count ?? 0,
        members: mem.count ?? 0,
        activeMembers: memActive.count ?? 0,
      });
    })();
  }, []);

  const cards: { tab: AdminTab; label: string; value: number; sub: string; icon: typeof FolderKanban; color: string }[] = [
    { tab: 'projects', label: 'Projects', value: counts.projects, sub: 'Published', icon: FolderKanban, color: 'blue' },
    { tab: 'services', label: 'Services', value: counts.services, sub: 'Capability cards', icon: Wrench, color: 'purple' },
    { tab: 'messages', label: 'Messages', value: counts.messages, sub: `${counts.unread} unread`, icon: Inbox, color: 'amber' },
    { tab: 'members', label: 'Members', value: counts.members, sub: `${counts.activeMembers} active`, icon: Users, color: 'green' },
    { tab: 'content', label: 'Homepage Text', value: 0, sub: 'Edit content', icon: FileText, color: 'blue' },
  ];

  const colorMap: Record<string, string> = {
    blue: 'bg-blue-600/10 border-blue-500/20 text-blue-400',
    purple: 'bg-purple-600/10 border-purple-500/20 text-purple-400',
    amber: 'bg-amber-600/10 border-amber-500/20 text-amber-400',
    green: 'bg-green-600/10 border-green-500/20 text-green-400',
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-1">Overview</h1>
      <p className="text-slate-400 text-sm mb-8">Manage your portfolio from one place.</p>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((c) => (
          <button
            key={c.tab}
            onClick={() => setTab(c.tab)}
            className="group text-left p-6 rounded-2xl bg-white/[0.03] border border-white/5 hover:border-white/15 transition-all"
          >
            <div className={`w-11 h-11 rounded-xl border flex items-center justify-center mb-4 ${colorMap[c.color]}`}>
              <c.icon size={20} />
            </div>
            <p className="text-3xl font-bold text-white">{c.value || '—'}</p>
            <p className="text-slate-400 text-sm mt-1">{c.label}</p>
            <p className="text-slate-600 text-xs mt-0.5">{c.sub}</p>
            <span className="inline-flex items-center gap-1 text-blue-400 text-xs mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
              Manage <ArrowRight size={12} />
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
