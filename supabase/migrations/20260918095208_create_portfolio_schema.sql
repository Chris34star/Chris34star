/*
# Portfolio website schema (Phase 1)

Creates the tables that back a personal portfolio site for an AI & Data Engineer:
projects, services, site content (hero/services/contact text), and contact form
submissions. The public site reads everything; only the authenticated admin can
write. Contact messages can be inserted by anyone but only read/deleted by admin.

## 1. New Tables

- `projects` — portfolio projects shown on the public site.
  - id (uuid, pk)
  - title (text, not null)
  - category (text, not null) — one of: AI projects, Data engineering, Dashboards, Automation, Web apps, Business software
  - short_description (text, not null)
  - long_description (text)
  - tech_stack (text[]) — list of technologies
  - github_link (text)
  - demo_link (text)
  - business_use_case (text)
  - status (text, default 'active') — active | in-progress | archived
  - featured (boolean, default false)
  - sort_order (int, default 0)
  - screenshots (text[]) — image URLs
  - created_at, updated_at
- `services` — capability cards shown on the public site (editable from admin).
  - id (uuid, pk)
  - icon (text) — lucide icon name
  - title (text, not null)
  - description (text)
  - sort_order (int, default 0)
  - created_at, updated_at
- `site_content` — single-row table holding editable homepage text (hero, subheadline, CTAs, build-like-me intro).
  - id (int, pk, always 1)
  - hero_headline (text)
  - hero_subheadline (text)
  - cta_projects_label (text)
  - cta_projects_link (text)
  - cta_contact_label (text)
  - cta_contact_link (text)
  - build_intro (text)
  - build_link_label (text)
  - build_link_url (text)
  - contact_email (text)
  - contact_whatsapp (text)
  - contact_github (text)
  - contact_linkedin (text)
  - updated_at
- `contact_messages` — submissions from the public contact form.
  - id (uuid, pk)
  - name (text, not null)
  - email (text, not null)
  - message (text, not null)
  - read (boolean, default false)
  - created_at

## 2. Security (RLS)

- `projects`: public read (anon + authenticated), admin write (authenticated only).
- `services`: public read, admin write.
- `site_content`: public read, admin write.
- `contact_messages`: anyone can insert (public contact form); only authenticated admin can read/delete/update.

## 3. Notes

- The admin is any authenticated Supabase user (email/password). No per-row ownership
  is needed because this is a single-admin portfolio; every authenticated user is the
  site owner. Public visitors (anon) can read published content and submit messages.
- A single site_content row (id = 1) is seeded so the homepage renders without admin setup.
*/

-- projects
CREATE TABLE IF NOT EXISTS projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  category text NOT NULL,
  short_description text NOT NULL,
  long_description text,
  tech_stack text[] DEFAULT '{}',
  github_link text,
  demo_link text,
  business_use_case text,
  status text NOT NULL DEFAULT 'active',
  featured boolean NOT NULL DEFAULT false,
  sort_order int NOT NULL DEFAULT 0,
  screenshots text[] DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_projects" ON projects;
CREATE POLICY "public_read_projects" ON projects FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "admin_insert_projects" ON projects;
CREATE POLICY "admin_insert_projects" ON projects FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "admin_update_projects" ON projects;
CREATE POLICY "admin_update_projects" ON projects FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "admin_delete_projects" ON projects;
CREATE POLICY "admin_delete_projects" ON projects FOR DELETE
  TO authenticated USING (true);

