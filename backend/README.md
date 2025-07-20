# E-FarmLink Backend API

A Node.js/Express backend API for the E-FarmLink platform that connects farmers and buyers.

## Features

- **User Authentication**: JWT-based authentication for farmers and buyers
- **Product Management**: CRUD operations for farm products
- **Order Management**: Order placement and tracking
- **Messaging System**: Real-time communication between users
- **Market Prices**: Historical and current market price data
- **Database Integration**: PostgreSQL with proper schema design

## Tech Stack

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **PostgreSQL** - Database
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **CORS** - Cross-origin resource sharing

## Setup Instructions

### 1. Prerequisites

- Node.js (v14 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn

### 2. Installation

```bash
# Clone the repository
git clone <repository-url>
cd backend

# Install dependencies
npm install

# Create environment file
cp .env.example .env
```

### 3. Database Setup

```bash
# Create PostgreSQL database
createdb efarmlink

# Run the schema script
psql -d efarmlink -f database/schema.sql
```

### 4. Environment Configuration

Edit the `.env` file with your database credentials:

```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=efarmlink
DB_USER=your_username
DB_PASSWORD=your_password
JWT_SECRET=your-super-secret-jwt-key
PORT=5000
```

### 5. Start the Server

```bash
# Development mode
npm run dev

# Production mode
npm start
```

The API will be available at `http://localhost:5000`

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/user/profile` - Get user profile (protected)

### Products

- `GET /api/products` - Get all products (with filters)
- `GET /api/products/farmer` - Get farmer's products (protected)
- `POST /api/products` - Create new product (protected)
- `PUT /api/products/:id` - Update product (protected)
- `DELETE /api/products/:id` - Delete product (protected)

### Orders

- `POST /api/orders` - Create new order (protected)
- `GET /api/orders` - Get user orders (protected)
- `PUT /api/orders/:id/status` - Update order status (protected)

### Messages

- `POST /api/messages` - Send message (protected)
- `GET /api/messages/conversations` - Get conversations (protected)
- `GET /api/messages/:userId` - Get messages with specific user (protected)

### Market Prices

- `GET /api/market-prices` - Get market prices (with filters)

### Health Check

- `GET /api/health` - API health status

## Request/Response Examples

### Register User

```bash
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+233 24 123 4567",
  "location": "Kumasi, Ashanti",
  "password": "securepassword",
  "userType": "farmer"
}
```

### Login

```bash
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "securepassword",
  "userType": "farmer"
}
```

### Create Product

```bash
POST /api/products
Authorization: Bearer <jwt-token>
Content-Type: application/json

{
  "name": "Fresh Tomatoes",
  "description": "Organic tomatoes from our farm",
  "category": "Vegetables",
  "quantity_available": 100,
  "unit": "kg",
  "price_per_unit": 5.50,
  "location": "Kumasi, Ashanti",
  "is_organic": true
}
```

## Database Schema

The database includes the following main tables:

- **users** - User accounts (farmers and buyers)
- **products** - Product listings
- **orders** - Purchase orders
- **messages** - User communications
- **buyer_needs** - Buyer requirements
- **market_prices** - Market price data
- **reviews** - User reviews

## Security Features

- Password hashing with bcrypt
- JWT token authentication
- Input validation
- SQL injection prevention
- CORS configuration

## Error Handling

The API returns consistent error responses:

```json
{
  "error": "Error message description"
}
```

Common HTTP status codes:
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error

## Development

### Running Tests

```bash
npm test
```

### Code Structure

```
backend/
├── server.js          # Main server file
├── package.json       # Dependencies
├── .env.example       # Environment template
├── database/
│   └── schema.sql     # Database schema
└── README.md          # This file
```

## Deployment

### Environment Variables for Production

```env
NODE_ENV=production
DB_HOST=your-production-db-host
DB_NAME=your-production-db-name
DB_USER=your-production-db-user
DB_PASSWORD=your-production-db-password
JWT_SECRET=your-super-secure-production-jwt-secret
PORT=5000
```

### Docker Deployment (Optional)

```dockerfile
FROM node:16-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 5000
CMD ["npm", "start"]
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.