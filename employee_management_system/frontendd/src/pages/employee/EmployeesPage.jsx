import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axiosInstance from '../../api/axiosConfig';
import Button from '../../components/common/Button';

const EmployeesPage = () => {
  const [employees, setEmployees] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getEmployees = async () => {
      try {
        setIsLoading(true);
        const res = await axiosInstance.get('/api/employees');
        setEmployees(res.data.employees || []);
        setError(null);
      } catch (err) {
        setError('Failed to load employees. Please try again later.');
        console.error('Error fetching employees:', err);
      } finally {
        setIsLoading(false);
      }
    };
    getEmployees();
  }, []);

  const handleDelete = async (id) => {
    try {
      await axiosInstance.delete(`/api/employees/${id}`);
      setEmployees((prevEmployees) => prevEmployees.filter((emp) => emp.id !== id));
    } catch (err) {
      setError('Failed to delete employee. Please try again.');
      console.error('Error deleting employee:', err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white shadow-sm rounded-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Employees</h1>
          <Link to="/employees/add">
            <Button variant="primary">Add Employee</Button>
          </Link>
        </div>
        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
            {error}
          </div>
        )}
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded-lg shadow-sm">
            <thead>
              <tr className="bg-gray-50 border-b">
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {employees.map((employee) => (
                <tr key={employee.id} className="hover:bg-gray-50 transition-colors">
                  <td className="py-4 px-4 whitespace-nowrap">{employee.name}</td>
                  <td className="py-4 px-4 whitespace-nowrap">{employee.email}</td>
                  <td className="py-4 px-4 whitespace-nowrap">{employee.role}</td>
                  <td className="py-4 px-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <Link to={`/employees/edit/${employee.id}`}>
                        <button className="text-blue-600 hover:text-blue-900">Edit</button>
                      </Link>
                      <button
                        onClick={() => {
                          if (window.confirm('Are you sure you want to delete this employee?')) {
                            handleDelete(employee.id);
                          }
                        }}
                        className="text-red-600 hover:text-red-900"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default EmployeesPage; 