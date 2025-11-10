import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const SupervisorRegister = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    designation: '',
    department: '',
    researchArea: '',
    phone: ''
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

    console.log('Form data being sent:', formData);

    try {
      const response = await fetch('http://192.168.0.106:8081/api/auth/register/supervisor', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          name: formData.name,
          designation: formData.designation,
          department: formData.department,
          research_area: formData.researchArea,
          phone: formData.phone,
        }),
      });

      const data = await response.json();

      console.log('Response status:', response.status);
      console.log('Response data:', data);

      if (response.ok) {
        setError('Registration successful! Please login.');
        setTimeout(() => navigate('/supervisor/auth'), 2000);
      } else {
        setError(data.message || 'Registration failed');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-purple-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
            <span className="text-2xl">👨‍🏫</span>
          </div>
          <h2 className="text-3xl font-bold text-gray-900">
            Supervisor Registration
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Create your supervisor account
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
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-purple-500 focus:border-purple-500 transition-colors"
                placeholder="supervisor@university.edu"
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
                value={formData.password}
                onChange={handleInputChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-purple-500 focus:border-purple-500 transition-colors"
                placeholder="Enter your password"
              />
            </div>

            {/* Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Full Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                value={formData.name}
                onChange={handleInputChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-purple-500 focus:border-purple-500 transition-colors"
                placeholder="Dr. John Smith"
              />
            </div>

            {/* Designation */}
            <div>
              <label htmlFor="designation" className="block text-sm font-medium text-gray-700">
                Designation
              </label>
              <input
                id="designation"
                name="designation"
                type="text"
                required
                value={formData.designation}
                onChange={handleInputChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-purple-500 focus:border-purple-500 transition-colors"
                placeholder="Associate Professor"
              />
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
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-purple-500 focus:border-purple-500 transition-colors"
                placeholder="Computer Science"
              />
            </div>

            {/* Research Area */}
            <div>
              <label htmlFor="researchArea" className="block text-sm font-medium text-gray-700">
                Research Area
              </label>
              <input
                id="researchArea"
                name="researchArea"
                type="text"
                value={formData.researchArea}
                onChange={handleInputChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-purple-500 focus:border-purple-500 transition-colors"
                placeholder="Machine Learning, AI"
              />
            </div>

            {/* Phone */}
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                Phone Number
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleInputChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-purple-500 focus:border-purple-500 transition-colors"
                placeholder="+880 1XX XXX XXXX"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-all duration-200 disabled:opacity-50"
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
              to="/supervisor/auth"
              className="text-sm text-purple-600 hover:text-purple-500 transition-colors"
            >
              Already have an account? Sign in
            </Link>
          </div>

          {/* Back to home */}
          <div className="mt-4 text-center">
            <Link
              to="/"
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

export default SupervisorRegister;