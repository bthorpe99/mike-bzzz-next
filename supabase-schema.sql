-- Run this in your Supabase SQL editor

-- Profiles table (extends auth.users)
create table if not exists public.profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  email text,
  full_name text,
  stripe_customer_id text unique,
  created_at timestamptz default now()
);

-- Memberships table
create table if not exists public.memberships (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade unique,
  stripe_subscription_id text unique,
  stripe_customer_id text,
  status text check (status in ('active', 'inactive', 'cancelled', 'past_due')) default 'inactive',
  current_period_end timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, email, full_name)
  values (new.id, new.email, new.raw_user_meta_data->>'full_name');
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- RLS policies
alter table public.profiles enable row level security;
alter table public.memberships enable row level security;

create policy "Users can view own profile" on public.profiles for select using (auth.uid() = id);
create policy "Users can update own profile" on public.profiles for update using (auth.uid() = id);
create policy "Service role can manage profiles" on public.profiles for all using (auth.role() = 'service_role');

create policy "Users can view own membership" on public.memberships for select using (auth.uid() = user_id);
create policy "Service role can manage memberships" on public.memberships for all using (auth.role() = 'service_role');
