-- Add new columns to registrations table if not exists
ALTER TABLE public.registrations
ADD COLUMN IF NOT EXISTS member3_name VARCHAR(100);

ALTER TABLE public.registrations
ADD COLUMN IF NOT EXISTS member3_email VARCHAR(255);

ALTER TABLE public.registrations
ADD COLUMN IF NOT EXISTS member3_dept VARCHAR(50);

ALTER TABLE public.registrations
ADD COLUMN IF NOT EXISTS project_title VARCHAR(255);

ALTER TABLE public.registrations
ADD COLUMN IF NOT EXISTS project_description TEXT;

ALTER TABLE public.registrations
ADD COLUMN IF NOT EXISTS git_link VARCHAR(500);

ALTER TABLE public.registrations
ADD COLUMN IF NOT EXISTS notes TEXT;

ALTER TABLE public.registrations
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

-- Create an audit log table
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id BIGSERIAL PRIMARY KEY,
    action VARCHAR(50) NOT NULL,
    table_name VARCHAR(100) NOT NULL,
    record_id BIGINT,
    admin_id BIGINT,
    old_values JSONB,
    new_values JSONB,
    performed_at TIMESTAMPTZ DEFAULT NOW(),
    FOREIGN KEY (admin_id) REFERENCES public.admin_users(id) ON DELETE SET NULL
);

-- Enable RLS on audit logs
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Create policy for audit logs
CREATE POLICY "Allow authenticated users to read audit logs"
ON public.audit_logs
FOR SELECT
TO authenticated
USING (true);

-- Create index on audit logs
CREATE INDEX idx_audit_logs_performed_at ON public.audit_logs(performed_at DESC);
CREATE INDEX idx_audit_logs_admin_id ON public.audit_logs(admin_id);
CREATE INDEX idx_audit_logs_table_name ON public.audit_logs(table_name);
