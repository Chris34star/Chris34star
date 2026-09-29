import { useEffect, useState } from 'react';
import { Menu, X } from 'lucide-react';
import type { SiteContent } from '@/lib/supabase';

export function Navbar({ content }: { content: SiteContent | null }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const links = [
    { label: 'Work', href: '#projects' },
    { label: 'Services', href: '#services' },
    { label: 'Build', href: '#build' },
    { label: 'Contact', href: '#contact' },
  ];

  return (
    <header className="fixed top-0 inset-x-0 z-50 flex justify-center px-4 pt-4">
      <nav
        className={`w-full max-w-5xl flex items-center justify-between px-5 h-14 rounded-2xl transition-all duration-500 ${
          scrolled
            ? 'bg-[#0D1117]/80 backdrop-blur-xl border border-white/[0.08] shadow-[0_8px_32px_rgba(0,0,0,0.3)]'
            : 'bg-transparent border border-transparent'
        }`}
      >
        <a href="#home" className="flex items-center gap-2.5 group">
          <div className="w-7 h-7 rounded-lg bg-mint flex items-center justify-center font-mono font-bold text-mint-dark text-xs transition-transform group-hover:scale-105">
            C
          </div>
          <span className="font-display font-semibold text-text-primary text-[15px] tracking-tight">
            chris34star
          </span>
        </a>

        <div className="hidden md:flex items-center gap-7">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="relative text-[13px] font-medium text-text-secondary hover:text-text-primary transition-colors duration-200 after:content-[''] after:absolute after:-bottom-1 after:left-0 after:w-0 after:h-px after:bg-mint after:transition-all after:duration-300 hover:after:w-full"
            >
              {l.label}
            </a>
          ))}
          <a
            href="#contact"
            className="btn-mint inline-flex items-center gap-1.5 px-4 py-2 text-[13px] font-semibold"
          >
            Let's Build
          </a>
        </div>

        <button
          className="md:hidden text-text-primary p-1.5"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </nav>

      {open && (
        <div className="md:hidden absolute top-20 left-4 right-4 rounded-2xl bg-[#0D1117]/95 backdrop-blur-xl border border-white/[0.08] shadow-[0_20px_60px_rgba(0,0,0,0.4)] px-5 py-4 flex flex-col gap-1">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="text-text-secondary hover:text-text-primary py-2.5 text-sm font-medium transition-colors"
            >
              {l.label}
            </a>
          ))}
          <a
            href="#contact"
            onClick={() => setOpen(false)}
            className="btn-mint inline-flex items-center justify-center px-4 py-2.5 text-sm font-semibold mt-2"
          >
            Let's Build
          </a>
        </div>
      )}
    </header>
  );
}
