/*
  # KROXIA Database Schema - Part 1: Core Tables
  
  Initial setup for KROXIA platform with auth, orgs, and staff
*/

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Roles table
CREATE TABLE IF NOT EXISTS roles (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name text UNIQUE NOT NULL,
  description text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE roles ENABLE ROW LEVEL SECURITY;

INSERT INTO roles (name, description) VALUES
  ('super_admin', 'Full platform control'),
  ('admin', 'Organization admin'),
  ('manager', 'Department/Project manager'),
  ('staff', 'Team member'),
  ('client', 'Client user'),
  ('support', 'Support agent'),
  ('finance', 'Finance officer'),
  ('seller', 'Marketplace seller')
ON CONFLICT (name) DO NOTHING;

-- Organizations table
CREATE TABLE IF NOT EXISTS organizations (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name text NOT NULL,
  slug text UNIQUE,
  plan text DEFAULT 'starter',
  status text DEFAULT 'active',
  white_label_config jsonb DEFAULT '{}',
  branding jsonb DEFAULT '{"logo_url": "", "primary_color": "#000000"}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;

-- Staff table
CREATE TABLE IF NOT EXISTS staff (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  org_id uuid REFERENCES organizations(id) ON DELETE CASCADE NOT NULL,
  role_id uuid REFERENCES roles(id) ON DELETE SET NULL,
  first_name text,
  last_name text,
  title text,
  email text,
  phone text,
  hourly_rate numeric(10, 2),
  status text DEFAULT 'active',
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, org_id)
);

ALTER TABLE staff ENABLE ROW LEVEL SECURITY;

-- Departments table
CREATE TABLE IF NOT EXISTS departments (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  org_id uuid REFERENCES organizations(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  description text,
  manager_id uuid REFERENCES staff(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(org_id, name)
);

ALTER TABLE departments ENABLE ROW LEVEL SECURITY;
