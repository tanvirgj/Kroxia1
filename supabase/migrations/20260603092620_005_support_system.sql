/*
  # KROXIA Support & Ticketing
  
  Support tickets, messaging, knowledge base
*/

CREATE TABLE IF NOT EXISTS tickets (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  org_id uuid REFERENCES organizations(id) ON DELETE CASCADE NOT NULL,
  client_id uuid REFERENCES clients(id) ON DELETE CASCADE,
  subject text NOT NULL,
  description text,
  status text DEFAULT 'open',
  priority text DEFAULT 'medium',
  assigned_to uuid REFERENCES staff(id) ON DELETE SET NULL,
  created_by uuid REFERENCES staff(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE tickets ENABLE ROW LEVEL SECURITY;

CREATE TABLE IF NOT EXISTS ticket_messages (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  ticket_id uuid REFERENCES tickets(id) ON DELETE CASCADE NOT NULL,
  sender_id uuid REFERENCES staff(id) ON DELETE CASCADE,
  content text NOT NULL,
  attachments_json jsonb,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE ticket_messages ENABLE ROW LEVEL SECURITY;

CREATE TABLE IF NOT EXISTS knowledge_base (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  org_id uuid REFERENCES organizations(id) ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  slug text,
  content text,
  category text,
  published boolean DEFAULT false,
  views integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE knowledge_base ENABLE ROW LEVEL SECURITY;

CREATE INDEX idx_tickets_org_id ON tickets(org_id);
CREATE INDEX idx_tickets_client_id ON tickets(client_id);
