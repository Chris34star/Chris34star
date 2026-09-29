import { useEffect, useState } from 'react';
import { Trash2, Mail, MailOpen, Star } from 'lucide-react';
import { supabase, type ContactMessage } from '@/lib/supabase';

export function AdminMessages() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    const { data } = await supabase.from('contact_messages').select('*').order('created_at', { ascending: false });
    setMessages(data ?? []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const toggleRead = async (m: ContactMessage) => {
    await supabase.from('contact_messages').update({ read: !m.read }).eq('id', m.id);
    load();
  };

  const del = async (id: string) => {
    if (!confirm('Delete this message?')) return;
    await supabase.from('contact_messages').delete().eq('id', id);
    load();
  };

  const unread = messages.filter((m) => !m.read).length;

  if (loading) return <div className="flex justify-center py-20"><div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Messages</h1>
        <p className="text-slate-400 text-sm mt-1">{messages.length} total · {unread} unread</p>
      </div>

      <div className="space-y-3">
        {messages.map((m) => (
          <div key={m.id} className={`p-5 rounded-xl border transition-colors ${m.read ? 'bg-white/[0.02] border-white/5' : 'bg-blue-600/5 border-blue-500/20'}`}>
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  {!m.read && <Star size={14} className="text-blue-400 fill-blue-400" />}
                  <h3 className="text-white font-medium">{m.name}</h3>
                  <span className="text-slate-600 text-xs">{new Date(m.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                </div>
                <a href={`mailto:${m.email}`} className="text-blue-400 text-sm hover:underline">{m.email}</a>
                <p className="text-slate-300 text-sm mt-3 leading-relaxed whitespace-pre-wrap">{m.message}</p>
              </div>
              <div className="flex flex-col gap-2 shrink-0">
                <button onClick={() => toggleRead(m)} className="p-2 text-slate-400 hover:text-white transition-colors" title={m.read ? 'Mark unread' : 'Mark read'}>
                  {m.read ? <MailOpen size={16} /> : <Mail size={16} />}
                </button>
                <button onClick={() => del(m.id)} className="p-2 text-slate-400 hover:text-red-400 transition-colors">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          </div>
        ))}
        {messages.length === 0 && <p className="text-slate-500 text-center py-12">No messages yet.</p>}
      </div>
    </div>
  );
}
