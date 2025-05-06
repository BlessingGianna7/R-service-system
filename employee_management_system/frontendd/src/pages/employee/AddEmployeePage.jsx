import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axiosInstance from '../../api/axiosConfig';
import EmployeeForm from '../../components/employee/EmployeeForm';

const AddEmployeePage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (employeeData) => {
    try {
      setIsLoading(true);
      setError(null);
      await axiosInstance.post('/api/employees', employeeData);
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        navigate('/employees');
      }, 1500);
    } catch (err) {
      setError('Failed to add employee. Please try again.');
      console.error('Error adding employee:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white shadow-sm rounded-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Add New Employee</h1>
          <Link to="/employees" className="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300">Back to Employees</Link>
        </div>
        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
            {error}
          </div>
        )}
        {success && (
          <div className="mb-4 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md">
            Employee added successfully!
          </div>
        )}
        <EmployeeForm onSubmit={handleSubmit} isLoading={isLoading} />
      </div>
    </div>
  );
};

export default AddEmployeePage; 