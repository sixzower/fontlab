-- FontLab: font data only. Run once in your Supabase project's SQL Editor.
-- Safe to re-run. It does not touch (or depend on) any older RomTranslate table.
-- Auth > Providers > Email must be enabled. Turn off "Confirm email" if you want instant sign-up.
create table if not exists public.fontlab_fonts (
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  font_id text not null check (font_id ~ '^[A-Za-z0-9_-]{6,64}$'),
  name text not null check (char_length(name) between 1 and 100),
  console text not null check (char_length(console) between 1 and 20),
  width smallint not null check (width between 1 and 64),
  height smallint not null check (height between 1 and 64),
  bpp smallint not null check (bpp in (1,2,4,8)),
  glyph_count integer not null check (glyph_count between 0 and 2048),
  data jsonb not null check (jsonb_typeof(data) = 'object' and octet_length(data::text) <= 2097152),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (user_id, font_id)
);
create index if not exists fontlab_fonts_user_updated on public.fontlab_fonts (user_id, updated_at desc);
alter table public.fontlab_fonts enable row level security;
revoke all on public.fontlab_fonts from anon;
grant select, insert, update, delete on public.fontlab_fonts to authenticated;
drop policy if exists fontlab_fonts_select on public.fontlab_fonts;
create policy fontlab_fonts_select on public.fontlab_fonts for select to authenticated using ((select auth.uid()) = user_id);
drop policy if exists fontlab_fonts_insert on public.fontlab_fonts;
create policy fontlab_fonts_insert on public.fontlab_fonts for insert to authenticated with check ((select auth.uid()) = user_id);
drop policy if exists fontlab_fonts_update on public.fontlab_fonts;
create policy fontlab_fonts_update on public.fontlab_fonts for update to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
drop policy if exists fontlab_fonts_delete on public.fontlab_fonts;
create policy fontlab_fonts_delete on public.fontlab_fonts for delete to authenticated using ((select auth.uid()) = user_id);
