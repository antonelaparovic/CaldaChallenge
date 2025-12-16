insert into public.orders (user_id, recipient_name, shipping_address, status, total_amount)
values
  (
    (select id from auth.users where email = 'antonelaparovic@gmail.com'),
    'Antonela Parovic',
    'Ulica 1, Ljubljana',
    'pending',
    5.40
  ),
  (
    (select id from auth.users where email = 'antonelaparovic@gmail.com'),
    'Antonela Parovic',
    'Ulica 1, Ljubljana',
    'pending',
    10.90
  ),
  (
    (select id from auth.users where email = 'antonelaparovic@gmail.com'),
    'Antonela Parovic',
    'Ulica 1, Ljubljana',
    'pending',
    10.70
  );

-- order items
insert into public.order_items (order_id, item_id, quantity, unit_price)
values
  (
    1,
    (select id from public.items where name = 'Coca Cola'),
    2,
    1.80
  ),
  (
    1,
    (select id from public.items where name = 'Fanta'),
    1,
    1.80
  );

insert into public.order_items (order_id, item_id, quantity, unit_price)
values
  (
    2,
    (select id from public.items where name = 'Lavazza'),
    1,
    4.50
  ),
  (
    2,
    (select id from public.items where name = 'Cedevita'),
    2,
    3.20
  );

insert into public.order_items (order_id, item_id, quantity, unit_price)
values
  (
    3,
    (select id from public.items where name = 'Cedevita'),
    1,
    3.20
  ),
  (
    3,
    (select id from public.items where name = 'Nestea'),
    1,
    2.10
  ),
  (
    3,
    (select id from public.items where name = 'Coca Cola'),
    3,
    1.80
  );
