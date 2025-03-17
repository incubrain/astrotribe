DO $$
BEGIN
  -- Step 1: Check current column type
  IF EXISTS (
    SELECT FROM information_schema.columns 
    WHERE table_schema = 'public' AND table_name = 'companies' AND column_name = 'category_id'
    AND data_type = 'bigint'
  ) THEN
    -- Step 2: Add a new UUID column
    ALTER TABLE public.companies ADD COLUMN category_id_uuid UUID;
    
    -- Step 3: Set all values to the Uncategorized UUID
    UPDATE public.companies SET category_id_uuid = '38608e39-d0c8-42b4-b7ad-c9af5d0de879';
    
    -- Step 4: Drop the existing foreign key constraint if it exists
    IF EXISTS (
      SELECT FROM pg_constraint 
      WHERE conname = 'companies_category_id_fkey'
    ) THEN
      ALTER TABLE public.companies DROP CONSTRAINT companies_category_id_fkey;
    END IF;
    
    -- Step 5: Drop the old column and rename the new one
    ALTER TABLE public.companies DROP COLUMN category_id;
    ALTER TABLE public.companies RENAME COLUMN category_id_uuid TO category_id;
    
    -- Step 6: Set the default value
    ALTER TABLE public.companies ALTER COLUMN category_id SET DEFAULT '38608e39-d0c8-42b4-b7ad-c9af5d0de879';
    
    -- Step 7: Add the new foreign key constraint
    ALTER TABLE public.companies
    ADD CONSTRAINT companies_category_id_fkey
    FOREIGN KEY (category_id) REFERENCES public.categories(id);
  ELSIF NOT EXISTS (
    SELECT FROM pg_constraint 
    WHERE conname = 'companies_category_id_fkey'
  ) THEN
    -- If column is already UUID but missing the constraint, just add the constraint
    ALTER TABLE public.companies
    ADD CONSTRAINT companies_category_id_fkey
    FOREIGN KEY (category_id) REFERENCES public.categories(id);
  END IF;
END;
$$;