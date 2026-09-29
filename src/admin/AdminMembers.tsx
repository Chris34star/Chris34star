import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, X, Save, Mail, Send, Search } from 'lucide-react';
import { supabase, type Member, SUBSCRIPTION_PLANS, SUBSCRIPTION_STATUSES } from '@/lib/supabase';

export function AdminMembers() {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Member | null>(null);
  const [creating, setCreating] = useState(false);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [emailComposer, setEmailComposer] = useState<{ recipients: Member[] } | null>(null);

  const load = async () => {
    const { data } = await supabase.from('members').select('*').order('joined_at', { ascending: false });
    setMembers(data ?? []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const del = async (id: string) => {
    if (!confirm('Remove this member?')) return;
    await supabase.from('members').delete().eq('id', id);
    load();
  };

  const filtered = members.filter((m) => {
    const matchesSearch = !search ||
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.email.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'all' || m.subscription_status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const sendEmailToGroup = (status: string) => {
    const recipients = status === 'all' ? members : members.filter((m) => m.subscription_status === status);
    if (recipients.length === 0) {
      alert('No members match this filter.');
      return;
    }
    setEmailComposer({ recipients });
  };

  const sendEmailToSingle = (member: Member) => {
    setEmailComposer({ recipients: [member] });
  };

  if (loading) return <div className="flex justify-center py-20"><div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" /></div>;

  const statusColors: Record<string, string> = {
    active: 'text-green-400 bg-green-500/10 border-green-500/20',
    trial: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
    expired: 'text-red-400 bg-red-500/10 border-red-500/20',
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Members</h1>
          <p className="text-slate-400 text-sm mt-1">{members.length} member{members.length !== 1 ? 's' : ''} · {members.filter((m) => m.subscription_status === 'active').length} active</p>
        </div>
        <button
          onClick={() => setCreating(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium transition-colors"
        >
          <Plus size={18} /> Add member
        </button>
      </div>

      {/* filters + bulk email */}
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-11 pr-4 py-2.5 rounded-xl bg-[#0a0f1f] border border-white/10 text-white text-sm focus:outline-none focus:border-blue-500/50 transition-colors placeholder:text-slate-600"
            placeholder="Search by name or email..."
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2.5 rounded-xl bg-[#0a0f1f] border border-white/10 text-white text-sm focus:outline-none focus:border-blue-500/50"
        >
          <option value="all" className="bg-[#0a0f1f]">All statuses</option>
          {SUBSCRIPTION_STATUSES.map((s) => <option key={s} value={s} className="bg-[#0a0f1f]">{s}</option>)}
        </select>
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        <button onClick={() => sendEmailToGroup('active')} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-green-600/10 hover:bg-green-600/20 border border-green-500/20 text-green-300 text-xs font-medium transition-colors">
          <Send size={12} /> Email all active
        </button>
        <button onClick={() => sendEmailToGroup('trial')} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-blue-600/10 hover:bg-blue-600/20 border border-blue-500/20 text-blue-300 text-xs font-medium transition-colors">
          <Send size={12} /> Email all trial
        </button>
        <button onClick={() => sendEmailToGroup('expired')} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-red-600/10 hover:bg-red-600/20 border border-red-500/20 text-red-300 text-xs font-medium transition-colors">
          <Send size={12} /> Email all expired
        </button>
        <button onClick={() => sendEmailToGroup('all')} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 text-xs font-medium transition-colors">
          <Send size={12} /> Email all members
        </button>
      </div>

      <div className="space-y-3">
        {filtered.map((m) => (
          <div key={m.id} className="flex items-start gap-4 p-4 rounded-xl bg-white/[0.03] border border-white/5">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-medium text-sm shrink-0">
              {m.name.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-white font-medium truncate">{m.name}</h3>
                <span className={`text-xs px-2 py-0.5 rounded-full border ${statusColors[m.subscription_status] ?? 'text-slate-400 bg-white/5 border-white/10'}`}>
                  {m.subscription_status}
                </span>
                <span className="text-xs text-slate-500 px-2 py-0.5 rounded bg-white/5">{m.subscription_plan}</span>
              </div>
              <p className="text-slate-500 text-sm truncate">{m.email}{m.phone ? ` · ${m.phone}` : ''}</p>
              {m.notes && <p className="text-slate-600 text-xs mt-1 line-clamp-2">{m.notes}</p>}
              <p className="text-slate-700 text-xs mt-1">Joined {new Date(m.joined_at).toLocaleDateString()}</p>
            </div>
            <div className="flex items-center gap-1 shrink-0">
              <button onClick={() => sendEmailToSingle(m)} className="p-2 text-slate-400 hover:text-blue-400 transition-colors" title="Send email">
                <Mail size={16} />
              </button>
              <button onClick={() => setEditing(m)} className="p-2 text-slate-400 hover:text-white transition-colors">
                <Pencil size={16} />
              </button>
              <button onClick={() => del(m.id)} className="p-2 text-slate-400 hover:text-red-400 transition-colors">
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <p className="text-slate-500 text-center py-12">No members found. Click "Add member" to create one.</p>
        )}
      </div>

      {(creating || editing) && (
        <MemberForm
          member={editing}
          onClose={() => { setCreating(false); setEditing(null); }}
          onSaved={() => { setCreating(false); setEditing(null); load(); }}
        />
      )}

      {emailComposer && (
        <EmailComposer
          recipients={emailComposer.recipients}
          onClose={() => setEmailComposer(null)}
        />
      )}
    </div>
  );
}

const inputCls = 'w-full px-4 py-2.5 rounded-xl bg-[#0a0f1f] border border-white/10 text-white text-sm focus:outline-none focus:border-blue-500/50 transition-colors placeholder:text-slate-600';

function MemberForm({ member, onClose, onSaved }: { member: Member | null; onClose: () => void; onSaved: () => void }) {
  const [form, setForm] = useState({
    name: member?.name ?? '',
    email: member?.email ?? '',
    phone: member?.phone ?? '',
    subscription_plan: member?.subscription_plan ?? 'free',
    subscription_status: member?.subscription_status ?? 'trial',
    notes: member?.notes ?? '',
    joined_at: member?.joined_at ?? new Date().toISOString().split('T')[0],
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const save = async () => {
    setSaving(true);
    setError(null);
    const payload = {
      name: form.name,
      email: form.email,
      phone: form.phone || null,
      subscription_plan: form.subscription_plan,
      subscription_status: form.subscription_status,
      notes: form.notes || null,
      joined_at: form.joined_at,
    };
    const { error: err } = member
      ? await supabase.from('members').update(payload).eq('id', member.id)
      : await supabase.from('members').insert(payload);
    if (err) setError(err.message);
    else onSaved();
    setSaving(false);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm" onClick={onClose}>
      <div className="relative max-w-lg w-full max-h-[90vh] overflow-y-auto rounded-2xl bg-[#0f1424] border border-white/10 shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
          <h2 className="text-lg font-bold text-white">{member ? 'Edit member' : 'New member'}</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white"><X size={20} /></button>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-xs text-slate-400 mb-1.5 uppercase tracking-wider">Name</label>
            <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={inputCls} placeholder="Full name" />
          </div>
          <div>
            <label className="block text-xs text-slate-400 mb-1.5 uppercase tracking-wider">Email</label>
            <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className={inputCls} placeholder="member@example.com" />
          </div>
          <div>
            <label className="block text-xs text-slate-400 mb-1.5 uppercase tracking-wider">Phone / WhatsApp</label>
            <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className={inputCls} placeholder="+1234567890" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-slate-400 mb-1.5 uppercase tracking-wider">Subscription plan</label>
              <select value={form.subscription_plan} onChange={(e) => setForm({ ...form, subscription_plan: e.target.value })} className={inputCls}>
                {SUBSCRIPTION_PLANS.map((p) => <option key={p} value={p} className="bg-[#0a0f1f]">{p}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1.5 uppercase tracking-wider">Subscription status</label>
              <select value={form.subscription_status} onChange={(e) => setForm({ ...form, subscription_status: e.target.value })} className={inputCls}>
                {SUBSCRIPTION_STATUSES.map((s) => <option key={s} value={s} className="bg-[#0a0f1f]">{s}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-xs text-slate-400 mb-1.5 uppercase tracking-wider">Activity / Notes</label>
            <textarea rows={3} value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} className={`${inputCls} resize-none`} placeholder="Track progress, what you're teaching them, where they are..." />
          </div>
          <div>
            <label className="block text-xs text-slate-400 mb-1.5 uppercase tracking-wider">Join date</label>
            <input type="date" value={form.joined_at} onChange={(e) => setForm({ ...form, joined_at: e.target.value })} className={inputCls} />
          </div>
          {error && <p className="text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-2.5">{error}</p>}
        </div>
        <div className="flex justify-end gap-3 px-6 py-4 border-t border-white/5">
          <button onClick={onClose} className="px-4 py-2.5 rounded-xl text-slate-400 hover:text-white text-sm">Cancel</button>
          <button onClick={save} disabled={saving} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white text-sm font-medium">
            <Save size={16} /> {saving ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>
    </div>
  );
}

function EmailComposer({ recipients, onClose }: { recipients: Member[]; onClose: () => void }) {
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [sending, setSending] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const send = async () => {
    if (!subject || !body) return;
    setSending(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/send-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({
          to: recipients.map((r) => r.email),
          subject,
          body,
        }),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || `Request failed (${response.status})`);
      }

      const data = await response.json();
      setResult(data.message || 'Email sent successfully.');
      setSubject('');
      setBody('');
      setTimeout(onClose, 2500);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send email.');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm" onClick={onClose}>
      <div className="relative max-w-2xl w-full max-h-[90vh] overflow-y-auto rounded-2xl bg-[#0f1424] border border-white/10 shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
          <div>
            <h2 className="text-lg font-bold text-white">Send Email</h2>
            <p className="text-slate-500 text-xs mt-0.5">{recipients.length} recipient{recipients.length !== 1 ? 's' : ''}: {recipients.slice(0, 3).map((r) => r.email).join(', ')}{recipients.length > 3 ? ` +${recipients.length - 3} more` : ''}</p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white"><X size={20} /></button>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <label className="block text-xs text-slate-400 mb-1.5 uppercase tracking-wider">Subject</label>
            <input value={subject} onChange={(e) => setSubject(e.target.value)} className={inputCls} placeholder="Email subject" />
          </div>
          <div>
            <label className="block text-xs text-slate-400 mb-1.5 uppercase tracking-wider">Body</label>
            <textarea rows={8} value={body} onChange={(e) => setBody(e.target.value)} className={`${inputCls} resize-none`} placeholder="Write your email..." />
          </div>

          {result && (
            <p className="text-green-400 text-sm bg-green-500/10 border border-green-500/20 rounded-lg px-4 py-2.5">{result}</p>
          )}
          {error && (
            <p className="text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-2.5">{error}</p>
          )}

          <div className="p-3 rounded-xl bg-blue-500/5 border border-blue-500/10 text-xs text-slate-400">
            <strong className="text-blue-300">Note:</strong> Emails are sent through the Resend API. You need to add a Resend API key in your Supabase edge function secrets (named <code className="text-blue-300">RESEND_API_KEY</code>) for email sending to work. Until then, emails will fail with a configuration error.
          </div>
        </div>

        <div className="flex justify-end gap-3 px-6 py-4 border-t border-white/5">
          <button onClick={onClose} className="px-4 py-2.5 rounded-xl text-slate-400 hover:text-white text-sm">Cancel</button>
          <button onClick={send} disabled={sending || !subject || !body} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white text-sm font-medium">
            <Send size={16} /> {sending ? 'Sending...' : `Send to ${recipients.length}`}
          </button>
        </div>
      </div>
    </div>
  );
}
