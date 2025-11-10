import React from 'react';
import SiteBar from '../sitebar/SiteBar';
import TopBar from '../TopBar/TopBar';
import ComputerLabAnimation from './ComputerLabAnimation';

const Deshboard = () => {
  return (
    <div className="flex h-screen bg-gray-100">
      <SiteBar />
      <div className="flex-1 ml-64 flex flex-col">
        <TopBar />
        <div className="flex-1 p-8 overflow-y-auto pt-24">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-800 mb-8">Dashboard</h1>

          {/* Stats Cards */}
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

          {/* Computer Lab Animation */}
          <ComputerLabAnimation />

          {/* Recent Projects */}
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

          {/* Tasks Overview */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Today's Tasks</h2>
            <div className="space-y-3">
              <div className="flex items-center p-3 border border-gray-200 rounded-lg">
                <input type="checkbox" className="mr-3" />
                <span className="text-gray-700">Review design mockups</span>
              </div>
              <div className="flex items-center p-3 border border-gray-200 rounded-lg">
                <input type="checkbox" className="mr-3" />
                <span className="text-gray-700">Update project timeline</span>
              </div>
              <div className="flex items-center p-3 border border-gray-200 rounded-lg">
                <input type="checkbox" className="mr-3" />
                <span className="text-gray-700">Team meeting at 3 PM</span>
              </div>
              <div className="flex items-center p-3 border border-gray-200 rounded-lg">
                <input type="checkbox" className="mr-3" />
                <span className="text-gray-700">Code review for feature branch</span>
              </div>
            </div>
          </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Deshboard;
