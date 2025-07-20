# E-FarmLink Database Schema

## Overview
This document outlines the complete database schema for the E-FarmLink platform, showing how farmers and buyers connect through products, orders, and messaging.

## Database Tables

### 1. Users Table
**Purpose**: Store all user accounts (both farmers and buyers)

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  location VARCHAR(255) NOT NULL,
  user_type VARCHAR(10) NOT NULL CHECK (user_type IN ('farmer', 'buyer')),
  profile_image_url VARCHAR(500),
  is_verified BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
```

**Key Fields**:
- `id`: Unique identifier for each user
- `user_type`: Distinguishes between 'farmer' and 'buyer'
- `location`: Used for matching nearby farmers and buyers
- `is_verified`: For account verification status

---

### 2. Products Table
**Purpose**: Store all products listed by farmers

```sql
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  farmer_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  category VARCHAR(100) NOT NULL,
  quantity_available INTEGER NOT NULL,
  unit VARCHAR(50) NOT NULL, -- kg, bags, crates, etc.
  price_per_unit DECIMAL(10,2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'GHS',
  harvest_date DATE,
  expiry_date DATE,
  location VARCHAR(255) NOT NULL,
  is_available BOOLEAN DEFAULT true,
  is_organic BOOLEAN DEFAULT false,
  images JSONB, -- Array of image URLs
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
```

**Key Fields**:
- `farmer_id`: Links to the farmer who owns this product
- `quantity_available`: Current stock level
- `price_per_unit`: Price for the specified unit
- `location`: Where the product is available for pickup/delivery

---

### 3. Orders Table
**Purpose**: Track all purchase orders between buyers and farmers

```sql
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  buyer_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  farmer_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  quantity_ordered INTEGER NOT NULL,
  unit_price DECIMAL(10,2) NOT NULL,
  total_amount DECIMAL(10,2) NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'pending' 
    CHECK (status IN ('pending', 'confirmed', 'in_progress', 'delivered', 'cancelled')),
  delivery_address TEXT,
  delivery_date DATE,
  payment_status VARCHAR(20) DEFAULT 'pending'
    CHECK (payment_status IN ('pending', 'paid', 'failed', 'refunded')),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
```

**Key Fields**:
- `buyer_id`: Who placed the order
- `farmer_id`: Who will fulfill the order
- `product_id`: What product was ordered
- `status`: Current order status
- `total_amount`: Final price calculation

---

### 4. Messages Table
**Purpose**: Handle all chat communications between users

```sql
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  receiver_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  order_id UUID REFERENCES orders(id) ON DELETE SET NULL,
  product_id UUID REFERENCES products(id) ON DELETE SET NULL,
  message_text TEXT NOT NULL,
  message_type VARCHAR(20) DEFAULT 'text' 
    CHECK (message_type IN ('text', 'image', 'file', 'location')),
  attachment_url VARCHAR(500),
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);
```

**Key Fields**:
- `sender_id` & `receiver_id`: Who sent and received the message
- `order_id`: Optional link to specific order discussion
- `product_id`: Optional link to product inquiry
- `is_read`: Track message read status

---

### 5. Buyer Needs Table
**Purpose**: Store buyer requirements when they post what they need

```sql
CREATE TABLE buyer_needs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  buyer_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  product_name VARCHAR(255) NOT NULL,
  description TEXT,
  quantity_needed INTEGER NOT NULL,
  unit VARCHAR(50) NOT NULL,
  budget_min DECIMAL(10,2),
  budget_max DECIMAL(10,2),
  preferred_location VARCHAR(255),
  needed_by_date DATE,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
