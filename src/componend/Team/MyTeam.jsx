import React, { useState, useEffect } from 'react';
import SiteBar from '../sitebar/SiteBar';
import TopBar from '../TopBar/TopBar';

const MyTeam = () => {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedTeams, setExpandedTeams] = useState({});
  const [teamTasks, setTeamTasks] = useState({});
  const [teamMessages, setTeamMessages] = useState({});
  const [loadingDetails, setLoadingDetails] = useState({});

  const API_BASE = 'https://projectmanagement-production-e252.up.railway.app/api';

  useEffect(() => {
    const fetchMyTeams = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('No authentication token found');
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`${API_BASE}/my-team`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          const data = await response.json();
          console.log(data)
          setTeams(data.has_team ? [data.team] : []);
        } else {
          setError('Failed to fetch teams');
        }
      } catch (err) {
        setError('Error fetching teams: ' + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMyTeams();
  }, []);

  const fetchTeamTasks = async (teamId) => {
    const token = localStorage.getItem('token');
    if (!token) return;

    setLoadingDetails(prev => ({ ...prev, [teamId]: true }));
    try {
      const response = await fetch(`${API_BASE}/teams/${teamId}/tasks`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setTeamTasks(prev => ({ ...prev, [teamId]: data.tasks || [] }));
      }
    } catch (err) {
      console.error('Error fetching tasks:', err);
    } finally {
      setLoadingDetails(prev => ({ ...prev, [teamId]: false }));
    }
  };

  const fetchTeamMessages = async (teamId) => {
    const token = localStorage.getItem('token');
    if (!token) return;

    setLoadingDetails(prev => ({ ...prev, [teamId]: true }));
    try {
      const response = await fetch(`${API_BASE}/teams/${teamId}/messages`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setTeamMessages(prev => ({ ...prev, [teamId]: data.messages || [] }));
      }
    } catch (err) {
      console.error('Error fetching messages:', err);
    } finally {
      setLoadingDetails(prev => ({ ...prev, [teamId]: false }));
    }
  };

  const toggleTeamExpansion = (teamId, type) => {
    const key = `${teamId}-${type}`;
    const isExpanded = expandedTeams[key];

    setExpandedTeams(prev => ({ ...prev, [key]: !isExpanded }));

    if (!isExpanded) {
      if (type === 'tasks') {
        fetchTeamTasks(teamId);
      } else if (type === 'messages') {
        fetchTeamMessages(teamId);
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-xl shadow-2xl max-w-md w-full">
          <div className="text-center">
            <svg className="mx-auto h-16 w-16 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            <h2 className="mt-4 text-xl font-semibold text-gray-900">Error</h2>
            <p className="mt-2 text-gray-600">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <SiteBar />
      <div className="flex-1 ml-64 flex flex-col">
        <TopBar />
        <div className="flex-1 p-8 overflow-y-auto pt-24">
          <div className="max-w-7xl mx-auto">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-800 mb-2">My Teams</h1>
              <p className="text-gray-600">Explore and manage your project teams</p>
            </div>

        {teams.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
            <svg className="mx-auto h-24 w-24 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <h3 className="mt-4 text-xl font-semibold text-gray-900">No Teams Found</h3>
            <p className="mt-2 text-gray-600">You haven't joined any teams yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {teams.map((team) => (
              <div key={team.id} className="bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
                <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6">
                  <div className="flex items-center justify-between">
                    <div className="text-white">
                      <h3 className="text-xl font-bold">{team.name}</h3>
                      <p className="text-blue-100">Team ID: {team.id}</p>
                    </div>
                    <div className="bg-white bg-opacity-20 rounded-full p-3">
                      <svg className="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-500">Project</label>
                      <p className="text-gray-900 font-semibold">{team.project_name || 'N/A'}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Members</label>
                      <p className="text-gray-900">{team.members ? team.members.length : 0} members</p>
                    </div>
                     <div>
                      <label className="text-sm font-medium text-gray-500">Members</label>
                      <p className="text-gray-900">{team.members ? team.members.length : 0} members</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Status</label>
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        team.status === 'active' ? 'bg-green-100 text-green-800' :
                        team.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {team.status || 'Unknown'}
                      </span>
                    </div>
                  </div>

                  {/* Action Icons */}
                  <div className="mt-6 flex justify-center space-x-4">
                    <button
                      onClick={() => toggleTeamExpansion(team.id, 'tasks')}
                      className="flex items-center justify-center w-12 h-12 bg-blue-100 hover:bg-blue-200 rounded-full transition-all duration-300 hover:scale-110 group"
                      title="View Tasks"
                    >
                      <svg className="h-6 w-6 text-blue-600 group-hover:text-blue-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                      </svg>
                    </button>
                    <button
                      onClick={() => toggleTeamExpansion(team.id, 'messages')}
                      className="flex items-center justify-center w-12 h-12 bg-purple-100 hover:bg-purple-200 rounded-full transition-all duration-300 hover:scale-110 group"
                      title="View Messages"
                    >
                      <svg className="h-6 w-6 text-purple-600 group-hover:text-purple-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                    </button>
                  </div>

                  {/* Expandable Tasks Section */}
                  {expandedTeams[`${team.id}-tasks`] && (
                    <div className="mt-6 bg-blue-50 rounded-xl p-4 border border-blue-200">
                      <h4 className="text-lg font-semibold text-blue-800 mb-3 flex items-center">
                        <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                        </svg>
                        Team Tasks
                      </h4>
                      {loadingDetails[team.id] ? (
                        <div className="flex justify-center py-4">
                          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          {teamTasks[team.id]?.length > 0 ? (
                            teamTasks[team.id].map((task) => (
                              <div key={task.id} className="bg-white rounded-lg p-3 shadow-sm border border-blue-100">
                                <h5 className="font-medium text-gray-800">{task.title}</h5>
                                <p className="text-sm text-gray-600 mt-1">{task.description}</p>
                                <p className="text-xs text-gray-500 mt-2">Deadline: {new Date(task.deadline).toLocaleDateString()}</p>
                              </div>
                            ))
                          ) : (
                            <p className="text-sm text-gray-500 text-center py-2">No tasks available</p>
                          )}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Expandable Messages Section */}
                  {expandedTeams[`${team.id}-messages`] && (
                    <div className="mt-6 bg-purple-50 rounded-xl p-4 border border-purple-200">
                      <h4 className="text-lg font-semibold text-purple-800 mb-3 flex items-center">
                        <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                        Team Messages
                      </h4>
                      {loadingDetails[team.id] ? (
                        <div className="flex justify-center py-4">
                          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-600"></div>
                        </div>
                      ) : (
                        <div className="space-y-2 max-h-48 overflow-y-auto">
                          {teamMessages[team.id]?.length > 0 ? (
                            teamMessages[team.id].map((message) => (
                              <div key={message.id} className="bg-white rounded-lg p-3 shadow-sm border border-purple-100">
                                <p className="text-sm text-gray-800">{message.content}</p>
                                <div className="flex justify-between items-center mt-2">
                                  <span className="text-xs font-medium text-purple-600">{message.sender}</span>
                                  <span className="text-xs text-gray-500">{new Date(message.created_at).toLocaleString()}</span>
                                </div>
                              </div>
                            ))
                          ) : (
                            <p className="text-sm text-gray-500 text-center py-2">No messages available</p>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyTeam;