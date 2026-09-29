import { useEffect, useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { Hero } from '@/components/Hero';
import { Services } from '@/components/Services';
import { Projects } from '@/components/Projects';
import { BuildLikeMe } from '@/components/BuildLikeMe';
import { Contact } from '@/components/Contact';
import { Footer } from '@/components/Footer';
import { supabase, type Project, type Service, type SiteContent } from '@/lib/supabase';

export function PublicSite() {
  const [content, setContent] = useState<SiteContent | null>(null);
  const [services, setServices] = useState<Service[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const [c, s, p] = await Promise.all([
        supabase.from('site_content').select('*').eq('id', 1).maybeSingle(),
        supabase.from('services').select('*').order('sort_order', { ascending: true }),
        supabase.from('projects').select('*').order('featured', { ascending: false }).order('sort_order', { ascending: true }),
      ]);
      setContent(c.data as SiteContent | null);
      setServices(s.data ?? []);
      setProjects(p.data ?? []);
      setLoading(false);
    })();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-ink-base flex items-center justify-center">
        <div className="w-7 h-7 border-2 border-mint border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="bg-ink-base">
      <Navbar content={content} />
      <main>
        <Hero content={content} />
        <Projects projects={projects} />
        <Services services={services} />
        <BuildLikeMe content={content} />
        <Contact content={content} />
      </main>
      <Footer content={content} />
    </div>
  );
}
