import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Validators, FormArray, FormBuilder, ReactiveFormsModule, FormGroup } from '@angular/forms';
import { OrderService } from 'src/app/services/order.service';
import { supabase } from 'src/app/supabase-client';

// helper types
type CatalogItem = {
  id: number;
  name: string;
  price: number;
  stock: number;
};

type OrderAggregateRow = {
  id: number;
  user_id: string;
  recipient_name: string;
  shipping_address: string;
  status: string;
  total_amount: number | null;
  created_at: string;
  items: Array<{
    item_id: number;
    quantity: number;
    unit_price: number | null;
    name?: string;
  }>;
};

@Component({
  selector: 'app-order',
  standalone: true,
  imports: [
    CommonModule, 
    ReactiveFormsModule
  ],
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.css']
})
export class OrderComponent {
  loading = false;
  errorMessage = '';
  successMessage = '';
  responseData: any = null;

  loadingItems = false;
  loadingHistory = false;

  itemsCatalog: CatalogItem[] = [];
  history: OrderAggregateRow[] = [];

  form = this.fb.group({
    recipient_name: ['', Validators.required],
    shipping_address: ['', Validators.required],
    items: this.fb.array<FormGroup>([this.createItemGroup()]),
  });

  constructor(private fb: FormBuilder, private orderService: OrderService) { }

  async ngOnInit() {
    await this.loadItems();
    await this.loadHistory();

    const { data } = await supabase.auth.getUser();
    console.log('Logged user:', data.user?.email);

  }

  private createItemGroup(): FormGroup {
    return this.fb.group({
      item_id: [null, Validators.required],
      quantity: [1, [Validators.required, Validators.min(1)]],
    });
  }

  get itemsControls(): FormArray<FormGroup> {
    return this.form.get('items') as FormArray<FormGroup>;
  }

  addItemRow() {
    this.itemsControls.push(this.createItemGroup());
  }

  removeItemRow(index: number) {
    if (this.itemsControls.length > 1) {
      this.itemsControls.removeAt(index);
    }
  }

  private clearMessages() {
    this.errorMessage = '';
    this.successMessage = '';
    this.responseData = null;
  }

  public getItemLabel(itemId: number): string {
    const it = this.itemsCatalog.find((x) => x.id === itemId);
    return it ? it.name : `Item ${itemId}`;
  }

  private async loadItems() {
    this.loadingItems = true;
    this.errorMessage = '';

    const { data, error } = await supabase
      .from('items')
      .select('id, name, price, stock')
      .order('id', { ascending: true });

    this.loadingItems = false;

    if (error) {
      this.errorMessage = error.message;
      return;
    }

    this.itemsCatalog = (data ?? []) as CatalogItem[];
  }

  private async loadHistory() {
    this.loadingHistory = true;
    this.errorMessage = '';

    const { data, error } = await supabase
      .from('order_with_items_view')
      .select('*')
      .order('created_at', { ascending: false });

    this.loadingHistory = false;

    if (error) {
      this.errorMessage = error.message;
      return;
    }

    this.history = (data ?? []) as OrderAggregateRow[];
  }

  async submit() {
    if (this.form.invalid || this.loading) return;

    this.clearMessages();
    this.loading = true;

    const { recipient_name, shipping_address, items } = this.form.value;

    const parsedItems =
      (items ?? []).map((it: any) => ({
        item_id: Number(it.item_id),
        quantity: Number(it.quantity),
      })) || [];

    const result = await this.orderService.createOrder(
      recipient_name!,
      shipping_address!,
      parsedItems
    );

    this.loading = false;

    if (result.error) {
      this.errorMessage = result.error;
      return;
    }

    this.responseData = result.data;
    this.successMessage = 'Order created successfully.';
    await this.loadHistory();
  }
}
