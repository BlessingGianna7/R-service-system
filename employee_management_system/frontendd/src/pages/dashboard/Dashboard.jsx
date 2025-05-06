import React, { useEffect, useState } from 'react';
import axiosInstance from '../../api/axiosConfig';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchStatsAndEmployees = async () => {
      try {
        const statsRes = await axiosInstance.get('/api/dashboard/stats');
        setStats(statsRes.data);
        const empRes = await axiosInstance.get('/api/employees');
        setEmployees(empRes.data.employees || []);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchStatsAndEmployees();
  }, []);

  const filteredEmployees = employees.filter(
    (emp) =>
      emp.name.toLowerCase().includes(search.toLowerCase()) ||
      emp.email.toLowerCase().includes(search.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row gap-6">
        <div className="flex-1 bg-white rounded-xl shadow p-6 flex items-center border-2 border-blue-200">
          <div className="bg-blue-100 rounded-full h-12 w-12 flex items-center justify-center mr-4">
            <span className="text-2xl">👥</span>
          </div>
          <div>
            <div className="text-gray-500 text-sm font-medium mb-1">Total Employees</div>
            <div className="text-3xl font-bold text-blue-700">{employees.length}</div>
          </div>
        </div>
        <div className="flex-1 bg-white rounded-xl shadow p-6 flex items-center border-2 border-green-200">
          <div className="bg-green-100 rounded-full h-12 w-12 flex items-center justify-center mr-4">
            <span className="text-2xl">💼</span>
          </div>
          <div>
            <div className="text-gray-500 text-sm font-medium mb-1">Active Employees</div>
            <div className="text-3xl font-bold text-green-700">{stats?.activeEmployees}</div>
          </div>
        </div>
      </div>
      <div className="bg-white rounded-xl shadow p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-4">
          <h2 className="text-lg font-semibold text-gray-900">Employees</h2>
          <input
            type="text"
            placeholder="Search employees..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="border border-gray-300 rounded px-4 py-2 w-full md:w-72 focus:outline-none focus:ring-2 focus:ring-blue-200"
          />
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded-lg shadow-sm">
            <thead>
              <tr className="bg-gray-50 border-b">
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredEmployees.map((employee) => (
                <tr key={employee.id} className="hover:bg-gray-50 transition-colors">
                  <td className="py-4 px-4 whitespace-nowrap">{employee.name}</td>
                  <td className="py-4 px-4 whitespace-nowrap">{employee.email}</td>
                  <td className="py-4 px-4 whitespace-nowrap">{employee.role}</td>
                </tr>
              ))}
              {filteredEmployees.length === 0 && (
                <tr>
                  <td colSpan={3} className="text-center py-6 text-gray-400">No employees found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 