import React from 'react';
import { Link } from 'react-router-dom';
import { Leaf, Users, TrendingUp, MessageSquare, MapPin, Clock } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import Header from '../components/Header';

const LandingPage: React.FC = () => {
  const { t } = useLanguage();
  const { isAuthenticated, user } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50">
      <Header />
      
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-green-100 rounded-full">
              <Leaf className="h-12 w-12 text-green-600" />
            </div>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            {t('landing.title')}
          </h1>
          <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto">
            {t('landing.subtitle')}
          </p>
          
          {/* Role Selection Buttons */}
          {!isAuthenticated ? (
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
              <Link 
                to="/signup?type=farmer"
                className="group relative bg-green-600 hover:bg-green-700 text-white px-12 py-6 rounded-xl text-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 min-w-[280px]"
              >
                <div className="flex items-center justify-center space-x-3">
                  <Users className="h-6 w-6" />
                  <span>{t('landing.iAmFarmer')}</span>
                </div>
                <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 rounded-xl transition-opacity"></div>
              </Link>
              <Link 
                to="/signup?type=buyer"
                className="group relative bg-blue-600 hover:bg-blue-700 text-white px-12 py-6 rounded-xl text-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 min-w-[280px]"
              >
                <div className="flex items-center justify-center space-x-3">
                  <MapPin className="h-6 w-6" />
                  <span>{t('landing.iAmBuyer')}</span>
                </div>
                <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 rounded-xl transition-opacity"></div>
              </Link>
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
              <Link 
                to={user?.type === 'farmer' ? '/farmer-dashboard' : '/buyer-dashboard'}
                className="group relative bg-green-600 hover:bg-green-700 text-white px-12 py-6 rounded-xl text-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 min-w-[280px]"
              >
                <div className="flex items-center justify-center space-x-3">
                  <Users className="h-6 w-6" />
                  <span>Go to Dashboard</span>
                </div>
                <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 rounded-xl transition-opacity"></div>
              </Link>
            </div>
          )}
        </div>

        {/* Features Section */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="group bg-white p-8 rounded-xl shadow-sm border hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
            <div className="p-3 bg-green-100 rounded-lg w-fit mb-4 group-hover:bg-green-200 transition-colors">
              <TrendingUp className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">{t('landing.realTimeMarketPrices')}</h3>
            <p className="text-gray-600">{t('landing.realTimeMarketPricesDesc')}</p>
          </div>
          
          <div className="group bg-white p-8 rounded-xl shadow-sm border hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
            <div className="p-3 bg-blue-100 rounded-lg w-fit mb-4 group-hover:bg-blue-200 transition-colors">
              <MessageSquare className="h-8 w-8 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">{t('landing.directCommunication')}</h3>
            <p className="text-gray-600">{t('landing.directCommunicationDesc')}</p>
          </div>
          
          <div className="group bg-white p-8 rounded-xl shadow-sm border hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
            <div className="p-3 bg-orange-100 rounded-lg w-fit mb-4 group-hover:bg-orange-200 transition-colors">
              <Clock className="h-8 w-8 text-orange-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">{t('landing.orderTracking')}</h3>
            <p className="text-gray-600">{t('landing.orderTrackingDesc')}</p>
          </div>
        </div>

        {/* Quick Access Links */}
        <div className="bg-white rounded-xl shadow-sm border p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">{t('landing.quickAccess')}</h2>
          <div className="flex flex-wrap justify-center gap-6">
            <Link 
              to="/market-prices" 
              className="text-green-600 hover:text-green-700 font-medium border-b-2 border-transparent hover:border-green-600 transition-all duration-200 pb-1"
            >
              {t('landing.viewTodayPrices')}
            </Link>
            <span className="text-gray-300 hidden sm:inline">•</span>
            {!isAuthenticated && (
              <>
                <Link 
                  to="/signup" 
                  className="text-green-600 hover:text-green-700 font-medium border-b-2 border-transparent hover:border-green-600 transition-all duration-200 pb-1"
                >
                  Create Account
                </Link>
                <span className="text-gray-300 hidden sm:inline">•</span>
                <Link 
                  to="/login" 
                  className="text-green-600 hover:text-green-700 font-medium border-b-2 border-transparent hover:border-green-600 transition-all duration-200 pb-1"
                >
                  Sign In
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <Leaf className="h-6 w-6" />
              <span className="text-xl font-bold">E-FarmLink</span>
            </div>
            <div className="flex space-x-8">
              <a href="#" className="hover:text-green-400 transition-colors">{t('landing.about')}</a>
              <a href="#" className="hover:text-green-400 transition-colors">{t('landing.terms')}</a>
              <a href="#" className="hover:text-green-400 transition-colors">{t('landing.privacy')}</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;