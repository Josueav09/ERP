
// import './App.css';
// import { AuthProvider } from './context/AuthContext';
// import AppRoutes from './routes/AppRoutes';

// function App() {
//   return (
//     <AuthProvider>
//       <AppRoutes />
//     </AuthProvider>
//   );
// }

// export default App;

import React from 'react';
import { AuthProvider } from './context/AuthContext';
import { NavigationProvider } from './context/NavigationContext';
import Router from './routes/AppRoutes';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <NavigationProvider>
        <Router />
      </NavigationProvider>
    </AuthProvider>
  );
};

export default App;