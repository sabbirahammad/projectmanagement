import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const TopBar = () => {
  const { user, logout } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [teamRequests, setTeamRequests] = useState([]);
  const [supervisorRequests, setSupervisorRequests] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setIsLoggedIn(true);
      fetchTeamRequests();
      fetchSupervisorRequests();
    } else {
      setIsLoggedIn(false);
    }
  }, [user]);

  const fetchTeamRequests = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    setLoading(true);
    try {
      const response = await fetch('https://projectmanagement-production-e252.up.railway.app/api/team-requests/received', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setTeamRequests(data.requests || []);
      } else {
        console.log('Failed to fetch team requests');
      }
    } catch (err) {
      console.log('Error fetching team requests:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchSupervisorRequests = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    setLoading(true);
    try {
      const response = await fetch('https://projectmanagement-production-e252.up.railway.app/api/supervisor-requests/pending', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        console.log(data)
        setSupervisorRequests(data.requests || []);
      } else {
        console.log('Failed to fetch supervisor requests');
      }
    } catch (err) {
      console.log('Error fetching supervisor requests:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptRequest = async (requestId) => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`https://projectmanagement-production-e252.up.railway.app/api/team-requests/${requestId}/accept`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        // Remove the accepted request from the list
        setTeamRequests(teamRequests.filter(req => req.id !== requestId));
      }
    } catch (err) {
      console.log('Error accepting team request:', err);
    }
  };

  const handleRejectRequest = async (requestId) => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`https://projectmanagement-production-e252.up.railway.app/api/team-requests/${requestId}/reject`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        // Remove the rejected request from the list
        setTeamRequests(teamRequests.filter(req => req.id !== requestId));
      }
    } catch (err) {
      console.log('Error rejecting team request:', err);
    }
  };

  const handleAcceptSupervisorRequest = async (requestId) => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`https://projectmanagement-production-e252.up.railway.app/api/supervisor-requests/${requestId}/accept`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        // Remove the accepted request from the list
        setSupervisorRequests(supervisorRequests.filter(req => req.id !== requestId));
      }
    } catch (err) {
      console.log('Error accepting supervisor request:', err);
    }
  };

  const handleRejectSupervisorRequest = async (requestId) => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`https://projectmanagement-production-e252.up.railway.app/api/supervisor-requests/${requestId}/reject`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        // Remove the rejected request from the list
        setSupervisorRequests(supervisorRequests.filter(req => req.id !== requestId));
      }
    } catch (err) {
      console.log('Error rejecting supervisor request:', err);
    }
  };

  const notifications = [

  ];
  return (
    <div className="h-16 bg-white shadow-lg border-b border-gray-200 fixed top-0 left-64 right-0 z-40 backdrop-blur-md bg-white/95">
      <div className="flex items-center justify-between h-full px-6">

        {/* Left Section - Breadcrumb */}
        <div className="flex items-center space-x-4">
          <h1 className="text-xl font-semibold text-gray-800">Dashboard</h1>
          <div className="hidden md:flex items-center space-x-2 text-sm text-gray-500">
            <span>ProjectFlow</span>
            <span>/</span>
            <span>Overview</span>
          </div>
        </div>

        {/* Center Section - Search Bar */}
        <div className="flex-1 max-w-md mx-8">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Search projects, tasks, team..."
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Right Section - Actions */}
        <div className="flex items-center space-x-4">
<div>
  <Link to={'/profile'} className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200">
    Profile
  </Link>