```

**Key Fields**:
- `buyer_id`: Who posted the need
- `product_name`: What they're looking for
- `budget_min/max`: Price range they're willing to pay
- `needed_by_date`: When they need it

---

### 6. Market Prices Table
**Purpose**: Track historical and current market prices

```sql
CREATE TABLE market_prices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_name VARCHAR(255) NOT NULL,
  category VARCHAR(100) NOT NULL,
  region VARCHAR(100) NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  unit VARCHAR(50) NOT NULL,
  currency VARCHAR(3) DEFAULT 'GHS',
  price_date DATE NOT NULL,
  source VARCHAR(100), -- Where the price data came from
  created_at TIMESTAMPTZ DEFAULT now()
);
```

**Key Fields**:
- `product_name`: What product this price is for
- `region`: Geographic area for this price
- `price_date`: When this price was recorded
- `source`: Data source for verification

---

### 7. Reviews Table
**Purpose**: Allow buyers to review farmers and vice versa

```sql
CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reviewer_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  reviewed_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  review_text TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);
```

**Key Fields**:
- `reviewer_id`: Who wrote the review
- `reviewed_id`: Who is being reviewed
- `order_id`: Which transaction this review is about
- `rating`: 1-5 star rating

---

## Table Relationships

### Primary Relationships

1. **Users → Products** (One-to-Many)
   - One farmer can have many products
   - `products.farmer_id` → `users.id`

2. **Users → Orders** (One-to-Many, twice)
   - One buyer can place many orders: `orders.buyer_id` → `users.id`
   - One farmer can receive many orders: `orders.farmer_id` → `users.id`

3. **Products → Orders** (One-to-Many)
   - One product can be ordered multiple times
   - `orders.product_id` → `products.id`

4. **Users → Messages** (One-to-Many, twice)
   - One user can send many messages: `messages.sender_id` → `users.id`
   - One user can receive many messages: `messages.receiver_id` → `users.id`

5. **Users → Buyer Needs** (One-to-Many)
   - One buyer can post many needs
   - `buyer_needs.buyer_id` → `users.id`

6. **Orders → Reviews** (One-to-One)
   - Each order can have one review
   - `reviews.order_id` → `orders.id`

### Secondary Relationships

1. **Messages → Orders** (Many-to-One, Optional)
   - Messages can reference specific orders
   - `messages.order_id` → `orders.id`

2. **Messages → Products** (Many-to-One, Optional)
   - Messages can reference specific products
   - `messages.product_id` → `products.id`

## Data Flow Examples

### 1. Farmer Lists a Product
```
1. Farmer logs in → users table
2. Farmer creates product → products table
3. Product appears in buyer searches
```

### 2. Buyer Places Order
```
1. Buyer searches products → products table
2. Buyer contacts farmer → messages table
3. Buyer places order → orders table
4. Farmer receives notification
```

### 3. Order Fulfillment
```
1. Farmer confirms order → orders.status = 'confirmed'
2. Farmer updates progress → orders.status = 'in_progress'
3. Order delivered → orders.status = 'delivered'
4. Buyer leaves review → reviews table
```

### 4. Communication Flow
```
1. Buyer sees product → products table
2. Buyer sends message → messages table (with product_id)
3. Farmer responds → messages table
4. Order placed → orders table
5. Order-specific messages → messages table (with order_id)
```

## Indexes for Performance

```sql
-- User lookups
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_type_location ON users(user_type, location);

-- Product searches
CREATE INDEX idx_products_farmer ON products(farmer_id);
CREATE INDEX idx_products_category_location ON products(category, location);
CREATE INDEX idx_products_available ON products(is_available);

-- Order tracking
CREATE INDEX idx_orders_buyer ON orders(buyer_id);
CREATE INDEX idx_orders_farmer ON orders(farmer_id);
CREATE INDEX idx_orders_status ON orders(status);

-- Message queries
CREATE INDEX idx_messages_conversation ON messages(sender_id, receiver_id);
CREATE INDEX idx_messages_receiver_unread ON messages(receiver_id, is_read);

-- Market price lookups
CREATE INDEX idx_market_prices_product_region ON market_prices(product_name, region);
CREATE INDEX idx_market_prices_date ON market_prices(price_date);
```

## Security Considerations

### Row Level Security (RLS)
```sql
-- Users can only see their own data
CREATE POLICY "Users can view own profile" ON users
  FOR SELECT USING (auth.uid() = id);

-- Farmers can only manage their own products
CREATE POLICY "Farmers manage own products" ON products
  FOR ALL USING (auth.uid() = farmer_id);

-- Users can only see their own orders
CREATE POLICY "Users see own orders" ON orders
  FOR SELECT USING (auth.uid() = buyer_id OR auth.uid() = farmer_id);

-- Users can only see messages they sent or received
CREATE POLICY "Users see own messages" ON messages
  FOR SELECT USING (auth.uid() = sender_id OR auth.uid() = receiver_id);
```

This schema provides a solid foundation for the E-FarmLink platform, ensuring data integrity, performance, and security while supporting all the core features like product listings, orders, messaging, and market price tracking.