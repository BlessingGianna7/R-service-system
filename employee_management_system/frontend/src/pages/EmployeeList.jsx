import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';






const EmployeeList = () => {
  const navigate = useNavigate();
  const [employees, setEmployees] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchEmployees();
  }, [page]);

  const fetchEmployees = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/employees?page=${page}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (response.ok) {
        setEmployees(data.employees);
        setTotalPages(data.totalPages);
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error('Error fetching employees:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/employees/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (response.ok) {
        fetchEmployees(); 
      } else {
        alert('Failed to delete employee');
      }
    } catch (error) {
      console.error('Error deleting employee:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Employee List</h2>
      <Link
        to="/add-employee"
        className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 mb-4 inline-block"
      >
        Add Employee
      </Link>
      <table className="w-full bg-white rounded shadow-md">
        <thead>
          <tr>
            <th className="p-2 border">Name</th>
            <th className="p-2 border">Email</th>
            <th className="p-2 border">Role</th>
            <th className="p-2 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {employees.map((employee) => (
            <tr key={employee.id}>
              <td className="p-2 border">{employee.name}</td>
              <td className="p-2 border">{employee.email}</td>
              <td className="p-2 border">{employee.role}</td>
              <td className="p-2 border">
                <button
                  onClick={() => handleDelete(employee.id)}
                  className="bg-red-500 text-white p-1 rounded hover:bg-red-600 mr-2"
                >
                  Delete
                </button>
                <button
                  onClick={() => navigate(`/edit-employee/${employee.id}`)} 
                  className="bg-yellow-500 text-white p-1 rounded hover:bg-yellow-600"
                >
                  Edit
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="mt-4 flex justify-between">
        <button
          onClick={() => setPage(page - 1)}
          disabled={page === 1}
          className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
        >
          Previous
        </button>
        <span>Page {page} of {totalPages}</span>
        <button
          onClick={() => setPage(page + 1)}
          disabled={page === totalPages}
          className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
        >
          Next
        </button>
      </div>
      <button onClick={handleLogout} className="bg-red-500 text-white p-2 rounded hover:bg-red-600 mt-6">Logout</button>
    </div>
  );
};

export default EmployeeList;