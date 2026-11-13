-- FontLab cloud backup: font data only, no login. Run once in your Supabase project's SQL Editor (safe to re-run).
-- Each browser makes a random 256-bit backup code; only its SHA-256 hash is stored here. Whoever holds the code can
-- read and write that code's fonts, so treat it like a password. Nothing else (ROMs, workspaces, admin data) is used.
-- Tables are closed to every role; the browser can only call the four functions below.
create table if not exists public.fontlab_vaults (
  code_hash text primary key check (code_hash ~ '^[a-f0-9]{64}$'),
  created_at timestamptz not null default now()
);
create table if not exists public.fontlab_vault_fonts (
  code_hash text not null references public.fontlab_vaults(code_hash) on delete cascade,
  font_id text not null check (font_id ~ '^[A-Za-z0-9_-]{6,64}$'),
  name text not null check (char_length(name) between 1 and 100),
  console text not null check (char_length(console) between 1 and 20),
  width smallint not null check (width between 1 and 64),
  height smallint not null check (height between 1 and 64),
  bpp smallint not null check (bpp in (1,2,4,8)),
  glyph_count integer not null check (glyph_count between 0 and 2048),
  data jsonb not null check (jsonb_typeof(data) = 'object' and octet_length(data::text) <= 2097152),
  updated_at timestamptz not null default now(),
  primary key (code_hash, font_id)
);
alter table public.fontlab_vaults enable row level security;
alter table public.fontlab_vault_fonts enable row level security;
revoke all on public.fontlab_vaults, public.fontlab_vault_fonts from anon, authenticated;

create or replace function public.fontlab_list(p_code text)
returns table(font_id text, name text, console text, glyph_count integer, updated_at timestamptz)
language plpgsql security definer set search_path = pg_catalog as $$
declare h text;
begin
  if p_code is null or p_code !~ '^[a-f0-9]{64}$' then raise exception 'Invalid backup code'; end if;
  h := encode(sha256(convert_to(p_code,'UTF8')),'hex');
  return query select f.font_id, f.name, f.console, f.glyph_count, f.updated_at
    from public.fontlab_vault_fonts f where f.code_hash = h order by f.updated_at desc limit 1000;
end $$;

create or replace function public.fontlab_get(p_code text, p_ids text[])
returns table(font_id text, data jsonb)
language plpgsql security definer set search_path = pg_catalog as $$
declare h text;
begin
  if p_code is null or p_code !~ '^[a-f0-9]{64}$' or p_ids is null or cardinality(p_ids) > 10 then raise exception 'Invalid request'; end if;
  h := encode(sha256(convert_to(p_code,'UTF8')),'hex');
  return query select f.font_id, f.data from public.fontlab_vault_fonts f where f.code_hash = h and f.font_id = any(p_ids);
end $$;

create or replace function public.fontlab_put(p_code text, p_fonts jsonb)
returns void language plpgsql security definer set search_path = pg_catalog as $$
declare h text; r jsonb;
begin
  if p_code is null or p_code !~ '^[a-f0-9]{64}$' or jsonb_typeof(p_fonts) is distinct from 'array' or jsonb_array_length(p_fonts) > 10 then raise exception 'Invalid request'; end if;
  h := encode(sha256(convert_to(p_code,'UTF8')),'hex');
  insert into public.fontlab_vaults(code_hash) values (h) on conflict do nothing;
  perform 1 from public.fontlab_vaults v where v.code_hash = h for update;
  for r in select value from jsonb_array_elements(p_fonts) loop
    if not exists(select 1 from public.fontlab_vault_fonts f where f.code_hash = h and f.font_id = r->>'font_id')
       and (select count(*) from public.fontlab_vault_fonts f where f.code_hash = h) >= 500 then
      raise exception 'Backup limit: 500 fonts';
    end if;
    insert into public.fontlab_vault_fonts(code_hash,font_id,name,console,width,height,bpp,glyph_count,data,updated_at)
    values (h, r->>'font_id', r->>'name', r->>'console', (r->>'width')::smallint, (r->>'height')::smallint, (r->>'bpp')::smallint,
            (r->>'glyph_count')::integer, r->'data', coalesce((r->>'updated_at')::timestamptz, now()))
    on conflict (code_hash, font_id) do update set name = excluded.name, console = excluded.console, width = excluded.width,
      height = excluded.height, bpp = excluded.bpp, glyph_count = excluded.glyph_count, data = excluded.data, updated_at = excluded.updated_at;
  end loop;
end $$;

create or replace function public.fontlab_delete(p_code text, p_ids text[])
returns void language plpgsql security definer set search_path = pg_catalog as $$
declare h text;
begin
  if p_code is null or p_code !~ '^[a-f0-9]{64}$' or p_ids is null or cardinality(p_ids) > 50 then raise exception 'Invalid request'; end if;
  h := encode(sha256(convert_to(p_code,'UTF8')),'hex');
  delete from public.fontlab_vault_fonts f where f.code_hash = h and f.font_id = any(p_ids);
end $$;

revoke all on function public.fontlab_list(text), public.fontlab_get(text,text[]), public.fontlab_put(text,jsonb), public.fontlab_delete(text,text[]) from public;
grant execute on function public.fontlab_list(text), public.fontlab_get(text,text[]), public.fontlab_put(text,jsonb), public.fontlab_delete(text,text[]) to anon, authenticated;
-- The earlier email-login table (public.fontlab_fonts), if you created it, is no longer used. Drop it if you wish:
-- drop table if exists public.fontlab_fonts;
