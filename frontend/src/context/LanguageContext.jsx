import React, { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext();

const translations = {
  en: {
    home: 'Home',
    destinations: 'Destinations',
    hotels: 'Stays',
    food: 'Eateries',
    planner: 'AI Planner',
    utilities: 'Companion Utilities',
    dashboard: 'Dashboard',
    admin: 'Admin',
    login: 'Login',
    register: 'Register',
    logout: 'Logout',
    welcome: 'Welcome to Punjab',
    searchPlaceholder: 'Search destinations, dhabas, local tips...',
    allRightsReserved: 'All rights reserved.',
    explore: 'Explore',
    bookNow: 'Book Now',
    generateItinerary: 'Generate Itinerary',
    backToHome: 'Back to Home'
  },
  hi: {
    home: 'होम',
    destinations: 'गंतव्य',
    hotels: 'ठहरने की जगह',
    food: 'भोजन स्थल',
    planner: 'एआई योजनाकार',
    utilities: 'यात्रा साथी',
    dashboard: 'डैशबोर्ड',
    admin: 'प्रशासक',
    login: 'लॉगिन',
    register: 'रजिस्टर',
    logout: 'लॉगआउट',
    welcome: 'पंजाब में आपका स्वागत है',
    searchPlaceholder: 'गंतव्य, ढाबा, स्थानीय सुझाव खोजें...',
    allRightsReserved: 'सर्वाधिकार सुरक्षित।',
    explore: 'खोजें',
    bookNow: 'अभी बुक करें',
    generateItinerary: 'यात्रा कार्यक्रम बनाएं',
    backToHome: 'मुख्य पृष्ठ पर जाएँ'
  },
  pb: {
    home: 'ਮੁੱਖ ਪੰਨਾ',
    destinations: 'ਗੰਤਵ',
    hotels: 'ਰਿਹਾਇਸ਼',
    food: 'ਖਾਣ-ਪੀਣ',
    planner: 'ਏਆਈ ਪਲਾਨਰ',
    utilities: 'ਯਾਤਰਾ ਸਾਥੀ',
    dashboard: 'ਡੈਸ਼ਬੋਰਡ',
    admin: 'ਪ੍ਰਬੰਧਕ',
    login: 'ਲੌਗਇਨ',
    register: 'ਰਜਿਸਟਰ',
    logout: 'ਲੌਗਆਉਟ',
    welcome: 'ਪੰਜਾਬ ਵਿੱਚ ਜੀ ਆਇਆਂ ਨੂੰ',
    searchPlaceholder: 'ਥਾਂਵਾਂ, ਢਾਬੇ, ਸਥਾਨਕ ਨੁਕਤੇ ਲੱਭੋ...',
    allRightsReserved: 'ਸਾਰੇ ਹੱਕ ਰਾਖਵੇਂ ਹਨ।',
    explore: 'ਦੇਖੋ',
    bookNow: 'ਹੁਣੇ ਬੁੱਕ ਕਰੋ',
    generateItinerary: 'ਯੋਜਨਾ ਤਿਆਰ ਕਰੋ',
    backToHome: 'ਮੁੱਖ ਪੰਨੇ ਤੇ ਜਾਓ'
  }
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem('ptg-lang') || 'en';
  });

  useEffect(() => {
    localStorage.setItem('ptg-lang', language);
  }, [language]);

  const t = (key) => {
    return translations[language]?.[key] || translations['en']?.[key] || key;
  };

  const changeLanguage = (lang) => {
    if (['en', 'hi', 'pb'].includes(lang)) {
      setLanguage(lang);
    }
  };

  return (
    <LanguageContext.Provider value={{ language, changeLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
