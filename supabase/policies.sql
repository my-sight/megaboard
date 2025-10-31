alter table public.tenants enable row level security;
alter table public.domain_routes enable row level security;
alter table public.profiles enable row level security;
alter table public.memberships enable row level security;
alter table public.boards enable row level security;
alter table public.board_members enable row level security;
alter table public.project_cards enable row level security;
alter table public.project_status enable row level security;
alter table public.project_checklists enable row level security;
alter table public.project_escalations enable row level security;
alter table public.project_escalation_events enable row level security;
alter table public.project_top_topics enable row level security;
alter table public.board_attendance enable row level security;
alter table public.team_flow_lanes enable row level security;
alter table public.team_tasks enable row level security;

create or replace function public.tenant_is_demo(_tenant uuid)
returns boolean as $$
  select is_demo from public.tenants where id = _tenant;
$$ language sql stable;

create policy "Tenants readable" on public.tenants
for select using (
  tenants.is_demo or exists (
    select 1 from public.memberships m where m.tenant_id = tenants.id and m.profile_id = auth.uid()
  )
);

create policy "Domain routes readable" on public.domain_routes
for select using (true);

create policy "Profiles self" on public.profiles
for select using (auth.uid() = profiles.id);

create policy "Profiles service insert" on public.profiles
for insert with check (true);

create policy "Membership read" on public.memberships
for select using (
  exists(select 1 from public.memberships m where m.tenant_id = memberships.tenant_id and m.profile_id = auth.uid())
);

create policy "Membership manage" on public.memberships
for all using (
  exists(select 1 from public.memberships m where m.tenant_id = memberships.tenant_id and m.profile_id = auth.uid() and m.role = 'ADMIN')
) with check (
  exists(select 1 from public.memberships m where m.tenant_id = memberships.tenant_id and m.profile_id = auth.uid() and m.role = 'ADMIN')
);

create policy "Boards read" on public.boards
for select using (
  tenant_is_demo(boards.tenant_id) or exists (
    select 1 from public.memberships m where m.tenant_id = boards.tenant_id and m.profile_id = auth.uid()
  )
);

create policy "Boards manage" on public.boards
for all using (
  exists(select 1 from public.memberships m where m.tenant_id = boards.tenant_id and m.profile_id = auth.uid() and m.role = 'ADMIN')
) with check (
  exists(select 1 from public.memberships m where m.tenant_id = boards.tenant_id and m.profile_id = auth.uid() and m.role = 'ADMIN')
);

create policy "Board members read" on public.board_members
for select using (
  tenant_is_demo((select tenant_id from public.boards where id = board_members.board_id)) or exists (
    select 1 from public.memberships m
    join public.boards b on b.id = board_members.board_id
    where m.tenant_id = b.tenant_id and m.profile_id = auth.uid()
  )
);

create policy "Board members manage" on public.board_members
for all using (
  exists(
    select 1 from public.memberships m
    join public.boards b on b.id = board_members.board_id
    where m.tenant_id = b.tenant_id and m.profile_id = auth.uid() and m.role = 'ADMIN'
  )
) with check (
  exists(
    select 1 from public.memberships m
    join public.boards b on b.id = board_members.board_id
    where m.tenant_id = b.tenant_id and m.profile_id = auth.uid() and m.role = 'ADMIN'
  )
);

create policy "Project cards read" on public.project_cards
for select using (
  tenant_is_demo((select tenant_id from public.boards where id = project_cards.board_id)) or exists (
    select 1 from public.memberships m
    join public.boards b on b.id = project_cards.board_id
    where m.tenant_id = b.tenant_id and m.profile_id = auth.uid()
  )
);

create policy "Project cards write" on public.project_cards
for all using (
  not tenant_is_demo((select tenant_id from public.boards where id = project_cards.board_id)) and exists (
    select 1 from public.memberships m
    join public.boards b on b.id = project_cards.board_id
    where m.tenant_id = b.tenant_id and m.profile_id = auth.uid() and m.role in ('ADMIN','USER')
  )
) with check (
  not tenant_is_demo((select tenant_id from public.boards where id = project_cards.board_id)) and exists (
    select 1 from public.memberships m
    join public.boards b on b.id = project_cards.board_id
    where m.tenant_id = b.tenant_id and m.profile_id = auth.uid() and m.role in ('ADMIN','USER')
  )
);

create policy "Project status read" on public.project_status
for select using (
  tenant_is_demo((select tenant_id from public.boards b join public.project_cards pc on pc.board_id = b.id where pc.id = project_status.project_card_id)) or exists (
    select 1 from public.memberships m
    join public.project_cards pc on pc.id = project_status.project_card_id
    join public.boards b on b.id = pc.board_id
    where m.tenant_id = b.tenant_id and m.profile_id = auth.uid()
  )
);

