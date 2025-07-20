import React from 'react';
import { Edit3, MapPin, Calendar } from 'lucide-react';

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    quantity: string;
    price: string;
    farmer?: string;
    location?: string;
    date?: string;
    available?: boolean;
    icon?: string;
  };
  showEdit?: boolean;
  showLocation?: boolean;
  onEdit?: (id: string) => void;
  onContact?: (id: string) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ 
  product, 
  showEdit = false, 
  showLocation = false,
  onEdit,
  onContact
}) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border p-6 hover:shadow-md transition-all duration-200 hover:-translate-y-1">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center space-x-3">
          {product.icon && <span className="text-2xl">{product.icon}</span>}
          <h3 className="text-lg font-semibold text-gray-900">{product.name}</h3>
        </div>
        {showEdit && (
          <button 
            onClick={() => onEdit?.(product.id)}
            className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
          >
            <Edit3 className="h-4 w-4" />
          </button>
        )}
      </div>

      <div className="space-y-3 mb-4">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Quantity:</span>
          <span className="font-medium text-gray-900">{product.quantity}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Price:</span>
          <span className="font-semibold text-green-600">{product.price}</span>
        </div>
        {product.farmer && (
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Farmer:</span>
            <span className="font-medium text-gray-900">{product.farmer}</span>
          </div>
        )}
      </div>

      {showLocation && product.location && (
        <div className="flex items-center text-sm text-gray-600 mb-3">
          <MapPin className="h-4 w-4 mr-1" />
          <span>{product.location}</span>
        </div>
      )}

      {product.date && (
        <div className="flex items-center text-sm text-gray-600 mb-4">
          <Calendar className="h-4 w-4 mr-1" />
          <span>{product.date}</span>
        </div>
      )}

      {product.available !== undefined && (
        <div className="mb-4">
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
            product.available 
              ? 'bg-green-100 text-green-800' 
              : 'bg-yellow-100 text-yellow-800'
          }`}>
            {product.available ? 'Available' : 'Limited Stock'}
          </span>
        </div>
      )}

      {onContact && (
        <button 
          onClick={() => onContact(product.id)}
          className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition-colors font-medium"
        >
          Contact Farmer
        </button>
      )}
    </div>
  );
};

export default ProductCard;