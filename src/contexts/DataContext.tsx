import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { apiClient, Product, Order, Message, MarketPrice } from '../lib/api';
import { useAuth } from './AuthContext';

interface DataContextType {
  products: Product[];
  orders: Order[];
  messages: Message[];
  marketPrices: MarketPrice[];
  isLoading: boolean;
  error: string | null;
  
  // Product methods
  addProduct: (product: Omit<Product, 'id' | 'farmer_id' | 'created_at'>) => Promise<boolean>;
  updateProduct: (id: string, updates: Partial<Product>) => Promise<boolean>;
  deleteProduct: (id: string) => Promise<boolean>;
  
  // Order methods
  createOrder: (order: {
    product_id: string;
    quantity_ordered: number;
    delivery_address?: string;
    notes?: string;
  }) => Promise<boolean>;
  updateOrderStatus: (id: string, status: Order['status']) => Promise<boolean>;
  
  // Message methods
  sendMessage: (message: {
    receiver_id: string;
    message_text: string;
    product_id?: string;
    order_id?: string;
  }) => Promise<boolean>;
  
  // Data fetching
  fetchProducts: () => Promise<void>;
  fetchOrders: () => Promise<void>;
  fetchMessages: () => Promise<void>;
  fetchMarketPrices: () => Promise<void>;
  
  // Legacy methods for compatibility
  addMessage: (messageData: any) => void;
  addOrder: (orderData: any) => void;
  addBuyerNeed: (needData: any) => void;
  getConversation: (userId1: string, userId2: string) => any[];
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [marketPrices, setMarketPrices] = useState<MarketPrice[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch data when user changes
  useEffect(() => {
    if (user) {
      fetchProducts();
      fetchOrders();
      fetchMessages();
      fetchMarketPrices();
    }
  }, [user]);

  const fetchProducts = async () => {
    try {
      setIsLoading(true);
      const data = await apiClient.getProducts();
      setProducts(data || []);
    } catch (error: any) {
      console.error('Error fetching products:', error);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchOrders = async () => {
    if (!user) return;

    try {
      setIsLoading(true);
      const data = await apiClient.getOrders();
      setOrders(data || []);
    } catch (error: any) {
      console.error('Error fetching orders:', error);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchMessages = async () => {
    if (!user) return;

    try {
      setIsLoading(true);
      const conversations = await apiClient.getConversations();
      // For now, we'll store conversations as messages
      setMessages(conversations || []);
    } catch (error: any) {
      console.error('Error fetching messages:', error);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchMarketPrices = async () => {
    try {
      setIsLoading(true);
      const data = await apiClient.getMarketPrices();
      setMarketPrices(data || []);
    } catch (error: any) {
      console.error('Error fetching market prices:', error);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const addProduct = async (productData: Omit<Product, 'id' | 'farmer_id' | 'created_at'>): Promise<boolean> => {
    if (!user || user.user_type !== 'farmer') return false;

    try {
      setIsLoading(true);
      await apiClient.addProduct(productData);
      await fetchProducts();
      return true;
    } catch (error: any) {
      console.error('Error adding product:', error);
      setError(error.message);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const updateProduct = async (id: string, updates: Partial<Product>): Promise<boolean> => {
    if (!user || user.user_type !== 'farmer') return false;

    try {
      setIsLoading(true);
      await apiClient.updateProduct(id, updates);
      await fetchProducts();
      return true;
    } catch (error: any) {
      console.error('Error updating product:', error);
      setError(error.message);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteProduct = async (id: string): Promise<boolean> => {
    if (!user || user.user_type !== 'farmer') return false;

    try {
      setIsLoading(true);
      await apiClient.deleteProduct(id);
      await fetchProducts();
      return true;
    } catch (error: any) {
      console.error('Error deleting product:', error);
      setError(error.message);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const createOrder = async (orderData: {
    product_id: string;
    quantity_ordered: number;
    delivery_address?: string;
    notes?: string;
  }): Promise<boolean> => {
    if (!user || user.user_type !== 'buyer') return false;

    try {
      setIsLoading(true);
      await apiClient.createOrder(orderData);
      await fetchOrders();
      return true;
    } catch (error: any) {
      console.error('Error creating order:', error);
      setError(error.message);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const updateOrderStatus = async (id: string, status: Order['status']): Promise<boolean> => {
    if (!user || user.user_type !== 'farmer') return false;

    try {
      setIsLoading(true);
      await apiClient.updateOrderStatus(id, status);
      await fetchOrders();
      return true;
    } catch (error: any) {
      console.error('Error updating order status:', error);
      setError(error.message);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const sendMessage = async (messageData: {
    receiver_id: string;
    message_text: string;
    product_id?: string;
    order_id?: string;
  }): Promise<boolean> => {
    if (!user) return false;

    try {
      setIsLoading(true);
      await apiClient.sendMessage(messageData);
      await fetchMessages();
      return true;
    } catch (error: any) {
      console.error('Error sending message:', error);
      setError(error.message);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Legacy methods for compatibility with existing components
  const addMessage = (messageData: any) => {
    if (user) {
      sendMessage({
        receiver_id: messageData.receiverId,
        message_text: messageData.content,
        product_id: messageData.productId,
      });
    }
  };

  const addOrder = (orderData: any) => {
    if (user) {
      createOrder({
        product_id: orderData.productId,
        quantity_ordered: parseInt(orderData.quantity),
        notes: orderData.message,
      });
    }
  };

  const addBuyerNeed = (needData: any) => {
    // For now, just show success message
    console.log('Buyer need posted:', needData);
  };

  const getConversation = (userId1: string, userId2: string) => {
    // Return mock conversation for now
    return [];
  };

  return (
    <DataContext.Provider
      value={{
        products,
        orders,
        messages,
        marketPrices,
        isLoading,
        error,
        addProduct,
        updateProduct,
        deleteProduct,
        createOrder,
        updateOrderStatus,
        sendMessage,
        fetchProducts,
        fetchOrders,
        fetchMessages,
        fetchMarketPrices,
        addMessage,
        addOrder,
        addBuyerNeed,
        getConversation,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};