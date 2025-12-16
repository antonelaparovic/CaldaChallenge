-- item_history cannot have FK to items, otherwise DELETE cannot be done
alter table public.item_history
drop constraint if exists item_history_item_id_fkey;

