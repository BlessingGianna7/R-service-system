import React, { useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import axiosInstance from '../../api/axiosConfig';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';

const VerifyEmail = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const prefilledEmail = location.state?.email || '';

  const [email, setEmail] = useState(prefilledEmail);
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleVerify = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (!email.trim() || !otp.trim()) {
      setError('Please enter both email and OTP');
      return;
    }
    setIsLoading(true);
    try {
      const res = await axiosInstance.post('/api/auth/verify-email', { email, otp });
      setSuccess(res.data.message);
      // Redirect to login after a short delay
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setError(
        err.response?.data?.message || 'Verification failed. Please try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Verify Your Email</h2>
      </div>
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {error && <div className="mb-4 text-red-600">{error}</div>}
          {success && <div className="mb-4 text-green-600">{success}</div>}
          <form className="space-y-6" onSubmit={handleVerify}>
            <Input
              label="Email address"
              id="email"
              name="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              label="OTP Code"
              id="otp"
              name="otp"
              type="text"
              required
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />
            <div>
              <Button type="submit" fullWidth isLoading={isLoading}>
                Verify
              </Button>
            </div>
          </form>
          <div className="mt-6 text-center">
            <Link to="/resend-otp" className="font-medium text-blue-600 hover:text-blue-500">
              Didn't receive code? Resend OTP
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;
