-- Allow public reads/updates/deletes for admin panel without auth
CREATE POLICY "Allow public to read registrations"
ON public.registrations
FOR SELECT
TO public
USING (true);

CREATE POLICY "Allow public to update registrations"
ON public.registrations
FOR UPDATE
TO public
USING (true)
WITH CHECK (true);

CREATE POLICY "Allow public to delete registrations"
ON public.registrations
FOR DELETE
TO public
USING (true);
