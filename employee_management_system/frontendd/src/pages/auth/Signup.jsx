import React, { useState } from 'react';
import { UserPlus } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import axiosInstance from '../../api/axiosConfig';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';

const Signup = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors([]);
    if (!username.trim() || !email.trim() || !password.trim() || !confirmPassword.trim()) {
      setErrors(['Please fill out all fields']);
      return;
    }
    if (password !== confirmPassword) {
      setErrors(['Passwords do not match']);
      return;
    }
    if (password.length < 6) {
      setErrors(['Password must be at least 6 characters']);
      return;
    }
    setIsLoading(true);
    try {
      const res = await axiosInstance.post('/api/auth/signup', { username, email, password, confirmPassword });
      if (res.data.success) {
        navigate('/verify-email', { state: { email } });
      }
    } catch (err) {
      if (err.response?.data?.errors) {
        setErrors(err.response.data.errors.map(e => e.msg));
      } else if (err.response?.data?.message) {
        setErrors([err.response.data.message]);
      } else {
        setErrors(['Registration failed. Please try again.']);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Employee Management System</h2>
        <div className="flex justify-center mt-4">
          <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
            <UserPlus className="h-6 w-6 text-blue-600" />
          </div>
        </div>
        <h3 className="mt-3 text-center text-xl font-bold text-gray-900">Create your account</h3>
      </div>
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {errors.length > 0 && (
            <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
              <ul>
                {errors.map((err, i) => <li key={i}>{err}</li>)}
              </ul>
            </div>
          )}
          <form className="space-y-6" onSubmit={handleSubmit}>
            <Input label="Username" id="username" name="username" type="text" autoComplete="username" required value={username} onChange={e => setUsername(e.target.value)} />
            <Input label="Email address" id="email" name="email" type="email" autoComplete="email" required value={email} onChange={e => setEmail(e.target.value)} />
            <Input label="Password" id="password" name="password" type="password" autoComplete="new-password" required value={password} onChange={e => setPassword(e.target.value)} />
            <Input label="Confirm Password" id="confirmPassword" name="confirmPassword" type="password" autoComplete="new-password" required value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} />
            <div>
              <Button type="submit" fullWidth isLoading={isLoading}>Sign up</Button>
            </div>
          </form>
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm"><span className="px-2 bg-white text-gray-500">Or</span></div>
            </div>
            <div className="mt-6 text-center">
              <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500">Already have an account? Sign in</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
