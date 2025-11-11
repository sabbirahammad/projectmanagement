import React, { useState, useEffect } from 'react';
import SiteBar from '../sitebar/SiteBar';
import TopBar from '../TopBar/TopBar';

const Project = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const API_BASE = 'https://projectmanagement-production-e252.up.railway.app/api';

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetchMyTasks();
    } else {
      setLoading(false);
      setError('No authentication token found');
    }
  }, []);

  const fetchMyTasks = async () => {
    const token = localStorage.getItem('token');
    console.log('fetchMyTasks - Token exists:', !!token);
    console.log('fetchMyTasks - API URL:', `${API_BASE}/my-team/tasks`);

    if (!token) {
      console.log('fetchMyTasks - No token found, returning');
      return;
    }

    setLoading(true);
    try {
      console.log('fetchMyTasks - Making API call...');
      const response = await fetch(`${API_BASE}/my-team/tasks`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      console.log('fetchMyTasks - Response status:', response.status);
      console.log('fetchMyTasks - Response ok:', response.ok);

      if (response.ok) {
        const data = await response.json();
        console.log('fetchMyTasks - Success data:', data);
        console.log('Student tasks data:', data.tasks);
        setTasks(data.tasks || []);
      } else {
        const errorText = await response.text();
        console.log('fetchMyTasks - Error response:', errorText);
        setError('Failed to fetch tasks');
      }
    } catch (err) {
      console.error('fetchMyTasks - Network error:', err);
      console.error('fetchMyTasks - Error details:', {
        name: err.name,
        message: err.message,
        stack: err.stack
      });
      setError(err.message);
    } finally {
      setLoading(false);
      console.log('fetchMyTasks - Loading set to false');
    }
  };

  console.log(tasks);

  if (loading) {
    return (
      <div className="flex h-screen bg-gray-100">
        <SiteBar />
        <div className="flex-1 ml-64 flex flex-col">
          <TopBar />
          <div className="flex-1 flex items-center justify-center pt-24">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen bg-gray-100">
        <SiteBar />
        <div className="flex-1 ml-64 flex flex-col">
          <TopBar />
          <div className="flex-1 flex items-center justify-center pt-24">
            <div className="text-red-600 text-lg">{error}</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <SiteBar />
      <div className="flex-1 ml-64 flex flex-col">
        <TopBar />
        <div className="flex-1 p-8 overflow-y-auto pt-24">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-4xl font-bold text-gray-800 mb-8">My Projects</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {tasks.length > 0 ? (
                tasks.map((task) => (
                  <div key={task.id} className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        {/* <h3 className="text-xl font-semibold text-gray-800 mb-2">{task.title}</h3>
                        <p className="text-gray-600 mb-3">{task.description}</p> */}
                        {/* <div className="space-y-2 text-sm text-gray-500">
                          <p><strong>Team:</strong> {task.team_name}</p>
                          <p><strong>Project:</strong> {task.project_name}</p>
                          <p><strong>Deadline:</strong> {new Date(task.deadline).toLocaleDateString()}</p>
                          <p><strong>Status:</strong>
                            <span className={`ml-2 px-2 py-1 rounded-full text-xs ${
                              task.status === 'completed' || task.status === 'approved' ? 'bg-green-100 text-green-800' :
                              task.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {task.status || 'pending'}
                            </span>
                          </p>
                        </div> */}
                      </div>
                    </div>

                    {task.submissions && task.submissions.length > 0 && (
                      <div className="mt-4 p-4 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg">
                        <div className="flex items-center mb-3">
                          <div className="bg-green-500 rounded-full p-1 mr-2">
                            <svg className="h-4 w-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                          <p className="text-sm font-semibold text-green-800">
                            {task.submissions.length} Submission{task.submissions.length > 1 ? 's' : ''}
                          </p>
                        </div>
                        <div className="space-y-3">
                          {task.submissions.map((submission, index) => (
                            <div key={index} className="bg-white rounded-lg p-3 border border-green-100 shadow-sm">
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <div className="flex items-center space-x-2 mb-1">
                                    <span className="text-sm font-medium text-gray-800">{submission.student_name}</span>
                                    <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                                      {submission.submission_type}
                                    </span>
                                  </div>
                                  <p className="text-xs text-gray-500 mb-2">
                                    {new Date(submission.submitted_at).toLocaleDateString('en-US', {
                                      year: 'numeric',
                                      month: 'short',
                                      day: 'numeric',
                                      hour: '2-digit',
                                      minute: '2-digit'
                                    })}
                                  </p>
                                  {submission.feedback && (
                                    <div className="bg-blue-50 rounded p-2 mt-2">
                                      <p className="text-xs font-medium text-blue-800 mb-1">Feedback:</p>
                                      <p className="text-xs text-blue-700">{submission.feedback}</p>
                                    </div>
                                  )}
                                </div>
                                {submission.file_url && (
                                  <a
                                    href={submission.file_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center px-3 py-1 bg-blue-500 text-white text-xs rounded-lg hover:bg-blue-600 transition-colors"
                                  >
                                    <svg className="h-3 w-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                    View File
                                  </a>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="col-span-full text-center py-12">
                  <div className="text-6xl mb-4">📋</div>
                  <h3 className="text-xl font-semibold text-gray-600 mb-2">No projects assigned</h3>
                  <p className="text-gray-500">You don't have any projects to work on at the moment.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Project;