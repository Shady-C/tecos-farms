export type PaymentStatus = "unpaid" | "prepaid" | "paid";
export type PaymentMethod = "cash" | "mobile_money" | null;
export type OrderStatus = "pending" | "confirmed" | "delivered";

export interface Customer {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  created_at: string;
}

export interface Address {
  id: string;
  customer_id: string;
  street_address: string;
  address_line_2: string | null;
  landmark: string | null;
  is_default: boolean;
  created_at: string;
}

export interface Order {
  id: string;
  customer_id: string;
  address_id: string;
  customer: Customer;
  address: Address;
  kilos: number;
  price_per_kg: number;
  total_price: number;
  payment_status: PaymentStatus;
  payment_method: PaymentMethod;
  order_status: OrderStatus;
  delivery_date: string;
  notes: string | null;
  created_at: string;
}

export interface MobileMoneyDetails {
  number: string;
  name: string;
  instructions: string;
}

export interface Settings {
  id: string;
  price_per_kg: number;
  min_kg: number;
  order_cutoff_day: string;
  order_cutoff_time: string;
  delivery_day: string;
  mobile_money_details: MobileMoneyDetails | null;
  enabled_payment_methods: string[];
}
