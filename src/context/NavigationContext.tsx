import React, { createContext, useContext, useState, useCallback } from 'react';

export type PageType = 
  | 'login'
  | 'dashboard'
  | 'products'
  | 'product-form'
  | 'marketing'
  | 'marketing-form'
  | 'sales'
  | 'sales-form'
  | 'reports'
  | 'personal'
  | 'learning'
  | 'users'
  | 'user-form'
  | 'not-found';

interface NavigationContextType {
  currentPage: PageType;
  pageParams: Record<string, any>;
  navigate: (page: PageType, params?: Record<string, any>) => void;
  goBack: () => void;
}

const NavigationContext = createContext<NavigationContextType | undefined>(undefined);

export const useNavigation = () => {
  const context = useContext(NavigationContext);
  if (!context) {
    throw new Error('useNavigation must be used within NavigationProvider');
  }
  return context;
};

interface NavigationProviderProps {
  children: React.ReactNode;
}

interface NavigationHistory {
  page: PageType;
  params: Record<string, any>;
}

export const NavigationProvider: React.FC<NavigationProviderProps> = ({ children }) => {
  const [currentPage, setCurrentPage] = useState<PageType>('login');
  const [pageParams, setPageParams] = useState<Record<string, any>>({});
  const [history, setHistory] = useState<NavigationHistory[]>([]);

  const navigate = useCallback((page: PageType, params: Record<string, any> = {}) => {
    // Save current page to history
    setHistory((prev) => [...prev, { page: currentPage, params: pageParams }]);
    
    // Navigate to new page
    setCurrentPage(page);
    setPageParams(params);
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    // Update browser history (optional)
    if (typeof window !== 'undefined') {
      window.history.pushState({ page, params }, '', `#${page}`);
    }
  }, [currentPage, pageParams]);

  const goBack = useCallback(() => {
    if (history.length > 0) {
      const previousPage = history[history.length - 1];
      setHistory((prev) => prev.slice(0, -1));
      setCurrentPage(previousPage.page);
      setPageParams(previousPage.params);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [history]);

  // Handle browser back/forward buttons
  React.useEffect(() => {
    const handlePopState = (event: PopStateEvent) => {
      if (event.state && event.state.page) {
        setCurrentPage(event.state.page);
        setPageParams(event.state.params || {});
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const value: NavigationContextType = {
    currentPage,
    pageParams,
    navigate,
    goBack,
  };

  return (
    <NavigationContext.Provider value={value}>
      {children}
    </NavigationContext.Provider>
  );
};

export default NavigationContext;