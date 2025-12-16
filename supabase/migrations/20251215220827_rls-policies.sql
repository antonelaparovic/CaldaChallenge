alter table public.items enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.profiles enable row level security;
alter table public.item_history enable row level security;
alter table public.order_totals_archive enable row level security;

-- ITEMS

-- all authenticated users can read items
create policy "items_select_authenticated"
on public.items
for select
to authenticated
using (true);

-- no direct modification of items by users
create policy "items_deny_modify_authenticated"
on public.items
for all
to authenticated
using (false)
with check (false);

-- PROFILES

-- user can see only their own profile
create policy "profiles_select_own"
on public.profiles
for select
to authenticated
using (auth.uid() = id);

-- user can update only their own profile
create policy "profiles_update_own"
on public.profiles
for update
to authenticated
using (auth.uid() = id)
with check (auth.uid() = id);

-- ORDERS

-- user sees only their own orders
create policy "orders_select_owner"
on public.orders
for select
to authenticated
using (auth.uid() = user_id);

-- user can insert only their own orders
create policy "orders_insert_owner"
on public.orders
for insert
to authenticated
with check (auth.uid() = user_id);

-- user can update only their own orders
create policy "orders_update_owner"
on public.orders
for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

-- user can delete only their own orders
create policy "orders_delete_owner"
on public.orders
for delete
to authenticated
using (auth.uid() = user_id);

-- ORDER ITEMS

-- user sees order_items only for their own orders
create policy "order_items_select_owner"
on public.order_items
for select
to authenticated
using (
  exists (
    select 1
    from public.orders o
    where o.id = order_id
      and o.user_id = auth.uid()
  )
);

-- user can insert items only into their own orders
create policy "order_items_insert_owner"
on public.order_items
for insert
to authenticated
with check (
  exists (
    select 1
    from public.orders o
    where o.id = order_id
      and o.user_id = auth.uid()
  )
);

-- user can update items only for their own orders
create policy "order_items_update_owner"
on public.order_items
for update
to authenticated
using (
  exists (
    select 1
    from public.orders o
    where o.id = order_id
      and o.user_id = auth.uid()
  )
)
with check (
  exists (
    select 1
    from public.orders o
    where o.id = order_id
      and o.user_id = auth.uid()
  )
);

-- user can delete items only for their own orders
create policy "order_items_delete_owner"
on public.order_items
for delete
to authenticated
using (
  exists (
    select 1
    from public.orders o
    where o.id = order_id
      and o.user_id = auth.uid()
  )
);

-- ADMIN (audit log) / ARCHIVE TABLES

-- deny all access for authenticated users
create policy "item_history_deny_authenticated"
on public.item_history
for all
to authenticated
using (false)
with check (false);

create policy "order_totals_archive_deny_authenticated"
on public.order_totals_archive
for all
to authenticated
using (false)
with check (false);

-- VIEW: order_with_items

alter view public.order_with_items_view
set (security_invoker = true);

-- reload schema so PostgREST picks it up
notify pgrst, 'reload schema';
