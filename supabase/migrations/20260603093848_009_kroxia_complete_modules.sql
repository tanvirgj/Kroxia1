/*
  # KROXIA Complete Finance & Advanced Modules
  
  Adding missing tables for:
  - Finance: quotations, estimates, expense tracking
  - CRM: opportunities, activities tracking
  - Support: advanced ticketing, live chat
  - Knowledge Base: articles, categories
  - Notifications: system alerts
  - Team: attendance, performance
*/

-- Finance: Quotations
CREATE TABLE IF NOT EXISTS quotations (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  org_id uuid REFERENCES organizations(id) ON DELETE CASCADE NOT NULL,
  client_id uuid REFERENCES clients(id) ON DELETE CASCADE NOT NULL,
  lead_id uuid REFERENCES leads(id) ON DELETE SET NULL,
  quote_number text UNIQUE,
  title text NOT NULL,
  description text,
  amount numeric(12, 2),
  tax_amount numeric(12, 2) DEFAULT 0,
  total_amount numeric(12, 2),
  validity_days integer DEFAULT 30,
  valid_until date,
  status text DEFAULT 'draft',
  sent_at timestamptz,
  accepted_at timestamptz,
  rejected_at timestamptz,
  created_by uuid REFERENCES staff(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE quotations ENABLE ROW LEVEL SECURITY;

-- Finance: Estimates
CREATE TABLE IF NOT EXISTS estimates (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  org_id uuid REFERENCES organizations(id) ON DELETE CASCADE NOT NULL,
  project_id uuid REFERENCES projects(id) ON DELETE CASCADE,
  title text NOT NULL,
  scope text,
  timeline text,
  resource_allocation text,
  estimated_cost numeric(12, 2),
  estimated_hours numeric(10, 2),
  confidence_level text,
  created_by uuid REFERENCES staff(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE estimates ENABLE ROW LEVEL SECURITY;

-- Finance: Expense Categories
CREATE TABLE IF NOT EXISTS expense_categories (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  org_id uuid REFERENCES organizations(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  description text,
  created_at timestamptz DEFAULT now(),
  UNIQUE(org_id, name)
);

ALTER TABLE expense_categories ENABLE ROW LEVEL SECURITY;

-- Finance: Budgets
CREATE TABLE IF NOT EXISTS budgets (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  org_id uuid REFERENCES organizations(id) ON DELETE CASCADE NOT NULL,
  project_id uuid REFERENCES projects(id) ON DELETE CASCADE,
  category_id uuid REFERENCES expense_categories(id) ON DELETE SET NULL,
  name text NOT NULL,
  budgeted_amount numeric(12, 2),
  spent_amount numeric(12, 2) DEFAULT 0,
  month date,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE budgets ENABLE ROW LEVEL SECURITY;

-- CRM: Opportunities (enhanced deals)
CREATE TABLE IF NOT EXISTS opportunities (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  org_id uuid REFERENCES organizations(id) ON DELETE CASCADE NOT NULL,
  contact_id uuid REFERENCES contacts(id) ON DELETE CASCADE,
  company_id uuid REFERENCES clients(id) ON DELETE CASCADE,
  name text NOT NULL,
  amount numeric(12, 2),
  pipeline_stage text,
  probability numeric(3, 0) DEFAULT 50,
  expected_close_date date,
  actual_close_date date,
  owner_id uuid REFERENCES staff(id) ON DELETE SET NULL,
  status text DEFAULT 'open',
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE opportunities ENABLE ROW LEVEL SECURITY;

-- CRM: Activities (detailed tracking)
CREATE TABLE IF NOT EXISTS crm_activities (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  org_id uuid REFERENCES organizations(id) ON DELETE CASCADE NOT NULL,
  activity_type text NOT NULL,
  subject text,
  description text,
  contact_id uuid REFERENCES contacts(id) ON DELETE SET NULL,
  opportunity_id uuid REFERENCES opportunities(id) ON DELETE SET NULL,
  assigned_to uuid REFERENCES staff(id) ON DELETE SET NULL,
  due_date timestamptz,
  completed_at timestamptz,
  outcome text,
  created_by uuid REFERENCES staff(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE crm_activities ENABLE ROW LEVEL SECURITY;

-- CRM: Follow-ups
CREATE TABLE IF NOT EXISTS follow_ups (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  org_id uuid REFERENCES organizations(id) ON DELETE CASCADE NOT NULL,
  contact_id uuid REFERENCES contacts(id) ON DELETE CASCADE NOT NULL,
  opportunity_id uuid REFERENCES opportunities(id) ON DELETE SET NULL,
  follow_up_date date NOT NULL,
  notes text,
  status text DEFAULT 'pending',
  assigned_to uuid REFERENCES staff(id) ON DELETE SET NULL,
  created_by uuid REFERENCES staff(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE follow_ups ENABLE ROW LEVEL SECURITY;

-- Support: Live Chat Messages
CREATE TABLE IF NOT EXISTS chat_conversations (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  org_id uuid REFERENCES organizations(id) ON DELETE CASCADE NOT NULL,
  client_id uuid REFERENCES clients(id) ON DELETE CASCADE,
  started_by uuid REFERENCES staff(id) ON DELETE SET NULL,
  status text DEFAULT 'active',
  started_at timestamptz DEFAULT now(),
  ended_at timestamptz
);

ALTER TABLE chat_conversations ENABLE ROW LEVEL SECURITY;

CREATE TABLE IF NOT EXISTS chat_messages (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  conversation_id uuid REFERENCES chat_conversations(id) ON DELETE CASCADE NOT NULL,
  sender_id uuid REFERENCES staff(id) ON DELETE CASCADE,
  message text NOT NULL,
  attachments_json jsonb,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;

-- Support: SLA Configuration
CREATE TABLE IF NOT EXISTS sla_policies (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  org_id uuid REFERENCES organizations(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  response_time_minutes integer,
  resolution_time_minutes integer,
  priority_level text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE sla_policies ENABLE ROW LEVEL SECURITY;

-- Support: Ticket SLA Tracking
CREATE TABLE IF NOT EXISTS ticket_sla_tracking (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  ticket_id uuid REFERENCES tickets(id) ON DELETE CASCADE NOT NULL,
  sla_policy_id uuid REFERENCES sla_policies(id) ON DELETE SET NULL,
  response_due_at timestamptz,
  resolution_due_at timestamptz,
  response_met boolean,
  resolution_met boolean,
  breached_at timestamptz
);

ALTER TABLE ticket_sla_tracking ENABLE ROW LEVEL SECURITY;

-- Knowledge Base: Categories
CREATE TABLE IF NOT EXISTS kb_categories (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  org_id uuid REFERENCES organizations(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  slug text,
  description text,
  icon text,
  order_index integer DEFAULT 0,
  parent_id uuid REFERENCES kb_categories(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  UNIQUE(org_id, slug)
);

ALTER TABLE kb_categories ENABLE ROW LEVEL SECURITY;

-- Knowledge Base: Articles
CREATE TABLE IF NOT EXISTS kb_articles (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  org_id uuid REFERENCES organizations(id) ON DELETE CASCADE NOT NULL,
  category_id uuid REFERENCES kb_categories(id) ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  slug text NOT NULL,
  content text,
  excerpt text,
  status text DEFAULT 'draft',
  featured boolean DEFAULT false,
  views integer DEFAULT 0,
  helpful_count integer DEFAULT 0,
  unhelpful_count integer DEFAULT 0,
  author_id uuid REFERENCES staff(id) ON DELETE SET NULL,
  published_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(org_id, slug)
);

ALTER TABLE kb_articles ENABLE ROW LEVEL SECURITY;

-- Knowledge Base: Article Comments
CREATE TABLE IF NOT EXISTS kb_article_comments (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  article_id uuid REFERENCES kb_articles(id) ON DELETE CASCADE NOT NULL,
  author_id uuid,
  content text NOT NULL,
  rating integer,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE kb_article_comments ENABLE ROW LEVEL SECURITY;

-- Notifications: System Notifications
CREATE TABLE IF NOT EXISTS system_notifications (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  type text NOT NULL,
  title text NOT NULL,
  message text,
  data_json jsonb,
  read_at timestamptz,
  action_url text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE system_notifications ENABLE ROW LEVEL SECURITY;

-- Notifications: Notification Templates
CREATE TABLE IF NOT EXISTS notification_templates (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  org_id uuid REFERENCES organizations(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  event_type text,
  email_subject text,
  email_body text,
  sms_body text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE notification_templates ENABLE ROW LEVEL SECURITY;

-- Notifications: User Preferences
CREATE TABLE IF NOT EXISTS notification_preferences (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  email_notifications boolean DEFAULT true,
  sms_notifications boolean DEFAULT false,
  push_notifications boolean DEFAULT true,
  in_app_notifications boolean DEFAULT true,
  notification_digest text DEFAULT 'daily',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE notification_preferences ENABLE ROW LEVEL SECURITY;

-- Team: Attendance
CREATE TABLE IF NOT EXISTS attendance (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  staff_id uuid REFERENCES staff(id) ON DELETE CASCADE NOT NULL,
  org_id uuid REFERENCES organizations(id) ON DELETE CASCADE NOT NULL,
  date date NOT NULL,
  check_in_time timestamptz,
  check_out_time timestamptz,
  status text DEFAULT 'present',
  notes text,
  created_at timestamptz DEFAULT now(),
  UNIQUE(staff_id, date)
);

ALTER TABLE attendance ENABLE ROW LEVEL SECURITY;

-- Team: Performance Metrics
CREATE TABLE IF NOT EXISTS performance_metrics (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  staff_id uuid REFERENCES staff(id) ON DELETE CASCADE NOT NULL,
  org_id uuid REFERENCES organizations(id) ON DELETE CASCADE NOT NULL,
  metric_name text NOT NULL,
  metric_value numeric,
  period_start date,
  period_end date,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE performance_metrics ENABLE ROW LEVEL SECURITY;

-- Team: Tasks Assignment
CREATE TABLE IF NOT EXISTS task_assignments (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  task_id uuid REFERENCES tasks(id) ON DELETE CASCADE NOT NULL,
  assignee_id uuid REFERENCES staff(id) ON DELETE CASCADE NOT NULL,
  assigned_by uuid REFERENCES staff(id) ON DELETE SET NULL,
  assigned_at timestamptz DEFAULT now()
);

ALTER TABLE task_assignments ENABLE ROW LEVEL SECURITY;

-- Public Website: Blog Articles
CREATE TABLE IF NOT EXISTS blog_articles (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  org_id uuid REFERENCES organizations(id) ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  slug text NOT NULL,
  excerpt text,
  content text,
  featured_image text,
  author_id uuid REFERENCES staff(id) ON DELETE SET NULL,
  status text DEFAULT 'draft',
  published_at timestamptz,
  views integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(org_id, slug)
);

ALTER TABLE blog_articles ENABLE ROW LEVEL SECURITY;

-- Public Website: Blog Categories
CREATE TABLE IF NOT EXISTS blog_categories (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  org_id uuid REFERENCES organizations(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  slug text NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(org_id, slug)
);

ALTER TABLE blog_categories ENABLE ROW LEVEL SECURITY;

-- Public Website: Portfolio Projects
CREATE TABLE IF NOT EXISTS portfolio_projects (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  org_id uuid REFERENCES organizations(id) ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  slug text NOT NULL,
  description text,
  image_url text,
  client_name text,
  services jsonb,
  results text,
  link text,
  status text DEFAULT 'published',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE portfolio_projects ENABLE ROW LEVEL SECURITY;

-- Public Website: Testimonials
CREATE TABLE IF NOT EXISTS testimonials (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  org_id uuid REFERENCES organizations(id) ON DELETE CASCADE NOT NULL,
  client_name text NOT NULL,
  company text,
  content text NOT NULL,
  rating integer,
  image_url text,
  verified boolean DEFAULT false,
  status text DEFAULT 'pending',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;

-- Public Website: Contact Forms
CREATE TABLE IF NOT EXISTS contact_submissions (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  org_id uuid REFERENCES organizations(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  email text,
  phone text,
  subject text,
  message text,
  service_interested text,
  budget text,
  timeline text,
  status text DEFAULT 'new',
  assigned_to uuid REFERENCES staff(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;

-- Client Portal: File Downloads
CREATE TABLE IF NOT EXISTS client_downloads (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_id uuid REFERENCES clients(id) ON DELETE CASCADE NOT NULL,
  file_id uuid REFERENCES project_files(id) ON DELETE CASCADE,
  downloaded_at timestamptz DEFAULT now()
);

ALTER TABLE client_downloads ENABLE ROW LEVEL SECURITY;

-- Client Portal: Contracts
CREATE TABLE IF NOT EXISTS contracts (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  org_id uuid REFERENCES organizations(id) ON DELETE CASCADE NOT NULL,
  client_id uuid REFERENCES clients(id) ON DELETE CASCADE NOT NULL,
  project_id uuid REFERENCES projects(id) ON DELETE CASCADE,
  title text NOT NULL,
  document_url text,
  status text DEFAULT 'draft',
  sent_at timestamptz,
  signed_at timestamptz,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE contracts ENABLE ROW LEVEL SECURITY;

-- Marketplace: Coupons
CREATE TABLE IF NOT EXISTS coupons (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  org_id uuid REFERENCES organizations(id) ON DELETE CASCADE NOT NULL,
  code text UNIQUE NOT NULL,
  discount_type text,
  discount_value numeric(10, 2),
  max_uses integer,
  uses_count integer DEFAULT 0,
  valid_from date,
  valid_until date,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE coupons ENABLE ROW LEVEL SECURITY;

-- Marketplace: Wishlist
CREATE TABLE IF NOT EXISTS wishlist (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_id uuid REFERENCES clients(id) ON DELETE CASCADE NOT NULL,
  product_id uuid REFERENCES products(id) ON DELETE CASCADE NOT NULL,
  added_at timestamptz DEFAULT now(),
  UNIQUE(client_id, product_id)
);

ALTER TABLE wishlist ENABLE ROW LEVEL SECURITY;

-- Analytics: Revenue Tracking
CREATE TABLE IF NOT EXISTS revenue_analytics (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  org_id uuid REFERENCES organizations(id) ON DELETE CASCADE NOT NULL,
  metric_type text,
  value numeric(12, 2),
  period date,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE revenue_analytics ENABLE ROW LEVEL SECURITY;

-- Analytics: Sales Analytics
CREATE TABLE IF NOT EXISTS sales_analytics (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  org_id uuid REFERENCES organizations(id) ON DELETE CASCADE NOT NULL,
  sales_rep_id uuid REFERENCES staff(id) ON DELETE SET NULL,
  deals_closed integer DEFAULT 0,
  revenue_generated numeric(12, 2),
  period date,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE sales_analytics ENABLE ROW LEVEL SECURITY;

-- Indexes for better performance
CREATE INDEX idx_quotations_org_id ON quotations(org_id);
CREATE INDEX idx_quotations_client_id ON quotations(client_id);
CREATE INDEX idx_estimates_org_id ON estimates(org_id);
CREATE INDEX idx_opportunities_org_id ON opportunities(org_id);
CREATE INDEX idx_crm_activities_org_id ON crm_activities(org_id);
CREATE INDEX idx_follow_ups_org_id ON follow_ups(org_id);
CREATE INDEX idx_chat_conversations_org_id ON chat_conversations(org_id);
CREATE INDEX idx_kb_articles_org_id ON kb_articles(org_id);
CREATE INDEX idx_blog_articles_org_id ON blog_articles(org_id);
CREATE INDEX idx_attendance_staff_id ON attendance(staff_id);
