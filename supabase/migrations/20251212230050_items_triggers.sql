-- updated_at trigger

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_items_set_updated_at on public.items;

create trigger trg_items_set_updated_at
before update on public.items
for each row
execute function public.set_updated_at();


-- item_history trigger

create or replace function public.log_item_history()
returns trigger
language plpgsql
security definer
as $$
begin
  if (tg_op = 'INSERT') then
    insert into public.item_history (
      item_id,
      operation,
      changed_by,
      old_data,
      new_data
    )
    values (
      new.id,
      'INSERT',
      auth.uid(),
      null,
      to_jsonb(new)
    );

    return new;

  elsif (tg_op = 'UPDATE') then
    insert into public.item_history (
      item_id,
      operation,
      changed_by,
      old_data,
      new_data
    )
    values (
      new.id,
      'UPDATE',
      auth.uid(),
      to_jsonb(old),
      to_jsonb(new)
    );

    return new;

  elsif (tg_op = 'DELETE') then
    insert into public.item_history (
      item_id,
      operation,
      changed_by,
      old_data,
      new_data
    )
    values (
      old.id,
      'DELETE',
      auth.uid(),
      to_jsonb(old),
      null
    );

    return old;
  end if;

  return null;
end;
$$;

drop trigger if exists trg_items_history on public.items;

create trigger trg_items_history
after insert or update or delete on public.items
for each row
execute function public.log_item_history();

drop trigger if exists trg_orders_set_updated_at on public.orders;
create trigger trg_orders_set_updated_at
before update on public.orders
for each row
execute function public.set_updated_at();

drop trigger if exists trg_order_items_set_updated_at on public.order_items;
create trigger trg_order_items_set_updated_at
before update on public.order_items
for each row
execute function public.set_updated_at();

drop trigger if exists trg_profiles_set_updated_at on public.profiles;
create trigger trg_profiles_set_updated_at
before update on public.profiles
for each row
execute function public.set_updated_at();