-- services
CREATE TABLE IF NOT EXISTS services (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  icon text NOT NULL DEFAULT 'Code2',
  title text NOT NULL,
  description text,
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE services ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_services" ON services;
CREATE POLICY "public_read_services" ON services FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "admin_insert_services" ON services;
CREATE POLICY "admin_insert_services" ON services FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "admin_update_services" ON services;
CREATE POLICY "admin_update_services" ON services FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "admin_delete_services" ON services;
CREATE POLICY "admin_delete_services" ON services FOR DELETE
  TO authenticated USING (true);

-- site_content (single row)
CREATE TABLE IF NOT EXISTS site_content (
  id int PRIMARY KEY DEFAULT 1,
  hero_headline text NOT NULL DEFAULT 'AI & Data Engineer building smart systems, dashboards, automations, and business tools.',
  hero_subheadline text NOT NULL DEFAULT 'I design and ship real products — from AI tools to business dashboards — and share how I build them for anyone who wants to build the same way.',
  cta_projects_label text NOT NULL DEFAULT 'View My Projects',
  cta_projects_link text NOT NULL DEFAULT '#projects',
  cta_contact_label text NOT NULL DEFAULT 'Contact Me',
  cta_contact_link text NOT NULL DEFAULT '#contact',
  build_intro text NOT NULL DEFAULT 'I document how I build these projects. Anyone curious can learn from it — GitHub starter projects, CodeAI deployment notes, and occasional training.',
  build_link_label text NOT NULL DEFAULT 'Explore the resources',
  build_link_url text NOT NULL DEFAULT '#',
  contact_email text NOT NULL DEFAULT 'hello@example.com',
  contact_whatsapp text NOT NULL DEFAULT '',
  contact_github text NOT NULL DEFAULT '',
  contact_linkedin text NOT NULL DEFAULT '',
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE site_content ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_site_content" ON site_content;
CREATE POLICY "public_read_site_content" ON site_content FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "admin_update_site_content" ON site_content;
CREATE POLICY "admin_update_site_content" ON site_content FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

-- contact_messages
CREATE TABLE IF NOT EXISTS contact_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  message text NOT NULL,
  read boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_insert_contact_messages" ON contact_messages;
CREATE POLICY "public_insert_contact_messages" ON contact_messages FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "admin_read_contact_messages" ON contact_messages;
CREATE POLICY "admin_read_contact_messages" ON contact_messages FOR SELECT
  TO authenticated USING (true);

DROP POLICY IF EXISTS "admin_update_contact_messages" ON contact_messages;
CREATE POLICY "admin_update_contact_messages" ON contact_messages FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "admin_delete_contact_messages" ON contact_messages;
CREATE POLICY "admin_delete_contact_messages" ON contact_messages FOR DELETE
  TO authenticated USING (true);

-- Seed the single site_content row if it does not exist.
INSERT INTO site_content (id)
SELECT 1
WHERE NOT EXISTS (SELECT 1 FROM site_content WHERE id = 1);

-- Seed default services if none exist.
INSERT INTO services (icon, title, description, sort_order)
SELECT * FROM (VALUES
  ('Bot', 'AI Automation', 'Automate repetitive work with AI agents, workflows, and intelligent pipelines.', 1),
  ('BarChart3', 'Data Dashboards', 'Interactive dashboards that turn raw data into clear, actionable insight.', 2),
  ('Database', 'Data Engineering', 'Pipelines, warehousing, and modeling to make data reliable and ready to use.', 3),
  ('Building2', 'Business Software Development', 'Custom internal tools and business software built to fit how your team works.', 4),
  ('Github', 'GitHub Project Customization', 'Tailored GitHub project setups, templates, and automation for your repos.', 5),
  ('Lightbulb', 'Consulting for Startups & Small Businesses', 'Practical advice on where AI and data can create real value for your business.', 6)
) AS v(icon, title, description, sort_order)
WHERE NOT EXISTS (SELECT 1 FROM services);

-- updated_at trigger helper
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS projects_set_updated_at ON projects;
CREATE TRIGGER projects_set_updated_at BEFORE UPDATE ON projects
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS services_set_updated_at ON services;
CREATE TRIGGER services_set_updated_at BEFORE UPDATE ON services
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS site_content_set_updated_at ON site_content;
CREATE TRIGGER site_content_set_updated_at BEFORE UPDATE ON site_content
FOR EACH ROW EXECUTE FUNCTION set_updated_at();
