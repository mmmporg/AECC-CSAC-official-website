-- 005_v2_galerie_table.sql
-- Table contenant les métadonnées des images de la galerie
create table galerie (
  id uuid primary key default uuid_generate_v4(),
  storage_path text not null,                        -- path in the bucket (e.g. galerie_images/abcd.jpg)
  title text,
  description text,
  uploaded_by uuid references auth.users(id),
  uploaded_at timestamp with time zone default now(),
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- indexes for efficient queries
create index on galerie (uploaded_by);
create index on galerie (uploaded_at desc);
