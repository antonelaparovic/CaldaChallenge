truncate table public.order_items restart identity cascade;
truncate table public.orders restart identity cascade;
truncate table public.items restart identity cascade;
truncate table public.item_history restart identity cascade;
truncate table public.order_totals_archive restart identity cascade;

insert into public.items (name, description, price, stock)
values
  ('Cedevita', 'Instant vitamin drink powder, orange flavour, 1 pack', 3.20, 50),
  ('Nestea', 'Iced tea with peach flavour, 0.5L bottle', 2.10, 80),
  ('Lavazza', 'Ground Lavazza coffee, 250g pack', 4.50, 40),
  ('Coca Cola', 'Carbonated soft drink, 0.5L bottle', 1.80, 100),
  ('Fanta', 'Carbonated soft drink with orange flavour, 0.5L bottle', 1.80, 90);
