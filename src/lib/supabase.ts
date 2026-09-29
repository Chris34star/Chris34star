import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});

export type Project = {
  id: string;
  title: string;
  category: string;
  short_description: string;
  long_description: string | null;
  tech_stack: string[];
  github_link: string | null;
  demo_link: string | null;
  business_use_case: string | null;
  getting_started: string | null;
  marketing_strategy: string | null;
  revenue_estimate: string | null;
  demo_samples: string[];
  status: string;
  featured: boolean;
  is_open: boolean;
  sort_order: number;
  screenshots: string[];
  created_at: string;
  updated_at: string;
};

export type Service = {
  id: string;
  icon: string;
  title: string;
  description: string | null;
  sort_order: number;
  created_at: string;
  updated_at: string;
};

export type SiteContent = {
  id: number;
  hero_headline: string;
  hero_subheadline: string;
  cta_projects_label: string;
  cta_projects_link: string;
  cta_contact_label: string;
  cta_contact_link: string;
  build_intro: string;
  build_link_label: string;
  build_link_url: string;
  contact_email: string;
  contact_whatsapp: string;
  contact_github: string;
  contact_linkedin: string;
  profile_photo: string | null;
  updated_at: string;
};

export type ContactMessage = {
  id: string;
  name: string;
  email: string;
  message: string;
  read: boolean;
  created_at: string;
};

export type Member = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  subscription_plan: string;
  subscription_status: string;
  notes: string | null;
  joined_at: string;
  created_at: string;
  updated_at: string;
};

export const PROJECT_CATEGORIES = [
  'AI projects',
  'Data engineering',
  'Dashboards',
  'Automation',
  'Web apps',
  'Business software',
] as const;

export const PROJECT_STATUSES = ['active', 'in-progress', 'archived'] as const;

export const SUBSCRIPTION_PLANS = ['free', 'basic', 'pro', 'enterprise'] as const;
export const SUBSCRIPTION_STATUSES = ['active', 'expired', 'trial'] as const;
