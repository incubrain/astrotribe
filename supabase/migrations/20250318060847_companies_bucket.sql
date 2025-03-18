INSERT INTO "storage"."buckets" 
("id", "name", "owner", "created_at", "updated_at", "public", "avif_autodetection", "file_size_limit", "allowed_mime_types", "owner_id") VALUES
('companies', 'companies', NULL, '2025-03-18 05:39:17.641583+00', '2025-03-18 05:39:17.641583+00', true, false, NULL, NULL, NULL),
ON CONFLICT (id) DO NOTHING;