import { useState } from 'react';
import { Github, Linkedin, Mail, MessageCircle, Send, CheckCircle2 } from 'lucide-react';
import type { SiteContent } from '@/lib/supabase';
import { supabase } from '@/lib/supabase';
import { useReveal } from '@/lib/useReveal';

export function Contact({ content }: { content: SiteContent | null }) {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const { ref, visible } = useReveal<HTMLDivElement>();

  const email = content?.contact_email ?? '';
  const whatsapp = content?.contact_whatsapp ?? '';
  const github = content?.contact_github ?? '';
  const linkedin = content?.contact_linkedin ?? '';

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) return;
    setStatus('sending');
    const { error } = await supabase.from('contact_messages').insert({
      name: form.name,
      email: form.email,
      message: form.message,
    });
    if (error) {
      setStatus('error');
    } else {
      setStatus('sent');
      setForm({ name: '', email: '', message: '' });
      setTimeout(() => setStatus('idle'), 5000);
    }
  };

  const channels = [
    { icon: MessageCircle, label: 'WhatsApp', value: whatsapp, href: whatsapp },
    { icon: Mail, label: 'Email', value: email, href: `mailto:${email}` },
    { icon: Github, label: 'GitHub', value: github, href: github },
    { icon: Linkedin, label: 'LinkedIn', value: linkedin, href: linkedin },
  ].filter((c) => c.value);

  const inputCls = 'w-full px-4 py-3 rounded-glass-sm bg-white/[0.03] border border-white/[0.08] text-text-primary text-sm focus:outline-none focus:border-mint/30 focus:shadow-[0_0_20px_rgba(124,245,200,0.05)] transition-all placeholder:text-text-muted';

  return (
    <section id="contact" className="relative py-28 bg-ink-elevated">
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />

      <div ref={ref} className={`max-w-6xl mx-auto px-6 reveal ${visible ? 'visible' : ''}`}>
        <p className="mono-label mb-4">// GET IN TOUCH</p>
        <h2 className="font-display font-semibold text-3xl md:text-[2.5rem] text-text-primary tracking-tight mb-4">
          Let's build something
        </h2>
        <p className="text-text-secondary text-base md:text-lg max-w-xl leading-relaxed mb-14">
          Have a project in mind, a question, or just want to connect? Send a message — I read every one.
        </p>

        <div className="grid lg:grid-cols-[1fr_1.2fr] gap-8">
          {/* channels */}
          <div className="space-y-3">
            {channels.map((c) => (
              <a
                key={c.label}
                href={c.href}
                target={c.href.startsWith('http') ? '_blank' : undefined}
                rel="noreferrer"
                className="group glass-card glass-card-hover rounded-glass-sm p-5 flex items-center gap-4"
              >
                <div className="w-10 h-10 rounded-xl bg-mint-dim border border-mint/15 flex items-center justify-center transition-all group-hover:bg-mint/15">
                  <c.icon size={18} className="text-mint" />
                </div>
                <div>
                  <p className="mono-label">{c.label}</p>
                  <p className="text-text-primary text-sm font-medium truncate max-w-[200px]">{c.value}</p>
                </div>
              </a>
            ))}
          </div>

          {/* form */}
          <div className="glass-card rounded-glass p-7">
            <form onSubmit={submit} className="space-y-4">
              <div>
                <label className="mono-label block mb-2">Name</label>
                <input type="text" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={inputCls} placeholder="Your name" />
              </div>
              <div>
                <label className="mono-label block mb-2">Email</label>
                <input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className={inputCls} placeholder="you@example.com" />
              </div>
              <div>
                <label className="mono-label block mb-2">Message</label>
                <textarea required rows={4} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} className={`${inputCls} resize-none`} placeholder="Tell me about your project or question..." />
              </div>

              <button type="submit" disabled={status === 'sending'} className="btn-mint w-full flex items-center justify-center gap-2 px-5 py-3 text-sm font-semibold disabled:opacity-50">
                {status === 'sent' ? (
                  <span className="flex items-center gap-2"><CheckCircle2 size={17} /> Message sent</span>
                ) : status === 'sending' ? (
                  'Sending...'
                ) : (
                  <span className="flex items-center gap-2">Send message <Send size={15} /></span>
                )}
              </button>

              {status === 'error' && (
                <p className="text-red-400 text-sm text-center">Something went wrong. Please try again or email me directly.</p>
              )}
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
