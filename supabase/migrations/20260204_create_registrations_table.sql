-- Create registrations table
CREATE TABLE IF NOT EXISTS public.registrations (
    id BIGSERIAL PRIMARY KEY,
    team_name VARCHAR(50) NOT NULL,
    leader_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL,
    mobile VARCHAR(10) NOT NULL,
    college VARCHAR(200) NOT NULL,
    leader_dept VARCHAR(50) NOT NULL,
    member2_name VARCHAR(100) NOT NULL,
    member2_email VARCHAR(255) NOT NULL DEFAULT '',
    member2_dept VARCHAR(50) NOT NULL,
    status VARCHAR(20) DEFAULT 'pending' NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Enable Row Level Security
ALTER TABLE public.registrations ENABLE ROW LEVEL SECURITY;

-- Create policy to allow public insert (for registration form)
CREATE POLICY "Allow public to insert registrations"
ON public.registrations
FOR INSERT
TO public
WITH CHECK (true);

-- Create policy to allow authenticated users to read all registrations
CREATE POLICY "Allow authenticated users to read registrations"
ON public.registrations
FOR SELECT
TO authenticated
USING (true);

-- Create policy to allow authenticated users to update status
CREATE POLICY "Allow authenticated users to update registrations"
ON public.registrations
FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

-- Create index on email for faster lookups
CREATE INDEX idx_registrations_email ON public.registrations(email);
CREATE INDEX idx_registrations_status ON public.registrations(status);
CREATE INDEX idx_registrations_leader_dept ON public.registrations(leader_dept);

-- Insert sample data (the 6 teams from the mock data)
INSERT INTO public.registrations (team_name, leader_name, email, mobile, college, leader_dept, member2_name, member2_email, member2_dept, status) VALUES
('AI Pioneers', 'John Doe', 'john@college.edu', '9876543210', 'Tech University', 'AIML', 'Jane Smith', 'jane@college.edu', 'CS', 'pending'),
('Code Warriors', 'Alice Brown', 'alice@college.edu', '9876543211', 'Science College', 'CS', 'Bob Wilson', 'bob@college.edu', 'IT', 'selected'),
('Neural Network', 'Charlie Green', 'charlie@college.edu', '9876543212', 'Engineering Institute', 'AIML', 'Diana Ross', 'diana@college.edu', 'AIML', 'pending'),
('Data Dynamos', 'Eve Adams', 'eve@college.edu', '9876543213', 'Tech University', 'IT', 'Frank Miller', 'frank@college.edu', 'BCA', 'not_selected'),
('ML Masters', 'Grace Lee', 'grace@college.edu', '9876543214', 'Science College', 'AIDA', 'Henry Chen', 'henry@college.edu', 'AIML', 'selected'),
('Cyber Squad', 'Ivan Kumar', 'ivan@college.edu', '9876543215', 'Engineering Institute', 'DCFS', 'Julia Martinez', 'julia@college.edu', 'CT', 'pending');
