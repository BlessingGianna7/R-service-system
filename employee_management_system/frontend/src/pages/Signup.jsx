import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import bgImage from '../assets/bg-pic.jpg';

const Signup = () => {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/auth/signup', { 
        email, 
        username, 
        password 
      });
      alert(response.data.message);
      navigate('/login'); 
    } catch (error) {
      console.error('Signup error:', error);
      alert('Signup failed. Try again.');
    }
  };

  return (
    <div className="flex h-screen">
      <div 
        className="w-1/2 bg-cover bg-center flex items-center justify-center" 
        style={{ backgroundImage: `url(${bgImage})` }}
      >
        <div className="text-white text-center p-8">
        
          <div className="mt-6 flex space-x-4">
           
          </div>
        </div>
      </div>

      <div className="w-1/2 flex items-center justify-center bg-white">
        <div className="w-96 p-8 shadow-lg rounded">
          <h2 className="text-2xl font-bold mb-6 text-center text-blue-900">Welcome to EmployeeManage</h2>
          <p className="text-gray-600 text-center mb-6">Register your account</p>

          <form onSubmit={handleSignup}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">E-mail Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-2 border rounded"
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full p-2 border rounded"
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-2 border rounded"
                required
              />
            </div>

            <div className="flex items-center mb-6">
              <input type="checkbox" className="mr-2" required />
              <label className="text-sm text-gray-700">
                I agree to all the <span className="text-blue-600">Terms, Privacy Policy</span>
              </label>
            </div>

            <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700">
              Create Account
            </button>
          </form>

          <p className="text-center text-gray-600 mt-4">
            Already have an account? <a href="/login" className="text-blue-600">Log In</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;