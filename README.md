# 📦 E-FarmLink PostgreSQL Database Structure

> This database powers the core functionality of E-FarmLink. Buyers can easily locate nearby farmers, browse listed farm products, and communicate directly without needing to place traditional online orders.

---

## 🔐 Auth Flow
- Users (buyers or farmers) sign up via email, phone, password, and location info.
- Upon login, user is redirected to a dashboard based on their role (farmer/buyer).

---

## 🗂 Tables & Column Descriptions

### 🧑‍🌾 `users`
Stores general account info.

| Column            | Type      | Description                          |
|-------------------|-----------|--------------------------------------|
| id                | string pk | Unique user ID                       |
| name              | string    | Full name                            |
| email             | string    | Email address                        |
| phone             | string    | Phone number                         |
| password_hash     | string    | Encrypted password                   |
| role              | string    | `farmer` or `buyer`                  |
| is_verified       | boolean   | Email/phone verification status      |
| profile_photo_url | string    | Profile picture                      |
| created_at        | timestamp | Account creation timestamp           |

---

### 📍 `locations`
Geographic info used for search, proximity, and profile.

| Column     | Type    | Description            |
|------------|---------|------------------------|
| id         | string pk | Unique location ID   |
| address    | string  | Street address         |
| city       | string  | City                   |
| region     | string  | Region or province     |
| latitude   | float   | GPS latitude           |
| longitude  | float   | GPS longitude          |
| description| string  | Optional note          |

---

### 🌾 `farmers`
Extension of user profile (for farmers).

| Column           | Type      | Description                   |
|------------------|-----------|-------------------------------|
| id               | string pk | Unique farmer profile ID      |
| location_id      | string    | Links to `locations`          |
| farm_name        | string    | Farmer’s business name        |
| farm_description | string    | About the farm                |
| experience_years | int       | Years of farming experience   |
| user_id          | string    | FK → `users.id`               |

---

### 🛒 `buyers`
Extension of user profile (for buyers).

| Column        | Type      | Description                      |
|---------------|-----------|----------------------------------|
| id            | string pk | Unique buyer profile ID          |
| business_name | string    | Company or store name            |
| business_type | string    | Retailer, wholesaler, etc.       |
| preferences   | string    | Buyer interests (optional)       |
| location_id   | string    | FK → `locations.id`              |
| user_id       | string    | FK → `users.id`                  |

---

### 🥕 `products`
Farm items listed by farmers.

| Column         | Type      | Description                     |
|----------------|-----------|---------------------------------|
| id             | string pk | Product ID                      |
| location_id    | string    | FK → `locations.id`             |
| name           | string    | Product name                    |
| description    | string    | Short description               |
| category       | string    | Crop, fruit, etc.               |
| quantity       | int       | Total quantity available        |
| unit           | string    | E.g. kg, bag, crate             |
| price_per_unit | float     | Selling price                   |
| farmer_id      | string    | FK → `farmers.id`               |
| available_from | date      | Start of availability           |
| available_until| date      | End of availability             |
| created_at     | timestamp | Date listed                     |
| is_active      | boolean   | Is product still listed?        |

---

### 📬 `messages`
For buyer–farmer conversations.

| Column           | Type      | Description                    |
|------------------|-----------|--------------------------------|
| id               | string pk | Unique message ID              |
| related_product_id| string   | Optional: link to a product    |
| sender_id        | string    | FK → `users.id`                |
| receiver_id      | string    | FK → `users.id`                |
| content          | string    | Message body                   |
| sent_at          | timestamp | Timestamp                      |
| is_read          | boolean   | Read status                    |

---

### 🧾 `transactions`
Tracks buyer visits, prices agreed, and meeting points.

| Column             | Type      | Description                            |
|--------------------|-----------|----------------------------------------|
| id                 | string pk | Transaction/meeting ID                 |
| buyer_id           | string    | FK → `buyers.id`                       |
| farmer_id          | string    | FK → `farmers.id`                      |
| product_id         | string    | FK → `products.id`                     |
| quantity           | int       | Quantity buyer accepted                |
| unit               | string    | Measurement unit                       |
| agreed_price       | float     | Final price agreed                     |
| transaction_date   | date      | When they met                         |
| meeting_location_id| string    | FK → `locations.id`                    |
| status             | string    | `completed`, `cancelled`, etc.         |
| notes              | string    | Optional remarks                       |

---

### 📢 `buyer_needs`
Let buyers broadcast what they are searching for.

| Column              | Type      | Description                      |
|---------------------|-----------|----------------------------------|
| id                  | string pk | Unique post ID                   |
| product_name        | string    | Desired item                     |
| category            | string    | Category of crop                 |
| quantity            | int       | Desired amount                   |
| unit                | string    | Measurement unit                 |
| max_price_per_unit  | float     | Buyer’s budget per unit          |
| needed_by           | date      | Deadline to get the item         |
| created_at          | timestamp | Post timestamp                   |
| is_active           | boolean   | Still relevant?                  |
| buyer_id            | string    | FK → `buyers.id`                 |
| location_id         | string    | FK → `locations.id`              |

---

## 📌 Summary: Core System Flow

1. **Signup/Login**
   - User chooses role (Farmer or Buyer).
   - Provides contact info and preferred location.
   - Redirected to appropriate dashboard.

2. **Farmer Dashboard**
   - Post new farm products.
   - Chat with buyers.
   - View nearby buyer needs.
   - Manage posted listings.

3. **Buyer Dashboard**
   - View nearby farmers & their products (by location).
   - Post buyer needs (like a wanted ad).
   - Chat directly with farmers.
   - View saved chats, previous transactions.

---

## ✅ Key Notes for Developer

- Every user must be linked to a **location**.
- A buyer finds products **based on proximity**, not by traditional e-commerce cart/order.
- All relations use foreign keys to ensure **data consistency**.
- **No ordering system** is enforced — buyer contacts and agrees physically.
- Messages, locations, and transactions help track & coordinate offline deals.

---
