import React from 'react';
import SiteBar from '../sitebar/SiteBar';
import TopBar from '../TopBar/TopBar';
import { Link } from 'react-router-dom';

const Admin = () => {
  return (
    <div className="flex h-screen bg-gray-100">
      <SiteBar />
      <div className="flex-1 ml-64 flex flex-col">
        <TopBar />
        <div className="flex-1 p-8 overflow-y-auto pt-24">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-800 mb-8">Admin Dashboard</h1>
            <p className="text-gray-600 mb-6">Welcome to the admin panel.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Link to="/supervisor/register" className="bg-blue-500 text-white px-6 py-4 rounded-lg hover:bg-blue-700 text-center font-semibold shadow-md transition-colors duration-200">
                Supervisor Registration
              </Link>
              <Link to="/approval" className="bg-green-500 text-white px-6 py-4 rounded-lg hover:bg-green-700 text-center font-semibold shadow-md transition-colors duration-200">
                Student Approval
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;