create policy "Project status write" on public.project_status
for all using (
  not tenant_is_demo((select tenant_id from public.boards b join public.project_cards pc on pc.board_id = b.id where pc.id = project_status.project_card_id)) and exists (
    select 1 from public.memberships m
    join public.project_cards pc on pc.id = project_status.project_card_id
    join public.boards b on b.id = pc.board_id
    where m.tenant_id = b.tenant_id and m.profile_id = auth.uid() and m.role in ('ADMIN','USER')
  )
) with check (
  not tenant_is_demo((select tenant_id from public.boards b join public.project_cards pc on pc.board_id = b.id where pc.id = project_status.project_card_id)) and exists (
    select 1 from public.memberships m
    join public.project_cards pc on pc.id = project_status.project_card_id
    join public.boards b on b.id = pc.board_id
    where m.tenant_id = b.tenant_id and m.profile_id = auth.uid() and m.role in ('ADMIN','USER')
  )
);

create policy "Project checklists read" on public.project_checklists
for select using (
  tenant_is_demo((select tenant_id from public.boards b join public.project_cards pc on pc.board_id = b.id where pc.id = project_checklists.project_card_id)) or exists (
    select 1 from public.memberships m
    join public.project_cards pc on pc.id = project_checklists.project_card_id
    join public.boards b on b.id = pc.board_id
    where m.tenant_id = b.tenant_id and m.profile_id = auth.uid()
  )
);

create policy "Project checklists write" on public.project_checklists
for all using (
  not tenant_is_demo((select tenant_id from public.boards b join public.project_cards pc on pc.board_id = b.id where pc.id = project_checklists.project_card_id)) and exists (
    select 1 from public.memberships m
    join public.project_cards pc on pc.id = project_checklists.project_card_id
    join public.boards b on b.id = pc.board_id
    where m.tenant_id = b.tenant_id and m.profile_id = auth.uid() and m.role in ('ADMIN','USER')
  )
) with check (
  not tenant_is_demo((select tenant_id from public.boards b join public.project_cards pc on pc.board_id = b.id where pc.id = project_checklists.project_card_id)) and exists (
    select 1 from public.memberships m
    join public.project_cards pc on pc.id = project_checklists.project_card_id
    join public.boards b on b.id = pc.board_id
    where m.tenant_id = b.tenant_id and m.profile_id = auth.uid() and m.role in ('ADMIN','USER')
  )
);

create policy "Project escalations read" on public.project_escalations
for select using (
  tenant_is_demo((select tenant_id from public.boards where id = project_escalations.board_id)) or exists (
    select 1 from public.memberships m
    join public.boards b on b.id = project_escalations.board_id
    where m.tenant_id = b.tenant_id and m.profile_id = auth.uid()
  )
);

create policy "Project escalations write" on public.project_escalations
for all using (
  not tenant_is_demo((select tenant_id from public.boards where id = project_escalations.board_id)) and exists (
    select 1 from public.memberships m
    join public.boards b on b.id = project_escalations.board_id
    where m.tenant_id = b.tenant_id and m.profile_id = auth.uid() and m.role in ('ADMIN','USER')
  )
) with check (
  not tenant_is_demo((select tenant_id from public.boards where id = project_escalations.board_id)) and exists (
    select 1 from public.memberships m
    join public.boards b on b.id = project_escalations.board_id
    where m.tenant_id = b.tenant_id and m.profile_id = auth.uid() and m.role in ('ADMIN','USER')
  )
);

create policy "Project escalation events read" on public.project_escalation_events
for select using (
  tenant_is_demo((select b.tenant_id from public.project_escalations pe join public.boards b on b.id = pe.board_id where pe.id = project_escalation_events.escalation_id)) or exists (
    select 1 from public.memberships m
    join public.project_escalations pe on pe.id = project_escalation_events.escalation_id
    join public.boards b on b.id = pe.board_id
    where m.tenant_id = b.tenant_id and m.profile_id = auth.uid()
  )
);

create policy "Project escalation events write" on public.project_escalation_events
for all using (
  not tenant_is_demo((select b.tenant_id from public.project_escalations pe join public.boards b on b.id = pe.board_id where pe.id = project_escalation_events.escalation_id)) and exists (
    select 1 from public.memberships m
    join public.project_escalations pe on pe.id = project_escalation_events.escalation_id
    join public.boards b on b.id = pe.board_id
    where m.tenant_id = b.tenant_id and m.profile_id = auth.uid() and m.role in ('ADMIN','USER')
  )
) with check (
  not tenant_is_demo((select b.tenant_id from public.project_escalations pe join public.boards b on b.id = pe.board_id where pe.id = project_escalation_events.escalation_id)) and exists (
    select 1 from public.memberships m
    join public.project_escalations pe on pe.id = project_escalation_events.escalation_id
    join public.boards b on b.id = pe.board_id
    where m.tenant_id = b.tenant_id and m.profile_id = auth.uid() and m.role in ('ADMIN','USER')
  )
);

