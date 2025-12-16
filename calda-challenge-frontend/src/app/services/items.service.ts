import { Injectable } from '@angular/core';
import { supabase } from '../supabase-client';

export type Item = {
    id: number;
    name: string;
    price: number;
    stock: number;
};

@Injectable({ providedIn: 'root' })
export class ItemsService {
    async listItems(): Promise<{ data?: Item[]; error?: string }> {
        const { data, error } = await supabase
            .from('items')
            .select('id, name, price, stock')
            .order('id', { ascending: true });

        if (error) return { error: error.message };
        return { data: (data ?? []) as Item[] };
    }
}
