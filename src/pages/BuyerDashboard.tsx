import React, { useState } from 'react';
import { Plus, Search, MapPin, Filter, ShoppingBag, Phone, MessageCircle } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import Header from '../components/Header';

const BuyerDashboard: React.FC = () => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const { products, orders, addOrder, addBuyerNeed, addMessage } = useData();
  const [showNeedModal, setShowNeedModal] = useState(false);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Filter orders for current buyer
  const buyerOrders = orders.filter(o => o.buyerId === user?.id);

  const [needForm, setNeedForm] = useState({
    productNeeded: '',
    quantityNeeded: '',
    budgetRange: '',
    location: user?.location || ''
  });

  const [orderForm, setOrderForm] = useState({
    quantity: '',
    message: ''
  });

  const handlePostNeed = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    addBuyerNeed({
      ...needForm,
      buyerId: user.id,
      buyerName: user.name,
      buyerPhone: user.phone,
      date: new Date().toLocaleDateString()
    });

    setNeedForm({
      productNeeded: '',
      quantityNeeded: '',
      budgetRange: '',
      location: user.location
    });
    setShowNeedModal(false);
    alert('Your need has been posted successfully! Farmers will be able to see it.');
  };

  const handleContactFarmer = (product: any) => {
    setSelectedProduct(product);
    setShowOrderModal(true);
  };

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !selectedProduct) return;

    // Calculate total price (simplified calculation)
    const pricePerUnit = parseFloat(selectedProduct.price.match(/\d+/)?.[0] || '0');
    const quantity = parseFloat(orderForm.quantity);
    const totalPrice = `GHS ${(pricePerUnit * quantity / 50).toFixed(0)}`; // Assuming price is per 50kg bag

    addOrder({
      productId: selectedProduct.id,
      productName: selectedProduct.name,
      buyerId: user.id,
      buyerName: user.name,
      buyerPhone: user.phone,
      quantity: orderForm.quantity,
      totalPrice,
      status: 'pending',
      date: new Date().toLocaleDateString()
    });

    // Send message to farmer
    if (orderForm.message) {
      addMessage({
        senderId: user.id,
        receiverId: selectedProduct.farmerId,
        senderName: user.name,
        content: orderForm.message,
        productId: selectedProduct.id
      });
    }

    setOrderForm({ quantity: '', message: '' });
    setSelectedProduct(null);
    setShowOrderModal(false);
    alert('Order placed successfully!');
  };

  // Filter products based on search
  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Header userType="buyer" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{t('buyer.welcome')} {user?.name}</h1>
          <p className="text-gray-600">{t('buyer.subtitle')}</p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <button 
            onClick={() => setShowNeedModal(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg flex items-center justify-center space-x-2 transition-colors shadow-sm hover:shadow-md"
          >
            <Plus className="h-4 w-4" />
            <span>{t('buyer.postNeed')}</span>
          </button>
          <button className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg flex items-center justify-center space-x-2 transition-colors shadow-sm hover:shadow-md">
            <ShoppingBag className="h-4 w-4" />
            <span>{t('buyer.myOrders')} ({buyerOrders.length})</span>
          </button>
        </div>

        {/* Search and Filter */}
        <div className="bg-white rounded-xl shadow-sm border p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input 
                type="text" 
                placeholder={t('buyer.searchProducts')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-3 rounded-lg flex items-center justify-center space-x-2 transition-colors">
              <Filter className="h-4 w-4" />
              <span>{t('buyer.filter')}</span>
            </button>
          </div>
        </div>

        {/* My Orders Section */}
        {buyerOrders.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm border p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">{t('buyer.myOrders')}</h2>
            <div className="space-y-4">
              {buyerOrders.slice(0, 3).map((order) => (
                <div key={order.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-gray-900">{order.productName}</h3>
                      <p className="text-sm text-gray-600">Quantity: {order.quantity}</p>
                      <p className="text-sm font-semibold text-green-600">Total: {order.totalPrice}</p>
                    </div>
                    <div className="text-right">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        order.status === 'confirmed' ? 'bg-blue-100 text-blue-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </span>
                      <p className="text-xs text-gray-500 mt-1">{order.date}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Matched Products Section */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">{t('buyer.matchedProducts')}</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product) => (
              <div key={product.id} className="bg-white rounded-xl shadow-sm border p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{product.icon}</span>
                    <h3 className="text-lg font-semibold text-gray-900">{product.name}</h3>
                  </div>
                </div>

                <div className="space-y-3 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">{t('farmer.quantity')}:</span>
                    <span className="font-medium text-gray-900">{product.quantity}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">{t('farmer.price')}:</span>
                    <span className="font-semibold text-green-600">{product.price}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">{t('buyer.farmer')}:</span>
                    <span className="font-medium text-gray-900">{product.farmerName}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Phone className="h-3 w-3 mr-1" />
                    <span>{product.farmerPhone}</span>
                  </div>
                </div>

                <div className="flex items-center text-sm text-gray-600 mb-4">
                  <MapPin className="h-4 w-4 mr-1" />
                  <span>{product.location}</span>
                </div>

                <div className="mb-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    product.available 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {product.available ? t('farmer.available') : t('farmer.limitedStock')}
                  </span>
                </div>

                <div className="flex space-x-2">
                  <button 
                    onClick={() => handleContactFarmer(product)}
                    className="flex-1 bg-green-600 text-white py-2 px-3 rounded-lg hover:bg-green-700 transition-colors font-medium text-sm"
                  >
                    {t('buyer.contactFarmer')}
                  </button>
                  <button 
                    onClick={() => {
                      addMessage({
                        senderId: user?.id || '',
                        receiverId: product.farmerId,
                        senderName: user?.name || '',
                        content: `Hi, I'm interested in your ${product.name}. Is it still available?`,
                        productId: product.id
                      });
                      alert('Message sent to farmer!');
                    }}
                    className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <MessageCircle className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Post Need Modal */}
        {showNeedModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">{t('buyer.postYourNeed')}</h3>
              
              <form onSubmit={handlePostNeed} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">{t('buyer.productNeeded')}</label>
                  <input 
                    type="text" 
                    value={needForm.productNeeded}
                    onChange={(e) => setNeedForm(prev => ({ ...prev, productNeeded: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., Tomatoes"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">{t('buyer.quantityNeeded')}</label>
                  <input 
                    type="text" 
                    value={needForm.quantityNeeded}
                    onChange={(e) => setNeedForm(prev => ({ ...prev, quantityNeeded: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder={`e.g., 100${t('common.kg')}`}
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">{t('buyer.budgetRange')}</label>
                  <input 
                    type="text" 
                    value={needForm.budgetRange}
                    onChange={(e) => setNeedForm(prev => ({ ...prev, budgetRange: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder={`e.g., ${t('common.ghs')} 100-150/${t('common.bag')}`}
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                  <input 
                    type="text" 
                    value={needForm.location}
                    onChange={(e) => setNeedForm(prev => ({ ...prev, location: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., Kumasi"
                    required
                  />
                </div>
                
                <div className="flex space-x-3 pt-6">
                  <button 
                    type="button"
                    onClick={() => setShowNeedModal(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    {t('farmer.cancel')}
                  </button>
                  <button 
                    type="submit"
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    {t('buyer.postNeedBtn')}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Order Modal */}
        {showOrderModal && selectedProduct && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Order {selectedProduct.name}</h3>
              
              <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3 mb-2">
                  <span className="text-2xl">{selectedProduct.icon}</span>
                  <div>
                    <h4 className="font-semibold">{selectedProduct.name}</h4>
                    <p className="text-sm text-gray-600">Farmer: {selectedProduct.farmerName}</p>
                    <p className="text-sm text-green-600 font-semibold">{selectedProduct.price}</p>
                  </div>
                </div>
              </div>
              
              <form onSubmit={handlePlaceOrder} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Quantity Needed</label>
                  <input 
                    type="text" 
                    value={orderForm.quantity}
                    onChange={(e) => setOrderForm(prev => ({ ...prev, quantity: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., 10kg"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Message to Farmer (Optional)</label>
                  <textarea 
                    value={orderForm.message}
                    onChange={(e) => setOrderForm(prev => ({ ...prev, message: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Any special requirements or questions..."
                    rows={3}
                  />
                </div>
                
                <div className="flex space-x-3 pt-6">
                  <button 
                    type="button"
                    onClick={() => {
                      setShowOrderModal(false);
                      setSelectedProduct(null);
                      setOrderForm({ quantity: '', message: '' });
                    }}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Place Order
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BuyerDashboard;