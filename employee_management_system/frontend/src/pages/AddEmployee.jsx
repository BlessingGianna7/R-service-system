// pages/AddEmployee.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const AddEmployee = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/employees', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ name, email, role }),
      });
  
      const data = await response.json();
      if (response.ok) {
        setName('');
        setEmail('');
        setRole('');
        navigate('/employee-list');
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error('Error adding employee:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };
  
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Add Employee</h2>
      <Link
        to="/employee-list"
        className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 mb-4 inline-block"
      >
        Back to Employee List
      </Link>
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md">
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Role</label>
          <input
            type="text"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <button type="submit" className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
          Add Employee
        </button>
      </form>

      <button onClick={handleLogout} className="bg-red-500 text-white p-2 rounded hover:bg-red-600 mt-6">Logout</button>
    </div>
  );
};

export default AddEmployee;