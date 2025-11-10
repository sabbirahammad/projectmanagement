import React, { useState, useEffect } from 'react';
import SiteBar from '../sitebar/SiteBar';
import TopBar from '../TopBar/TopBar';

const StudentTask = () => {
  const [tasks, setTasks] = useState([]);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState(null);
  const [submitFile, setSubmitFile] = useState(null);
  const [submittingSubmit, setSubmittingSubmit] = useState(false);
  const [messageForm, setMessageForm] = useState({ content: '' });
  const [file, setFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const API_BASE = 'http://192.168.0.106:8081/api';

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetchMyTasks();
      fetchTeamMessages();
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

  const fetchTeamMessages = async () => {
    const token = localStorage.getItem('token');
    console.log('fetchTeamMessages - Token exists:', !!token);
    console.log('fetchTeamMessages - API URL:', `${API_BASE}/my-team/messages`);

    try {
      console.log('fetchTeamMessages - Making API call...');
      const response = await fetch(`${API_BASE}/my-team/messages`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      console.log('fetchTeamMessages - Response status:', response.status);
      console.log('fetchTeamMessages - Response ok:', response.ok);

      if (response.ok) {
        const data = await response.json();
        console.log('fetchTeamMessages - Success data:', data);
        console.log('Fetched messages:', data.messages);
        setMessages(data.messages || []);
      } else {
        const errorText = await response.text();
        console.log('fetchTeamMessages - Error response:', errorText);
        console.error('Failed to fetch messages:', response.status, response.statusText, errorText);
        setError(`Failed to fetch messages: ${response.status} ${response.statusText}`);
      }
    } catch (err) {
      console.error('fetchTeamMessages - Network error:', err);
      console.error('fetchTeamMessages - Error details:', {
        name: err.name,
        message: err.message,
        stack: err.stack
      });
      setError(`Error fetching messages: ${err.message}`);
    }
  };

  const handleSendMessage = async () => {
    const token = localStorage.getItem('token');
    console.log('Sending message to team');
    console.log('Token exists:', !!token);
    console.log('Message content:', messageForm.content);
    console.log('File exists:', !!file);
    setSubmitting(true);
    try {
      let fileUrl = null;

      // If there's a file, upload it first
      if (file) {
        console.log('Uploading file first...');
        const uploadFormData = new FormData();
        uploadFormData.append('file', file);

        const uploadResponse = await fetch(`${API_BASE}/upload`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`
          },
          body: uploadFormData
        });

        if (uploadResponse.ok) {
          const uploadData = await uploadResponse.json();
          fileUrl = uploadData.file_url || uploadData.url;
          console.log('File uploaded successfully, URL:', fileUrl);
        } else {
          throw new Error('File upload failed');
        }
      }

      // Send message with or without file URL
      const messageContent = messageForm.content.trim();
      const payload = {
        message: messageContent,
        ...(fileUrl && { file_url: fileUrl, file_name: file.name })
      };

      console.log('Sending message payload:', payload);
      const response = await fetch(`${API_BASE}/my-team/messages`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      console.log('Response status:', response.status);
      if (response.ok) {
        const responseData = await response.json();
        console.log('Success response:', responseData);
        alert('Message sent successfully!');
        setMessageForm({ content: '' });
        setFile(null);
        fetchTeamMessages();
      } else {
        const errorText = await response.text();
        console.error('Failed to send message - Status:', response.status);
        console.error('Failed to send message - Response:', errorText);
        setError(`Failed to send message: ${response.status} ${response.statusText}`);
      }
    } catch (err) {
      console.error('Network error sending message:', err);
      console.error('Error details:', {
        name: err.name,
        message: err.message,
        stack: err.stack
      });
      setError(`Network error: ${err.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  const handleTaskSubmit = async (taskId) => {
    const token = localStorage.getItem('token');
    console.log('Task Submit - Token:', token ? 'Token exists' : 'No token');
    console.log('Task Submit - Task ID:', taskId);
    console.log('Task Submit - File:', submitFile ? submitFile.name : 'No file');

    if (!submitFile) {
      alert('Please select a file to submit');
      return;
    }

    console.log('Task Submit - Starting task submission process...');
    setSubmittingSubmit(true);
    try {
      // First upload the file
      console.log('Task Submit - Starting file upload...');
      const uploadFormData = new FormData();
      uploadFormData.append('file', submitFile);

      const uploadResponse = await fetch(`${API_BASE}/upload`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: uploadFormData
      });

      console.log('Task Submit - Upload response status:', uploadResponse.status);
      console.log('Task Submit - Upload response ok:', uploadResponse.ok);

      if (!uploadResponse.ok) {
        const uploadErrorText = await uploadResponse.text();
        console.error('Task Submit - File upload failed:', uploadResponse.status, uploadResponse.statusText, uploadErrorText);
        throw new Error(`File upload failed: ${uploadResponse.status} ${uploadResponse.statusText}`);
      }

      const uploadData = await uploadResponse.json();
      console.log('Task Submit - Upload data:', uploadData);
      const fileUrl = uploadData.file_url || uploadData.url;
      console.log('Task Submit - File URL:', fileUrl);

      // Then submit the task with the file URL
      console.log('Task Submit - Starting task submission...');
      const submitPayload = {
        file_url: fileUrl,
        file_name: submitFile.name,
        submission_type: 'file' // Add the required submission_type field
      };
      console.log('Task Submit - Submit payload:', submitPayload);

      const submitResponse = await fetch(`${API_BASE}/tasks/${taskId}/submit`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(submitPayload)
      });

      console.log('Task Submit - Submit response status:', submitResponse.status);
      console.log('Task Submit - Submit response ok:', submitResponse.ok);

      if (submitResponse.ok) {
        const submitData = await submitResponse.json();
        console.log('Task Submit - Submit success:', submitData);
        alert('Task submitted successfully!');
        setShowSubmitModal(false);
        setSubmitFile(null);
        setSelectedTaskId(null);
        // Refresh tasks
        fetchMyTasks();
      } else {
        const errorText = await submitResponse.text();
        console.error('Task Submit - Submit failed:', submitResponse.status, submitResponse.statusText, errorText);
        alert(`Failed to submit task: ${submitResponse.status} ${submitResponse.statusText} - ${errorText}`);
      }
    } catch (err) {
      console.error('Task Submit - Error:', err);
      alert(`Error submitting task: ${err.message}`);
    } finally {
      setSubmittingSubmit(false);
    }
  };

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
            <h1 className="text-4xl font-bold text-gray-800 mb-8">My Tasks</h1>

            {/* Messages Section */}
            <div className="mb-8 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-200">
              <h2 className="text-2xl font-semibold text-purple-800 mb-4 flex items-center">
                <svg className="h-6 w-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                Team Messages
              </h2>

              {/* Send Message Form */}
              <div className="bg-white rounded-lg p-4 mb-4 border border-purple-100 shadow-sm">
                <div className="flex space-x-3">
                  <textarea
                    placeholder="Type your message..."
                    value={messageForm.content}
                    onChange={(e) => setMessageForm({...messageForm, content: e.target.value})}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 resize-none text-sm"
                    rows={2}
                  />
                  <input
                    type="file"
                    accept="image/*,video/*,audio/*,application/*"
                    onChange={(e) => setFile(e.target.files[0])}
                    className="hidden"
                    id="file-upload"
                  />
                  <label
                    htmlFor="file-upload"
                    className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors cursor-pointer text-sm font-medium"
                  >
                    📎
                  </label>
                  <button
                    onClick={handleSendMessage}
                    disabled={submitting || (!messageForm.content.trim() && !file)}
                    className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors duration-200 font-medium disabled:bg-purple-400 disabled:cursor-not-allowed text-sm"
                  >
                    {submitting ? 'Sending...' : 'Send'}
                  </button>
                </div>
                {file && (
                  <div className="mt-2 text-xs text-gray-600">
                    File: {file.name}
                  </div>
                )}
              </div>

              <div className="space-y-3 max-h-64 overflow-y-auto">
                {messages.length > 0 ? (
                  messages.map((message) => (
                    <div key={message.id} className="bg-white rounded-lg p-3 shadow-sm border border-purple-100">
                      <p className="text-sm text-gray-800">{message.message}</p>
                      {message.file_url && (
                        <div className="mt-2">
                          <a href={message.file_url} target="_blank" rel="noopener noreferrer" className="text-xs text-purple-600 hover:text-purple-800 underline">
                            📎 {message.file_name || 'Attachment'}
                          </a>
                        </div>
                      )}
                      <div className="flex justify-between items-center mt-2">
                        <span className="text-xs font-medium text-purple-600">{message.sender_name}</span>
                        <span className="text-xs text-gray-500">{new Date(message.created_at).toLocaleString()}</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-6">
                    <div className="text-3xl mb-2">💭</div>
                    <p className="text-sm text-gray-500">No messages yet</p>
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {tasks.length > 0 ? (
                tasks.map((task) => (
                  <div key={task.id} className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold text-gray-800 mb-2">{task.title}</h3>
                        <p className="text-gray-600 mb-3">{task.description}</p>
                        <div className="space-y-2 text-sm text-gray-500">
                          <p><strong>Team:</strong> {task.team_name}</p>
                          <p><strong>Project:</strong> {task.project_name}</p>
                          <p><strong>Deadline:</strong> {new Date(task.deadline).toLocaleDateString()}</p>
                          <p><strong>Status:</strong>
                            <span className={`ml-2 px-2 py-1 rounded-full text-xs ${
                              task.status === 'completed' ? 'bg-green-100 text-green-800' :
                              task.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {task.status || 'pending'}
                            </span>
                          </p>
                        </div>
                      </div>
                    </div>

                    {task.status !== 'completed' && (
                      <button
                        onClick={() => {
                          setSelectedTaskId(task.id);
                          setShowSubmitModal(true);
                        }}
                        className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center justify-center"
                      >
                        📤 Submit Task
                      </button>
                    )}

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
                  <h3 className="text-xl font-semibold text-gray-600 mb-2">No tasks assigned</h3>
                  <p className="text-gray-500">You don't have any tasks to complete at the moment.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Submit Task Modal */}
      {showSubmitModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-xl p-6 max-w-md w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Submit Task</h3>
              <button
                onClick={() => {
                  setShowSubmitModal(false);
                  setSubmitFile(null);
                  setSelectedTaskId(null);
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select File to Submit
                </label>
                <input
                  type="file"
                  accept="image/*,video/*,audio/*,application/*"
                  onChange={(e) => setSubmitFile(e.target.files[0])}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                {submitFile && (
                  <p className="mt-2 text-sm text-gray-600">
                    Selected: {submitFile.name}
                  </p>
                )}
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => {
                    setShowSubmitModal(false);
                    setSubmitFile(null);
                    setSelectedTaskId(null);
                  }}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleTaskSubmit(selectedTaskId)}
                  disabled={!submitFile || submittingSubmit}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-400 disabled:cursor-not-allowed"
                >
                  {submittingSubmit ? 'Submitting...' : 'Submit Task'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentTask;
