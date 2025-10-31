insert into public.tenants (id, slug, name, is_demo)
values
  ('11111111-1111-1111-1111-111111111111', 'weber', 'Weber GmbH', false),
  ('22222222-2222-2222-2222-222222222222', 'tryout', 'Tryout Demo', true)
on conflict (id) do nothing;

insert into public.domain_routes (subdomain, tenant_id)
values
  ('weber', '11111111-1111-1111-1111-111111111111'),
  ('tryout', '22222222-2222-2222-2222-222222222222'),
  ('www', '11111111-1111-1111-1111-111111111111')
on conflict (subdomain) do nothing;

insert into public.profiles (id, auth_id, email, full_name)
values
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'michael@mysight.net', 'Michael Admin')
on conflict (id) do nothing;

insert into public.memberships (tenant_id, profile_id, role)
values
  ('11111111-1111-1111-1111-111111111111', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'ADMIN'),
  ('22222222-2222-2222-2222-222222222222', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'ADMIN')
on conflict do nothing;

-- Demo Boards for tryout
insert into public.boards (id, tenant_id, name, type)
values
  ('33333333-3333-3333-3333-333333333333', '22222222-2222-2222-2222-222222222222', 'Tryout Projekte', 'PROJECT'),
  ('44444444-4444-4444-4444-444444444444', '22222222-2222-2222-2222-222222222222', 'Tryout Team', 'TEAM')
on conflict (id) do nothing;

insert into public.project_cards (id, board_id, title, priority, phase, swimlane, assignee_id, due_date)
values
  ('55555555-5555-5555-5555-555555555555', '33333333-3333-3333-3333-333333333333', 'Pilot Einführung', 'P1', 'Planung', 'User A', null, current_date + interval '14 days'),
  ('66666666-6666-6666-6666-666666666666', '33333333-3333-3333-3333-333333333333', 'Stakeholder Alignment', 'P2', 'Durchführung', 'Kategorie B', null, current_date + interval '30 days')
on conflict (id) do nothing;

insert into public.project_status (project_card_id, status, note)
values
  ('55555555-5555-5555-5555-555555555555', 'In Arbeit', 'Kickoff abgeschlossen'),
  ('66666666-6666-6666-6666-666666666666', 'Risiko', 'Abhängigkeiten klären');

insert into public.project_checklists (project_card_id, title, is_completed)
values
  ('55555555-5555-5555-5555-555555555555', 'Kickoff durchführen', true),
  ('55555555-5555-5555-5555-555555555555', 'Lieferplan finalisieren', false);

insert into public.project_escalations (id, board_id, severity, quadrant, summary)
values
  ('77777777-7777-7777-7777-777777777777', '33333333-3333-3333-3333-333333333333', 'LK', 'Prozess', 'Ressourcen knapp')
on conflict (id) do nothing;

insert into public.project_escalation_events (escalation_id, note)
values
  ('77777777-7777-7777-7777-777777777777', 'Review mit Steering Committee geplant');

insert into public.project_top_topics (board_id, title, weight)
values
  ('33333333-3333-3333-3333-333333333333', 'Qualität sichern', 3),
  ('33333333-3333-3333-3333-333333333333', 'Lieferanten onboarden', 2);

insert into public.board_attendance (board_id, week_year, week_number, present_profiles)
values
  ('33333333-3333-3333-3333-333333333333', extract(year from current_date)::int, extract(week from current_date)::int, array['aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa']);

insert into public.team_flow_lanes (id, board_id, title, position)
values
  ('88888888-8888-8888-8888-888888888888', '44444444-4444-4444-4444-444444444444', 'Speicher', 1),
  ('99999999-9999-9999-9999-999999999999', '44444444-4444-4444-4444-444444444444', 'Swimlane', 2),
  ('aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee', '44444444-4444-4444-4444-444444444444', 'Flow', 3),
  ('bbbbbbbb-cccc-dddd-eeee-ffffffffffff', '44444444-4444-4444-4444-444444444444', 'Fertig', 4)
on conflict (id) do nothing;

insert into public.team_tasks (board_id, lane_id, title, assignee, due_date, priority)
values
  ('44444444-4444-4444-4444-444444444444', '88888888-8888-8888-8888-888888888888', 'Backlog Sichtung', 'Alex', current_date + interval '5 days', 2),
  ('44444444-4444-4444-4444-444444444444', '99999999-9999-9999-9999-999999999999', 'Aktuellen Sprint planen', 'Mira', current_date + interval '2 days', 3);

-- Hinweis: Passwort für michael@mysight.net im Supabase Auth UI setzen und sofort ändern.
