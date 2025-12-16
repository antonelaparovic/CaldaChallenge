create extension if not exists pg_cron;

drop table if exists public.order_totals_archive;

create table public.order_totals_archive (
  id bigint generated always as identity primary key,
  total_amount numeric not null,
  archived_at timestamptz not null default now()
);

-- archive + delete
create or replace function public.archive_and_delete_old_orders()
returns void
language sql
security definer
as $$
  with deleted_orders as (
    delete from public.orders
    where created_at < now() - interval '7 days'
    returning total_amount
  )
  insert into public.order_totals_archive (total_amount)
  select total_amount
  from deleted_orders;
$$;

-- cron (2am every day)
select
  cron.schedule(
    'archive_old_orders',
    '0 2 * * *',
    $$select public.archive_and_delete_old_orders();$$
  );
