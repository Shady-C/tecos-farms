-- Add delivery_zones JSONB column to settings table
-- This stores configurable delivery zones displayed on the public order form.
-- Each zone: { name: string, icon: string, detail: string }

ALTER TABLE settings
  ADD COLUMN IF NOT EXISTS delivery_zones JSONB NOT NULL DEFAULT '[]'::jsonb;

-- Seed the default Dar es Salaam zones (run once, idempotent via the WHERE NOT EXISTS check)
UPDATE settings
SET delivery_zones = '[
  {"name": "Kinondoni", "icon": "🏙️", "detail": "Mikocheni, Sinza, Mwenge"},
  {"name": "Ilala",     "icon": "🏢", "detail": "CBD, Kariakoo, Buguruni"},
  {"name": "Temeke",    "icon": "🌊", "detail": "Mbagala, Tandika, Mjimwema"},
  {"name": "Ubungo",    "icon": "🏘️", "detail": "Kimara, Kwembe, Mbezi"}
]'::jsonb
WHERE delivery_zones = '[]'::jsonb;
