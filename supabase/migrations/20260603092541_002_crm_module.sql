/*
  # KROXIA CRM Module
  
  Leads, contacts, deals, activities, pipelines
*/

CREATE TABLE IF NOT EXISTS pipelines (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  org_id uuid REFERENCES organizations(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  stages jsonb NOT NULL DEFAULT '["New", "Contacted", "Proposal", "Won", "Lost"]',
  created_at timestamptz DEFAULT now(),
  UNIQUE(org_id, name)
);

ALTER TABLE pipelines ENABLE ROW LEVEL SECURITY;

CREATE TABLE IF NOT EXISTS leads (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  org_id uuid REFERENCES organizations(id) ON DELETE CASCADE NOT NULL,
  first_name text,
  last_name text,
  email text,
  phone text,
  company text,
  source text,
  status text DEFAULT 'new',
  stage text,
  pipeline_id uuid REFERENCES pipelines(id) ON DELETE SET NULL,
  assigned_to uuid REFERENCES staff(id) ON DELETE SET NULL,
  score numeric(5, 2) DEFAULT 0,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

CREATE TABLE IF NOT EXISTS contacts (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  org_id uuid REFERENCES organizations(id) ON DELETE CASCADE NOT NULL,
  first_name text NOT NULL,
  last_name text,
  email text,
  phone text,
  company text,
  title text,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;

CREATE TABLE IF NOT EXISTS deals (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  org_id uuid REFERENCES organizations(id) ON DELETE CASCADE NOT NULL,
  contact_id uuid REFERENCES contacts(id) ON DELETE CASCADE,
  title text NOT NULL,
  amount numeric(12, 2),
  stage text,
  pipeline_id uuid REFERENCES pipelines(id) ON DELETE SET NULL,
  probability numeric(3, 0) DEFAULT 0,
  assigned_to uuid REFERENCES staff(id) ON DELETE SET NULL,
  expected_close_date date,
  closed_at timestamptz,
  status text DEFAULT 'open',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE deals ENABLE ROW LEVEL SECURITY;

CREATE TABLE IF NOT EXISTS activities (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  org_id uuid REFERENCES organizations(id) ON DELETE CASCADE NOT NULL,
  type text NOT NULL,
  title text,
  content text,
  related_id uuid,
  related_type text,
  assigned_to uuid REFERENCES staff(id) ON DELETE SET NULL,
  due_at timestamptz,
  completed_at timestamptz,
  created_by uuid REFERENCES staff(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE activities ENABLE ROW LEVEL SECURITY;

CREATE INDEX idx_leads_org_id ON leads(org_id);
CREATE INDEX idx_leads_assigned_to ON leads(assigned_to);
CREATE INDEX idx_contacts_org_id ON contacts(org_id);
CREATE INDEX idx_deals_org_id ON deals(org_id);
CREATE INDEX idx_pipelines_org_id ON pipelines(org_id);
