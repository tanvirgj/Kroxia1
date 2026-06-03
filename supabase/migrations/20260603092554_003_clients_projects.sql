/*
  # KROXIA Clients & Projects
  
  Client management, projects, milestones, tasks
*/

CREATE TABLE IF NOT EXISTS clients (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  org_id uuid REFERENCES organizations(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  company_name text NOT NULL,
  email text,
  phone text,
  website text,
  address text,
  city text,
  state text,
  postal_code text,
  country text,
  status text DEFAULT 'active',
  portal_enabled boolean DEFAULT true,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE clients ENABLE ROW LEVEL SECURITY;

CREATE TABLE IF NOT EXISTS client_notes (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_id uuid REFERENCES clients(id) ON DELETE CASCADE NOT NULL,
  author_id uuid REFERENCES staff(id) ON DELETE CASCADE,
  content text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE client_notes ENABLE ROW LEVEL SECURITY;

CREATE TABLE IF NOT EXISTS projects (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  org_id uuid REFERENCES organizations(id) ON DELETE CASCADE NOT NULL,
  client_id uuid REFERENCES clients(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text,
  status text DEFAULT 'active',
  type text,
  budget numeric(12, 2),
  actual_cost numeric(12, 2) DEFAULT 0,
  start_date date,
  deadline date,
  created_by uuid REFERENCES staff(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

CREATE TABLE IF NOT EXISTS milestones (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id uuid REFERENCES projects(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  description text,
  due_date date,
  completed_at timestamptz,
  status text DEFAULT 'pending',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE milestones ENABLE ROW LEVEL SECURITY;

CREATE TABLE IF NOT EXISTS tasks (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  org_id uuid REFERENCES organizations(id) ON DELETE CASCADE NOT NULL,
  project_id uuid REFERENCES projects(id) ON DELETE CASCADE NOT NULL,
  milestone_id uuid REFERENCES milestones(id) ON DELETE SET NULL,
  title text NOT NULL,
  description text,
  assignee_id uuid REFERENCES staff(id) ON DELETE SET NULL,
  status text DEFAULT 'todo',
  priority text DEFAULT 'medium',
  due_date date,
  estimated_hours numeric(8, 2),
  actual_hours numeric(8, 2) DEFAULT 0,
  completed_at timestamptz,
  created_by uuid REFERENCES staff(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;

CREATE TABLE IF NOT EXISTS task_comments (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  task_id uuid REFERENCES tasks(id) ON DELETE CASCADE NOT NULL,
  author_id uuid REFERENCES staff(id) ON DELETE CASCADE,
  content text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE task_comments ENABLE ROW LEVEL SECURITY;

CREATE TABLE IF NOT EXISTS task_attachments (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  task_id uuid REFERENCES tasks(id) ON DELETE CASCADE NOT NULL,
  uploader_id uuid REFERENCES staff(id) ON DELETE SET NULL,
  file_url text NOT NULL,
  filename text,
  file_size numeric,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE task_attachments ENABLE ROW LEVEL SECURITY;

CREATE TABLE IF NOT EXISTS time_logs (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  task_id uuid REFERENCES tasks(id) ON DELETE CASCADE NOT NULL,
  staff_id uuid REFERENCES staff(id) ON DELETE CASCADE NOT NULL,
  hours numeric(8, 2) NOT NULL,
  logged_at date DEFAULT now(),
  notes text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE time_logs ENABLE ROW LEVEL SECURITY;

CREATE TABLE IF NOT EXISTS approvals (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id uuid REFERENCES projects(id) ON DELETE CASCADE NOT NULL,
  type text NOT NULL,
  title text,
  content text,
  submitted_by uuid REFERENCES staff(id) ON DELETE CASCADE NOT NULL,
  reviewed_by uuid REFERENCES staff(id) ON DELETE SET NULL,
  status text DEFAULT 'pending',
  submitted_at timestamptz DEFAULT now(),
  reviewed_at timestamptz,
  notes text
);

ALTER TABLE approvals ENABLE ROW LEVEL SECURITY;

CREATE TABLE IF NOT EXISTS project_files (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id uuid REFERENCES projects(id) ON DELETE CASCADE NOT NULL,
  uploader_id uuid REFERENCES staff(id) ON DELETE SET NULL,
  file_url text NOT NULL,
  filename text,
  file_size numeric,
  category text,
  visibility text DEFAULT 'internal',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE project_files ENABLE ROW LEVEL SECURITY;

CREATE INDEX idx_clients_org_id ON clients(org_id);
CREATE INDEX idx_clients_user_id ON clients(user_id);
CREATE INDEX idx_projects_org_id ON projects(org_id);
CREATE INDEX idx_projects_client_id ON projects(client_id);
CREATE INDEX idx_tasks_org_id ON tasks(org_id);
CREATE INDEX idx_tasks_project_id ON tasks(project_id);
CREATE INDEX idx_tasks_assignee_id ON tasks(assignee_id);
