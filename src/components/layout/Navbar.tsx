// import React from 'react';
// import { Link, useLocation, useNavigate } from 'react-router-dom';
// import { useAuth } from '../../hooks/useAuth';

// const Navbar: React.FC = () => {
//   const { user, logout } = useAuth();
//   const navigate = useNavigate();
//   const location = useLocation();

//   const handleLogout = () => {
//     logout();
//     navigate('/login');
//   };

//   const isActive = (path: string): boolean => {
//     return location.pathname === path || location.pathname.startsWith(path + '/');
//   };

//   return (
//     <nav className="bg-primary-dark border-b border-primary px-6 py-4 shadow-md">
//       <div className="flex justify-between items-center">
//         <div className="flex items-center space-x-8">
//           <Link
//             to="/dashboard"
//             className="text-2xl font-bold text-accent cursor-pointer hover:text-accent-light transition"
//           >
//             🏢 ERP System
//           </Link>
//           <div className="hidden md:flex space-x-4">
//             <Link
//               to="/dashboard"
//               className={`transition font-medium ${
//                 isActive('/dashboard') ? 'text-accent' : 'text-accent-light hover:text-accent'
//               }`}
//             >
//               Dashboard
//             </Link>
//             <Link
//               to="/products"
//               className={`transition font-medium ${
//                 isActive('/products') ? 'text-accent' : 'text-accent-light hover:text-accent'
//               }`}
//             >
//               Productos
//             </Link>
//             <Link
//               to="/marketing"
//               className={`transition font-medium ${
//                 isActive('/marketing') ? 'text-accent' : 'text-accent-light hover:text-accent'
//               }`}
//             >
//               Marketing
//             </Link>
//             <Link
//               to="/sales"
//               className={`transition font-medium ${
//                 isActive('/sales') ? 'text-accent' : 'text-accent-light hover:text-accent'
//               }`}
//             >
//               Ventas
//             </Link>
//             <Link
//               to="/reports"
//               className={`transition font-medium ${
//                 isActive('/reports') ? 'text-accent' : 'text-accent-light hover:text-accent'
//               }`}
//             >
//               Reportes
//             </Link>
//           </div>
//         </div>

//         <div className="flex items-center space-x-4">
//           {/* Notifications */}
//           <button className="relative text-accent-light hover:text-accent transition">
//             <svg
//               className="w-6 h-6"
//               fill="none"
//               strokeLinecap="round"
//               strokeLinejoin="round"
//               strokeWidth="2"
//               viewBox="0 0 24 24"
//               stroke="currentColor"
//             >
//               <path d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path>
//             </svg>
//             <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
//               3
//             </span>
//           </button>

//           {/* User menu */}
//           <div className="flex items-center space-x-3">
//             <div className="hidden md:block text-right">
//               <p className="text-accent font-medium">{user?.name}</p>
//               <p className="text-accent-light text-sm capitalize">{user?.role}</p>
//             </div>
//             <div className="w-10 h-10 bg-accent rounded-full flex items-center justify-center text-primary-dark font-bold">
//               {user?.name.charAt(0).toUpperCase()}
//             </div>
//           </div>

//           <button
//             onClick={handleLogout}
//             className="bg-primary text-accent px-4 py-2 rounded font-semibold hover:bg-primary-dark transition"
//           >
//             Salir
//           </button>
//         </div>
//       </div>
//     </nav>
//   );
// };

// export default Navbar;