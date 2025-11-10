import React from 'react';

const StatsCards = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center">
          <div className="p-3 rounded-full bg-blue-100 text-blue-600">
            📁
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-600">Total Projects</p>
            <p className="text-2xl font-bold text-gray-900">12</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center">
          <div className="p-3 rounded-full bg-green-100 text-green-600">
            ✅
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-600">Completed Tasks</p>
            <p className="text-2xl font-bold text-gray-900">87</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center">
          <div className="p-3 rounded-full bg-yellow-100 text-yellow-600">
            ⏳
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-600">Pending Tasks</p>
            <p className="text-2xl font-bold text-gray-900">23</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center">
          <div className="p-3 rounded-full bg-purple-100 text-purple-600">
            👥
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-600">Team Members</p>
            <p className="text-2xl font-bold text-gray-900">8</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsCards;