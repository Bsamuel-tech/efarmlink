import React, { createContext, useContext, useState, ReactNode } from 'react';

export type Language = 'en' | 'tw';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const translations = {
  en: {
    // Header
    'header.marketPrices': 'Market Prices',
    'header.messages': 'Messages',
    
    // Landing Page
    'landing.title': 'Connect Farmers and Buyers in Real Time',
    'landing.subtitle': 'E-FarmLink bridges the gap between local farmers and buyers, creating a direct marketplace for fresh produce with real-time communication and transparent pricing.',
    'landing.iAmFarmer': 'I AM A FARMER',
    'landing.iAmBuyer': 'I AM A BUYER',
    'landing.realTimeMarketPrices': 'Real-Time Market Prices',
    'landing.realTimeMarketPricesDesc': 'Track live market prices across different regions to make informed buying and selling decisions.',
    'landing.directCommunication': 'Direct Communication',
    'landing.directCommunicationDesc': 'Chat directly with farmers and buyers to negotiate prices, quantities, and delivery schedules.',
    'landing.orderTracking': 'Order Tracking',
    'landing.orderTrackingDesc': 'Monitor your orders from placement to delivery with real-time status updates and notifications.',
    'landing.quickAccess': 'Quick Access',
    'landing.viewTodayPrices': 'View Today\'s Market Prices',
    'landing.trackOrders': 'Track Your Orders',
    'landing.about': 'About',
    'landing.terms': 'Terms',
    'landing.privacy': 'Privacy',

    // Farmer Dashboard
    'farmer.welcome': 'Farmer Dashboard',
    'farmer.subtitle': 'Manage your products and connect with buyers',
    'farmer.dashboard': 'Dashboard',
    'farmer.myProducts': 'My Products',
    'farmer.messages': 'Messages',
    'farmer.activeListings': 'Active Listings',
    'farmer.newMessages': 'New Messages',
    'farmer.monthSales': 'This Month\'s Sales',
    'farmer.productListings': 'Product Listings',
    'farmer.addNewProduct': 'Add New Product',
    'farmer.quantity': 'Quantity',
    'farmer.price': 'Price',
    'farmer.date': 'Date',
    'farmer.available': 'Available',
    'farmer.limitedStock': 'Limited Stock',
    'farmer.edit': 'Edit',
    'farmer.addProduct': 'Add New Product',
    'farmer.productName': 'Product Name',
    'farmer.cancel': 'Cancel',
    'farmer.addProductBtn': 'Add Product',

    // Buyer Dashboard
    'buyer.welcome': 'Welcome, Buyer',
    'buyer.subtitle': 'Find fresh produce from local farmers',
    'buyer.postNeed': 'Post a Need',
    'buyer.myOrders': 'My Orders',
    'buyer.searchProducts': 'Search for products...',
    'buyer.filter': 'Filter',
    'buyer.matchedProducts': 'Matched Products Near You',
    'buyer.farmer': 'Farmer',
    'buyer.location': 'Location',
    'buyer.contactFarmer': 'Contact Farmer',
    'buyer.postYourNeed': 'Post Your Need',
    'buyer.productNeeded': 'Product Needed',
    'buyer.quantityNeeded': 'Quantity Needed',
    'buyer.budgetRange': 'Budget Range',
    'buyer.postNeedBtn': 'Post Need',

    // Market Prices
    'market.title': 'Market Prices',
    'market.subtitle': 'Real-time market prices across different regions',
    'market.crop': 'Crop',
    'market.region': 'Region',
    'market.allCrops': 'All Crops',
    'market.allRegions': 'All Regions',
    'market.dateRange': 'Date Range',
    'market.todayPrices': 'Today\'s Market Prices',
    'market.currentPrice': 'Current Price',
    'market.previousPrice': 'Previous Price',
    'market.change': 'Change',
    'market.pricesTrends': 'Price Trends',
    'market.topPerforming': 'Top Performing',
    'market.marketAlert': 'Market Alert',
    'market.overallStable': 'Overall market stable',

    // Chat Interface
    'chat.typeMessage': 'Type message...',
    'chat.send': 'Send',
    'chat.discussingProduct': 'Discussing Product',
    'chat.online': 'Online',

    // Common
    'common.ghs': 'GHS',
    'common.bag': 'bag',
    'common.kg': 'kg',
    'common.bird': 'bird',
    'common.tuber': 'tuber',
    'common.crate': 'crate',
  },
  tw: {
    // Header
    'header.marketPrices': 'Gua So',
    'header.messages': 'Nkrasɛm',
    
    // Landing Page
    'landing.title': 'Fa Akuafo ne Atɔfo Bom Wɔ Berɛ Ankasa Mu',
    'landing.subtitle': 'E-FarmLink de akuafo ne atɔfo bom, na ɛyɛ gua a wɔtɔn nnɔbae a ɛyɛ frɛ wɔ hɔ a wɔka wɔn ho nsɛm na gua no mu da hɔ pefee.',
    'landing.iAmFarmer': 'ME YƐ OKUANI',
    'landing.iAmBuyer': 'ME YƐ OTƆNI',
    'landing.realTimeMarketPrices': 'Gua So Wɔ Berɛ Ankasa Mu',
    'landing.realTimeMarketPricesDesc': 'Hwɛ gua so a ɛkɔ so wɔ mmeae ahorow so na woayɛ gyinae a ɛfata wɔ atɔn ne tɔn ho.',
    'landing.directCommunication': 'Nkitahodi Tee',
    'landing.directCommunicationDesc': 'Ka wo ho nsɛm tee kwan so ne akuafo ne atɔfo na moayɛ nhyehyɛe wɔ bo, dodow, ne nneɛma a wɔde bɛba ho.',
    'landing.orderTracking': 'Nhyehyɛe Akyi Kwan',
    'landing.orderTrackingDesc': 'Hwɛ wo nhyehyɛe fi berɛ a wode to hɔ kosi berɛ a wɔde bɛba no na woanya nsɛm a ɛkɔ so wɔ berɛ ankasa mu.',
    'landing.quickAccess': 'Ntɛm Kwan',
    'landing.viewTodayPrices': 'Hwɛ Nnɛ Gua So',
    'landing.trackOrders': 'Di Wo Nhyehyɛe Akyi',
    'landing.about': 'Ɛho Nsɛm',
    'landing.terms': 'Nhyehyɛe',
    'landing.privacy': 'Kokoam',

    // Farmer Dashboard
    'farmer.welcome': 'Okuani Adwumayɛbea',
    'farmer.subtitle': 'Hwɛ wo nnɔbae so na fa wo ho bom akuafo',
    'farmer.dashboard': 'Adwumayɛbea',
    'farmer.myProducts': 'Me Nnɔbae',
    'farmer.messages': 'Nkrasɛm',
    'farmer.activeListings': 'Nneɛma a Ɛwɔ Hɔ',
    'farmer.newMessages': 'Nkrasɛm Foforɔ',
    'farmer.monthSales': 'Saa Bosome Yi Atɔn',
    'farmer.productListings': 'Nnɔbae Nhyehyɛe',
    'farmer.addNewProduct': 'Fa Nnɔbae Foforɔ Ka Ho',
    'farmer.quantity': 'Dodow',
    'farmer.price': 'Bo',
    'farmer.date': 'Da',
    'farmer.available': 'Ɛwɔ Hɔ',
    'farmer.limitedStock': 'Kakraa Bi Pɛ Na Aka',
    'farmer.edit': 'Sesa',
    'farmer.addProduct': 'Fa Nnɔbae Foforɔ Ka Ho',
    'farmer.productName': 'Nnɔbae Din',
    'farmer.cancel': 'Gyae',
    'farmer.addProductBtn': 'Fa Ka Ho',

    // Buyer Dashboard
    'buyer.welcome': 'Akwaaba, Otɔni',
    'buyer.subtitle': 'Hwehwɛ nnɔbae a ɛyɛ frɛ fi akuafo nkyɛn',
    'buyer.postNeed': 'Ka Nea Wohia',
    'buyer.myOrders': 'Me Nhyehyɛe',
    'buyer.searchProducts': 'Hwehwɛ nnɔbae...',
    'buyer.filter': 'Yi Fi',
    'buyer.matchedProducts': 'Nnɔbae a Ɛfata Wo Nkyɛn',
    'buyer.farmer': 'Okuani',
    'buyer.location': 'Beae',
    'buyer.contactFarmer': 'Frɛ Okuani',
    'buyer.postYourNeed': 'Ka Nea Wohia',
    'buyer.productNeeded': 'Nnɔbae a Wohia',
    'buyer.quantityNeeded': 'Dodow a Wohia',
    'buyer.budgetRange': 'Sika a Wowɔ',
    'buyer.postNeedBtn': 'Ka Hia',

    // Market Prices
    'market.title': 'Gua So',
    'market.subtitle': 'Gua so a ɛkɔ so wɔ mmeae ahorow wɔ berɛ ankasa mu',
    'market.crop': 'Nnɔbae',
    'market.region': 'Mpɔtam',
    'market.allCrops': 'Nnɔbae Nyinaa',
    'market.allRegions': 'Mpɔtam Nyinaa',
    'market.dateRange': 'Nna Ntam',
    'market.todayPrices': 'Nnɛ Gua So',
    'market.currentPrice': 'Mprempren Bo',
    'market.previousPrice': 'Kane Bo',
    'market.change': 'Nsakrae',
    'market.pricesTrends': 'Bo Kwan',
    'market.topPerforming': 'Nea Ɛyɛ Adwuma Yie',
    'market.marketAlert': 'Gua Kɔkɔbɔ',
    'market.overallStable': 'Gua no nyinaa gyina pintinn',

    // Chat Interface
    'chat.typeMessage': 'Kyerɛw nkrasɛm...',
    'chat.send': 'Soma',
    'chat.discussingProduct': 'Nnɔbae a Yɛreka Ho Asɛm',
    'chat.online': 'Wɔ Intanɛt So',

    // Common
    'common.ghs': 'GHS',
    'common.bag': 'kotoku',
    'common.kg': 'kg',
    'common.bird': 'akokɔ',
    'common.tuber': 'duaba',
    'common.crate': 'adaka',
  }
};

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en');

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};