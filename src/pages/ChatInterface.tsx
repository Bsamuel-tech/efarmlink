import React, { useState, useEffect } from 'react';
import { Send, Phone, Video, MoreVertical, ArrowLeft, PhoneCall, Settings, UserX, Flag } from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import Header from '../components/Header';

const ChatInterface: React.FC = () => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const { messages, products, addMessage, getConversation } = useData();
  const [searchParams] = useSearchParams();
  const [message, setMessage] = useState('');
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [selectedUserName, setSelectedUserName] = useState<string>('');
  const [showCallModal, setShowCallModal] = useState(false);
  const [callType, setCallType] = useState<'voice' | 'video'>('voice');
  const [showMenuDropdown, setShowMenuDropdown] = useState(false);

  // Get unique conversations for current user
  const getUniqueConversations = () => {
    if (!user) return [];
    
    const conversations = new Map();
    
    messages.forEach(msg => {
      const otherUserId = msg.senderId === user.id ? msg.receiverId : msg.senderId;
      const otherUserName = msg.senderId === user.id ? 
        (products.find(p => p.farmerId === otherUserId)?.farmerName || 'Unknown') :
        msg.senderName;
      
      if (otherUserId !== user.id) {
        conversations.set(otherUserId, {
          userId: otherUserId,
          userName: otherUserName,
          lastMessage: msg.content,
          timestamp: msg.timestamp,
          productId: msg.productId
        });
      }
    });
    
    return Array.from(conversations.values());
  };

  const conversations = getUniqueConversations();
  const currentConversation = selectedUserId ? getConversation(user?.id || '', selectedUserId) : [];
  const discussedProduct = currentConversation.find(m => m.productId)?.productId ? 
    products.find(p => p.id === currentConversation.find(m => m.productId)?.productId) : null;

  useEffect(() => {
    // Auto-select conversation from URL params
    const userId = searchParams.get('user');
    if (userId && conversations.find(c => c.userId === userId)) {
      setSelectedUserId(userId);
      setSelectedUserName(conversations.find(c => c.userId === userId)?.userName || '');
    } else if (conversations.length > 0 && !selectedUserId) {
      setSelectedUserId(conversations[0].userId);
      setSelectedUserName(conversations[0].userName);
    }
  }, [conversations.length, searchParams]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && selectedUserId && user) {
      addMessage({
        senderId: user.id,
        receiverId: selectedUserId,
        senderName: user.name,
        content: message.trim(),
        productId: discussedProduct?.id
      });
      setMessage('');
    }
  };

  const handleCall = (type: 'voice' | 'video') => {
    setCallType(type);
    setShowCallModal(true);
  };

  const simulateCall = () => {
    // Simulate call functionality
    alert(`Starting ${callType === 'voice' ? 'voice' : 'video'} call with ${selectedUserName}...`);
    setTimeout(() => {
      setShowCallModal(false);
      alert(`${callType === 'voice' ? 'Voice' : 'Video'} call with ${selectedUserName} ended`);
    }, 3000);
  };

  if (conversations.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header userType={user?.type} />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white rounded-xl shadow-sm border p-8 text-center">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">No Messages Yet</h2>
            <p className="text-gray-600 mb-6">Start a conversation by contacting a farmer or buyer.</p>
            <Link 
              to={user?.type === 'farmer' ? '/farmer-dashboard' : '/buyer-dashboard'}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg transition-colors"
            >
              Go to Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header userType={user?.type} />
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl shadow-sm border overflow-hidden" style={{ height: '600px' }}>
          <div className="flex h-full">
            {/* Conversations List */}
            <div className="w-1/3 border-r border-gray-200 flex flex-col">
              <div className="p-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Messages</h2>
              </div>
              <div className="flex-1 overflow-y-auto">
                {conversations.map((conversation) => (
                  <button
                    key={conversation.userId}
                    onClick={() => {
                      setSelectedUserId(conversation.userId);
                      setSelectedUserName(conversation.userName);
                    }}
                    className={`w-full p-4 text-left hover:bg-gray-50 border-b border-gray-100 transition-colors ${
                      selectedUserId === conversation.userId ? 'bg-green-50 border-green-200' : ''
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center text-white font-semibold">
                        {conversation.userName.charAt(0)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-gray-900 truncate">{conversation.userName}</h3>
                        <p className="text-sm text-gray-600 truncate">{conversation.lastMessage}</p>
                      </div>
                      <span className="text-xs text-gray-500">{conversation.timestamp}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Chat Area */}
            <div className="flex-1 flex flex-col">
              {selectedUserId ? (
                <>
                  {/* Chat Header */}
                  <div className="p-4 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center text-white font-semibold">
                          {selectedUserName.charAt(0)}
                        </div>
                        <div>
                          <h2 className="text-lg font-semibold text-gray-900">{selectedUserName}</h2>
                          <p className="text-sm text-green-600 flex items-center">
                            <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                            {user?.type === 'buyer' ? t('buyer.farmer') : 'Buyer'} • {t('chat.online')}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <button 
                          onClick={() => handleCall('voice')}
                          className="p-2 text-gray-600 hover:text-green-600 hover:bg-gray-100 rounded-lg transition-colors"
                          title="Voice Call"
                        >
                          <Phone className="h-5 w-5" />
                        </button>
                        <button 
                          onClick={() => handleCall('video')}
                          className="p-2 text-gray-600 hover:text-green-600 hover:bg-gray-100 rounded-lg transition-colors"
                          title="Video Call"
                        >
                          <Video className="h-5 w-5" />
                        </button>
                        <div className="relative">
                          <button 
                            onClick={() => setShowMenuDropdown(!showMenuDropdown)}
                            className="p-2 text-gray-600 hover:text-green-600 hover:bg-gray-100 rounded-lg transition-colors"
                          >
                            <MoreVertical className="h-5 w-5" />
                          </button>
                          
                          {/* Dropdown Menu */}
                          {showMenuDropdown && (
                            <div className="absolute right-0 top-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 min-w-[160px]">
                              <button className="w-full flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                                <Settings className="h-4 w-4" />
                                <span>Chat Settings</span>
                              </button>
                              <button className="w-full flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                                <UserX className="h-4 w-4" />
                                <span>Block User</span>
                              </button>
                              <button className="w-full flex items-center space-x-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors">
                                <Flag className="h-4 w-4" />
                                <span>Report User</span>
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Chat Messages */}
                  <div className="flex-1 overflow-y-auto p-6 space-y-4">
                    {currentConversation.map((msg) => (
                      <div
                        key={msg.id}
                        className={`flex ${msg.senderId === user?.id ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl ${
                            msg.senderId === user?.id
                              ? 'bg-green-600 text-white rounded-br-md'
                              : 'bg-gray-100 text-gray-900 rounded-bl-md'
                          }`}
                        >
                          <p className="text-sm">{msg.content}</p>
                          <p className={`text-xs mt-1 ${
                            msg.senderId === user?.id ? 'text-green-100' : 'text-gray-500'
                          }`}>
                            {msg.timestamp}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Message Input */}
                  <div className="p-4 border-t border-gray-200">
                    <form onSubmit={handleSendMessage} className="flex space-x-3">
                      <input
                        type="text"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder={t('chat.typeMessage')}
                        className="flex-1 px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                      <button
                        type="submit"
                        className="bg-green-600 hover:bg-green-700 text-white p-3 rounded-full transition-colors shadow-sm hover:shadow-md"
                      >
                        <Send className="h-5 w-5" />
                      </button>
                    </form>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center">
                  <p className="text-gray-500">Select a conversation to start messaging</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Product Context */}
        {discussedProduct && (
          <div className="bg-white rounded-xl shadow-sm border p-6 mt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">{t('chat.discussingProduct')}</h3>
            <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
              <div className="w-16 h-16 bg-amber-100 rounded-xl flex items-center justify-center">
                <span className="text-3xl">{discussedProduct.icon}</span>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 text-lg">{discussedProduct.name}</h4>
                <p className="text-sm text-gray-600">{discussedProduct.quantity} available</p>
                <p className="text-sm font-semibold text-green-600">{discussedProduct.price}</p>
                <p className="text-sm text-gray-600">Location: {discussedProduct.location}</p>
              </div>
            </div>
          </div>
        )}

        {/* Call Modal */}
        {showCallModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl p-8 w-full max-w-md text-center">
              <div className="mb-6">
                <div className="w-20 h-20 bg-green-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
                  {selectedUserName.charAt(0)}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{selectedUserName}</h3>
                <p className="text-gray-600">
                  {callType === 'voice' ? 'Voice' : 'Video'} calling...
                </p>
              </div>
              
              <div className="flex items-center justify-center space-x-4 mb-6">
                {callType === 'voice' ? (
                  <PhoneCall className="h-8 w-8 text-green-600 animate-pulse" />
                ) : (
                  <Video className="h-8 w-8 text-green-600 animate-pulse" />
                )}
              </div>
              
              <div className="flex space-x-4">
                <button
                  onClick={() => setShowCallModal(false)}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white py-3 px-4 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={simulateCall}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-lg transition-colors"
                >
                  Connect
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Click outside to close dropdown */}
      {showMenuDropdown && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setShowMenuDropdown(false)}
        ></div>
      )}
    </div>
  );
};

export default ChatInterface;