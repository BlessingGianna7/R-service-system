import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../common/Button';

const defaultEmployee = {
  name: '',
  email: '',
  role: '',
};

const EmployeeForm = ({ initialData, onSubmit, isLoading = false }) => {
  const [employee, setEmployee] = useState(initialData || defaultEmployee);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    if (initialData) {
      setEmployee(initialData);
    }
  }, [initialData]);

  const validateForm = () => {
    const newErrors = {};
    if (!employee.name.trim()) newErrors.name = 'Name is required';
    if (!employee.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(employee.email)) {
      newErrors.email = 'Email is invalid';
    }
    if (!employee.role.trim()) newErrors.role = 'Role is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEmployee((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        await onSubmit(employee);
      } catch (error) {
        // error handled in parent
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-md mx-auto">
      <div className="bg-white shadow-sm rounded-lg p-6">
        <div className="grid grid-cols-1 gap-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <input
              id="name"
              name="name"
              type="text"
              value={employee.name}
              onChange={handleChange}
              className={`block w-full rounded-md border ${errors.name ? 'border-red-500' : 'border-gray-300'} p-2`}
              required
            />
            {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              value={employee.email}
              onChange={handleChange}
              className={`block w-full rounded-md border ${errors.email ? 'border-red-500' : 'border-gray-300'} p-2`}
              required
            />
            {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
          </div>
          <div>
            <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">Role</label>
            <input
              id="role"
              name="role"
              type="text"
              value={employee.role}
              onChange={handleChange}
              className={`block w-full rounded-md border ${errors.role ? 'border-red-500' : 'border-gray-300'} p-2`}
              required
            />
            {errors.role && <p className="mt-1 text-sm text-red-600">{errors.role}</p>}
          </div>
        </div>
      </div>
      <div className="flex justify-end space-x-3">
        <Button type="submit" variant="primary" isLoading={isLoading}>
          {initialData ? 'Update Employee' : 'Add Employee'}
        </Button>
      </div>
    </form>
  );
};

EmployeeForm.propTypes = {
  initialData: PropTypes.shape({
    name: PropTypes.string,
    email: PropTypes.string,
    role: PropTypes.string,
  }),
  onSubmit: PropTypes.func.isRequired,
  isLoading: PropTypes.bool,
};

export default EmployeeForm; 