import React from 'react';
import SiteBar from '../sitebar/SiteBar';
import TopBar from '../TopBar/TopBar';
import ComputerLabAnimation from './ComputerLabAnimation';
import StatsCards from './StatsCards';
import RecentProjects from './RecentProjects';
import TasksOverview from './TasksOverview';

const Deshboard = () => {
  return (
    <div className="flex h-screen bg-gray-100">
      <SiteBar />
      <div className="flex-1 ml-64 flex flex-col">
        <TopBar />
        <div className="flex-1 p-8 overflow-y-auto pt-24">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-800 mb-8">Dashboard</h1>

          <StatsCards />

          <ComputerLabAnimation />

          <RecentProjects />

          <TasksOverview />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Deshboard;
