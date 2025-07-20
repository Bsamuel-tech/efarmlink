const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Pool } = require('pg');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Database connection
const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'efarmlink',
  password: process.env.DB_PASSWORD || 'password',
  port: process.env.DB_PORT || 5432,
});

// JWT Secret
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Test database connection
pool.connect((err, client, release) => {
  if (err) {
    console.error('Error connecting to database:', err);
  } else {
    console.log('Connected to PostgreSQL database');
    release();
  }
});

// Auth middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid token' });
    }
    req.user = user;
    next();
  });
};

// Routes

// User Registration
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, phone, location, password, userType } = req.body;

    // Check if user already exists
    const existingUser = await pool.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );

    if (existingUser.rows.length > 0) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Insert new user
    const newUser = await pool.query(
      `INSERT INTO users (name, email, phone, location, password_hash, user_type) 
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING id, name, email, phone, location, user_type`,
      [name, email, phone, location, hashedPassword, userType]
    );

    // Generate JWT token
    const token = jwt.sign(
      { 
        userId: newUser.rows[0].id, 
        email: newUser.rows[0].email,
        userType: newUser.rows[0].user_type 
      },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(201).json({
      message: 'User created successfully',
      token,
      user: newUser.rows[0]
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// User Login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password, userType } = req.body;

    // Find user
    const user = await pool.query(
      'SELECT * FROM users WHERE email = $1 AND user_type = $2',
      [email, userType]
    );

    if (user.rows.length === 0) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    // Check password
    const validPassword = await bcrypt.compare(password, user.rows[0].password_hash);
    if (!validPassword) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { 
        userId: user.rows[0].id, 
        email: user.rows[0].email,
        userType: user.rows[0].user_type 
      },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    const { password_hash, ...userWithoutPassword } = user.rows[0];

    res.json({
      message: 'Login successful',
      token,
      user: userWithoutPassword
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get user profile
app.get('/api/user/profile', authenticateToken, async (req, res) => {
  try {
    const user = await pool.query(
      'SELECT id, name, email, phone, location, user_type, created_at FROM users WHERE id = $1',
      [req.user.userId]
    );

    if (user.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(user.rows[0]);
  } catch (error) {
    console.error('Profile fetch error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Products Routes

// Get all products
app.get('/api/products', async (req, res) => {
  try {
    const { category, location, search } = req.query;
    let query = `
      SELECT p.*, u.name as farmer_name, u.phone as farmer_phone 
      FROM products p 
      JOIN users u ON p.farmer_id = u.id 
      WHERE p.is_available = true
    `;
    const params = [];

    if (category) {
      params.push(category);
      query += ` AND p.category = $${params.length}`;
    }

    if (location) {
      params.push(`%${location}%`);
      query += ` AND p.location ILIKE $${params.length}`;
    }

    if (search) {
      params.push(`%${search}%`);
      query += ` AND (p.name ILIKE $${params.length} OR p.description ILIKE $${params.length})`;
    }

    query += ' ORDER BY p.created_at DESC';

    const products = await pool.query(query, params);
    res.json(products.rows);
  } catch (error) {
    console.error('Products fetch error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get farmer's products
app.get('/api/products/farmer', authenticateToken, async (req, res) => {
  try {
    const products = await pool.query(
      'SELECT * FROM products WHERE farmer_id = $1 ORDER BY created_at DESC',
      [req.user.userId]
    );
    res.json(products.rows);
  } catch (error) {
    console.error('Farmer products fetch error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Add new product
app.post('/api/products', authenticateToken, async (req, res) => {
  try {
    const { name, description, category, quantity_available, unit, price_per_unit, location, harvest_date, expiry_date, is_organic } = req.body;

    const newProduct = await pool.query(
      `INSERT INTO products (farmer_id, name, description, category, quantity_available, unit, price_per_unit, location, harvest_date, expiry_date, is_organic) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *`,
      [req.user.userId, name, description, category, quantity_available, unit, price_per_unit, location, harvest_date, expiry_date, is_organic]
    );

    res.status(201).json(newProduct.rows[0]);
  } catch (error) {
    console.error('Product creation error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update product
app.put('/api/products/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, category, quantity_available, unit, price_per_unit, location, is_available, is_organic } = req.body;

    const updatedProduct = await pool.query(
      `UPDATE products SET name = $1, description = $2, category = $3, quantity_available = $4, 
       unit = $5, price_per_unit = $6, location = $7, is_available = $8, is_organic = $9, updated_at = NOW()
       WHERE id = $10 AND farmer_id = $11 RETURNING *`,
      [name, description, category, quantity_available, unit, price_per_unit, location, is_available, is_organic, id, req.user.userId]
    );

    if (updatedProduct.rows.length === 0) {
      return res.status(404).json({ error: 'Product not found or unauthorized' });
    }

    res.json(updatedProduct.rows[0]);
  } catch (error) {
    console.error('Product update error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete product
app.delete('/api/products/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    const deletedProduct = await pool.query(
      'DELETE FROM products WHERE id = $1 AND farmer_id = $2 RETURNING *',
      [id, req.user.userId]
    );

    if (deletedProduct.rows.length === 0) {
      return res.status(404).json({ error: 'Product not found or unauthorized' });
    }

    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Product deletion error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Orders Routes

// Create order
app.post('/api/orders', authenticateToken, async (req, res) => {
  try {
    const { product_id, quantity_ordered, delivery_address, notes } = req.body;

    // Get product details
    const product = await pool.query(
      'SELECT * FROM products WHERE id = $1',
      [product_id]
    );

    if (product.rows.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }

    const unit_price = product.rows[0].price_per_unit;
    const total_amount = unit_price * quantity_ordered;

    const newOrder = await pool.query(
      `INSERT INTO orders (buyer_id, farmer_id, product_id, quantity_ordered, unit_price, total_amount, delivery_address, notes) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
      [req.user.userId, product.rows[0].farmer_id, product_id, quantity_ordered, unit_price, total_amount, delivery_address, notes]
    );

    res.status(201).json(newOrder.rows[0]);
  } catch (error) {
    console.error('Order creation error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get user orders
app.get('/api/orders', authenticateToken, async (req, res) => {
  try {
    let query;
    if (req.user.userType === 'farmer') {
      query = `
        SELECT o.*, p.name as product_name, u.name as buyer_name, u.phone as buyer_phone
        FROM orders o
        JOIN products p ON o.product_id = p.id
        JOIN users u ON o.buyer_id = u.id
        WHERE o.farmer_id = $1
        ORDER BY o.created_at DESC
      `;
    } else {
      query = `
        SELECT o.*, p.name as product_name, u.name as farmer_name, u.phone as farmer_phone
        FROM orders o
        JOIN products p ON o.product_id = p.id
        JOIN users u ON o.farmer_id = u.id
        WHERE o.buyer_id = $1
        ORDER BY o.created_at DESC
      `;
    }

    const orders = await pool.query(query, [req.user.userId]);
    res.json(orders.rows);
  } catch (error) {
    console.error('Orders fetch error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update order status
app.put('/api/orders/:id/status', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const updatedOrder = await pool.query(
      'UPDATE orders SET status = $1, updated_at = NOW() WHERE id = $2 AND farmer_id = $3 RETURNING *',
      [status, id, req.user.userId]
    );

    if (updatedOrder.rows.length === 0) {
      return res.status(404).json({ error: 'Order not found or unauthorized' });
    }

    res.json(updatedOrder.rows[0]);
  } catch (error) {
    console.error('Order status update error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Messages Routes

// Send message
app.post('/api/messages', authenticateToken, async (req, res) => {
  try {
    const { receiver_id, message_text, order_id, product_id } = req.body;

    const newMessage = await pool.query(
      `INSERT INTO messages (sender_id, receiver_id, message_text, order_id, product_id) 
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [req.user.userId, receiver_id, message_text, order_id, product_id]
    );

    res.status(201).json(newMessage.rows[0]);
  } catch (error) {
    console.error('Message creation error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get conversations
app.get('/api/messages/conversations', authenticateToken, async (req, res) => {
  try {
    const conversations = await pool.query(
      `SELECT DISTINCT 
        CASE 
          WHEN sender_id = $1 THEN receiver_id 
          ELSE sender_id 
        END as other_user_id,
        u.name as other_user_name,
        MAX(m.created_at) as last_message_time
       FROM messages m
       JOIN users u ON u.id = CASE 
         WHEN m.sender_id = $1 THEN m.receiver_id 
         ELSE m.sender_id 
       END
       WHERE sender_id = $1 OR receiver_id = $1
       GROUP BY other_user_id, u.name
       ORDER BY last_message_time DESC`,
      [req.user.userId]
    );

    res.json(conversations.rows);
  } catch (error) {
    console.error('Conversations fetch error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get messages between two users
app.get('/api/messages/:userId', authenticateToken, async (req, res) => {
  try {
    const { userId } = req.params;

    const messages = await pool.query(
      `SELECT m.*, u.name as sender_name 
       FROM messages m
       JOIN users u ON m.sender_id = u.id
       WHERE (sender_id = $1 AND receiver_id = $2) OR (sender_id = $2 AND receiver_id = $1)
       ORDER BY created_at ASC`,
      [req.user.userId, userId]
    );

    // Mark messages as read
    await pool.query(
      'UPDATE messages SET is_read = true WHERE sender_id = $1 AND receiver_id = $2',
      [userId, req.user.userId]
    );

    res.json(messages.rows);
  } catch (error) {
    console.error('Messages fetch error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Market Prices Routes

// Get market prices
app.get('/api/market-prices', async (req, res) => {
  try {
    const { product_name, region, date } = req.query;
    let query = 'SELECT * FROM market_prices WHERE 1=1';
    const params = [];

    if (product_name) {
      params.push(product_name);
      query += ` AND product_name = $${params.length}`;
    }

    if (region) {
      params.push(region);
      query += ` AND region = $${params.length}`;
    }

    if (date) {
      params.push(date);
      query += ` AND price_date = $${params.length}`;
    }

    query += ' ORDER BY price_date DESC, product_name';

    const prices = await pool.query(query, params);
    res.json(prices.rows);
  } catch (error) {
    console.error('Market prices fetch error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'E-FarmLink API is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});