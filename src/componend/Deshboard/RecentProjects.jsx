import React from 'react';

const RecentProjects = () => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-8">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Recent Projects</h2>
      <div className="space-y-4">
        <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
          <div>
            <h3 className="font-medium text-gray-900">Website Redesign</h3>
            <p className="text-sm text-gray-600">Due in 3 days</p>
          </div>
          <span className="px-3 py-1 text-sm bg-green-100 text-green-800 rounded-full">In Progress</span>
        </div>
        <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
          <div>
            <h3 className="font-medium text-gray-900">Mobile App Development</h3>
            <p className="text-sm text-gray-600">Due in 2 weeks</p>
          </div>
          <span className="px-3 py-1 text-sm bg-blue-100 text-blue-800 rounded-full">Planning</span>
        </div>
        <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
          <div>
            <h3 className="font-medium text-gray-900">Database Migration</h3>
            <p className="text-sm text-gray-600">Due in 1 week</p>
          </div>
          <span className="px-3 py-1 text-sm bg-yellow-100 text-yellow-800 rounded-full">Review</span>
        </div>
      </div>
    </div>
  );
};

export default RecentProjects;