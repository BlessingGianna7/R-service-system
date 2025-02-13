import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import bgImage from '../assets/bg-pic.jpg';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();


  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        'http://localhost:5000/api/auth/login',
        { email, password },
        { withCredentials: true }
      );
  
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        navigate('/employee-list'); 
      } else {
        alert('Login failed, no token received.');
      }
    } catch (error) {
      alert('Invalid email or password');
    }
  };

  return (
    <div className="flex h-screen">
      <div 
        className="w-1/2 bg-cover bg-center flex items-center justify-center" 
        style={{ backgroundImage: `url(${bgImage})` }}
      >
        <div className="text-white text-center p-8">
        </div>
      </div>

      <div className="w-1/2 flex items-center justify-center bg-white">
        <div className="w-96 p-8 shadow-lg rounded">
          <h2 className="text-2xl font-bold mb-6 text-center text-blue-900">Welcome Back</h2>
          <p className="text-gray-600 text-center mb-6">Login to your account</p>

          <form onSubmit={handleLogin}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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

            <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700">
              Login
            </button>
          </form>

          <p className="text-center text-gray-600 mt-4">
            Don't have an account? <a href="/signup" className="text-blue-600">Sign Up</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
