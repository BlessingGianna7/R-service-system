import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const EditEmployee = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [employee, setEmployee] = useState({ name: '', email: '', role: '' });

  useEffect(() => {
    fetchEmployee();
  }, []);

  const fetchEmployee = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`http://localhost:5000/api/employees/${id}`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      const data = await response.json();
      if (response.ok) {
        setEmployee(data);
      } else {
        alert('Error fetching employee');
      }
    } catch (error) {
      console.error('Error fetching employee:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`http://localhost:5000/api/employees/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(employee),
      });
      if (response.ok) {
        navigate('/employee-list'); 
      } else {
        alert('Failed to update employee');
      }
    } catch (error) {
      console.error('Error updating employee:', error);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Edit Employee</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={employee.name}
          onChange={(e) => setEmployee({ ...employee, name: e.target.value })}
          className="border p-2 w-full mb-4"
          placeholder="Name"
        />
        <input
          type="email"
          value={employee.email}
          onChange={(e) => setEmployee({ ...employee, email: e.target.value })}
          className="border p-2 w-full mb-4"
          placeholder="Email"
        />
        <input
          type="text"
          value={employee.role}
          onChange={(e) => setEmployee({ ...employee, role: e.target.value })}
          className="border p-2 w-full mb-4"
          placeholder="Role"
        />
        <button type="submit" className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
          Save Changes
        </button>
      </form>
    </div>
  );
};

export default EditEmployee;
