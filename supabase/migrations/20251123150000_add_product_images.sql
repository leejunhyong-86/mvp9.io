-- Migration: Add images column to products table
-- Created: 2025-11-23
-- Description: Add support for multiple product images stored as TEXT array

-- Add images column to products table
ALTER TABLE products
ADD COLUMN IF NOT EXISTS images TEXT[] DEFAULT '{}';

-- Add comment to document the column
COMMENT ON COLUMN products.images IS 'Array of image URLs stored in Supabase Storage (product-images bucket)';

-- Optional: Create an index for better query performance if needed
-- CREATE INDEX IF NOT EXISTS idx_products_images ON products USING GIN (images);

