-- Add currency column to admins table if it doesn't exist
ALTER TABLE admins 
ADD COLUMN IF NOT EXISTS currency VARCHAR(3) DEFAULT 'NGN';

-- Optional: Update existing records to have a default currency
UPDATE admins 
SET currency = 'NGN' 
WHERE currency IS NULL;
