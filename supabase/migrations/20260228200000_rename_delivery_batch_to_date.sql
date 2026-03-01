-- ============================================================
-- Rename delivery_batch (text) to delivery_date (date)
-- Text column stored ISO 8601 dates, so ::date cast is safe
-- ============================================================

ALTER TABLE orders RENAME COLUMN delivery_batch TO delivery_date;
ALTER TABLE orders ALTER COLUMN delivery_date TYPE date USING delivery_date::date;

DROP INDEX IF EXISTS idx_orders_delivery_batch;
CREATE INDEX idx_orders_delivery_date ON orders (delivery_date DESC);
