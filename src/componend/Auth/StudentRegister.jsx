import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const StudentRegister = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    department: '',
    session: '',
    registrationNumber: '',
    batch: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Client-side validation
    if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email)) {
      setError('Please enter a valid email address.');
      setLoading(false);
      return;
    }
    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters long.');
      setLoading(false);
      return;
    }
    if (!formData.firstName.trim()) {
      setError('First name is required.');
      setLoading(false);
      return;
    }
    if (!formData.lastName.trim()) {
      setError('Last name is required.');
      setLoading(false);
      return;
    }
    if (!formData.department.trim()) {
      setError('Department is required.');
      setLoading(false);
      return;
    }
    if (!formData.session.trim()) {
      setError('Session is required.');
      setLoading(false);
      return;
    }
    if (!formData.registrationNumber.trim()) {
      setError('Registration number is required.');
      setLoading(false);
      return;
    }
    if (!formData.batch.trim()) {
      setError('Batch is required.');
      setLoading(false);
      return;
    }

    const requestBody = {
      email: formData.email,
      password: formData.password,
      first_name: formData.firstName,
      last_name: formData.lastName,
      department: formData.department,
      session: formData.session,
      registration_number: formData.registrationNumber,
      batch: formData.batch,
    };

    console.log('Registration request body:', requestBody);

    try {
      const response = await fetch('http://192.168.0.106:8081/api/auth/register/student', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      console.log('Response status:', response.status);
      const data = await response.json();
      console.log('Response data:', data);

      if (response.ok) {
        setError('Registration successful! Please login.');
        setTimeout(() => navigate('/student/auth'), 2000);
      } else {
        setError(data.message || 'Registration failed');
      }
    } catch (err) {
      console.error('Network error:', err);
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
            <span className="text-2xl">🎓</span>
          </div>
          <h2 className="text-3xl font-bold text-gray-900">
            Student Registration
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Create your student account
          </p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
              {error}
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-6">
            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleInputChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder="student@university.edu"
              />
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                minLength="8"
                value={formData.password}
                onChange={handleInputChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder="Enter your password (min 8 characters)"
              />
            </div>

            {/* Name Fields */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                  First Name
                </label>
                <input
                  id="firstName"
                  name="firstName"
                  type="text"
                  required
                  value={formData.firstName}
                  onChange={handleInputChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 transition-colors"
                />
              </div>
              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                  Last Name
                </label>
                <input
                  id="lastName"
                  name="lastName"
                  type="text"
                  required
                  value={formData.lastName}
                  onChange={handleInputChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 transition-colors"
                />
              </div>
            </div>

            {/* Department */}
            <div>
              <label htmlFor="department" className="block text-sm font-medium text-gray-700">
                Department
              </label>
              <input
                id="department"
                name="department"
                type="text"
                required
                value={formData.department}
                onChange={handleInputChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder="Computer Science"
              />
            </div>

            {/* Session and Batch */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="session" className="block text-sm font-medium text-gray-700">
                  Session
                </label>
                <input
                  id="session"
                  name="session"
                  type="text"
                  required
                  value={formData.session}
                  onChange={handleInputChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="2023-2024"
                />
              </div>
              <div>
                <label htmlFor="batch" className="block text-sm font-medium text-gray-700">
                  Batch
                </label>
                <input
                  id="batch"
                  name="batch"
                  type="text"
                  required
                  value={formData.batch}
                  onChange={handleInputChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="2023"
                />
              </div>
            </div>

            {/* Registration Number */}
            <div>
              <label htmlFor="registrationNumber" className="block text-sm font-medium text-gray-700">
                Registration Number
              </label>
              <input
                id="registrationNumber"
                name="registrationNumber"
                type="text"
                required
                value={formData.registrationNumber}
                onChange={handleInputChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder="2023001"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 disabled:opacity-50"
            >
              {loading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Creating account...
                </div>
              ) : (
                'Create Account'
              )}
            </button>
          </form>

          {/* Back to login */}
          <div className="mt-6 text-center">
            <Link
              to="/student/auth"
              className="text-sm text-blue-600 hover:text-blue-500 transition-colors"
            >
              Already have an account? Sign in
            </Link>
          </div>

          {/* Back to home */}
          <div className="mt-4 text-center">
            <Link
              to="/dashboard"
              className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
            >
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentRegister;