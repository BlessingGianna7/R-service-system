import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const Navbar = ({ hide }) => {
  const location = useLocation();
  const navigate = useNavigate();

  // Hide navbar on add/edit employee forms
  if (hide) return null;
  if (location.pathname.startsWith('/employees/add') || location.pathname.startsWith('/employees/edit')) return null;

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow-sm mb-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between h-16 items-center">
        <div className="flex items-center space-x-8">
          <Link to="/dashboard" className="text-blue-600 font-bold text-xl">EMS</Link>
          <Link to="/dashboard" className="text-gray-700 hover:text-blue-600">Dashboard</Link>
          <Link to="/employees" className="text-gray-700 hover:text-blue-600">Employees</Link>
          <Link to="/employees/add" className="text-gray-700 hover:text-blue-600">Add Employee</Link>
        </div>
        <button onClick={handleLogout} className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">Logout</button>
      </div>
    </nav>
  );
};

export default Navbar; 