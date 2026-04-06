create extension if not exists "pgcrypto";

create table if not exists users (
  id uuid primary key,
  email text not null unique,
  full_name text,
  created_at timestamptz not null default now()
);

create table if not exists style_presets (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  description text not null,
  rules_json jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists projects (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users(id) on delete cascade,
  title text not null,
  business_type text not null,
  audience text not null,
  page_goal text not null,
  style_preset text not null,
  desired_sections jsonb not null default '[]'::jsonb,
  notes text,
  current_version_id uuid,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists versions (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references projects(id) on delete cascade,
  version_number integer not null,
  prompt_input text not null,
  structured_output jsonb not null,
  preview_code_or_render_config jsonb not null,
  export_prompt text not null,
  scorecard jsonb not null,
  is_approved boolean not null default false,
  refinement_instruction text,
  created_at timestamptz not null default now(),
  unique (project_id, version_number)
);

alter table if exists projects
  drop constraint if exists projects_current_version_fk;

alter table projects
  add constraint projects_current_version_fk
  foreign key (current_version_id) references versions(id) on delete set null;

create index if not exists projects_user_id_idx on projects (user_id, updated_at desc);
create index if not exists versions_project_id_idx on versions (project_id, version_number desc);

alter table users enable row level security;
alter table style_presets enable row level security;
alter table projects enable row level security;
alter table versions enable row level security;

drop policy if exists "Users can view their own profile" on users;
create policy "Users can view their own profile"
on users for select
using (auth.uid() = id);

drop policy if exists "Users can manage their own profile" on users;
create policy "Users can manage their own profile"
on users for all
using (auth.uid() = id)
with check (auth.uid() = id);

drop policy if exists "Authenticated users can view style presets" on style_presets;
create policy "Authenticated users can view style presets"
on style_presets for select
using (auth.role() = 'authenticated');

drop policy if exists "Users can view their own projects" on projects;
create policy "Users can view their own projects"
on projects for select
using (auth.uid() = user_id);

drop policy if exists "Users can insert their own projects" on projects;
create policy "Users can insert their own projects"
on projects for insert
with check (auth.uid() = user_id);

drop policy if exists "Users can update their own projects" on projects;
create policy "Users can update their own projects"
on projects for update
using (auth.uid() = user_id);

drop policy if exists "Users can delete their own projects" on projects;
create policy "Users can delete their own projects"
on projects for delete
using (auth.uid() = user_id);

drop policy if exists "Users can view versions for their own projects" on versions;
create policy "Users can view versions for their own projects"
on versions for select
using (
  exists (
    select 1
    from projects
    where projects.id = versions.project_id
      and projects.user_id = auth.uid()
  )
);

drop policy if exists "Users can insert versions for their own projects" on versions;
create policy "Users can insert versions for their own projects"
on versions for insert
with check (
  exists (
    select 1
    from projects
    where projects.id = versions.project_id
      and projects.user_id = auth.uid()
  )
);

drop policy if exists "Users can update versions for their own projects" on versions;
create policy "Users can update versions for their own projects"
on versions for update
using (
  exists (
    select 1
    from projects
    where projects.id = versions.project_id
      and projects.user_id = auth.uid()
  )
);
