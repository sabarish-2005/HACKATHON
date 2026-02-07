-- Create admin users table
CREATE TABLE IF NOT EXISTS public.admin_users (
    id BIGSERIAL PRIMARY KEY,
    username VARCHAR(100) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'admin' NOT NULL,
    is_active BOOLEAN DEFAULT true NOT NULL,
    last_login TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Enable Row Level Security
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- Create policy to allow authenticated users to read admin info
CREATE POLICY "Allow authenticated users to read admin users"
ON public.admin_users
FOR SELECT
TO authenticated
USING (auth.uid()::text = id::text);

-- Create policy for admins to update their own records
CREATE POLICY "Allow admins to update their own records"
ON public.admin_users
FOR UPDATE
TO authenticated
USING (auth.uid()::text = id::text)
WITH CHECK (auth.uid()::text = id::text);

-- Create index on username for faster lookups
CREATE INDEX idx_admin_users_username ON public.admin_users(username);
CREATE INDEX idx_admin_users_email ON public.admin_users(email);

-- Insert default admin user (password should be changed in production)
-- Default password: admin123 (hashed with bcrypt, replace with actual hash in production)
INSERT INTO public.admin_users (username, email, password_hash, role) VALUES
('admin', 'admin@aihmackathon.com', 'default_hash_placeholder', 'super_admin');
