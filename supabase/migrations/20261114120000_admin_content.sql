-- Home page content edited from /admin.
--
-- Anyone may read published rows; only admins may write. An admin is a user
-- whose confirmed email is listed in private.admins.

-- Admin allowlist ---------------------------------------------------------------

create schema if not exists private;

create table private.admins (
  email text primary key check (email = lower(email))
);

insert into private.admins (email) values ('amraa1212@gmail.com');

-- SECURITY DEFINER so it can read auth.users and private.admins, which the
-- calling roles cannot. It lives in the unexposed private schema and only
-- answers for the caller's own uid.
create function private.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from auth.users u
    join private.admins a on a.email = lower(u.email)
    where u.id = (select auth.uid())
      and u.email_confirmed_at is not null
  );
$$;

revoke all on function private.is_admin() from public;
grant usage on schema private to anon, authenticated;
grant execute on function private.is_admin() to anon, authenticated;

-- Lets the app ask "am I an admin?" through the Data API.
create function public.is_admin()
returns boolean
language sql
stable
security invoker
set search_path = ''
as $$
  select private.is_admin();
$$;

revoke all on function public.is_admin() from public, anon;
grant execute on function public.is_admin() to authenticated;

create function private.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- Tables ----------------------------------------------------------------------

-- "Одоогийн урамшуулал" slider. A card shows its tag at the top, or the quote
-- when the tag is empty.
create table public.offers (
  id uuid primary key default gen_random_uuid(),
  position integer not null default 0,
  published boolean not null default true,
  image_url text not null,
  image_alt text not null default '',
  tag text not null default '',
  quote text not null default '',
  title text not null,
  subtitle text not null default '',
  logo text not null default '/assets/icons/placeholder-logo-1.svg',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Full-width cards with copy, a button and an image.
create table public.ctas (
  id uuid primary key default gen_random_uuid(),
  position integer not null default 0,
  published boolean not null default true,
  title text not null,
  body text not null default '',
  link_url text not null default '#',
  image_url text not null,
  image_alt text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Charger counts in the "Миний байршил" section.
create table public.charging_stats (
  id uuid primary key default gen_random_uuid(),
  position integer not null default 0,
  published boolean not null default true,
  value text not null,
  label text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index offers_position_idx on public.offers (position);
create index ctas_position_idx on public.ctas (position);
create index charging_stats_position_idx on public.charging_stats (position);

create trigger offers_set_updated_at before update on public.offers
  for each row execute function private.set_updated_at();
create trigger ctas_set_updated_at before update on public.ctas
  for each row execute function private.set_updated_at();
create trigger charging_stats_set_updated_at before update on public.charging_stats
  for each row execute function private.set_updated_at();

-- Data API access: grant exactly what the policies below allow.
revoke all on public.offers, public.ctas, public.charging_stats from anon, authenticated;
grant select on public.offers, public.ctas, public.charging_stats to anon, authenticated;
grant insert, update, delete on public.offers, public.ctas, public.charging_stats to authenticated;

-- Row level security -------------------------------------------------------------

alter table public.offers enable row level security;
alter table public.ctas enable row level security;
alter table public.charging_stats enable row level security;

create policy "Published offers are public; admins see all"
  on public.offers for select to anon, authenticated
  using (published or (select private.is_admin()));
create policy "Admins can add offers"
  on public.offers for insert to authenticated
  with check ((select private.is_admin()));
create policy "Admins can edit offers"
  on public.offers for update to authenticated
  using ((select private.is_admin()))
  with check ((select private.is_admin()));
create policy "Admins can delete offers"
  on public.offers for delete to authenticated
  using ((select private.is_admin()));

create policy "Published CTAs are public; admins see all"
  on public.ctas for select to anon, authenticated
  using (published or (select private.is_admin()));
create policy "Admins can add CTAs"
  on public.ctas for insert to authenticated
  with check ((select private.is_admin()));
create policy "Admins can edit CTAs"
  on public.ctas for update to authenticated
  using ((select private.is_admin()))
  with check ((select private.is_admin()));
create policy "Admins can delete CTAs"
  on public.ctas for delete to authenticated
  using ((select private.is_admin()));

create policy "Published stats are public; admins see all"
  on public.charging_stats for select to anon, authenticated
  using (published or (select private.is_admin()));
create policy "Admins can add stats"
  on public.charging_stats for insert to authenticated
  with check ((select private.is_admin()));
create policy "Admins can edit stats"
  on public.charging_stats for update to authenticated
  using ((select private.is_admin()))
  with check ((select private.is_admin()));
create policy "Admins can delete stats"
  on public.charging_stats for delete to authenticated
  using ((select private.is_admin()));

-- Image uploads ------------------------------------------------------------------

-- Public bucket: anyone can fetch a file by its public URL; only admins write.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'media',
  'media',
  true,
  5242880,
  array['image/jpeg', 'image/png', 'image/webp', 'image/avif', 'image/gif']
)
on conflict (id) do nothing;

create policy "Admins can list media"
  on storage.objects for select to authenticated
  using (bucket_id = 'media' and (select private.is_admin()));
create policy "Admins can upload media"
  on storage.objects for insert to authenticated
  with check (bucket_id = 'media' and (select private.is_admin()));
create policy "Admins can replace media"
  on storage.objects for update to authenticated
  using (bucket_id = 'media' and (select private.is_admin()))
  with check (bucket_id = 'media' and (select private.is_admin()));
create policy "Admins can delete media"
  on storage.objects for delete to authenticated
  using (bucket_id = 'media' and (select private.is_admin()));

-- Current site content ---------------------------------------------------------

insert into public.offers (position, image_url, image_alt, tag, title, subtitle, logo) values
  (10, '/assets/images/offer-model-y-l.jpg', 'Цагаан Model Y L ойн дундах замаар явж байна',
   'Long Wheelbase Midsize SUV', 'Model Y L Premium', 'Starting at $61,9902', '/assets/icons/placeholder-logo-1.svg'),
  (20, '/assets/images/offer-model-y.jpg', 'Цагаан Model Y уулын замаар явж байна',
   'Midsize SUV', 'Model Y', 'Lease From $499/mo', '/assets/icons/placeholder-logo-2.svg');

-- Placeholder testimonials, as in the original design.
insert into public.offers (position, image_url, quote, title, subtitle, logo)
select
  20 + n * 10,
  '/assets/images/offer-placeholder.png',
  '"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique. Duis cursus, mi quis viverra ornare, eros dolor interdum nulla, ut commodo diam libero vitae erat."',
  'Name Surname',
  'Position, Company name',
  case when n % 2 = 1 then '/assets/icons/placeholder-logo-1.svg' else '/assets/icons/placeholder-logo-2.svg' end
from generate_series(1, 4) as n;

insert into public.ctas (position, title, body, link_url, image_url, image_alt) values
  (10, 'Санал болгох', 'Tesla автомашины загваруудтай танилцаарай', '#',
   '/assets/images/cta-recommend.jpg', 'Cybertruck, Model Y болон Model 3 зэрэгцэн зогсож байна'),
  (20, '2026 оны Хувьцаа эзэмшигчдийн ээлжит хурал',
   'Tesla-ийн ирээдүй таны гарт. Таны санал яагаад чухал болохыг мэдэж аваарай.', '#',
   '/assets/images/cta-shareholder.jpg', 'Roadster-ийн арын төрх, харанхуй дэвсгэр дээр');

insert into public.charging_stats (position, value, label) values
  (10, '39,653', 'Түргэн цэнэглэгч'),
  (20, '401', 'Суурин цэнэглэх төв');
