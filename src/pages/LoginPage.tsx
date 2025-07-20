import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';

const LoginPage: React.FC = () => {
  const { t } = useLanguage();
  const { login, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [userType, setUserType] = useState<'farmer' | 'buyer'>('farmer');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  // Set user type based on URL parameter
  useEffect(() => {
    const typeParam = searchParams.get('type');
    if (typeParam === 'farmer' || typeParam === 'buyer') {
      setUserType(typeParam);
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const success = await login(email, password, userType);
      if (success) {
        navigate(userType === 'farmer' ? '/farmer-dashboard' : '/buyer-dashboard');
      } else {
        setError('Invalid email or password. Try: farmer@example.com / password');
      }
    } catch (err) {
      setError('Login failed. Please try again.');
    }
  };

  const handleSocialLogin = (provider: string) => {
    alert(`${provider} login will be available soon! For now, use:\nFarmer: farmer@example.com / password\nBuyer: buyer@example.com / password`);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Left Side - Welcome Section */}
      <div className={`flex-1 flex items-center justify-center p-8 ${
        userType === 'farmer' ? 'bg-gradient-to-br from-green-400 to-green-600' : 'bg-gradient-to-br from-blue-400 to-blue-600'
      }`}>
        <div className="text-center text-white max-w-md">
          <h1 className="text-3xl font-bold mb-6">
            Welcome, {userType === 'farmer' ? 'Farmer' : 'Buyer'}
          </h1>
          
          {/* Illustration */}
          <div className="mb-8">
            <div className="w-64 h-64 mx-auto bg-white bg-opacity-20 rounded-full flex items-center justify-center">
              <div className="relative">
                {/* Tree illustration */}
                <div className="w-32 h-32 relative">
                  <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-4 h-16 bg-amber-800 rounded-t-lg"></div>
                  <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2 w-24 h-24 bg-green-300 rounded-full"></div>
                  <div className="absolute bottom-16 left-1/4 w-16 h-16 bg-green-400 rounded-full"></div>
                  <div className="absolute bottom-16 right-1/4 w-16 h-16 bg-green-400 rounded-full"></div>
                </div>
                
                {/* Person illustration */}
                <div className="absolute -bottom-4 -right-8">
                  <div className="w-8 h-8 bg-yellow-300 rounded-full mb-1"></div>
                  <div className="w-6 h-12 bg-blue-500 rounded-lg mx-auto"></div>
                  <div className="flex justify-center space-x-1 mt-1">
                    <div className="w-2 h-6 bg-yellow-600 rounded"></div>
                    <div className="w-2 h-6 bg-yellow-600 rounded"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <button 
              className={`w-full py-3 px-6 rounded-full font-semibold transition-all ${
                userType === 'farmer' 
                  ? 'bg-white text-green-600 hover:bg-gray-100' 
                  : 'bg-white text-blue-600 hover:bg-gray-100'
              }`}
            >
              Login
            </button>
            <Link 
              to={`/signup?type=${userType}`}
              className="block w-full py-3 px-6 rounded-full font-semibold border-2 border-white text-white hover:bg-white hover:text-gray-800 transition-all"
            >
              Sign up
            </Link>
          </div>

          <div className="mt-8">
            <p className="text-sm mb-4">OR</p>
            <div className="flex justify-center space-x-4">
              <button 
                onClick={() => handleSocialLogin('Google')}
                className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center hover:bg-opacity-30 transition-all"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#EA4335" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
              </button>
              <button 
                onClick={() => handleSocialLogin('Facebook')}
                className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center hover:bg-opacity-30 transition-all"
              >
                <svg className="w-5 h-5" fill="#1877F2" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </button>
              <button 
                onClick={() => handleSocialLogin('Instagram')}
                className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center hover:bg-opacity-30 transition-all"
              >
                <svg className="w-5 h-5" fill="#E4405F" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </button>
            </div>
          </div>

          <div className="mt-8 text-xs opacity-75">
            <div className="flex justify-center space-x-4">
              <span>User Agreement</span>
              <span>Privacy Policy</span>
              <span>Community Guidelines</span>
              <span>Cookie Policy</span>
              <span>Copyright</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Login</h2>
            <p className="text-gray-600">Login to your account</p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-gray-100 border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-12 py-3 bg-gray-100 border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={authLoading}
              className={`w-full py-3 px-4 rounded-full font-semibold text-white transition-all ${
                userType === 'farmer'
                  ? 'bg-green-600 hover:bg-green-700'
                  : 'bg-blue-600 hover:bg-blue-700'
              } ${authLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {authLoading ? 'Signing In...' : 'Sign In'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Don't have an account?{' '}
              <Link
                to={`/signup?type=${userType}`}
                className={`font-medium ${
                  userType === 'farmer' ? 'text-green-600 hover:text-green-700' : 'text-blue-600 hover:text-blue-700'
                }`}
              >
                Sign up
              </Link>
            </p>
          </div>

          {/* Demo Credentials */}
          <div className="mt-8 p-4 bg-gray-50 rounded-lg">
            <p className="text-sm font-medium text-gray-700 mb-2">Demo Credentials:</p>
            <div className="text-xs text-gray-600 space-y-1">
              <p><strong>Farmer:</strong> farmer@example.com / password</p>
              <p><strong>Buyer:</strong> buyer@example.com / password</p>
              <p><strong>Quick Demo:</strong> demo@example.com / demo</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;