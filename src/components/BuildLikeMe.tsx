import { ArrowRight, Code2, Terminal, GraduationCap } from 'lucide-react';
import type { SiteContent } from '@/lib/supabase';
import { useReveal } from '@/lib/useReveal';

export function BuildLikeMe({ content }: { content: SiteContent | null }) {
  const { ref, visible } = useReveal<HTMLDivElement>();
  const intro = content?.build_intro ?? 'I document how I build these projects. Anyone curious can learn from it — GitHub starter projects, CodeAI deployment notes, and occasional training.';
  const linkLabel = content?.build_link_label ?? 'Explore open projects';
  const linkUrl = content?.build_link_url ?? '#projects';

  const items = [
    { icon: Code2, title: 'GitHub Starter Projects', desc: 'Ready-to-use templates and starter repos you can clone and fork.' },
    { icon: Terminal, title: 'CodeAI Deployment Notes', desc: 'How I deploy and run AI systems in production — step by step.' },
    { icon: GraduationCap, title: 'Occasional Training', desc: 'Hands-on sessions for builders who want to learn the process.' },
  ];

  return (
    <section id="build" className="relative py-28 bg-ink-base overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[250px] bg-mint-glow rounded-full blur-[150px] opacity-30" />

      <div ref={ref} className={`relative max-w-4xl mx-auto px-6 text-center reveal ${visible ? 'visible' : ''}`}>
        <p className="mono-label mb-4">// FOR CURIOUS BUILDERS</p>
        <h2 className="font-display font-semibold text-3xl md:text-[2.5rem] text-text-primary tracking-tight mb-6">
          Build like I do
        </h2>
        <p className="text-text-secondary text-base md:text-lg leading-relaxed max-w-2xl mx-auto mb-12">
          {intro}
        </p>

        <div className="grid sm:grid-cols-3 gap-4 mb-10 text-left">
          {items.map((it, i) => (
            <div
              key={it.title}
              className="glass-card glass-card-hover rounded-glass-sm p-6"
              style={{ animation: visible ? `fadeUp 0.5s ease-out ${i * 100}ms` : 'none', opacity: visible ? undefined : 0 }}
            >
              <it.icon size={20} className="text-mint mb-3" />
              <h3 className="font-display font-medium text-text-primary text-[15px] mb-1">{it.title}</h3>
              <p className="text-text-secondary text-[13px] leading-relaxed">{it.desc}</p>
            </div>
          ))}
        </div>

        <a
          href={linkUrl}
          className="group inline-flex items-center gap-2 text-sm font-medium text-mint hover:text-mint-dark transition-colors"
        >
          {linkLabel}
          <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
        </a>
      </div>
    </section>
  );
}
