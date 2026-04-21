-- 003_v2_galerie_images.sql
-- Stores metadata for each image in the “Galerie”
create table galerie_images (
  id uuid primary key default uuid_generate_v4(),
  annuaire_id uuid references annuaire(id) on delete cascade,
  storage_path text not null,
  title text,
  description text,
  uploaded_at timestamp with time zone default now(),
  created_by uuid references auth.users(id)
);

-- Enable Row Level Security
alter table galerie_images enable row level security;

-- Policies – only authenticated users can insert; all can read; only admins can modify/delete
create policy "Allow insert for authenticated" on galerie_images for insert
  using (auth.role() <> 'anonymous');
create policy "Allow read for all" on galerie_images for select
  using (true);
create policy "Allow modify for admins" on galerie_images for update, delete
  using (auth.role() = 'admin');
