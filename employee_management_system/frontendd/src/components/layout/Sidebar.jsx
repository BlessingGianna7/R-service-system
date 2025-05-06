import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const babyBlue = 'bg-blue-100 text-blue-700';
const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <aside className="h-screen w-56 bg-white text-gray-800 flex flex-col py-8 px-4 fixed left-0 top-0 z-10 border-r border-gray-200">
      <div className="mb-10 flex items-center space-x-2">
        <span className="font-bold text-2xl text-blue-700">EMS</span>
      </div>
      <nav className="flex flex-col space-y-2">
        <Link
          to="/dashboard"
          className={`flex items-center py-2 px-4 rounded-lg font-medium transition-colors ${location.pathname === '/dashboard' ? babyBlue : 'hover:bg-gray-100'}`}
        >
          <span className="mr-2">🏠</span> Dashboard
        </Link>
        <Link
          to="/employees"
          className={`flex items-center py-2 px-4 rounded-lg font-medium transition-colors ${location.pathname.startsWith('/employees') ? babyBlue : 'hover:bg-gray-100'}`}
        >
          <span className="mr-2">👥</span> Employees
        </Link>
      </nav>
      <div className="flex-1" />
      <button
        onClick={handleLogout}
        className="flex items-center py-2 px-4 rounded-lg font-medium text-red-500 hover:bg-red-50 transition-colors"
      >
        <span className="mr-2">🚪</span> Logout
      </button>
    </aside>
  );
};

export default Sidebar; 