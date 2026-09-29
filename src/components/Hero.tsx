import { useEffect, useRef, useState } from 'react';
import { ArrowRight, ArrowDown } from 'lucide-react';
import type { SiteContent } from '@/lib/supabase';

const DEFAULT_PHOTO = '/images/WhatsApp_Image_2026-09-26_at_9.18.05_AM.jpeg';

export function Hero({ content }: { content: SiteContent | null }) {
  const headline = content?.hero_headline ?? 'AI & Data Engineer who solves real problems with smart systems, dashboards, and automation.';
  const sub = content?.hero_subheadline ?? 'Every project starts with a problem worth solving. I ship the fix, then share how I built it.';
  const cta1Label = content?.cta_projects_label ?? 'View my work';
  const cta1Link = content?.cta_projects_link ?? '#projects';
  const cta2Label = content?.cta_contact_label ?? "Let's talk";
  const cta2Link = content?.cta_contact_link ?? '#contact';

  const heroRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 });

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      if (!heroRef.current) return;
      const rect = heroRef.current.getBoundingClientRect();
      setMousePos({
        x: (e.clientX - rect.left) / rect.width,
        y: (e.clientY - rect.top) / rect.height,
      });
    };
    window.addEventListener('mousemove', onMove);
    return () => window.removeEventListener('mousemove', onMove);
  }, []);

  return (
    <section
      ref={heroRef}
      id="home"
      className="relative min-h-screen flex items-center overflow-hidden bg-ink-base"
    >
      {/* subtle grid */}
      <div className="absolute inset-0 grid-bg grid-bg-fade opacity-60" />

      {/* atmospheric lighting — extremely subtle */}
      <div
        className="absolute pointer-events-none transition-all duration-1000"
        style={{
          left: `${mousePos.x * 100}%`,
          top: `${mousePos.y * 100}%`,
          transform: 'translate(-50%, -50%)',
          width: '600px',
          height: '600px',
          background: 'radial-gradient(circle, rgba(124,245,200,0.05) 0%, transparent 60%)',
          borderRadius: '50%',
        }}
      />
      <div className="absolute top-1/3 left-1/4 w-[500px] h-[500px] bg-mint-glow rounded-full blur-[160px] opacity-40" />
      <div className="absolute bottom-1/4 right-1/3 w-[400px] h-[400px] bg-cyan-glow rounded-full blur-[140px] opacity-30" />

      <div className="relative max-w-6xl mx-auto px-6 pt-24 pb-16 w-full">
        <div className="grid lg:grid-cols-[1.3fr_1fr] gap-12 items-center">
          {/* left: text */}
          <div className="animate-fade-up">
            <div className="mono-label mb-6 flex items-center gap-2">
              <span className="status-dot" />
              <span className="text-mint">// SOFTWARE · DATA · AI · PRODUCTS</span>
            </div>

            <h1 className="font-display font-bold text-[2.2rem] md:text-[3rem] lg:text-[3.5rem] leading-[1.08] tracking-tight text-text-primary mb-7 max-w-2xl">
              {headline}
            </h1>

            <p className="text-text-secondary text-base md:text-lg leading-relaxed mb-10 max-w-xl font-body font-normal">
              {sub}
            </p>

            <div className="flex flex-wrap gap-3">
              <a
                href={cta1Link}
                className="btn-mint group inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold"
              >
                {cta1Label}
                <ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
              </a>
              <a
                href={cta2Link}
                className="btn-glass inline-flex items-center gap-2 px-6 py-3 text-sm font-medium"
              >
                {cta2Label}
              </a>
            </div>
          </div>

          {/* right: profile photo with glass ring */}
          <div className="hidden lg:flex justify-center items-center relative">
            <div className="relative w-72 h-72">
              {/* outer glass ring */}
              <div className="absolute -inset-3 rounded-full border border-white/[0.06] bg-white/[0.015] backdrop-blur-sm" />
              {/* mint glow ring */}
              <div className="absolute -inset-1.5 rounded-full bg-mint-glow blur-md opacity-50" />
              {/* photo */}
              <div className="relative w-full h-full rounded-full overflow-hidden border-2 border-white/[0.08]">
                <img
                  src={content?.profile_photo || DEFAULT_PHOTO}
                  alt="chris34star"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink-base/40 to-transparent" />
              </div>
              {/* status dot */}
              <div className="absolute bottom-5 right-5 w-4 h-4 rounded-full bg-ink-base border-2 border-mint flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-mint shadow-[0_0_8px_rgba(124,245,200,0.6)]" />
              </div>
              {/* corner code fragment */}
              <div className="absolute -bottom-2 -left-2 px-2.5 py-1.5 rounded-glass-sm glass-card font-mono text-[10px] text-mint">
                {'>'}_
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-text-muted">
        <span className="font-mono text-[10px] uppercase tracking-widest">Scroll</span>
        <ArrowDown size={14} className="animate-bounce" style={{ animationDuration: '2s' }} />
      </div>
    </section>
  );
}
