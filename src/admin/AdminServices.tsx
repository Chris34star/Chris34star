import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, X, Save, GripVertical } from 'lucide-react';
import { supabase, type Service } from '@/lib/supabase';

export function AdminServices() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Service | null>(null);
  const [creating, setCreating] = useState(false);

  const load = async () => {
    const { data } = await supabase.from('services').select('*').order('sort_order', { ascending: true });
    setServices(data ?? []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const del = async (id: string) => {
    if (!confirm('Delete this service?')) return;
    await supabase.from('services').delete().eq('id', id);
    load();
  };

  if (loading) return <div className="flex justify-center py-20"><div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Services</h1>
          <p className="text-slate-400 text-sm mt-1">Capability cards shown on your homepage.</p>
        </div>
        <button onClick={() => setCreating(true)} className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium transition-colors">
          <Plus size={18} /> Add service
        </button>
      </div>

      <div className="space-y-3">
        {services.map((s) => (
          <div key={s.id} className="flex items-center gap-4 p-4 rounded-xl bg-white/[0.03] border border-white/5">
            <GripVertical size={16} className="text-slate-600 shrink-0" />
            <div className="w-10 h-10 rounded-lg bg-blue-600/10 border border-blue-500/20 flex items-center justify-center text-blue-400 text-sm font-medium shrink-0">
              {s.icon.slice(0, 2)}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-white font-medium">{s.title}</h3>
              <p className="text-slate-500 text-sm truncate">{s.description}</p>
            </div>
            <button onClick={() => setEditing(s)} className="p-2 text-slate-400 hover:text-white"><Pencil size={16} /></button>
            <button onClick={() => del(s.id)} className="p-2 text-slate-400 hover:text-red-400"><Trash2 size={16} /></button>
          </div>
        ))}
        {services.length === 0 && <p className="text-slate-500 text-center py-12">No services yet.</p>}
      </div>

      {(creating || editing) && (
        <ServiceForm service={editing} onClose={() => { setCreating(false); setEditing(null); }} onSaved={() => { setCreating(false); setEditing(null); load(); }} />
      )}
    </div>
  );
}

function ServiceForm({ service, onClose, onSaved }: { service: Service | null; onClose: () => void; onSaved: () => void }) {
  const [form, setForm] = useState({ icon: service?.icon ?? 'Code2', title: service?.title ?? '', description: service?.description ?? '', sort_order: service?.sort_order ?? 0 });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const save = async () => {
    setSaving(true);
    setError(null);
    const payload = { icon: form.icon, title: form.title, description: form.description || null, sort_order: form.sort_order };
    const { error: err } = service
      ? await supabase.from('services').update(payload).eq('id', service.id)
      : await supabase.from('services').insert(payload);
    if (err) setError(err.message);
    else onSaved();
    setSaving(false);
  };

  const inputCls = 'w-full px-4 py-2.5 rounded-xl bg-[#0a0f1f] border border-white/10 text-white text-sm focus:outline-none focus:border-blue-500/50 transition-colors placeholder:text-slate-600';

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm" onClick={onClose}>
      <div className="relative max-w-lg w-full rounded-2xl bg-[#0f1424] border border-white/10 shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
          <h2 className="text-lg font-bold text-white">{service ? 'Edit service' : 'New service'}</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white"><X size={20} /></button>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-xs text-slate-400 mb-1.5 uppercase tracking-wider">Icon name (lucide-react)</label>
            <input value={form.icon} onChange={(e) => setForm({ ...form, icon: e.target.value })} className={inputCls} placeholder="e.g. Bot, Database, BarChart3" />
          </div>
          <div>
            <label className="block text-xs text-slate-400 mb-1.5 uppercase tracking-wider">Title</label>
            <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className={inputCls} placeholder="Service title" />
          </div>
          <div>
            <label className="block text-xs text-slate-400 mb-1.5 uppercase tracking-wider">Description</label>
            <textarea rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className={`${inputCls} resize-none`} placeholder="What this service involves" />
          </div>
          <div>
            <label className="block text-xs text-slate-400 mb-1.5 uppercase tracking-wider">Sort order</label>
            <input type="number" value={form.sort_order} onChange={(e) => setForm({ ...form, sort_order: parseInt(e.target.value) || 0 })} className={inputCls} />
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
