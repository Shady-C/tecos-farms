export type PaymentStatus = "unpaid" | "prepaid" | "paid";
export type PaymentMethod = "cash" | "mobile_money" | null;
export type OrderStatus = "pending" | "confirmed" | "delivered";

export interface Order {
  id: string;
  customer_name: string;
  phone: string;
  email: string | null;
  area: string;
  kilos: number;
  price_per_kg: number;
  total_price: number;
  payment_status: PaymentStatus;
  payment_method: PaymentMethod;
  order_status: OrderStatus;
  delivery_batch: string;
  notes: string | null;
  created_at: string;
}

export interface Settings {
  id: string;
  price_per_kg: number;
  order_cutoff_day: string;
  order_cutoff_time: string;
  delivery_day: string;
}
