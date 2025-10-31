-- mysight Supabase Schema
create extension if not exists "uuid-ossp";
create extension if not exists pgcrypto;

create table public.tenants (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  is_demo boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.domain_routes (
  id uuid primary key default gen_random_uuid(),
  subdomain text not null unique,
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  created_at timestamptz not null default now()
);

create table public.profiles (
  id uuid primary key default gen_random_uuid(),
  auth_id uuid not null unique,
  email text not null unique,
  full_name text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create type public.membership_role as enum ('ADMIN','USER','GUEST');
create type public.board_type as enum ('PROJECT','TEAM');

create table public.memberships (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  profile_id uuid not null references public.profiles(id) on delete cascade,
  role public.membership_role not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (tenant_id, profile_id)
);

create table public.boards (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  name text not null,
  type public.board_type not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.board_members (
  id uuid primary key default gen_random_uuid(),
  board_id uuid not null references public.boards(id) on delete cascade,
  profile_id uuid not null references public.profiles(id) on delete cascade,
  role text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (board_id, profile_id)
);

create table public.project_cards (
  id uuid primary key default gen_random_uuid(),
  board_id uuid not null references public.boards(id) on delete cascade,
  title text not null,
  priority text not null,
  phase text not null,
  swimlane text,
  assignee_id uuid references public.profiles(id),
  due_date date,
  size text default 'M',
  archived_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.project_status (
  id uuid primary key default gen_random_uuid(),
  project_card_id uuid not null references public.project_cards(id) on delete cascade,
  status text not null,
  note text,
  created_at timestamptz not null default now()
);

create table public.project_checklists (
  id uuid primary key default gen_random_uuid(),
  project_card_id uuid not null references public.project_cards(id) on delete cascade,
  title text not null,
  is_completed boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.project_escalations (
  id uuid primary key default gen_random_uuid(),
  board_id uuid not null references public.boards(id) on delete cascade,
  severity text not null,
  quadrant text not null,
  summary text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.project_escalation_events (
  id uuid primary key default gen_random_uuid(),
  escalation_id uuid not null references public.project_escalations(id) on delete cascade,
  note text not null,
  created_at timestamptz not null default now(),
  created_by uuid references public.profiles(id)
);

create table public.project_top_topics (
  id uuid primary key default gen_random_uuid(),
  board_id uuid not null references public.boards(id) on delete cascade,
  title text not null,
  weight integer not null default 1,
  created_at timestamptz not null default now()
);

create table public.board_attendance (
  id uuid primary key default gen_random_uuid(),
  board_id uuid not null references public.boards(id) on delete cascade,
  week_year integer not null,
  week_number integer not null,
  present_profiles uuid[] not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (board_id, week_year, week_number)
);

create table public.team_flow_lanes (
  id uuid primary key default gen_random_uuid(),
  board_id uuid not null references public.boards(id) on delete cascade,
  title text not null,
  position integer not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (board_id, position)
);

create table public.team_tasks (
  id uuid primary key default gen_random_uuid(),
  board_id uuid not null references public.boards(id) on delete cascade,
  lane_id uuid references public.team_flow_lanes(id) on delete set null,
  title text not null,
  assignee text,
  due_date date,
  priority integer not null default 0,
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger set_updated_at_for_tenants before update on public.tenants
for each row execute function public.set_updated_at();
create trigger set_updated_at_for_profiles before update on public.profiles
for each row execute function public.set_updated_at();
create trigger set_updated_at_for_memberships before update on public.memberships
for each row execute function public.set_updated_at();
create trigger set_updated_at_for_boards before update on public.boards
for each row execute function public.set_updated_at();
create trigger set_updated_at_for_board_members before update on public.board_members
for each row execute function public.set_updated_at();
create trigger set_updated_at_for_project_cards before update on public.project_cards
for each row execute function public.set_updated_at();
create trigger set_updated_at_for_project_checklists before update on public.project_checklists
for each row execute function public.set_updated_at();
create trigger set_updated_at_for_project_escalations before update on public.project_escalations
for each row execute function public.set_updated_at();
create trigger set_updated_at_for_board_attendance before update on public.board_attendance
for each row execute function public.set_updated_at();
create trigger set_updated_at_for_team_flow_lanes before update on public.team_flow_lanes
for each row execute function public.set_updated_at();
create trigger set_updated_at_for_team_tasks before update on public.team_tasks
for each row execute function public.set_updated_at();

create view public.vw_project_phase_counters as
select
  b.tenant_id,
  pc.board_id,
  pc.phase,
  count(*) as card_count
from public.project_cards pc
join public.boards b on b.id = pc.board_id
where pc.archived_at is null
group by b.tenant_id, pc.board_id, pc.phase;

