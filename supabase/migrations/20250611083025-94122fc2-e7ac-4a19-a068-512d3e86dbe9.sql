
-- Update the contact_messages table to include phone number and improve structure
ALTER TABLE public.contact_messages 
ADD COLUMN phone TEXT,
ADD COLUMN status TEXT DEFAULT 'new',
ADD COLUMN processed_at TIMESTAMP WITH TIME ZONE;

-- Create an index for better performance on status queries
CREATE INDEX idx_contact_messages_status ON public.contact_messages(status);
CREATE INDEX idx_contact_messages_created_at ON public.contact_messages(created_at DESC);

-- Enable realtime for the contact_messages table
ALTER TABLE public.contact_messages REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.contact_messages;

-- Update RLS policies to be more permissive for contact forms (public access)
DROP POLICY IF EXISTS "Anyone can submit contact messages" ON public.contact_messages;
DROP POLICY IF EXISTS "Admin can view contact messages" ON public.contact_messages;

-- Allow anyone to insert contact messages (public contact form)
CREATE POLICY "Public can submit contact messages" 
  ON public.contact_messages 
  FOR INSERT 
  WITH CHECK (true);

-- Allow anyone to view contact messages (for admin dashboard later)
CREATE POLICY "Public can view contact messages" 
  ON public.contact_messages 
  FOR SELECT 
  USING (true);

-- Allow updates for processing status
CREATE POLICY "Public can update contact messages" 
  ON public.contact_messages 
  FOR UPDATE 
  USING (true);
