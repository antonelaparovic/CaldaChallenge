import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const supabaseUrl =
  Deno.env.get("SUPABASE_URL") ?? Deno.env.get("SB_URL") ?? "";

const serviceRoleKey =
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ??
  Deno.env.get("SB_SERVICE_ROLE_KEY") ??
  "";

if (!supabaseUrl || !serviceRoleKey) {
  throw new Error("Missing SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY");
}

const supabase = createClient(supabaseUrl, serviceRoleKey);

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

type OrderItemInput = { item_id: number; quantity: number };
type CreateOrderInput = {
  user_id: string;
  recipient_name: string;
  shipping_address: string;
  items: OrderItemInput[];
};

serve(async (req: Request) => {
  try {
    if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

    if (req.method !== "POST") {
      return new Response(JSON.stringify({ error: "Method not allowed" }), {
        status: 405,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const body = (await req.json()) as CreateOrderInput;
    const { user_id, recipient_name, shipping_address, items } = body;

    if (!user_id || !recipient_name || !shipping_address || !Array.isArray(items) || items.length === 0) {
      return new Response(JSON.stringify({ error: "Missing or invalid fields" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const itemIds = items.map((it) => it.item_id);

    const { data: dbItems, error: itemsError } = await supabase
      .from("items")
      .select("id, price")
      .in("id", itemIds);

    if (itemsError || !dbItems || dbItems.length !== itemIds.length) {
      return new Response(JSON.stringify({ error: "Failed to fetch items" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const priceById = new Map<number, number>();
    for (const it of dbItems) priceById.set(it.id as number, Number(it.price));

    let orderTotal = 0;
    const orderItemsRows = items.map((it) => {
      const unitPrice = priceById.get(it.item_id)!;
      orderTotal += unitPrice * it.quantity;
      return { item_id: it.item_id, quantity: it.quantity, unit_price: unitPrice };
    });

    const { data: newOrder, error: orderError } = await supabase
      .from("orders")
      .insert({
        user_id,
        recipient_name,
        shipping_address,
        status: "pending",
        total_amount: 0,
      })
      .select()
      .single();

    if (orderError || !newOrder) {
      return new Response(JSON.stringify({ error: "Failed to create order" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const orderId = newOrder.id as number;

    const { error: orderItemsError } = await supabase
      .from("order_items")
      .insert(orderItemsRows.map((row) => ({ ...row, order_id: orderId })));

    if (orderItemsError) {
      return new Response(JSON.stringify({ error: "Failed to insert order items" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { error: updateOrderError } = await supabase
      .from("orders")
      .update({ total_amount: orderTotal })
      .eq("id", orderId);

    if (updateOrderError) {
      return new Response(JSON.stringify({ error: "Failed to update order total" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { data: userOrders, error: userOrdersError } = await supabase
      .from("orders")
      .select("id, total_amount")
      .eq("user_id", user_id);

    if (userOrdersError) {
      return new Response(JSON.stringify({ error: "Failed to calculate totals" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const otherOrdersTotal = (userOrders ?? [])
      .filter((o: { id: number }) => o.id !== orderId)
      .reduce((sum: number, o: { total_amount: number | null }) => sum + Number(o.total_amount ?? 0), 0);

    return new Response(
      JSON.stringify({ order_id: orderId, order_total: orderTotal, other_orders_total: otherOrdersTotal }),
      { status: 201, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (_e) {
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
