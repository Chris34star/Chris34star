/*
# Add project detail fields: getting started, marketing, revenue, demo samples

## What this does
Adds four new optional columns to the `projects` table so that when a visitor
clicks a project and it expands, they can see:
1. How to get the project started on a specific platform (getting_started)
2. How to market the project (marketing_strategy)
3. Estimated recurring revenue in 6 months (revenue_estimate)
4. Demo samples — links or descriptions of sample demos (demo_samples, text array)

## New Columns on `projects`
- `getting_started` (text) — step-by-step instructions for getting the project running on a platform
- `marketing_strategy` (text) — how to market and promote the project
- `revenue_estimate` (text) — estimated recurring revenue over 6 months
- `demo_samples` (text[], default '{}') — list of demo sample descriptions or URLs

## Security
No security changes needed — the existing RLS policies on `projects` already
cover all columns (public read, admin write). The new columns inherit those policies.
*/

ALTER TABLE projects
  ADD COLUMN IF NOT EXISTS getting_started text,
  ADD COLUMN IF NOT EXISTS marketing_strategy text,
  ADD COLUMN IF NOT EXISTS revenue_estimate text,
  ADD COLUMN IF NOT EXISTS demo_samples text[] DEFAULT '{}';
