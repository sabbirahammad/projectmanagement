import React, { useState, useEffect } from 'react';
import SiteBar from '../sitebar/SiteBar';
import TopBar from '../TopBar/TopBar';

const Supervisor = () => {
  const [supervisors, setSupervisors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [department, setDepartment] = useState('');
  const [selectedSupervisor, setSelectedSupervisor] = useState(null);
  const [requestForm, setRequestForm] = useState({
    supervisor_id: '',
    project_title: '',
    project_info: ''
  });
  const [teams, setTeams] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [showRequestList, setShowRequestList] = useState(false);
  const [myRequests, setMyRequests] = useState([]);
  const [requestsLoading, setRequestsLoading] = useState(false);
  const [showSubmissions, setShowSubmissions] = useState(false);
  const [submissions, setSubmissions] = useState([]);
  const [submissionsLoading, setSubmissionsLoading] = useState(false);

  useEffect(() => {
    const fetchSupervisors = async () => {
      const token = localStorage.getItem('token');
      console.log('Token from localStorage:', token);

      if (!token) {
        setError('No authorization token found. Please log in.');
        setLoading(false);
        return;
      }

      try {
        const url = department
          ? `https://projectmanagement-production-e252.up.railway.app/api/supervisors?department=${encodeURIComponent(department)}`
          : 'https://projectmanagement-production-e252.up.railway.app/api/supervisors';
        console.log('Making API call to:', url);
        const response = await fetch(url, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        console.log('Response status:', response.status);
        console.log('Response ok:', response.ok);

        if (!response.ok) {
          console.log('API endpoint not found or error, using mock data');
          console.log('Response status text:', response.statusText);
          // Try to get error details
          try {
            const errorData = await response.text();
            console.log('Error response body:', errorData);
          } catch (e) {
            console.log('Could not read error response body');
          }

          // Use mock data for development
          const mockSupervisors = [
            ];
          setSupervisors(mockSupervisors);
          return;
        }

        const data = await response.json();
        console.log('Fetched data:', data);
        // Check if data is an object with supervisors array or direct array
        const supervisorsArray = data.supervisors || (Array.isArray(data) ? data : []);
        setSupervisors(supervisorsArray);
      } catch (err) {
        console.log('Fetch error:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSupervisors();
  }, [department]);

  const fetchTeams = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const response = await fetch('https://projectmanagement-production-e252.up.railway.app/api/my-team', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setTeams(data.has_team ? [data.team] : []);
      }
    } catch (err) {
      console.log('Error fetching teams:', err);
    }
  };

  const handleSupervisorClick = (supervisor) => {
    setSelectedSupervisor(supervisor);
    setRequestForm({
      supervisor_id: supervisor.id,
      project_title: '',
      project_info: ''
    });
    fetchTeams();
  };

  const handleSubmitRequest = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('No authentication token found');
      return;
    }

    setSubmitting(true);
    console.log('Submitting request with data:', requestForm);
    console.log('Project info length:', requestForm.project_info.length);
    try {
      const response = await fetch('https://projectmanagement-production-e252.up.railway.app/api/supervisor-requests', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestForm),
      });

      console.log('Response status:', response.status);
      console.log('Response ok:', response.ok);

      if (response.ok) {
        const responseData = await response.json();
        console.log('Success response:', responseData);
        alert('Supervisor request submitted successfully!');
        setSelectedSupervisor(null);
        setRequestForm({
          supervisor_id: '',
          project_title: '',
          project_info: ''
        });
      } else {
        try {
          const errorData = await response.json();
          console.log('Error response:', errorData);
          setError(errorData.message || 'Failed to submit request');
        } catch (e) {
          console.log('Could not parse error response');
          setError('Failed to submit request');
        }
      }
    } catch (err) {
      console.log('Network error:', err);
      setError('Error submitting request: ' + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const fetchMyRequests = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    setRequestsLoading(true);
    try {
      const response = await fetch('https://projectmanagement-production-e252.up.railway.app/api/supervisor-requests/my', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        console.log('My requests data:', data);
        setMyRequests(data.requests || []);
      } else {
        console.log('Failed to fetch my requests');
      }
    } catch (err) {
      console.log('Error fetching my requests:', err);
    } finally {
      setRequestsLoading(false);
    }
  };

  const handleShowRequestList = () => {
    setShowRequestList(!showRequestList);
    if (!showRequestList) {
      fetchMyRequests();
    }
  };

  const fetchSubmissions = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    setSubmissionsLoading(true);
    try {
      const response = await fetch('https://projectmanagement-production-e252.up.railway.app/api/submissions?status=1', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setSubmissions(data.submissions || data);
      }
    } catch (err) {
      console.log('Error fetching submissions:', err);
    } finally {
      setSubmissionsLoading(false);
    }
  };

  const handleAcceptSubmission = async (submissionId) => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const response = await fetch(`https://projectmanagement-production-e252.up.railway.app/api/submissions/${submissionId}/review`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: 2 }),
      });

      if (response.ok) {
        setSubmissions(submissions.filter(s => s.id !== submissionId));
        alert('Submission accepted');
      } else {
        alert('Failed to accept submission');
      }
    } catch (err) {
      console.log('Error accepting submission:', err);
    }
  };

  const handleShowSubmissions = () => {
    setShowSubmissions(!showSubmissions);
    if (!showSubmissions) {
      fetchSubmissions();
    }
  };


  const filteredSupervisors = supervisors.filter(supervisor =>
    supervisor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    supervisor.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    supervisor.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
            <div className="mb-8 flex justify-between items-center">
              <div>
                <h1 className="text-4xl font-bold text-gray-800 mb-4">Supervisor Directory</h1>
                <p className="text-gray-600">Manage and view all supervisors</p>
              </div>
              <div className="relative flex space-x-4">
                <button
                  onClick={handleShowRequestList}
                  className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all duration-300 font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                >
                  📋 Request List
                </button>
                <button
                  onClick={handleShowSubmissions}
                  className="px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-xl hover:from-blue-600 hover:to-indigo-600 transition-all duration-300 font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                >
                  📝 Pending Submissions
                </button>

                {/* Request List Dropdown */}
                {showRequestList && (
                  <div className="absolute right-0 mt-2 w-96 bg-white rounded-2xl shadow-2xl border border-gray-200 z-50 max-h-96 overflow-hidden">
                    <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-purple-50 to-pink-50">
                      <h3 className="text-lg font-semibold text-gray-800">My Supervisor Requests</h3>
                    </div>
                    <div className="max-h-80 overflow-y-auto">
                      {requestsLoading ? (
                        <div className="p-6 text-center">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
                          <p className="text-gray-500 mt-2">Loading requests...</p>
                        </div>
                      ) : myRequests.length === 0 ? (
                        <div className="p-6 text-center">
                          <div className="text-4xl mb-2">📭</div>
                          <p className="text-gray-500">No requests found</p>
                        </div>
                      ) : (
                        <div className="p-2">
                          {myRequests.map((request) => (
                            <div key={request.id} className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 mb-2 border border-blue-100 hover:shadow-md transition-shadow">
                              <div className="flex justify-between items-start mb-2">
                                <h4 className="font-semibold text-gray-800 text-sm">{request.project_title}</h4>
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                  request.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                  request.status === 'approved' ? 'bg-green-100 text-green-800' :
                                  request.status === 'rejected' ? 'bg-red-100 text-red-800' :
                                  'bg-gray-100 text-gray-800'
                                }`}>
                                  {request.status}
                                </span>
                              </div>
                              <p className="text-xs text-gray-600 mb-2 line-clamp-2">{request.project_info}</p>
                              <div className="flex justify-between items-center text-xs text-gray-500">
                                <span>Supervisor: {request.supervisor?.name || 'N/A'}</span>
                                <span>{new Date(request.created_at).toLocaleDateString()}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Department Filter and Search Bar */}
            <div className="mb-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Department</label>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    placeholder="Enter department name..."
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white"
                  />
                  <button
                    onClick={() => {
                      // Trigger refetch by updating state
                      setDepartment(department);
                    }}
                    className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors duration-200 font-medium"
                  >
                    Submit
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Search Supervisors</label>
                <input
                  type="text"
                  placeholder="Search by name, email, or department..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white"
                />
              </div>
            </div>

            {/* Supervisor Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredSupervisors.map((supervisor) => (
                <div
                  key={supervisor.id}
                  className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 p-6 border border-gray-100 cursor-pointer"
                  onClick={() => handleSupervisorClick(supervisor)}
                >
                  <div className="flex items-center mb-4">
                    <img
                      src={supervisor.image || 'https://via.placeholder.com/150'}
                      alt={supervisor.name}
                      className="w-12 h-12 rounded-full mr-4 object-cover"
                    />
                    <div>
                      <h3 className="text-xl font-semibold text-gray-800">{supervisor.name}</h3>
                      <p className="text-sm text-gray-500">{supervisor.role}</p>
                    </div>
                  </div>

                  <div className="space-y-2 text-sm mb-4">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Email:</span>
                      <span className="text-gray-800 font-medium">{supervisor.email}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Designation:</span>
                      <span className="text-gray-800 font-medium">{supervisor.designation}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Department:</span>
                      <span className="text-gray-800 font-medium">{supervisor.department}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Research Area:</span>
                      <span className="text-gray-800 font-medium">{supervisor.research_area}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Phone:</span>
                      <span className="text-gray-800 font-medium">{supervisor.phone}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Status:</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        supervisor.status === 'active' ? 'bg-green-100 text-green-800' :
                        supervisor.status === 'inactive' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {supervisor.status}
                      </span>
                    </div>
                  </div>

                </div>
              ))}
            </div>

            {showSubmissions && (
              <div className="mt-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Pending Submissions</h2>
                {submissionsLoading ? (
                  <div className="text-center py-4">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="text-gray-500 mt-2">Loading submissions...</p>
                  </div>
                ) : submissions.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="text-4xl mb-2">📄</div>
                    <p className="text-gray-500">No pending submissions</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {submissions.map((submission) => (
                      <div key={submission.id} className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 p-6 border border-gray-100">
                        <div className="flex justify-between items-start mb-4">
                          <h3 className="text-lg font-semibold text-gray-800">{submission.task?.title || 'Task'}</h3>
                          <span className="px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                            Pending
                          </span>
                        </div>
                        <p className="text-gray-600 mb-4 line-clamp-3">{submission.content}</p>
                        <div className="flex justify-between items-center text-sm text-gray-500 mb-4">
                          <span>Submitted by: {submission.student?.name || 'Student'}</span>
                          <span>{new Date(submission.submitted_at).toLocaleDateString()}</span>
                        </div>
                        <button
                          onClick={() => handleAcceptSubmission(submission.id)}
                          className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 font-medium"
                        >
                          Accept Submission
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {filteredSupervisors.length === 0 && (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">👨‍🏫</div>
                <h3 className="text-xl font-semibold text-gray-600 mb-2">No supervisors found</h3>
                <p className="text-gray-500">Try adjusting your search criteria</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Supervisor Request Modal */}
      {selectedSupervisor && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-4">Request Supervisor: {selectedSupervisor.name}</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Supervisor ID</label>
                <input
                  type="text"
                  value={requestForm.supervisor_id}
                  readOnly
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
                />
              </div>

              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-2">Project Title</label>
                <input
                  type="text"
                  placeholder="Enter project title or select from teams..."
                  value={requestForm.project_title}
                  onChange={(e) => {
                    setRequestForm({...requestForm, project_title: e.target.value});
                    setShowSuggestions(true);
                  }}
                  onFocus={() => setShowSuggestions(true)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                {showSuggestions && teams.length > 0 && (
                  <div className="absolute z-10 w-full bg-white border border-gray-300 rounded-lg shadow-lg mt-1 max-h-40 overflow-y-auto">
                    {teams.map((team) => (
                      <div
                        key={team.id}
                        className="px-3 py-2 hover:bg-gray-100 cursor-pointer border-b border-gray-100 last:border-b-0"
                        onClick={() => {
                          setRequestForm({...requestForm, project_title: team.project_name || team.name});
                          setShowSuggestions(false);
                        }}
                      >
                        <div className="font-medium">{team.project_name || team.name}</div>
                        <div className="text-sm text-gray-500">Team: {team.name}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Project Information</label>
                <textarea
                  placeholder="Describe your project in detail (minimum 10 characters)..."
                  value={requestForm.project_info}
                  onChange={(e) => setRequestForm({...requestForm, project_info: e.target.value})}
                  rows={6}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                />
                {requestForm.project_info && requestForm.project_info.length < 10 && (
                  <p className="text-red-500 text-xs mt-1">Project information must be at least 10 characters long</p>
                )}
              </div>
            </div>

            <div className="flex justify-end space-x-2 mt-6">
              <button
                onClick={() => {
                  setSelectedSupervisor(null);
                  setShowSuggestions(false);
                }}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
                disabled={submitting}
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitRequest}
                disabled={submitting || !requestForm.project_title || !requestForm.project_info || requestForm.project_info.length < 10}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-400 disabled:cursor-not-allowed"
              >
                {submitting ? 'Submitting...' : 'Submit Request'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Supervisor;
