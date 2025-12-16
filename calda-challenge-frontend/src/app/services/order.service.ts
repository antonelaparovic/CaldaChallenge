import { Injectable } from '@angular/core';
import { supabase } from '../supabase-client';
import { AuthService } from './auth.service';

export interface OrderItemInput {
    item_id: number;
    quantity: number;
}

export interface CreateOrderResponse {
    order_id: number;
    order_total: number;
    other_orders_total: number;
}

@Injectable({
    providedIn: 'root',
})
export class OrderService {
    constructor(private authService: AuthService) { }

    async createOrder(
        recipientName: string,
        shippingAddress: string,
        items: OrderItemInput[]
    ): Promise<{ data?: CreateOrderResponse; error?: string }> {
        const user = this.authService.currentUser;

        if (!user) {
            return { error: 'User not authenticated' };
        }

        // jwt in Authorization header by default
        const { data, error } = await supabase.functions.invoke('create-order', {
            body: {
                user_id: user.id, // uuid from auth.users
                recipient_name: recipientName,
                shipping_address: shippingAddress,
                items,
            },
        });

        if (error) {
            return { error: error.message };
        }

        return { data: data as CreateOrderResponse };
    }
}
