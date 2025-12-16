--user metadata
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- items
create table if not exists public.items (
  id bigint generated always as identity primary key,
  name text not null,
  description text,
  price numeric(10,2) not null check (price >= 0),
  stock integer not null default 0 check (stock >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- orders
create table if not exists public.orders (
  id bigint generated always as identity primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  recipient_name text not null,
  shipping_address text not null,
  status text not null default 'pending',
  total_amount numeric(10,2) not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- order items
create table if not exists public.order_items (
  id bigint generated always as identity primary key,
  order_id bigint not null references public.orders(id) on delete cascade,
  item_id bigint not null references public.items(id),
  quantity integer not null check (quantity > 0),
  unit_price numeric(10,2) not null check (unit_price >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (order_id, item_id)
);

-- item history
create table if not exists public.item_history (
  id bigint generated always as identity primary key,
  item_id bigint not null references public.items(id) on delete cascade,
  operation text not null check (operation in ('INSERT','UPDATE','DELETE')),
  changed_by uuid references auth.users(id),
  old_data jsonb,
  new_data jsonb,
  created_at timestamptz not null default now()
);

-- order archive (for CRON job)
create table if not exists public.order_totals_archive (
  id bigint generated always as identity primary key,
  archived_at timestamptz not null default now(),
  range_start timestamptz,
  range_end timestamptz,
  total_sum numeric(12,2) not null check (total_sum >= 0)
);
