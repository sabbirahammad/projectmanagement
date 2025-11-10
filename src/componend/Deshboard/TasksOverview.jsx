import React from 'react';

const TasksOverview = () => {
  return (
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
  );
};

export default TasksOverview;