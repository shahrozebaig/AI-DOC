-- 1. Create the base table
create table if not exists face_auth (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users(id) on delete cascade not null unique,
  email text not null unique,
  face_encoding float8[] not null,
  created_at timestamp with time zone default now()
);

-- 2. Enable Row Level Security
alter table face_auth enable row level security;

-- 3. Safety: Drop old policy if it exists
drop policy if exists "Users can view their own face data" on face_auth;
drop policy if exists "Users can manage their own face data" on face_auth;

-- 4. Create full access policy (CRUD)
create policy "Users can manage their own face data"
on face_auth
for all -- This covers SELECT, INSERT, UPDATE, and DELETE
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

-- 5. Fix for user deletion (Cascade Constraint)
alter table face_auth 
drop constraint if exists face_auth_user_id_fkey;

alter table face_auth 
add constraint face_auth_user_id_fkey 
foreign key (user_id) 
references auth.users(id) 
on delete cascade;