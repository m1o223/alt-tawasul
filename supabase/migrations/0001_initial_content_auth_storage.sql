create type content_status as enum ('draft', 'published');
create type content_kind as enum ('title', 'text', 'button', 'image');

create table public.admins (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

create table public.pages (
  id text primary key,
  slug text not null unique,
  title text not null,
  status content_status not null default 'draft',
  display_order integer not null default 0,
  updated_at timestamptz not null default now()
);

create table public.content_blocks (
  id uuid primary key default gen_random_uuid(),
  page_id text not null references public.pages(id) on delete cascade,
  block_key text not null,
  kind content_kind not null,
  label text,
  text_value text,
  url text,
  display_order integer not null default 0,
  status content_status not null default 'draft',
  updated_at timestamptz not null default now(),
  unique (page_id, block_key)
);

create table public.media_items (
  id uuid primary key default gen_random_uuid(),
  page_id text references public.pages(id) on delete set null,
  storage_path text not null unique,
  alt_text text,
  description text,
  display_order integer not null default 0,
  status content_status not null default 'draft',
  updated_at timestamptz not null default now()
);

alter table public.admins enable row level security;
alter table public.pages enable row level security;
alter table public.content_blocks enable row level security;
alter table public.media_items enable row level security;

create policy "admins can read own admin row"
on public.admins for select
to authenticated
using ((select auth.uid()) = user_id);

create policy "published pages are readable"
on public.pages for select
to anon, authenticated
using (status = 'published');

create policy "admins can read all pages"
on public.pages for select
to authenticated
using (exists (select 1 from public.admins where user_id = (select auth.uid())));

create policy "admins can write pages"
on public.pages for all
to authenticated
using (exists (select 1 from public.admins where user_id = (select auth.uid())))
with check (exists (select 1 from public.admins where user_id = (select auth.uid())));

create policy "published content is readable"
on public.content_blocks for select
to anon, authenticated
using (status = 'published');

create policy "admins can read all content"
on public.content_blocks for select
to authenticated
using (exists (select 1 from public.admins where user_id = (select auth.uid())));

create policy "admins can write content"
on public.content_blocks for all
to authenticated
using (exists (select 1 from public.admins where user_id = (select auth.uid())))
with check (exists (select 1 from public.admins where user_id = (select auth.uid())));

create policy "published media is readable"
on public.media_items for select
to anon, authenticated
using (status = 'published');

create policy "admins can read all media"
on public.media_items for select
to authenticated
using (exists (select 1 from public.admins where user_id = (select auth.uid())));

create policy "admins can write media"
on public.media_items for all
to authenticated
using (exists (select 1 from public.admins where user_id = (select auth.uid())))
with check (exists (select 1 from public.admins where user_id = (select auth.uid())));

insert into public.pages (id, slug, title, status, display_order)
values
  ('home', '/', 'التواصل البديل', 'published', 1),
  ('photos', '/photos', 'الصور', 'published', 2),
  ('about', '/about', 'من نحن', 'published', 3)
on conflict (id) do nothing;

insert into public.content_blocks (page_id, block_key, kind, label, text_value, url, display_order, status)
values
  ('home', 'home_title', 'title', 'عنوان الصفحة الرئيسية', 'التواصل البديل', null, 1, 'published'),
  ('home', 'home_subtitle', 'text', 'عنوان تجريبي قصير', 'مساحة تجريبية لعرض الصور والأفكار.', null, 2, 'published'),
  ('home', 'home_body', 'text', 'فقرة الصفحة الرئيسية', 'هذا نموذج أولي بسيط لمراجعة شكل الموقع على الجوال. المحتوى الحالي مؤقت وسيتم استبداله لاحقًا.', null, 3, 'published'),
  ('home', 'browse_photos_button', 'button', 'زر تصفّح الصور', 'تصفّح الصور', '/photos', 4, 'published'),
  ('photos', 'photos_intro', 'text', 'مقدمة الصور', 'معرض تجريبي بأحجام مختلفة لمراجعة شكل العرض على الجوال.', null, 1, 'published'),
  ('about', 'about_body', 'text', 'تعريف من نحن', 'التواصل البديل موقع تجريبي قيد التصميم، هدفه عرض تجربة بسيطة ونظيفة تناسب تصفح الجوال قبل إضافة المحتوى الحقيقي.', null, 1, 'published')
on conflict (page_id, block_key) do nothing;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'site-images',
  'site-images',
  true,
  5242880,
  array['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
on conflict (id) do update
set public = excluded.public,
    file_size_limit = excluded.file_size_limit,
    allowed_mime_types = excluded.allowed_mime_types;

create policy "published site images are readable"
on storage.objects for select
to anon, authenticated
using (
  bucket_id = 'site-images'
  and (
    exists (
      select 1 from public.media_items
      where storage_path = storage.objects.name
      and status = 'published'
    )
    or exists (
      select 1 from public.admins
      where user_id = (select auth.uid())
    )
  )
);

create policy "admins can upload site images"
on storage.objects for insert
to authenticated
with check (
  bucket_id = 'site-images'
  and exists (
    select 1 from public.admins
    where user_id = (select auth.uid())
  )
);

create policy "admins can update site images"
on storage.objects for update
to authenticated
using (
  bucket_id = 'site-images'
  and exists (
    select 1 from public.admins
    where user_id = (select auth.uid())
  )
)
with check (
  bucket_id = 'site-images'
  and exists (
    select 1 from public.admins
    where user_id = (select auth.uid())
  )
);

create policy "admins can delete site images"
on storage.objects for delete
to authenticated
using (
  bucket_id = 'site-images'
  and exists (
    select 1 from public.admins
    where user_id = (select auth.uid())
  )
);