</div>
    {!isLoggedIn && (
      <div>
        <Link to={'/security'}>
          <button className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200">
            Admin
          </button>
        </Link>
      </div>
    )}
          {/* Quick Actions */}
          <div className="hidden md:flex items-center space-x-2">
            <button className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200">
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </button>
            <button className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors duration-200">
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </button>
          </div>

          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200 relative"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM15 7v5h5l-5 5v-5H9V7h6z" />
              </svg>
              {(notifications.filter(n => n.unread).length + teamRequests.length + supervisorRequests.length) > 0 && (
                <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  {notifications.filter(n => n.unread).length + teamRequests.length + supervisorRequests.length}
                </span>
              )}
            </button>

            {/* Notifications Dropdown */}
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-gray-200 z-50">
                <div className="p-4 border-b border-gray-200">
                  <h3 className="text-sm font-semibold text-gray-900">Notifications</h3>
                </div>
                <div className="max-h-64 overflow-y-auto">
                  {/* Team Requests */}
                  {teamRequests.map((request) => (
                    <div key={`team-${request.id}`} className="p-4 border-b border-gray-100 hover:bg-green-50 bg-green-50">
                      <p className="text-sm text-gray-800 font-medium">
                        Team Request from {request.from_student.name || 'Unknown Student'}
                      </p>
                      <p className="text-xs text-gray-600 mt-1">
                        Team: {request.team_name} | Project: {request.project_name}
                      </p>
                      <div className="flex space-x-2 mt-2">
                        <button
                          onClick={() => handleAcceptRequest(request.id)}
                          className="px-3 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700"
                        >
                          Accept
                        </button>
                        <button
                          onClick={() => handleRejectRequest(request.id)}
                          className="px-3 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700"
                        >
                          Reject
                        </button>
                      </div>
                    </div>
                  ))}

                  {/* Supervisor Requests */}
                  {supervisorRequests.map((request) => (
                    <div key={`supervisor-${request.id}`} className="p-4 border-b border-gray-100 hover:bg-blue-50 bg-blue-50">
                      <p className="text-sm text-gray-800 font-medium">
                        Supervisor Request from {request.team_name || 'Unknown Student' } Team
                      </p>
                      <p className="text-xs text-gray-600 mt-1">
                        Project: {request.project_title}
                      </p>
                      <div className="flex space-x-2 mt-2">
                        <button
                          onClick={() => handleAcceptSupervisorRequest(request.id)}
                          className="px-3 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700"
                        >
                          Accept
                        </button>
                        <button
                          onClick={() => handleRejectSupervisorRequest(request.id)}
                          className="px-3 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700"
                        >
                          Reject
                        </button>
                      </div>
                    </div>
                  ))}

                  {/* Regular Notifications */}
                  {notifications.map((notification) => (
                    <div key={notification.id} className={`p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer ${notification.unread ? 'bg-blue-50' : ''}`}>
                      <p className="text-sm text-gray-800">{notification.message}</p>
                      <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                    </div>
                  ))}
                </div>
                <div className="p-3 text-center border-t border-gray-200">
                  <button className="text-sm text-blue-600 hover:text-blue-800">View all notifications</button>
                </div>
              </div>
            )}
          </div>

          {/* User Profile */}
          {isLoggedIn ? (
            <div className="flex items-center space-x-3">
              <div className="hidden md:block text-right">
                <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                <p className="text-xs text-gray-500">{user?.type === 'student' ? 'Student' : 'Supervisor'}</p>
              </div>
              <div className="relative group">
                {user?.image ? (
                  <img
                    src={user.image}
                    alt="Profile"
                    className="w-8 h-8 rounded-full object-cover cursor-pointer hover:scale-110 transition-transform duration-200"
                  />
                ) : (
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-bold cursor-pointer hover:scale-110 transition-transform duration-200">
                    {user?.name?.split(' ').map(n => n[0]).join('').toUpperCase()}
                  </div>
                )}
                {/* User Dropdown */}
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                  <div className="p-3 border-b border-gray-200">
                    <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                    <p className="text-xs text-gray-500">{user?.type === 'student' ? 'Student' : 'Supervisor'}</p>
                  </div>
                  <div className="py-2">
                    <Link to="/profile" className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-100">Profile</Link>
                    <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100">Settings</button>
                    <div className="border-t border-gray-200 my-1"></div>
                    <button
                      className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50"
                      onClick={() => {
                        logout();
                        window.location.reload();
                      }}
                    >
                      Logout
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <>
              {/* Auth Buttons for Unauthenticated Users */}
              <div className="flex items-center space-x-3">
                <div className="relative group">
                  <button className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200">
                    Login
                  </button>
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                    <div className="py-2">
                      <Link to="/student/auth" className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-100">Student Login</Link>
                      <Link to="/supervisor/auth" className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-100">Supervisor Login</Link>
                    </div>
                  </div>
                </div>
                <div className="relative group">
                  <button className="px-4 py-2 text-sm font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200">
                    Register
                  </button>
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                    <div className="py-2">
                      <Link to="/student/register" className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-100">Student Register</Link>
                      {/* <Link to="/supervisor/register" className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-100">Supervisor Register</Link> */}
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default TopBar;