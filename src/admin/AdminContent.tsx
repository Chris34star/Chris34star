import { useEffect, useState } from 'react';
import { Save, CheckCircle2 } from 'lucide-react';
import { supabase, type SiteContent } from '@/lib/supabase';

export function AdminContent() {
  const [form, setForm] = useState<SiteContent | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    supabase.from('site_content').select('*').eq('id', 1).maybeSingle().then(({ data }) => {
      setForm(data as SiteContent);
    });
  }, []);

  const save = async () => {
    if (!form) return;
    setSaving(true);
    await supabase.from('site_content').update({
      hero_headline: form.hero_headline,
      hero_subheadline: form.hero_subheadline,
      cta_projects_label: form.cta_projects_label,
      cta_projects_link: form.cta_projects_link,
      cta_contact_label: form.cta_contact_label,
      cta_contact_link: form.cta_contact_link,
      build_intro: form.build_intro,
      build_link_label: form.build_link_label,
      build_link_url: form.build_link_url,
      contact_email: form.contact_email,
      contact_whatsapp: form.contact_whatsapp,
      contact_github: form.contact_github,
      contact_linkedin: form.contact_linkedin,
      profile_photo: form.profile_photo || null,
    }).eq('id', 1);
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  if (!form) return <div className="flex justify-center py-20"><div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" /></div>;

  const inputCls = 'w-full px-4 py-2.5 rounded-xl bg-[#0a0f1f] border border-white/10 text-white text-sm focus:outline-none focus:border-blue-500/50 transition-colors placeholder:text-slate-600';
  const Field = ({ label, children }: { label: string; children: React.ReactNode }) => (
    <div>
      <label className="block text-xs text-slate-400 mb-1.5 uppercase tracking-wider">{label}</label>
      {children}
    </div>
  );

  const set = (k: keyof SiteContent, v: string) => setForm({ ...form, [k]: v });

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Homepage Text</h1>
          <p className="text-slate-400 text-sm mt-1">Edit your hero, CTAs, build section, and contact links.</p>
        </div>
        <button onClick={save} disabled={saving} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white text-sm font-medium">
          {saved ? <><CheckCircle2 size={16} /> Saved</> : <><Save size={16} /> {saving ? 'Saving...' : 'Save changes'}</>}
        </button>
      </div>

      <div className="space-y-8">
        <section className="p-6 rounded-2xl bg-white/[0.03] border border-white/5 space-y-4">
          <h2 className="text-sm font-semibold text-blue-400 uppercase tracking-wider">Hero section</h2>
          <Field label="Headline"><input value={form.hero_headline} onChange={(e) => set('hero_headline', e.target.value)} className={inputCls} /></Field>
          <Field label="Subheadline"><textarea rows={2} value={form.hero_subheadline} onChange={(e) => set('hero_subheadline', e.target.value)} className={`${inputCls} resize-none`} /></Field>
          <Field label="Profile photo URL"><input value={form.profile_photo ?? ''} onChange={(e) => set('profile_photo', e.target.value)} className={inputCls} placeholder="https://... (paste your photo URL here)" /></Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="CTA 1 label"><input value={form.cta_projects_label} onChange={(e) => set('cta_projects_label', e.target.value)} className={inputCls} /></Field>
            <Field label="CTA 1 link"><input value={form.cta_projects_link} onChange={(e) => set('cta_projects_link', e.target.value)} className={inputCls} /></Field>
            <Field label="CTA 2 label"><input value={form.cta_contact_label} onChange={(e) => set('cta_contact_label', e.target.value)} className={inputCls} /></Field>
            <Field label="CTA 2 link"><input value={form.cta_contact_link} onChange={(e) => set('cta_contact_link', e.target.value)} className={inputCls} /></Field>
          </div>
        </section>

        <section className="p-6 rounded-2xl bg-white/[0.03] border border-white/5 space-y-4">
          <h2 className="text-sm font-semibold text-purple-400 uppercase tracking-wider">Build like I do section</h2>
          <Field label="Intro text"><textarea rows={3} value={form.build_intro} onChange={(e) => set('build_intro', e.target.value)} className={`${inputCls} resize-none`} /></Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Link label"><input value={form.build_link_label} onChange={(e) => set('build_link_label', e.target.value)} className={inputCls} /></Field>
            <Field label="Link URL"><input value={form.build_link_url} onChange={(e) => set('build_link_url', e.target.value)} className={inputCls} /></Field>
          </div>
        </section>

        <section className="p-6 rounded-2xl bg-white/[0.03] border border-white/5 space-y-4">
          <h2 className="text-sm font-semibold text-blue-400 uppercase tracking-wider">Contact links</h2>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Email"><input value={form.contact_email} onChange={(e) => set('contact_email', e.target.value)} className={inputCls} /></Field>
            <Field label="WhatsApp link"><input value={form.contact_whatsapp} onChange={(e) => set('contact_whatsapp', e.target.value)} className={inputCls} placeholder="https://wa.me/..." /></Field>
            <Field label="GitHub URL"><input value={form.contact_github} onChange={(e) => set('contact_github', e.target.value)} className={inputCls} placeholder="https://github.com/..." /></Field>
            <Field label="LinkedIn URL"><input value={form.contact_linkedin} onChange={(e) => set('contact_linkedin', e.target.value)} className={inputCls} placeholder="https://linkedin.com/..." /></Field>
          </div>
        </section>
      </div>
    </div>
  );
}
