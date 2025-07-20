const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// API client for backend communication
class ApiClient {
  private baseURL: string;
  private token: string | null = null;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
    this.token = localStorage.getItem('authToken');
  }

  setToken(token: string | null) {
    this.token = token;
    if (token) {
      localStorage.setItem('authToken', token);
    } else {
      localStorage.removeItem('authToken');
    }
  }

  private async request(endpoint: string, options: RequestInit = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`;
    }

    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Network error' }));
      throw new Error(error.error || `HTTP ${response.status}`);
    }

    return response.json();
  }

  // Auth methods
  async login(email: string, password: string, userType: string) {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password, userType }),
    });
  }

  async register(userData: any) {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async getProfile() {
    return this.request('/user/profile');
  }

  // Products methods
  async getProducts(filters?: any) {
    const params = new URLSearchParams(filters);
    return this.request(`/products?${params}`);
  }

  async getFarmerProducts() {
    return this.request('/products/farmer');
  }

  async addProduct(productData: any) {
    return this.request('/products', {
      method: 'POST',
      body: JSON.stringify(productData),
    });
  }

  async updateProduct(id: string, productData: any) {
    return this.request(`/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(productData),
    });
  }

  async deleteProduct(id: string) {
    return this.request(`/products/${id}`, {
      method: 'DELETE',
    });
  }

  // Orders methods
  async getOrders() {
    return this.request('/orders');
  }

  async createOrder(orderData: any) {
    return this.request('/orders', {
      method: 'POST',
      body: JSON.stringify(orderData),
    });
  }

  async updateOrderStatus(id: string, status: string) {
    return this.request(`/orders/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
  }

  // Messages methods
  async getConversations() {
    return this.request('/messages/conversations');
  }

  async getMessages(userId: string) {
    return this.request(`/messages/${userId}`);
  }

  async sendMessage(messageData: any) {
    return this.request('/messages', {
      method: 'POST',
      body: JSON.stringify(messageData),
    });
  }

  // Market prices
  async getMarketPrices(filters?: any) {
    const params = new URLSearchParams(filters);
    return this.request(`/market-prices?${params}`);
  }
}

export const apiClient = new ApiClient(API_BASE_URL);

// Types
export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  location: string;
  user_type: 'farmer' | 'buyer';
  created_at: string;
}

export interface Product {
  id: string;
  farmer_id: string;
  name: string;
  description?: string;
  category: string;
  quantity_available: number;
  unit: string;
  price_per_unit: number;
  location: string;
  is_available: boolean;
  is_organic: boolean;
  created_at: string;
  farmer_name?: string;
  farmer_phone?: string;
}

export interface Order {
  id: string;
  buyer_id: string;
  farmer_id: string;
  product_id: string;
  quantity_ordered: number;
  unit_price: number;
  total_amount: number;
  status: 'pending' | 'confirmed' | 'in_progress' | 'delivered' | 'cancelled';
  delivery_address?: string;
  notes?: string;
  created_at: string;
  product_name?: string;
  buyer_name?: string;
  farmer_name?: string;
  buyer_phone?: string;
  farmer_phone?: string;
}

export interface Message {
  id: string;
  sender_id: string;
  receiver_id: string;
  message_text: string;
  product_id?: string;
  order_id?: string;
  is_read: boolean;
  created_at: string;
  sender_name?: string;
}

export interface MarketPrice {
  id: string;
  product_name: string;
  category: string;
  region: string;
  price: number;
  unit: string;
  price_date: string;
  source?: string;
  created_at: string;
}