import * as Icons from 'lucide-react';
import type { Service } from '@/lib/supabase';
import { useReveal } from '@/lib/useReveal';

function getIcon(name: string) {
  const Icon = (Icons as unknown as Record<string, Icons.LucideIcon>)[name];
  return Icon ?? Icons.Code2;
}

export function Services({ services }: { services: Service[] }) {
  const { ref, visible } = useReveal<HTMLDivElement>();

  return (
    <section id="services" className="relative py-28 bg-ink-base">
      <div className="max-w-6xl mx-auto px-6">
        <div ref={ref} className={`reveal ${visible ? 'visible' : ''}`}>
          <p className="mono-label mb-4">// CAPABILITIES</p>
          <h2 className="font-display font-semibold text-3xl md:text-[2.5rem] text-text-primary tracking-tight mb-4">
            What I do
          </h2>
          <p className="text-text-secondary text-base md:text-lg max-w-xl leading-relaxed mb-14">
            From AI automation to business software — the work I do for clients and my own products.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {services.map((s, i) => {
            const Icon = getIcon(s.icon);
            return (
              <div
                key={s.id}
                className={`glass-card glass-card-hover rounded-glass p-7 ${visible ? '' : ''}`}
                style={{
                  opacity: visible ? 0 : 0,
                  animation: visible ? `fadeUp 0.5s ease-out ${i * 80}ms forwards` : 'none',
                }}
              >
                <div className="w-11 h-11 rounded-xl bg-mint-dim border border-mint/20 flex items-center justify-center mb-5">
                  <Icon size={20} className="text-mint" />
                </div>
                <h3 className="font-display font-medium text-lg text-text-primary mb-2">{s.title}</h3>
                <p className="text-text-secondary text-sm leading-relaxed">{s.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
