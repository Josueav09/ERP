import React from 'react';
//import { AuthProvider } from './context/AuthContext';
import { NavigationProvider } from './context/NavigationContext';
import Router from './routes/AppRoutes';

const App: React.FC = () => {
  return (
    //<AuthProvider>
      <NavigationProvider>
        <Router />
      </NavigationProvider>
    //</AuthProvider>
  );
};

export default App;