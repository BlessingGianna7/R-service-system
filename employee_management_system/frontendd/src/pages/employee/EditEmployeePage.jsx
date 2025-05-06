import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import axiosInstance from '../../api/axiosConfig';
import Button from '../../components/common/Button';
import EmployeeForm from '../../components/employee/EmployeeForm';

const EditEmployeePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [employee, setEmployee] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const getEmployee = async () => {
      if (!id) return;
      try {
        setIsLoading(true);
        const res = await axiosInstance.get(`/api/employees/${id}`);
        setEmployee(res.data.employee);
        setError(null);
      } catch (err) {
        setError('Failed to load employee details. The employee may not exist.');
        console.error('Error fetching employee:', err);
      } finally {
        setIsLoading(false);
      }
    };
    getEmployee();
  }, [id]);

  const handleSubmit = async (employeeData) => {
    if (!id) return;
    try {
      setIsSaving(true);
      setError(null);
      await axiosInstance.put(`/api/employees/${id}`, employeeData);
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        navigate('/employees');
      }, 1500);
    } catch (err) {
      setError('Failed to update employee. Please try again.');
      console.error('Error updating employee:', err);
      throw err;
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error && !employee) {
    return (
      <div className="bg-white shadow-sm rounded-lg p-6">
        <div className="text-center py-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Employee Not Found</h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <Button variant="primary" onClick={() => navigate('/employees')}>
            Back to Employees
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white shadow-sm rounded-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Edit Employee</h1>
          <Link to="/employees" className="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300">Back to Employees</Link>
        </div>
        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
            {error}
          </div>
        )}
        {success && (
          <div className="mb-4 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md">
            Employee updated successfully!
          </div>
        )}
        {employee && (
          <EmployeeForm initialData={employee} onSubmit={handleSubmit} isLoading={isSaving} />
        )}
      </div>
    </div>
  );
};

export default EditEmployeePage; 