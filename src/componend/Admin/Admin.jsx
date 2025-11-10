import React, { useState, useEffect } from 'react';
import SiteBar from '../sitebar/SiteBar';
import TopBar from '../TopBar/TopBar';
import { Link } from 'react-router-dom';

const Admin = () => {
  const [pendingUsers, setPendingUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPendingUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/admin/pending-users', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) {
        throw new Error('Failed to fetch pending users');
      }
      const data = await response.json();
      console.log(data)
      setPendingUsers(Array.isArray(data.users) ? data.users : []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
console.log(pendingUsers)
  const approveUser = async (userId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/admin/users/${userId}/approve`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) {
        throw new Error('Failed to approve user');
      }
      // Remove the approved user from the list
      setPendingUsers((prev) => (Array.isArray(prev) ? prev.filter(user => user.id !== userId) : []));
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    fetchPendingUsers();
  }, []);

  return (
    <div className="flex h-screen bg-gray-100">
      <SiteBar />
      <div className="flex-1 ml-64 flex flex-col">
        <TopBar />
        <div className="flex-1 p-8 overflow-y-auto pt-24">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-800 mb-8">Admin Dashboard</h1>
            <p className="text-gray-600 mb-6">Welcome to the admin panel.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <Link to="/supervisor/register" className="bg-blue-500 text-white px-6 py-4 rounded-lg hover:bg-blue-700 text-center font-semibold shadow-md transition-colors duration-200">
                Supervisor Registration
              </Link>
            </div>
            <div className="bg-white shadow-md rounded-lg p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Pending Users Approval</h2>
              {loading ? (
                <p className="text-gray-600">Loading pending users...</p>
              ) : error ? (
                <p className="text-red-600">Error: {error}</p>
              ) : !Array.isArray(pendingUsers) || pendingUsers.length === 0 ? (
                <p className="text-gray-600">No pending users to approve.</p>
              ) : (
                <ul className="space-y-4">
                  {(Array.isArray(pendingUsers) ? pendingUsers : []).map((user) => (
                    <li key={user.id} className="flex justify-between items-center bg-gray-50 p-4 rounded-lg">
                      <div>
                        <p className="font-semibold">{user.name}</p>
                        <p className="text-gray-600">{user.email}</p>
                      </div>
                      <button
                        onClick={() => approveUser(user.id)}
                        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-700"
                      >
                        Approve
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;