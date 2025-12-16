import { Injectable } from '@angular/core';
import { supabase } from '../supabase-client';

export type OrderAggregateRow = {
    id: number;
    user_id: string;
    recipient_name: string;
    shipping_address: string;
    status: string;
    total_amount: number;
    created_at: string;
    items: Array<{
        item_id: number;
        quantity: number;
        unit_price: number;
        name?: string;
    }>;
};

@Injectable({ providedIn: 'root' })
export class OrdersHistoryService {
    async listMyOrders(): Promise<{ data?: OrderAggregateRow[]; error?: string }> {
        const { data, error } = await supabase
            .from('order_aggregates_view')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) return { error: error.message };
        return { data: (data ?? []) as OrderAggregateRow[] };
    }
}
