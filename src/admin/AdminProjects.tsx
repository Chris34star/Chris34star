import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, X, Star, Save, Lock, Unlock } from 'lucide-react';
import { supabase, type Project, PROJECT_CATEGORIES, PROJECT_STATUSES } from '@/lib/supabase';

const empty: Omit<Project, 'id' | 'created_at' | 'updated_at'> = {
  title: '',
  category: PROJECT_CATEGORIES[0],
  short_description: '',
  long_description: '',
  tech_stack: [],
  github_link: '',
  demo_link: '',
  business_use_case: '',
  getting_started: '',
  marketing_strategy: '',
  revenue_estimate: '',
  demo_samples: [],
  status: 'active',
  featured: false,
  is_open: true,
  sort_order: 0,
  screenshots: [],
};

export function AdminProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Project | null>(null);
  const [creating, setCreating] = useState(false);

  const load = async () => {
    const { data } = await supabase.from('projects').select('*').order('created_at', { ascending: false });
    setProjects(data ?? []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const del = async (id: string) => {
    if (!confirm('Delete this project? This cannot be undone.')) return;
    await supabase.from('projects').delete().eq('id', id);
    load();
  };

  if (loading) return <Spinner />;

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Projects</h1>
          <p className="text-slate-400 text-sm mt-1">{projects.length} project{projects.length !== 1 ? 's' : ''} published.</p>
        </div>
        <button
          onClick={() => setCreating(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium transition-colors"
        >
          <Plus size={18} /> Add project
        </button>
      </div>

      <div className="space-y-3">
        {projects.map((p) => (
          <div key={p.id} className="flex items-center gap-4 p-4 rounded-xl bg-white/[0.03] border border-white/5">
            <div className="w-12 h-12 rounded-lg bg-white/5 flex items-center justify-center text-slate-400 shrink-0 overflow-hidden">
              {p.screenshots[0] ? (
                <img src={p.screenshots[0]} alt="" className="w-full h-full object-cover" />
              ) : (
                <span className="text-xs">{'</>'}</span>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="text-white font-medium truncate">{p.title}</h3>
                {p.featured && <Star size={14} className="text-amber-400 fill-amber-400 shrink-0" />}
                {p.is_open ? (
                  <span className="flex items-center gap-1 text-xs text-green-400 px-1.5 py-0.5 rounded bg-green-500/10"><Unlock size={10} /> Open</span>
                ) : (
                  <span className="flex items-center gap-1 text-xs text-amber-400 px-1.5 py-0.5 rounded bg-amber-500/10"><Lock size={10} /> Locked</span>
                )}
              </div>
              <p className="text-slate-500 text-sm truncate">{p.category} · {p.status}</p>
            </div>
            <button onClick={() => setEditing(p)} className="p-2 text-slate-400 hover:text-white transition-colors">
              <Pencil size={16} />
            </button>
            <button onClick={() => del(p.id)} className="p-2 text-slate-400 hover:text-red-400 transition-colors">
              <Trash2 size={16} />
            </button>
          </div>
        ))}
        {projects.length === 0 && (
          <p className="text-slate-500 text-center py-12">No projects yet. Click "Add project" to create your first one.</p>
        )}
      </div>

      {(creating || editing) && (
        <ProjectForm
          project={editing}
          onClose={() => { setCreating(false); setEditing(null); }}
          onSaved={() => { setCreating(false); setEditing(null); load(); }}
        />
      )}
    </div>
  );
}

function ProjectForm({ project, onClose, onSaved }: { project: Project | null; onClose: () => void; onSaved: () => void }) {
  const [form, setForm] = useState({ ...empty, ...(project ?? {}) });
  const [techInput, setTechInput] = useState('');
  const [shotInput, setShotInput] = useState('');
  const [demoInput, setDemoInput] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const save = async () => {
    setSaving(true);
    setError(null);
    const payload = {
      title: form.title,
      category: form.category,
      short_description: form.short_description,
      long_description: form.long_description || null,
      tech_stack: form.tech_stack,
      github_link: form.github_link || null,
      demo_link: form.demo_link || null,
      business_use_case: form.business_use_case || null,
      getting_started: form.getting_started || null,
      marketing_strategy: form.marketing_strategy || null,
      revenue_estimate: form.revenue_estimate || null,
      demo_samples: form.demo_samples,
      status: form.status,
      featured: form.featured,
      is_open: form.is_open,
      sort_order: form.sort_order,
      screenshots: form.screenshots,
    };
    const { error: err } = project
      ? await supabase.from('projects').update(payload).eq('id', project.id)
      : await supabase.from('projects').insert(payload);
    if (err) setError(err.message);
    else onSaved();
    setSaving(false);
  };

  const addTech = () => {
    const t = techInput.trim();
    if (t && !form.tech_stack.includes(t)) setForm({ ...form, tech_stack: [...form.tech_stack, t] });
    setTechInput('');
  };
  const addShot = () => {
    const s = shotInput.trim();
    if (s) setForm({ ...form, screenshots: [...form.screenshots, s] });
    setShotInput('');
  };
  const addDemo = () => {
    const d = demoInput.trim();
    if (d && !form.demo_samples.includes(d)) setForm({ ...form, demo_samples: [...form.demo_samples, d] });
    setDemoInput('');
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm" onClick={onClose}>
      <div className="relative max-w-2xl w-full max-h-[90vh] overflow-y-auto rounded-2xl bg-[#0f1424] border border-white/10 shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="sticky top-0 bg-[#0f1424] flex items-center justify-between px-6 py-4 border-b border-white/5">
          <h2 className="text-lg font-bold text-white">{project ? 'Edit project' : 'New project'}</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white"><X size={20} /></button>
        </div>

        <div className="p-6 space-y-4">
          <Field label="Title">
            <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className={inputCls} placeholder="Project name" />
          </Field>

          <div className="grid grid-cols-2 gap-4">
            <Field label="Category">
              <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className={inputCls}>
                {PROJECT_CATEGORIES.map((c) => <option key={c} value={c} className="bg-[#0a0f1f]">{c}</option>)}
              </select>
            </Field>
            <Field label="Status">
              <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className={inputCls}>
                {PROJECT_STATUSES.map((s) => <option key={s} value={s} className="bg-[#0a0f1f]">{s}</option>)}
              </select>
            </Field>
          </div>

          <Field label="Short description">
            <input value={form.short_description} onChange={(e) => setForm({ ...form, short_description: e.target.value })} className={inputCls} placeholder="One-line summary shown on the card" />
          </Field>

          <Field label="Long description">
            <textarea rows={3} value={form.long_description ?? ''} onChange={(e) => setForm({ ...form, long_description: e.target.value })} className={`${inputCls} resize-none`} placeholder="Full description shown in the detail view" />
          </Field>

          <Field label="Business use case">
            <textarea rows={2} value={form.business_use_case ?? ''} onChange={(e) => setForm({ ...form, business_use_case: e.target.value })} className={`${inputCls} resize-none`} placeholder="What business problem does this solve?" />
          </Field>

          <Field label="Getting started (platform instructions)">
            <textarea rows={3} value={form.getting_started ?? ''} onChange={(e) => setForm({ ...form, getting_started: e.target.value })} className={`${inputCls} resize-none`} placeholder="Step-by-step instructions for getting this project running on a platform (e.g. Vercel, Railway, Render...). Shown when a visitor expands the project." />
          </Field>

          <Field label="Marketing strategy">
            <textarea rows={3} value={form.marketing_strategy ?? ''} onChange={(e) => setForm({ ...form, marketing_strategy: e.target.value })} className={`${inputCls} resize-none`} placeholder="How to market and promote this project — channels, tactics, target audience." />
          </Field>

          <Field label="Revenue estimate (6 months)">
            <input value={form.revenue_estimate ?? ''} onChange={(e) => setForm({ ...form, revenue_estimate: e.target.value })} className={inputCls} placeholder="e.g. $2,000/month recurring by month 6" />
          </Field>

          <Field label="Demo samples (add descriptions or URLs)">
            <div className="flex gap-2">
              <input value={demoInput} onChange={(e) => setDemoInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addDemo())} className={inputCls} placeholder="Add a demo description or URL and press Enter" />
              <button onClick={addDemo} className="px-4 rounded-xl bg-white/5 border border-white/10 text-white text-sm">Add</button>
            </div>
            {form.demo_samples.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {form.demo_samples.map((d, i) => (
                  <span key={i} className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-slate-300 text-xs">
                    {d}
                    <button onClick={() => setForm({ ...form, demo_samples: form.demo_samples.filter((_, j) => j !== i) })}><X size={12} /></button>
                  </span>
                ))}
              </div>
            )}
          </Field>

          <div className="grid grid-cols-2 gap-4">
            <Field label="GitHub link">
              <input value={form.github_link ?? ''} onChange={(e) => setForm({ ...form, github_link: e.target.value })} className={inputCls} placeholder="https://github.com/..." />
            </Field>
            <Field label="Demo link">
              <input value={form.demo_link ?? ''} onChange={(e) => setForm({ ...form, demo_link: e.target.value })} className={inputCls} placeholder="https://..." />
            </Field>
          </div>

          <Field label="Tech stack">
            <div className="flex gap-2">
              <input value={techInput} onChange={(e) => setTechInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTech())} className={inputCls} placeholder="Add a technology and press Enter" />
              <button onClick={addTech} className="px-4 rounded-xl bg-white/5 border border-white/10 text-white text-sm">Add</button>
            </div>
            {form.tech_stack.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {form.tech_stack.map((t) => (
                  <span key={t} className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-blue-600/10 border border-blue-500/20 text-blue-300 text-xs">
                    {t}
                    <button onClick={() => setForm({ ...form, tech_stack: form.tech_stack.filter((x) => x !== t) })}><X size={12} /></button>
                  </span>
                ))}
              </div>
            )}
          </Field>

          <Field label="Screenshots (image URLs)">
            <div className="flex gap-2">
              <input value={shotInput} onChange={(e) => setShotInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addShot())} className={inputCls} placeholder="Paste an image URL" />
              <button onClick={addShot} className="px-4 rounded-xl bg-white/5 border border-white/10 text-white text-sm">Add</button>
            </div>
            {form.screenshots.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {form.screenshots.map((s, i) => (
                  <div key={i} className="relative w-24 h-16 rounded-lg overflow-hidden border border-white/10">
                    <img src={s} alt="" className="w-full h-full object-cover" />
                    <button onClick={() => setForm({ ...form, screenshots: form.screenshots.filter((_, j) => j !== i) })} className="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/60 flex items-center justify-center text-white"><X size={10} /></button>
                  </div>
                ))}
              </div>
            )}
          </Field>

          <div className="grid grid-cols-2 gap-4">
            <Field label="Sort order">
              <input type="number" value={form.sort_order} onChange={(e) => setForm({ ...form, sort_order: parseInt(e.target.value) || 0 })} className={inputCls} />
            </Field>
            <label className="flex items-end gap-3 pb-3 cursor-pointer">
              <input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} className="w-5 h-5 rounded accent-blue-500" />
              <span className="text-white text-sm">Featured project</span>
            </label>
          </div>

          <label className="flex items-center gap-3 cursor-pointer p-3 rounded-xl bg-white/[0.02] border border-white/5">
            <input type="checkbox" checked={form.is_open} onChange={(e) => setForm({ ...form, is_open: e.target.checked })} className="w-5 h-5 rounded accent-green-500" />
            <div>
              <span className="text-white text-sm font-medium">Open project</span>
              <p className="text-slate-500 text-xs mt-0.5">When checked, this project appears in "Open Projects" with GitHub/demo links and a copy/fork CTA. When unchecked, it appears in "In Progress / Locked" with no links.</p>
            </div>
          </label>

          {error && <p className="text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-2.5">{error}</p>}
        </div>

        <div className="sticky bottom-0 bg-[#0f1424] flex justify-end gap-3 px-6 py-4 border-t border-white/5">
          <button onClick={onClose} className="px-4 py-2.5 rounded-xl text-slate-400 hover:text-white text-sm">Cancel</button>
          <button onClick={save} disabled={saving} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white text-sm font-medium">
            <Save size={16} /> {saving ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>
    </div>
  );
}

const inputCls = 'w-full px-4 py-2.5 rounded-xl bg-[#0a0f1f] border border-white/10 text-white text-sm focus:outline-none focus:border-blue-500/50 transition-colors placeholder:text-slate-600';

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs text-slate-400 mb-1.5 uppercase tracking-wider">{label}</label>
      {children}
    </div>
  );
}

function Spinner() {
  return (
    <div className="flex items-center justify-center py-20">
      <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );
}
