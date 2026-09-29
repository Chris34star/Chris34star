import { useState } from 'react';
import { ArrowUpRight, Lock, Copy, Github, ExternalLink, X, Star, GitFork, Briefcase, Rocket, TrendingUp, DollarSign, Play } from 'lucide-react';
import type { Project } from '@/lib/supabase';
import { PROJECT_CATEGORIES } from '@/lib/supabase';
import { useReveal } from '@/lib/useReveal';

type View = 'open' | 'client';

export function Projects({ projects }: { projects: Project[] }) {
  const [filter, setFilter] = useState<string>('All');
  const [view, setView] = useState<View>('open');
  const [selected, setSelected] = useState<Project | null>(null);

  const categories = ['All', ...PROJECT_CATEGORIES];
  const filtered = filter === 'All' ? projects : projects.filter((p) => p.category === filter);
  const openProjects = filtered.filter((p) => p.is_open);
  const clientProjects = filtered.filter((p) => !p.is_open);

  const sortFn = (a: Project, b: Project) => {
    if (a.featured !== b.featured) return a.featured ? -1 : 1;
    return a.sort_order - b.sort_order;
  };

  const openSorted = [...openProjects].sort(sortFn);
  const clientSorted = [...clientProjects].sort(sortFn);
  const activeList = view === 'open' ? openSorted : clientSorted;

  return (
    <section id="projects" className="relative py-28 bg-ink-elevated">
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />

      <div className="max-w-6xl mx-auto px-6">
        {/* header */}
        <div className="mb-10">
          <p className="mono-label mb-4">// SELECTED WORK</p>
          <h2 className="font-display font-semibold text-3xl md:text-[2.5rem] text-text-primary tracking-tight mb-4">
            Projects
          </h2>
          <p className="text-text-secondary text-base md:text-lg max-w-xl leading-relaxed">
            Real products I've designed and shipped — AI tools, dashboards, automations, and business software.
          </p>
        </div>

        {/* view toggle */}
        <div className="flex items-center gap-1 p-1 rounded-glass-sm glass-card mb-8 w-fit">
          <button
            onClick={() => setView('open')}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-[13px] font-medium font-mono transition-all ${
              view === 'open'
                ? 'bg-mint text-mint-dark'
                : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            <GitFork size={14} /> Open Projects
            {openProjects.length > 0 && (
              <span className={`text-[11px] ${view === 'open' ? 'text-mint-dark/60' : 'text-text-muted'}`}>{openProjects.length}</span>
            )}
          </button>
          <button
            onClick={() => setView('client')}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-[13px] font-medium font-mono transition-all ${
              view === 'client'
                ? 'bg-warm-accent text-ink-base'
                : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            <Briefcase size={14} /> Client Work
            {clientProjects.length > 0 && (
              <span className={`text-[11px] ${view === 'client' ? 'text-ink-base/60' : 'text-text-muted'}`}>{clientProjects.length}</span>
            )}
          </button>
        </div>

        {/* description for current view */}
        <p className="text-text-muted text-[13px] mb-10 max-w-2xl leading-relaxed font-body">
          {view === 'open'
            ? 'These are projects I open-sourced. You can clone, fork, and reuse them — links and a copy/fork button are included on each.'
            : 'These are proprietary projects built for clients. They\'re shown as proof of work — no source code or links are available.'}
        </p>

        {/* category filter pills */}
        <div className="flex flex-wrap gap-2 mb-12">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setFilter(c)}
              className={`px-3.5 py-1.5 rounded-lg text-[13px] font-medium font-mono transition-all ${
                filter === c
                  ? 'bg-white/[0.08] text-text-primary border border-white/[0.12]'
                  : 'bg-transparent text-text-muted hover:text-text-secondary border border-white/[0.04]'
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        {/* empty state */}
        {activeList.length === 0 ? (
          <div className="text-center py-20 text-text-muted">
            {view === 'open' ? (
              <div>
                <GitFork size={32} className="mx-auto mb-4 text-text-muted/30" />
                <p className="font-mono text-sm">No open projects in this category yet.</p>
                <p className="text-text-muted/60 text-xs mt-2 font-body">Open projects will appear here once published.</p>
              </div>
            ) : (
              <div>
                <Briefcase size={32} className="mx-auto mb-4 text-text-muted/30" />
                <p className="font-mono text-sm">No client work in this category yet.</p>
              </div>
            )}
          </div>
        ) : view === 'open' ? (
          /* Open Projects — editorial showcases */
          <div className="space-y-20">
            {openSorted.map((p, i) => (
              <ProjectShowcase key={p.id} project={p} index={i} onClick={() => setSelected(p)} />
            ))}
          </div>
        ) : (
          /* Client Work — compact cards */
          <div className="grid sm:grid-cols-2 gap-4">
            {clientSorted.map((p, i) => (
              <LockedCard key={p.id} project={p} index={i} onClick={() => setSelected(p)} />
            ))}
          </div>
        )}
      </div>

      {selected && <ProjectModal project={selected} onClose={() => setSelected(null)} />}
    </section>
  );
}

function ProjectShowcase({ project, index, onClick }: { project: Project; index: number; onClick: () => void }) {
  const { ref, visible } = useReveal<HTMLDivElement>();
  const isReversed = index % 2 === 1;

  return (
    <div
      ref={ref}
      className={`reveal ${visible ? 'visible' : ''} grid lg:grid-cols-2 gap-8 lg:gap-12 items-center ${isReversed ? 'lg:[direction:rtl]' : ''}`}
    >
      <div
        onClick={onClick}
        className={`group relative aspect-[16/10] rounded-glass overflow-hidden border border-white/[0.06] cursor-pointer transition-all duration-300 hover:border-mint/20 hover:shadow-[0_0_40px_rgba(124,245,200,0.06)] ${isReversed ? 'lg:[direction:ltr]' : ''}`}
      >
        {project.screenshots[0] ? (
          <img src={project.screenshots[0]} alt={project.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]" />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-white/[0.02] to-transparent flex items-center justify-center">
            <span className="font-mono text-3xl text-text-muted/30">{'</>'}</span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-mint/[0.04] to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
        {project.featured && (
          <div className="absolute top-4 left-4 flex items-center gap-1 px-2.5 py-1 rounded-md bg-warm-dim border border-warm-accent/20 text-warm-accent text-[10px] font-mono font-medium uppercase tracking-wider">
            <Star size={10} fill="currentColor" /> Featured
          </div>
        )}
        {/* open badge */}
        <div className="absolute top-4 right-4 flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-mint-dim border border-mint/20 text-mint text-[10px] font-mono font-medium uppercase tracking-wider">
          <GitFork size={10} /> Open
        </div>
      </div>

      <div className={isReversed ? 'lg:[direction:ltr]' : ''}>
        <div className="font-mono text-xs text-text-muted mb-3">
          {String(index + 1).padStart(2, '0')} / {project.category.toUpperCase()}
        </div>
        <h3 className="font-display font-semibold text-2xl md:text-[1.75rem] text-text-primary mb-3 tracking-tight">
          {project.title}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-5 max-w-md">
          {project.short_description}
        </p>

        {project.business_use_case && (
          <p className="text-text-muted text-[13px] leading-relaxed mb-5 max-w-md">
            <span className="text-mint/80 font-mono text-[11px] uppercase tracking-wider">Impact: </span>
            {project.business_use_case}
          </p>
        )}

        {project.tech_stack.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-6">
            {project.tech_stack.map((t) => (
              <span key={t} className="tech-tag">{t}</span>
            ))}
          </div>
        )}

        <div className="flex items-center gap-4 flex-wrap">
          <button onClick={onClick} className="group inline-flex items-center gap-1.5 text-sm font-medium text-mint hover:text-mint-dark transition-colors">
            View Project
            <ArrowUpRight size={15} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </button>
          {project.github_link && (
            <a href={project.github_link} target="_blank" rel="noreferrer" className="group inline-flex items-center gap-1.5 text-sm font-medium text-text-secondary hover:text-text-primary transition-colors">
              <Github size={15} /> GitHub
            </a>
          )}
          {project.demo_link && (
            <a href={project.demo_link} target="_blank" rel="noreferrer" className="group inline-flex items-center gap-1.5 text-sm font-medium text-text-secondary hover:text-text-primary transition-colors">
              <ExternalLink size={15} /> Demo
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

function LockedCard({ project, index, onClick }: { project: Project; index: number; onClick: () => void }) {
  return (
    <div
      onClick={onClick}
      className="group glass-card glass-card-hover rounded-glass-sm p-6 cursor-pointer relative overflow-hidden"
      style={{ animation: `fadeIn 0.4s ease-out ${index * 60}ms` }}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="font-mono text-xs text-text-muted">
          {String(index + 1).padStart(2, '0')} / {project.category.toUpperCase()}
        </div>
        <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-warm-dim border border-warm-accent/15 text-warm-accent text-[10px] font-mono uppercase tracking-wider">
          <Lock size={9} /> Client
        </div>
      </div>

      <h3 className="font-display font-medium text-lg text-text-primary mb-2">{project.title}</h3>
      <p className="text-text-secondary text-[13px] leading-relaxed line-clamp-2 mb-4">{project.short_description}</p>

      {project.tech_stack.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {project.tech_stack.slice(0, 4).map((t) => (
            <span key={t} className="tech-tag">{t}</span>
          ))}
        </div>
      )}

      <div className="absolute top-0 right-0 w-24 h-24 bg-warm-dim rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
    </div>
  );
}

function ProjectModal({ project, onClose }: { project: Project; onClose: () => void }) {
  const copyLink = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (project.github_link) navigator.clipboard.writeText(project.github_link);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md" onClick={onClose}>
      <div
        className="relative max-w-3xl w-full max-h-[90vh] overflow-y-auto scrollbar-hide rounded-glass bg-[#0D1117]/95 backdrop-blur-2xl border border-white/[0.08] shadow-[0_30px_80px_rgba(0,0,0,0.5)]"
        onClick={(e) => e.stopPropagation()}
      >
        <button onClick={onClose} className="absolute top-4 right-4 z-10 w-9 h-9 rounded-lg bg-white/[0.06] hover:bg-white/[0.12] flex items-center justify-center text-text-primary transition-colors">
          <X size={18} />
        </button>

        {project.screenshots[0] && (
          <div className="aspect-video w-full overflow-hidden rounded-t-glass bg-white/5">
            <img src={project.screenshots[0]} alt={project.title} className={`w-full h-full object-cover ${!project.is_open ? 'opacity-70' : ''}`} />
          </div>
        )}

        <div className="p-8">
          <div className="flex items-center gap-3 mb-4 flex-wrap">
            <span className="font-mono text-[11px] text-mint uppercase tracking-wider">{project.category}</span>
            {project.featured && (
              <span className="flex items-center gap-1 text-[11px] text-warm-accent font-mono uppercase tracking-wider">
                <Star size={10} fill="currentColor" /> Featured
              </span>
            )}
            {project.is_open ? (
              <span className="flex items-center gap-1.5 text-[11px] text-mint font-mono">
                <GitFork size={11} /> Open Source
              </span>
            ) : (
              <span className="flex items-center gap-1 text-[11px] text-warm-accent font-mono">
                <Lock size={10} /> Client Work
              </span>
            )}
          </div>

          <h2 className="font-display font-semibold text-2xl text-text-primary mb-4 tracking-tight">{project.title}</h2>
          <p className="text-text-secondary leading-relaxed mb-6">{project.long_description ?? project.short_description}</p>

          {project.business_use_case && (
            <div className="mb-6 p-4 rounded-glass-sm bg-mint-dim border border-mint/15">
              <p className="font-mono text-[11px] text-mint uppercase tracking-wider mb-1.5">Business use case</p>
              <p className="text-text-secondary text-sm">{project.business_use_case}</p>
            </div>
          )}

          {/* Expanded project details */}
          {project.is_open && project.getting_started && (
            <div className="mb-6 p-4 rounded-glass-sm bg-white/[0.03] border border-white/[0.06]">
              <p className="font-mono text-[11px] text-mint uppercase tracking-wider mb-1.5 flex items-center gap-1.5"><Rocket size={12} /> Getting started</p>
              <p className="text-text-secondary text-sm whitespace-pre-line leading-relaxed">{project.getting_started}</p>
            </div>
          )}

          {project.is_open && project.marketing_strategy && (
            <div className="mb-6 p-4 rounded-glass-sm bg-white/[0.03] border border-white/[0.06]">
              <p className="font-mono text-[11px] text-mint uppercase tracking-wider mb-1.5 flex items-center gap-1.5"><TrendingUp size={12} /> Marketing strategy</p>
              <p className="text-text-secondary text-sm whitespace-pre-line leading-relaxed">{project.marketing_strategy}</p>
            </div>
          )}

          {project.is_open && project.revenue_estimate && (
            <div className="mb-6 p-4 rounded-glass-sm bg-mint-dim border border-mint/15">
              <p className="font-mono text-[11px] text-mint uppercase tracking-wider mb-1.5 flex items-center gap-1.5"><DollarSign size={12} /> Revenue estimate (6 months)</p>
              <p className="text-text-secondary text-sm">{project.revenue_estimate}</p>
            </div>
          )}

          {project.is_open && project.demo_samples.length > 0 && (
            <div className="mb-6">
              <p className="mono-label mb-3 flex items-center gap-1.5"><Play size={11} /> Demo samples</p>
              <div className="space-y-2">
                {project.demo_samples.map((d, i) => (
                  <div key={i} className="p-3 rounded-glass-sm bg-white/[0.03] border border-white/[0.06] text-text-secondary text-sm">
                    {d.startsWith('http') ? (
                      <a href={d} target="_blank" rel="noreferrer" className="text-mint hover:text-mint-dark transition-colors flex items-center gap-1.5">
                        <ExternalLink size={13} /> {d}
                      </a>
                    ) : (
                      d
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {project.tech_stack.length > 0 && (
            <div className="mb-6">
              <p className="mono-label mb-3">Tech stack</p>
              <div className="flex flex-wrap gap-2">
                {project.tech_stack.map((t) => (
                  <span key={t} className="tech-tag">{t}</span>
                ))}
              </div>
            </div>
          )}

          <div className="flex flex-wrap gap-3">
            {project.is_open && project.github_link && (
              <a href={project.github_link} target="_blank" rel="noreferrer" className="btn-glass inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium">
                <Github size={15} /> GitHub
              </a>
            )}
            {project.is_open && project.demo_link && (
              <a href={project.demo_link} target="_blank" rel="noreferrer" className="btn-mint inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold">
                <ExternalLink size={15} /> Live demo
              </a>
            )}
            {project.is_open && project.github_link && (
              <button onClick={copyLink} className="btn-glass inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium">
                <Copy size={15} /> Copy / Fork
              </button>
            )}
            {!project.is_open && (
              <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-glass-sm bg-warm-dim border border-warm-accent/15 text-warm-accent text-sm font-medium">
                <Lock size={15} /> Proprietary client work
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
