-- ============================================================
-- Baseline schema: customers, addresses, orders, settings
-- Replaces all previous incremental migrations (squashed)
-- ============================================================

-- Enums
CREATE TYPE payment_status AS ENUM ('unpaid', 'prepaid', 'paid');
CREATE TYPE payment_method AS ENUM ('cash', 'mobile_money');
CREATE TYPE order_status AS ENUM ('pending', 'confirmed', 'delivered');

-- Customers: one record per unique phone number, upserted on each order
CREATE TABLE customers (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name       text NOT NULL,
  phone      text NOT NULL,
  email      text,
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT customers_phone_unique UNIQUE (phone)
);

CREATE INDEX idx_customers_phone ON customers (phone);

-- Addresses: append-only; old orders always reference their original address
CREATE TABLE addresses (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id     uuid NOT NULL REFERENCES customers (id),
  street_address  text NOT NULL,
  address_line_2  text,
  landmark        text,
  is_default      boolean NOT NULL DEFAULT true,
  created_at      timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_addresses_customer_id ON addresses (customer_id);

-- Orders: lean, references customer + address via FKs; price snapshot retained
CREATE TABLE orders (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id     uuid NOT NULL REFERENCES customers (id),
  address_id      uuid NOT NULL REFERENCES addresses (id),
  kilos           decimal NOT NULL CHECK (kilos > 0),
  price_per_kg    decimal NOT NULL,
  total_price     decimal NOT NULL,
  payment_status  payment_status NOT NULL DEFAULT 'unpaid',
  payment_method  payment_method,
  order_status    order_status NOT NULL DEFAULT 'pending',
  delivery_date   date NOT NULL,
  notes           text,
  created_at      timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_orders_customer_id    ON orders (customer_id);
CREATE INDEX idx_orders_address_id     ON orders (address_id);
CREATE INDEX idx_orders_delivery_date  ON orders (delivery_date DESC);
CREATE INDEX idx_orders_created_at     ON orders (created_at DESC);
CREATE INDEX idx_orders_payment_status ON orders (payment_status);

-- Settings: single-row config table
CREATE TABLE settings (
  id                       uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  price_per_kg             decimal NOT NULL,
  min_kg                   decimal NOT NULL DEFAULT 1,
  order_cutoff_day         text NOT NULL,
  order_cutoff_time        time NOT NULL,
  delivery_day             text NOT NULL,
  mobile_money_details     jsonb,
  enabled_payment_methods  jsonb NOT NULL DEFAULT '["cash","mobile_money"]'::jsonb
);

-- ============================================================
-- Row Level Security
-- All tables use service-role access via API routes; deny direct access
-- ============================================================

ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders    ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings  ENABLE ROW LEVEL SECURITY;

CREATE POLICY "No direct access to customers"
  ON customers FOR ALL
  USING (false)
  WITH CHECK (false);

CREATE POLICY "No direct access to addresses"
  ON addresses FOR ALL
  USING (false)
  WITH CHECK (false);

CREATE POLICY "No direct access to orders"
  ON orders FOR ALL
  USING (false)
  WITH CHECK (false);

CREATE POLICY "Authenticated users can read settings"
  ON settings FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can update settings"
  ON settings FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Anon cannot access settings"
  ON settings FOR ALL
  TO anon
  USING (false)
  WITH CHECK (false);
