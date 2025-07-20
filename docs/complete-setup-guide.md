# 🚀 Complete Setup Guide for E-FarmLink Platform

This guide will walk you through setting up both the frontend and backend of the E-FarmLink platform in VS Code.

## 📋 Prerequisites

Before starting, make sure you have these installed:

### Required Software:
1. **Node.js** (v16 or higher) - [Download here](https://nodejs.org/)
2. **PostgreSQL** (v12 or higher) - [Download here](https://www.postgresql.org/download/)
3. **VS Code** - [Download here](https://code.visualstudio.com/)
4. **Git** - [Download here](https://git-scm.com/)

### Recommended VS Code Extensions:
- **ES7+ React/Redux/React-Native snippets**
- **Prettier - Code formatter**
- **Auto Rename Tag**
- **Bracket Pair Colorizer**
- **PostgreSQL** (by Chris Kolkman)
- **Thunder Client** (for API testing)

## 🗂️ Project Structure

Your project should look like this:
```
e-farmlink/
├── frontend/                 # React frontend
│   ├── src/
│   ├── package.json
│   └── ...
├── backend/                  # Node.js backend
│   ├── server.js
│   ├── package.json
│   ├── database/
│   │   └── schema.sql
│   └── ...
└── README.md
```

## 🛠️ Step-by-Step Setup

### Step 1: Clone and Setup Project Structure

```bash
# Create main project directory
mkdir e-farmlink
cd e-farmlink

# Create frontend directory (copy your current frontend files here)
mkdir frontend
# Copy all your current React files to frontend/

# Create backend directory
mkdir backend
# Copy all backend files to backend/
```

### Step 2: Database Setup

#### 2.1 Install PostgreSQL
- Download and install PostgreSQL
- Remember your postgres user password
- Make sure PostgreSQL service is running

#### 2.2 Create Database
```bash
# Open terminal/command prompt
# Login to PostgreSQL (enter your password when prompted)
psql -U postgres

# Create database
CREATE DATABASE efarmlink;

# Exit PostgreSQL
\q
```

#### 2.3 Run Database Schema
```bash
# Navigate to backend directory
cd backend

# Run the schema file
psql -U postgres -d efarmlink -f database/schema.sql
```

### Step 3: Backend Setup

#### 3.1 Install Dependencies
```bash
# Make sure you're in the backend directory
cd backend

# Install all dependencies
npm install
```

#### 3.2 Environment Configuration
```bash
# Copy environment template
cp .env.example .env

# Edit .env file with your database credentials
```

Edit the `.env` file:
```env
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=efarmlink
DB_USER=postgres
DB_PASSWORD=your_postgres_password_here

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Server Configuration
PORT=5000
NODE_ENV=development

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:3000
```

#### 3.3 Test Backend
```bash
# Start the backend server
npm run dev

# You should see:
# "Server is running on port 5000"
# "Connected to PostgreSQL database"
```

### Step 4: Frontend Setup

#### 4.1 Install Dependencies
```bash
# Open new terminal and navigate to frontend
cd frontend

# Install dependencies
npm install
```

#### 4.2 Environment Configuration
```bash
# Create environment file
cp .env.example .env
```

Edit the `.env` file:
```env
VITE_API_URL=http://localhost:5000/api
```

#### 4.3 Test Frontend
```bash
# Start the frontend development server
npm run dev

# You should see:
# "Local: http://localhost:5173"
```

## 🔧 Running Both Frontend and Backend

### Option 1: Two Separate Terminals

**Terminal 1 (Backend):**
```bash
cd backend
npm run dev
```

**Terminal 2 (Frontend):**
```bash
cd frontend
npm run dev
```

### Option 2: VS Code Integrated Terminals

1. Open VS Code
2. Open the main project folder (`e-farmlink`)
3. Open Terminal → Split Terminal
4. In first terminal: `cd backend && npm run dev`
5. In second terminal: `cd frontend && npm run dev`

### Option 3: Using npm-run-all (Recommended)

Install concurrently to run both at once:

```bash
# In the main project directory
npm install -g concurrently

# Create package.json in root
```

Create `package.json` in root directory:
```json
{
  "name": "e-farmlink-fullstack",
  "scripts": {
    "dev": "concurrently \"cd backend && npm run dev\" \"cd frontend && npm run dev\"",
    "start": "concurrently \"cd backend && npm start\" \"cd frontend && npm run build && npm run preview\""
  },
  "devDependencies": {
    "concurrently": "^7.6.0"
  }
}
```

Then run:
```bash
npm run dev
```

## 🧪 Testing the Application

### 1. Test Database Connection
- Backend should show "Connected to PostgreSQL database"
- Check `http://localhost:5000/api/health` - should return `{"status": "OK"}`

### 2. Test Authentication
- Go to `http://localhost:5173`
- Try signing up as a farmer or buyer
- Check if you can login with the created account

### 3. Test API Endpoints
Use Thunder Client or Postman:

**Health Check:**
```
GET http://localhost:5000/api/health
```

**Register User:**
```
POST http://localhost:5000/api/auth/register
Content-Type: application/json

{
  "name": "Test User",
  "email": "test@example.com",
  "phone": "+233 24 123 4567",
  "location": "Accra, Ghana",
  "password": "password123",
  "userType": "farmer"
}
```

## ⚠️ Common Issues and Solutions

### Issue 1: Database Connection Error
**Error:** `Error connecting to database`

**Solutions:**
1. Check if PostgreSQL is running:
   ```bash
   # Windows
   net start postgresql-x64-14
   
   # macOS
   brew services start postgresql
   
   # Linux
   sudo systemctl start postgresql
   ```

2. Verify database credentials in `.env`
3. Make sure database `efarmlink` exists

### Issue 2: Port Already in Use
**Error:** `Port 5000 is already in use`

**Solutions:**
1. Kill the process using the port:
   ```bash
   # Find process using port 5000
   lsof -i :5000
   
   # Kill the process (replace PID with actual process ID)
   kill -9 PID
   ```

2. Or change the port in backend `.env`:
   ```env
   PORT=5001
   ```

### Issue 3: CORS Errors
**Error:** `Access to fetch at 'http://localhost:5000' from origin 'http://localhost:3000' has been blocked by CORS policy`

**Solutions:**
1. Make sure backend is running
2. Check CORS configuration in `server.js`
3. Verify `FRONTEND_URL` in backend `.env`

### Issue 4: Module Not Found
**Error:** `Cannot find module 'express'`

**Solutions:**
1. Delete `node_modules` and reinstall:
   ```bash
   rm -rf node_modules
   npm install
   ```

2. Check if you're in the correct directory
3. Verify `package.json` exists

### Issue 5: JWT Token Issues
**Error:** `Invalid token` or authentication not working

**Solutions:**
1. Clear browser localStorage:
   ```javascript
   // In browser console
   localStorage.clear()
   ```

2. Check JWT_SECRET in backend `.env`
3. Make sure token is being sent in requests

## 📱 Development Workflow

### Daily Development Routine:

1. **Start Development:**
   ```bash
   # Terminal 1: Backend
   cd backend && npm run dev
   
   # Terminal 2: Frontend  
   cd frontend && npm run dev
   ```

2. **Make Changes:**
   - Edit files in VS Code
   - Both servers auto-reload on changes

3. **Test Changes:**
   - Frontend: `http://localhost:5173`
   - Backend API: `http://localhost:5000/api`

4. **Debug Issues:**
   - Check terminal logs
   - Use browser developer tools
   - Check database with pgAdmin or psql

## 🚀 Production Deployment

### Backend Deployment (Heroku/Railway/DigitalOcean):
1. Set environment variables
2. Use production database
3. Change `NODE_ENV=production`

### Frontend Deployment (Netlify/Vercel):
1. Build the project: `npm run build`
2. Deploy the `dist` folder
3. Set `VITE_API_URL` to production backend URL

## 📚 Additional Resources

### Documentation:
- [React Documentation](https://react.dev/)
- [Express.js Documentation](https://expressjs.com/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)

### Useful Commands:

**Database:**
```bash
# Connect to database
psql -U postgres -d efarmlink

# List tables
\dt

# Describe table
\d users

# Exit
\q
```

**Git:**
```bash
# Initialize git (if not done)
git init
git add .
git commit -m "Initial commit"

# Create .gitignore
echo "node_modules/
.env
dist/
*.log" > .gitignore
```

**Package Management:**
```bash
# Install new package (backend)
cd backend && npm install package-name

# Install new package (frontend)
cd frontend && npm install package-name

# Update all packages
npm update
```

## 🎯 Success Checklist

- [ ] PostgreSQL installed and running
- [ ] Database `efarmlink` created
- [ ] Backend running on `http://localhost:5000`
- [ ] Frontend running on `http://localhost:5173`
- [ ] Can register new users
- [ ] Can login with created users
- [ ] API endpoints responding correctly
- [ ] No CORS errors
- [ ] Database tables populated with test data

## 🆘 Getting Help

If you encounter issues:

1. **Check the logs** in both terminal windows
2. **Verify all environment variables** are set correctly
3. **Test API endpoints** individually
4. **Check database connection** and data
5. **Clear browser cache** and localStorage
6. **Restart both servers** if needed

Remember: Most issues are related to:
- Wrong environment variables
- Database not running
- Port conflicts
- Missing dependencies

Good luck with your E-FarmLink platform! 🌱