/*
# Rebrand + members + email migration

## 1. Modified Tables

- `projects`: add column `is_open` (boolean, default true). Controls whether a
  project appears in the "Open Projects" section (with GitHub/demo links and a
  copy/fork CTA) or in the "In Progress / Locked" section (no links, locked badge).
  Defaults to true so existing projects remain open.
- `site_content`: add column `profile_photo` (text, nullable). URL for the hero
  profile photo shown on the homepage. Managed from the admin homepage-text editor.

## 2. New Tables

- `members` — students/members managed from the admin dashboard.
  - id (uuid, pk)
  - name (text, not null)
  - email (text, not null)
  - phone (text) — WhatsApp / contact number
  - subscription_plan (text, default 'free') — free | basic | pro | etc.
  - subscription_status (text, default 'trial') — active | expired | trial
  - notes (text) — activity / progress notes
  - joined_at (date, default current date)
  - created_at, updated_at

## 3. Security (RLS)

- `members`: admin-only CRUD (authenticated only). Public visitors cannot see
  member data. This is private admin data.
- `projects` and `site_content` policies are unchanged — existing public read
  + admin write policies already cover the new columns.

## 4. Notes

- The `is_open` column defaults to true so all existing projects remain visible
  in the Open Projects section without any data backfill.
- The `profile_photo` column is nullable so the hero renders gracefully with a
  placeholder when no photo URL has been set.
- Members are managed manually by the admin — there is no self-sign-up flow.
*/

-- Add is_open to projects
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'projects' AND column_name = 'is_open') THEN
    ALTER TABLE projects ADD COLUMN is_open boolean NOT NULL DEFAULT true;
  END IF;
END $$;

-- Add profile_photo to site_content
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'site_content' AND column_name = 'profile_photo') THEN
    ALTER TABLE site_content ADD COLUMN profile_photo text;
  END IF;
END $$;

-- Create members table
CREATE TABLE IF NOT EXISTS members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  phone text,
  subscription_plan text NOT NULL DEFAULT 'free',
  subscription_status text NOT NULL DEFAULT 'trial',
  notes text,
  joined_at date NOT NULL DEFAULT CURRENT_DATE,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE members ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "admin_read_members" ON members;
CREATE POLICY "admin_read_members" ON members FOR SELECT
  TO authenticated USING (true);

DROP POLICY IF EXISTS "admin_insert_members" ON members;
CREATE POLICY "admin_insert_members" ON members FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "admin_update_members" ON members;
CREATE POLICY "admin_update_members" ON members FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "admin_delete_members" ON members;
CREATE POLICY "admin_delete_members" ON members FOR DELETE
  TO authenticated USING (true);

-- updated_at trigger for members
DROP TRIGGER IF EXISTS members_set_updated_at ON members;
CREATE TRIGGER members_set_updated_at BEFORE UPDATE ON members
FOR EACH ROW EXECUTE FUNCTION set_updated_at();
