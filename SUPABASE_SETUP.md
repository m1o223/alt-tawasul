# Supabase setup

Run `supabase/migrations/0001_initial_content_auth_storage.sql` in the Supabase SQL editor for the project connected to Vercel.

Create the only admin user in Supabase Dashboard:

1. Open Authentication > Users.
2. Add the admin email and set the password there.
3. Copy the created user's UUID.
4. Run this SQL in Supabase SQL editor:

```sql
insert into public.admins (user_id)
values ('PASTE_ADMIN_USER_UUID_HERE')
on conflict (user_id) do nothing;
```

Do not put the admin password in GitHub, Vercel variables, or chat.

Set these Vercel environment variables for Production, Preview, and Development:

```text
SUPABASE_URL
SUPABASE_ANON_KEY
```

The app stores admin sessions in HttpOnly cookies through Vercel Functions. The browser does not receive a service role key and does not store the password.
