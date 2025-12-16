create or replace view public.order_with_items_view as
select
  o.id          as order_id,
  o.user_id     as user_id,
  o.recipient_name,
  o.shipping_address,
  o.status,
  o.total_amount,
  o.created_at,
  o.updated_at,
  coalesce(
    json_agg(
      json_build_object(
        'order_item_id', oi.id,
        'item_id',       i.id,
        'name',          i.name,
        'description',   i.description,
        'quantity',      oi.quantity,
        'unit_price',    oi.unit_price
      )
    ) filter (where oi.id is not null),
    '[]'::json
  ) as items
from public.orders o
left join public.order_items oi on oi.order_id = o.id
left join public.items       i  on i.id = oi.item_id
group by
  o.id,
  o.user_id,
  o.recipient_name,
  o.shipping_address,
  o.status,
  o.total_amount,
  o.created_at,
  o.updated_at;
