-- Enums for orders
CREATE TYPE payment_status AS ENUM ('unpaid', 'prepaid', 'paid');
CREATE TYPE payment_method AS ENUM ('cash', 'mobile_money');
CREATE TYPE order_status AS ENUM ('pending', 'confirmed', 'delivered');

-- Orders table
CREATE TABLE orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_name text NOT NULL,
  phone text NOT NULL,
  area text NOT NULL,
  kilos decimal NOT NULL CHECK (kilos > 0),
  price_per_kg decimal NOT NULL,
  total_price decimal NOT NULL,
  payment_status payment_status NOT NULL DEFAULT 'unpaid',
  payment_method payment_method,
  order_status order_status NOT NULL DEFAULT 'pending',
  delivery_batch text NOT NULL,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_orders_delivery_batch ON orders (delivery_batch);
CREATE INDEX idx_orders_created_at ON orders (created_at DESC);
CREATE INDEX idx_orders_payment_status ON orders (payment_status);

-- Settings table (single row)
CREATE TABLE settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  price_per_kg decimal NOT NULL,
  order_cutoff_day text NOT NULL,
  order_cutoff_time time NOT NULL,
  delivery_day text NOT NULL
);

-- RLS
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

-- No direct anon/auth access to orders; API uses service role
CREATE POLICY "No direct access to orders"
  ON orders FOR ALL
  USING (false)
  WITH CHECK (false);

-- Settings: only authenticated users (admin) can read/update
CREATE POLICY "Authenticated users can read settings"
  ON settings FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can update settings"
  ON settings FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Anon cannot read settings (API will use service role for public price endpoint)
CREATE POLICY "Anon cannot access settings"
  ON settings FOR ALL
  TO anon
  USING (false)
  WITH CHECK (false);
