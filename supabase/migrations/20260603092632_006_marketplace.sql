/*
  # KROXIA Marketplace & Products
  
  Products, versions, reviews, orders, licenses
*/

CREATE TABLE IF NOT EXISTS product_categories (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name text UNIQUE NOT NULL,
  slug text UNIQUE,
  description text,
  parent_id uuid REFERENCES product_categories(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE product_categories ENABLE ROW LEVEL SECURITY;

CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  seller_id uuid REFERENCES staff(id) ON DELETE CASCADE,
  org_id uuid REFERENCES organizations(id) ON DELETE CASCADE,
  name text NOT NULL,
  slug text,
  type text,
  description text,
  long_description text,
  price numeric(10, 2),
  category_id uuid REFERENCES product_categories(id) ON DELETE SET NULL,
  status text DEFAULT 'draft',
  featured boolean DEFAULT false,
  rating numeric(3, 2) DEFAULT 0,
  review_count integer DEFAULT 0,
  download_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE products ENABLE ROW LEVEL SECURITY;

CREATE TABLE IF NOT EXISTS product_versions (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id uuid REFERENCES products(id) ON DELETE CASCADE NOT NULL,
  version text NOT NULL,
  changelog text,
  file_url text,
  file_size numeric,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE product_versions ENABLE ROW LEVEL SECURITY;

CREATE TABLE IF NOT EXISTS product_screenshots (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id uuid REFERENCES products(id) ON DELETE CASCADE NOT NULL,
  image_url text NOT NULL,
  order_index integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE product_screenshots ENABLE ROW LEVEL SECURITY;

CREATE TABLE IF NOT EXISTS product_reviews (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id uuid REFERENCES products(id) ON DELETE CASCADE NOT NULL,
  buyer_id uuid REFERENCES clients(id) ON DELETE CASCADE,
  rating integer,
  content text,
  helpful_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE product_reviews ENABLE ROW LEVEL SECURITY;

CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  buyer_id uuid REFERENCES clients(id) ON DELETE CASCADE NOT NULL,
  total numeric(12, 2),
  status text DEFAULT 'pending',
  gateway_ref text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

CREATE TABLE IF NOT EXISTS order_items (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id uuid REFERENCES orders(id) ON DELETE CASCADE NOT NULL,
  product_id uuid REFERENCES products(id) ON DELETE CASCADE,
  price numeric(10, 2),
  license_key text UNIQUE,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

CREATE TABLE IF NOT EXISTS licenses (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_item_id uuid REFERENCES order_items(id) ON DELETE CASCADE,
  key text UNIQUE NOT NULL,
  activations_max integer DEFAULT 1,
  activations_used integer DEFAULT 0,
  expires_at date,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE licenses ENABLE ROW LEVEL SECURITY;

CREATE TABLE IF NOT EXISTS payouts (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  seller_id uuid REFERENCES staff(id) ON DELETE CASCADE NOT NULL,
  amount numeric(12, 2),
  status text DEFAULT 'pending',
  paid_at timestamptz,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE payouts ENABLE ROW LEVEL SECURITY;

CREATE INDEX idx_products_category_id ON products(category_id);
CREATE INDEX idx_orders_buyer_id ON orders(buyer_id);
