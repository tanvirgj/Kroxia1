/*
  # KROXIA Row Level Security Policies
  
  Comprehensive RLS policies for multi-tenant security
*/

-- Organizations policies
CREATE POLICY "Users can read their organization"
  ON organizations FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM staff
      WHERE staff.org_id = organizations.id
      AND staff.user_id = auth.uid()
    )
  );

-- Staff policies
CREATE POLICY "Staff can read organization staff"
  ON staff FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM staff s2
      WHERE s2.org_id = staff.org_id
      AND s2.user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can manage staff"
  ON staff FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM staff s1
      WHERE s1.org_id = staff.org_id
      AND s1.user_id = auth.uid()
      AND s1.role_id IN (
        SELECT id FROM roles WHERE name IN ('admin', 'super_admin')
      )
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM staff s1
      WHERE s1.org_id = staff.org_id
      AND s1.user_id = auth.uid()
      AND s1.role_id IN (
        SELECT id FROM roles WHERE name IN ('admin', 'super_admin')
      )
    )
  );

-- Leads policies
CREATE POLICY "Users can read their org leads"
  ON leads FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM staff
      WHERE staff.org_id = leads.org_id
      AND staff.user_id = auth.uid()
    )
  );

-- Contacts policies
CREATE POLICY "Users can read their org contacts"
  ON contacts FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM staff
      WHERE staff.org_id = contacts.org_id
      AND staff.user_id = auth.uid()
    )
  );

-- Deals policies
CREATE POLICY "Users can read their org deals"
  ON deals FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM staff
      WHERE staff.org_id = deals.org_id
      AND staff.user_id = auth.uid()
    )
  );

-- Clients policies
CREATE POLICY "Users can read their org clients"
  ON clients FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM staff
      WHERE staff.org_id = clients.org_id
      AND staff.user_id = auth.uid()
    )
  );

CREATE POLICY "Clients can read own data"
  ON clients FOR SELECT
  USING (user_id = auth.uid());

-- Projects policies
CREATE POLICY "Users can read their org projects"
  ON projects FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM staff
      WHERE staff.org_id = projects.org_id
      AND staff.user_id = auth.uid()
    )
  );

CREATE POLICY "Clients can read assigned projects"
  ON projects FOR SELECT
  USING (
    client_id IN (
      SELECT id FROM clients WHERE user_id = auth.uid()
    )
  );

-- Tasks policies
CREATE POLICY "Users can read their org tasks"
  ON tasks FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM staff
      WHERE staff.org_id = tasks.org_id
      AND staff.user_id = auth.uid()
    )
  );

-- Invoices policies
CREATE POLICY "Users can read their org invoices"
  ON invoices FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM staff
      WHERE staff.org_id = invoices.org_id
      AND staff.user_id = auth.uid()
    )
  );

CREATE POLICY "Clients can read own invoices"
  ON invoices FOR SELECT
  USING (
    client_id IN (
      SELECT id FROM clients WHERE user_id = auth.uid()
    )
  );

-- Tickets policies
CREATE POLICY "Users can read their org tickets"
  ON tickets FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM staff
      WHERE staff.org_id = tickets.org_id
      AND staff.user_id = auth.uid()
    )
  );

CREATE POLICY "Clients can read own tickets"
  ON tickets FOR SELECT
  USING (
    client_id IN (
      SELECT id FROM clients WHERE user_id = auth.uid()
    )
  );

-- Notifications policies
CREATE POLICY "Users can read own notifications"
  ON notifications FOR SELECT
  USING (user_id = auth.uid());

-- Products policies
CREATE POLICY "Anyone can read published products"
  ON products FOR SELECT
  USING (status = 'published');

-- Orders policies
CREATE POLICY "Buyers can read own orders"
  ON orders FOR SELECT
  USING (buyer_id IN (SELECT id FROM clients WHERE user_id = auth.uid()));
