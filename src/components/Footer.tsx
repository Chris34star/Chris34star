import { Github, Linkedin, Mail, MessageCircle } from 'lucide-react';
import type { SiteContent } from '@/lib/supabase';

export function Footer({ content }: { content: SiteContent | null }) {
  const year = new Date().getFullYear();
  return (
    <footer className="bg-ink-deep border-t border-white/[0.04] py-10">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-mint flex items-center justify-center font-mono font-bold text-mint-dark text-xs">
              C
            </div>
            <span className="font-display font-semibold text-text-primary text-[15px]">chris34star</span>
          </div>

          <div className="flex items-center gap-4">
            {content?.contact_github && (
              <a href={content.contact_github} target="_blank" rel="noreferrer" className="text-text-muted hover:text-mint transition-colors">
                <Github size={17} />
              </a>
            )}
            {content?.contact_linkedin && (
              <a href={content.contact_linkedin} target="_blank" rel="noreferrer" className="text-text-muted hover:text-mint transition-colors">
                <Linkedin size={17} />
              </a>
            )}
            {content?.contact_email && (
              <a href={`mailto:${content.contact_email}`} className="text-text-muted hover:text-mint transition-colors">
                <Mail size={17} />
              </a>
            )}
            {content?.contact_whatsapp && (
              <a href={content.contact_whatsapp} target="_blank" rel="noreferrer" className="text-text-muted hover:text-mint transition-colors">
                <MessageCircle size={17} />
              </a>
            )}
          </div>

          <div className="flex items-center gap-4">
            <p className="font-mono text-[12px] text-text-muted">© {year} chris34star</p>
            <a href="#/admin" className="font-mono text-[12px] text-text-muted/60 hover:text-text-secondary transition-colors">Admin</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