create policy "Project top topics read" on public.project_top_topics
for select using (
  tenant_is_demo((select tenant_id from public.boards where id = project_top_topics.board_id)) or exists (
    select 1 from public.memberships m
    join public.boards b on b.id = project_top_topics.board_id
    where m.tenant_id = b.tenant_id and m.profile_id = auth.uid()
  )
);

create policy "Project top topics write" on public.project_top_topics
for all using (
  not tenant_is_demo((select tenant_id from public.boards where id = project_top_topics.board_id)) and exists (
    select 1 from public.memberships m
    join public.boards b on b.id = project_top_topics.board_id
    where m.tenant_id = b.tenant_id and m.profile_id = auth.uid() and m.role in ('ADMIN','USER')
  )
) with check (
  not tenant_is_demo((select tenant_id from public.boards where id = project_top_topics.board_id)) and exists (
    select 1 from public.memberships m
    join public.boards b on b.id = project_top_topics.board_id
    where m.tenant_id = b.tenant_id and m.profile_id = auth.uid() and m.role in ('ADMIN','USER')
  )
);

create policy "Board attendance read" on public.board_attendance
for select using (
  tenant_is_demo((select tenant_id from public.boards where id = board_attendance.board_id)) or exists (
    select 1 from public.memberships m
    join public.boards b on b.id = board_attendance.board_id
    where m.tenant_id = b.tenant_id and m.profile_id = auth.uid()
  )
);

create policy "Board attendance write" on public.board_attendance
for all using (
  not tenant_is_demo((select tenant_id from public.boards where id = board_attendance.board_id)) and exists (
    select 1 from public.memberships m
    join public.boards b on b.id = board_attendance.board_id
    where m.tenant_id = b.tenant_id and m.profile_id = auth.uid() and m.role in ('ADMIN','USER')
  )
) with check (
  not tenant_is_demo((select tenant_id from public.boards where id = board_attendance.board_id)) and exists (
    select 1 from public.memberships m
    join public.boards b on b.id = board_attendance.board_id
    where m.tenant_id = b.tenant_id and m.profile_id = auth.uid() and m.role in ('ADMIN','USER')
  )
);

create policy "Team flow lanes read" on public.team_flow_lanes
for select using (
  tenant_is_demo((select tenant_id from public.boards where id = team_flow_lanes.board_id)) or exists (
    select 1 from public.memberships m
    join public.boards b on b.id = team_flow_lanes.board_id
    where m.tenant_id = b.tenant_id and m.profile_id = auth.uid()
  )
);

create policy "Team flow lanes write" on public.team_flow_lanes
for all using (
  not tenant_is_demo((select tenant_id from public.boards where id = team_flow_lanes.board_id)) and exists (
    select 1 from public.memberships m
    join public.boards b on b.id = team_flow_lanes.board_id
    where m.tenant_id = b.tenant_id and m.profile_id = auth.uid() and m.role in ('ADMIN','USER')
  )
) with check (
  not tenant_is_demo((select tenant_id from public.boards where id = team_flow_lanes.board_id)) and exists (
    select 1 from public.memberships m
    join public.boards b on b.id = team_flow_lanes.board_id
    where m.tenant_id = b.tenant_id and m.profile_id = auth.uid() and m.role in ('ADMIN','USER')
  )
);

create policy "Team tasks read" on public.team_tasks
for select using (
  tenant_is_demo((select tenant_id from public.boards where id = team_tasks.board_id)) or exists (
    select 1 from public.memberships m
    join public.boards b on b.id = team_tasks.board_id
    where m.tenant_id = b.tenant_id and m.profile_id = auth.uid()
  )
);

create policy "Team tasks write" on public.team_tasks
for all using (
  not tenant_is_demo((select tenant_id from public.boards where id = team_tasks.board_id)) and exists (
    select 1 from public.memberships m
    join public.boards b on b.id = team_tasks.board_id
    where m.tenant_id = b.tenant_id and m.profile_id = auth.uid() and m.role in ('ADMIN','USER')
  )
) with check (
  not tenant_is_demo((select tenant_id from public.boards where id = team_tasks.board_id)) and exists (
    select 1 from public.memberships m
    join public.boards b on b.id = team_tasks.board_id
    where m.tenant_id = b.tenant_id and m.profile_id = auth.uid() and m.role in ('ADMIN','USER')
  )
);

-- Storage Hinweis: Bucket project_images anlegen. Pfadstruktur {tenant}/{board}/{card} verwenden.
