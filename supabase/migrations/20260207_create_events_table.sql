-- Create events table
CREATE TABLE IF NOT EXISTS public.events (
    id BIGSERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    event_date DATE NOT NULL,
    event_time TIME NOT NULL,
    location VARCHAR(255),
    event_type VARCHAR(100),
    max_capacity INTEGER,
    registered_count INTEGER DEFAULT 0,
    status VARCHAR(50) DEFAULT 'upcoming' NOT NULL,
    created_by BIGINT,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    FOREIGN KEY (created_by) REFERENCES public.admin_users(id) ON DELETE SET NULL
);

-- Enable Row Level Security
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Allow public to view published events"
ON public.events
FOR SELECT
USING (status = 'published');

CREATE POLICY "Allow authenticated admins to manage events"
ON public.events
FOR ALL
TO authenticated
USING (created_by = (SELECT id FROM public.admin_users WHERE username = current_user))
WITH CHECK (created_by = (SELECT id FROM public.admin_users WHERE username = current_user));

-- Create indexes
CREATE INDEX idx_events_event_date ON public.events(event_date);
CREATE INDEX idx_events_status ON public.events(status);
CREATE INDEX idx_events_created_by ON public.events(created_by);
