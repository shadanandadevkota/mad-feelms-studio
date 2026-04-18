ALTER TABLE public.contact_submissions
  ADD CONSTRAINT contact_name_len CHECK (char_length(name) BETWEEN 1 AND 100),
  ADD CONSTRAINT contact_email_len CHECK (char_length(email) BETWEEN 5 AND 255 AND email LIKE '%@%'),
  ADD CONSTRAINT contact_message_len CHECK (char_length(message) BETWEEN 1 AND 2000),
  ADD CONSTRAINT contact_project_type_len CHECK (project_type IS NULL OR char_length(project_type) <= 100);