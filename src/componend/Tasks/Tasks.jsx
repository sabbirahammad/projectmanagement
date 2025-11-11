// import React, { useState, useEffect } from 'react';
// import SiteBar from '../sitebar/SiteBar';
// import TopBar from '../TopBar/TopBar';
// import { useAuth } from '../../context/AuthContext';

// const Tasks = () => {
//   const { user } = useAuth();
//   const [teams, setTeams] = useState([]);
//   const [selectedTeam, setSelectedTeam] = useState(null);
//   const [tasks, setTasks] = useState([]);
//   const [messages, setMessages] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');
//   const [taskForm, setTaskForm] = useState({ title: '', description: '', deadline: '' });
//   const [messageForm, setMessageForm] = useState({ content: '' });
//   const [submitting, setSubmitting] = useState(false);
//   const [activeSections, setActiveSections] = useState({});
//   const [showCreateTask, setShowCreateTask] = useState({});
//   const [showSubmitModal, setShowSubmitModal] = useState(false);
//   const [selectedTaskId, setSelectedTaskId] = useState(null);
//   const [submitFile, setSubmitFile] = useState(null);
//   const [submittingSubmit, setSubmittingSubmit] = useState(false);

//   const API_BASE = 'http://192.168.0.106:8081/api';

//   useEffect(() => {
//     const token = localStorage.getItem('token');
//     if (token) {
//       fetchTeams();
//     } else {
//       setLoading(false);
//       setError('No authentication token found');
//     }
//   }, []);

//   const fetchTeams = async () => {
//     const token = localStorage.getItem('token');
//     if (!token) return;

//     setLoading(true);
//     try {
//       // Only supervisor APIs - fetch teams
//       const response = await fetch(`${API_BASE}/supervisor/my-teams`, {
//         headers: { 'Authorization': `Bearer ${token}` }
//       });
//       if (response.ok) {
//         const data = await response.json();
//         console.log('Teams data:', data.teams);
//         setTeams(data.teams || []);
//       } else {
//         setError('Failed to fetch teams');
//       }
//     } catch (err) {
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };
//   const fetchTeamTasks = async (teamId) => {
//     const token = localStorage.getItem('token');
//     console.log('Fetching tasks for team:', teamId);
//     try {
//       const response = await fetch(`${API_BASE}/teams/${teamId}/tasks`, {
//         headers: { 'Authorization': `Bearer ${token}` }
//       });
//       console.log('Tasks fetch response status:', response.status);
//       if (response.ok) {
//         const data = await response.json();
//         console.log('Tasks data:', data.tasks);
//         setTasks(data.tasks || []);
//       } else {
//         const errorText = await response.text();
//         console.error('Failed to fetch tasks:', response.status, response.statusText, errorText);
//       }
//     } catch (err) {
//       console.error('Error fetching tasks:', err);
//     }
//   };

//   const fetchTeamMessages = async (teamId) => {
//     const token = localStorage.getItem('token');
//     console.log('Fetching messages with token:', token ? 'Token exists' : 'No token');
//     try {
//       const response = await fetch(`${API_BASE}/teams/${teamId}/messages`, {
//         headers: { 'Authorization': `Bearer ${token}` }
//       });
//       console.log('Response status:', response.status);
//       if (response.ok) {
//         const data = await response.json();
//         setMessages(data.messages || []);
//         console.log('Fetched messages:', data.messages);
//       } else {
//         const errorText = await response.text();
//         console.error('Failed to fetch messages:', response.status, response.statusText, errorText);
//         setError(`Failed to fetch messages: ${response.status} ${response.statusText}`);
//       }
//     } catch (err) {
//       console.error('Error fetching messages:', err);
//       setError(`Error fetching messages: ${err.message}`);
//     }
//   };

//   const handleCreateTask = async (teamId) => {
//     const token = localStorage.getItem('token');
//     console.log('Creating task for team:', teamId);
//     console.log('Task form data:', taskForm);
//     setSubmitting(true);
//     try {
//       const taskData = {
//         title: taskForm.title.trim(),
//         description: taskForm.description.trim(),
//         deadline: taskForm.deadline ? new Date(taskForm.deadline).toISOString() : null
//       };
//       console.log('Sending task data:', taskData);
//       console.log('Title length:', taskData.title.length);
//       console.log('Description length:', taskData.description.length);
//       const response = await fetch(`${API_BASE}/teams/${teamId}/tasks`, {
//         method: 'POST',
//         headers: {
//           'Authorization': `Bearer ${token}`,
//           'Content-Type': 'application/json'
//         },
//         body: JSON.stringify(taskData)
//       });
//       console.log('Task creation response status:', response.status);
//       if (response.ok) {
//         const responseData = await response.json();
//         console.log('Task creation success:', responseData);
//         alert('Task created successfully!');
//         setTaskForm({ title: '', description: '', deadline: '' });
//         fetchTeamTasks(teamId);
//       } else {
//         const errorText = await response.text();
//         console.error('Task creation failed:', response.status, response.statusText, errorText);
//         setError(`Failed to create task: ${errorText}`);
//       }
//     } catch (err) {
//       console.error('Network error creating task:', err);
//       setError(`Network error: ${err.message}`);
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   const handleDeleteTask = async (taskId, teamId) => {
//     const token = localStorage.getItem('token');
//     try {
//       const response = await fetch(`${API_BASE}/tasks/${taskId}`, {
//         method: 'DELETE',
//         headers: { 'Authorization': `Bearer ${token}` }
//       });
//       if (response.ok) {
//         alert('Task deleted successfully!');
//         fetchTeamTasks(teamId);
//       } else {
//         setError('Failed to delete task');
//       }
//     } catch (err) {
//       setError(err.message);
//     }
//   };


//   const handleSendMessage = async (teamId) => {
//     const token = localStorage.getItem('token');
//     console.log('Sending message to team:', teamId);
//     console.log('Token exists:', !!token);
//     console.log('Message content:', messageForm.content);
//     setSubmitting(true);
//     try {
//       // Send message without file upload
//       const messageContent = messageForm.content.trim();
//       const payload = {
//         message: messageContent
//       };

//       console.log('Sending message payload:', payload);
//       const response = await fetch(`${API_BASE}/teams/${teamId}/messages`, {
//         method: 'POST',
//         headers: {
//           'Authorization': `Bearer ${token}`,
//           'Content-Type': 'application/json'
//         },
//         body: JSON.stringify(payload)
//       });

//       console.log('Response status:', response.status);
//       if (response.ok) {
//         const responseData = await response.json();
//         console.log('Success response:', responseData);
//         alert('Message sent successfully!');
//         setMessageForm({ content: '' });
//       } else {
//         const errorText = await response.text();
//         console.error('Failed to send message - Status:', response.status);
//         console.error('Failed to send message - Response:', errorText);
//         setError(`Failed to send message: ${response.status} ${response.statusText}`);
//       }
//     } catch (err) {
//       console.error('Network error sending message:', err);
//       console.error('Error details:', {
//         name: err.name,
//         message: err.message,
//         stack: err.stack
//       });
//       setError(`Network error: ${err.message}`);
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   const handleFileUpload = async () => {
//     const token = localStorage.getItem('token');
//     if (!file) return;
//     const formData = new FormData();
//     formData.append('file', file);
//     setSubmitting(true);
//     try {
//       const response = await fetch(`${API_BASE}/upload`, {
//         method: 'POST',
//         headers: { 'Authorization': `Bearer ${token}` },
//         body: formData
//       });
//       if (response.ok) {
//         alert('File uploaded successfully!');
//         setFile(null);
//       } else {
//         setError('Failed to upload file');
//       }
//     } catch (err) {
//       setError(err.message);
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   const handleTaskSubmit = async (taskId) => {
//     const token = localStorage.getItem('token');
//     console.log('Task Submit - Token:', token);
//     console.log('Task Submit - User:', user);
//     console.log('Task Submit - Task ID:', taskId);
//     console.log('Task Submit - File:', submitFile ? submitFile.name : 'No file');

//     if (!submitFile) {
//       alert('Please select a file to submit');
//       return;
//     }

//     if (!token) {
//       alert('Authentication token not found. Please log in again.');
//       return;
//     }

//     // Check if user is logged in and has proper role
//     // if (!user || !user.role) {
//     //   alert('User authentication required. Please log in again.');
//     //   return;
//     // }

//     // // Allow both students and supervisors to submit tasks
//     // if (user.role !== 'student' && user.role !== 'supervisor') {
//     //   alert('Unauthorized user role for task submission.');
//     //   return;
//     // }

//     setSubmittingSubmit(true);
//     try {
//       // First upload the file
//       console.log('Task Submit - Starting file upload...');
//       const uploadFormData = new FormData();
//       uploadFormData.append('file', submitFile);

//       const uploadResponse = await fetch(`${API_BASE}/upload`, {
//         method: 'POST',
//         headers: { 'Authorization': `Bearer ${token}` },
//         body: uploadFormData
//       });

//       console.log('Task Submit - Upload response status:', uploadResponse.status);
//       console.log('Task Submit - Upload response ok:', uploadResponse.ok);

//       if (!uploadResponse.ok) {
//         const uploadErrorText = await uploadResponse.text();
//         console.error('Task Submit - File upload failed:', uploadResponse.status, uploadResponse.statusText, uploadErrorText);
//         throw new Error(`File upload failed: ${uploadResponse.status} ${uploadResponse.statusText}`);
//       }

//       const uploadData = await uploadResponse.json();
//       console.log('Task Submit - Upload data:', uploadData);
//       const fileUrl = uploadData.file_url || uploadData.url;
//       console.log('Task Submit - File URL:', fileUrl);

//       // Then submit the task with the file URL
//       console.log('Task Submit - Starting task submission...');
//       const submitPayload = {
//         file_url: fileUrl,
//         file_name: submitFile.name
//       };
//       console.log('Task Submit - Submit payload:', submitPayload);

//       const submitResponse = await fetch(`${API_BASE}/tasks/${taskId}/submit`, {
//         method: 'POST',
//         headers: {
//           'Authorization': `Bearer ${token}`,
//           'Content-Type': 'application/json'
//         },
//         body: JSON.stringify({
//           file_url: fileUrl,
       
//         })
//       });

//       console.log('Task Submit - Submit response status:', submitResponse.status);
//       console.log('Task Submit - Submit response ok:', submitResponse.ok);

//       if (submitResponse.ok) {
//         const submitData = await submitResponse.json();
//         console.log('Task Submit - Submit success:', submitData);
//         alert('Task submitted successfully!');
//         setShowSubmitModal(false);
//         setSubmitFile(null);
//         setSelectedTaskId(null);
//         // Refresh tasks for the current team
//         if (selectedTeam) {
//           fetchTeamTasks(selectedTeam.id);
//         }
//       } else {
//         const errorText = await submitResponse.text();
//         console.error('Task Submit - Submit failed:', submitResponse.status, submitResponse.statusText, errorText);
//         alert(`Failed to submit task: ${submitResponse.status} ${submitResponse.statusText} - ${errorText}`);
//       }
//     } catch (err) {
//       console.error('Task Submit - Error:', err);
//       alert(`Error submitting task: ${err.message}`);
//     } finally {
//       setSubmittingSubmit(false);
//     }
//   };


//   if (loading) {
//     return (
//       <div className="flex h-screen bg-gray-100">
//         <SiteBar />
//         <div className="flex-1 ml-64 flex flex-col">
//           <TopBar />
//           <div className="flex-1 flex items-center justify-center pt-24">
//             <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="flex h-screen bg-gray-100">
//         <SiteBar />
//         <div className="flex-1 ml-64 flex flex-col">
//           <TopBar />
//           <div className="flex-1 flex items-center justify-center pt-24">
//             <div className="text-red-600 text-lg">{error}</div>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="flex h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
//       <SiteBar />
//       <div className="flex-1 ml-64 flex flex-col">
//         <TopBar />
//         <div className="flex-1 p-8 overflow-y-auto pt-24">
//           <div className="max-w-7xl mx-auto">
//             <h1 className="text-4xl font-bold text-gray-800 mb-8">
//               Supervisor Tasks
//             </h1>

//             {/* Teams List */}
//             <div className="mb-8">
//               <h2 className="text-2xl font-semibold mb-4">Teams</h2>
//               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//                 {teams.map(team => (
//                   <div
//                     key={team.id}
//                     className={`bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border-2 ${
//                       selectedTeam?.id === team.id ? 'border-blue-500' : 'border-transparent'
//                     }`}
//                   >
//                     {/* Team Header */}
//                     <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6">
//                       <div className="flex items-center justify-between">
//                         <div className="text-white">
//                           <h3 className="text-xl font-bold">{team.name}</h3>
//                           <p className="text-blue-100">Team ID: {team.id}</p>
//                         </div>
//                         <div className="bg-white bg-opacity-20 rounded-full p-3">
//                           <svg className="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
//                           </svg>
//                         </div>
//                       </div>
//                     </div>

//                     {/* Team Info */}
//                     <div className="p-6">
//                       <div className="space-y-3 mb-4">
//                         <div>
//                           <label className="text-sm font-medium text-gray-500">Project</label>
//                           <p className="text-gray-900 font-semibold">{team.project_name || 'N/A'}</p>
//                         </div>
//                         <div>
//                           <label className="text-sm font-medium text-gray-500">Members</label>
//                           <p className="text-gray-900">{team.members ? team.members.length : 0} members</p>
//                         </div>
//                         <div>
//                           <label className="text-sm font-medium text-gray-500">Tasks</label>
//                           <p className="text-gray-900">{team.tasks_count || 0} tasks</p>
//                         </div>
//                       </div>

//                       <div className="flex justify-center space-x-4">
//                         <button
//                           onClick={() => {
//                             const newActiveSections = { ...activeSections };
//                             if (newActiveSections[team.id]?.tasks) {
//                               delete newActiveSections[team.id].tasks;
//                             } else {
//                               if (!newActiveSections[team.id]) newActiveSections[team.id] = {};
//                               newActiveSections[team.id].tasks = true;
//                               fetchTeamTasks(team.id);
//                             }
//                             setActiveSections(newActiveSections);
//                           }}
//                           className="flex items-center justify-center w-12 h-12 bg-blue-100 hover:bg-blue-200 rounded-full transition-all duration-300 hover:scale-110 group"
//                           title="View Tasks"
//                         >
//                           <svg className="h-6 w-6 text-blue-600 group-hover:text-blue-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
//                           </svg>
//                         </button>
//                         <button
//                           onClick={() => {
//                             const newActiveSections = { ...activeSections };
//                             if (newActiveSections[team.id]?.messages) {
//                               delete newActiveSections[team.id].messages;
//                             } else {
//                               if (!newActiveSections[team.id]) newActiveSections[team.id] = {};
//                               newActiveSections[team.id].messages = true;
//                               fetchTeamMessages(team.id);
//                             }
//                             setActiveSections(newActiveSections);
//                           }}
//                           className="flex items-center justify-center w-12 h-12 bg-purple-100 hover:bg-purple-200 rounded-full transition-all duration-300 hover:scale-110 group"
//                           title="View Messages"
//                         >
//                           <svg className="h-6 w-6 text-purple-600 group-hover:text-purple-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
//                           </svg>
//                         </button>
//                       </div>

//                       {/* Tasks Section */}
//                       {activeSections[team.id]?.tasks && (
//                         <div className="mt-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-200">
//                           <div className="flex justify-between items-center mb-3">
//                             <h4 className="text-lg font-semibold text-blue-800 flex items-center">
//                               <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
//                               </svg>
//                               Team Tasks
//                             </h4>
//                             <button
//                               onClick={() => {
//                                 const newShowCreateTask = { ...showCreateTask };
//                                 newShowCreateTask[team.id] = !newShowCreateTask[team.id];
//                                 setShowCreateTask(newShowCreateTask);
//                               }}
//                               className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all duration-300 text-sm font-medium shadow-md hover:shadow-lg"
//                             >
//                               {showCreateTask[team.id] ? 'Hide' : '+ Create Task'}
//                             </button>
//                           </div>

//                           {/* Create Task Form */}
//                           {showCreateTask[team.id] && (
//                             <div className="bg-white rounded-lg p-4 mb-4 border border-blue-100 shadow-sm">
//                               <h5 className="text-md font-semibold mb-3 text-blue-800">Create New Task</h5>
//                               <div className="grid grid-cols-1 gap-3 mb-3">
//                                 <input
//                                   type="text"
//                                   placeholder="Task Title"
//                                   value={taskForm.title}
//                                   onChange={(e) => setTaskForm({...taskForm, title: e.target.value})}
//                                   className="px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-sm"
//                                 />
//                                 <textarea
//                                   placeholder="Task Description"
//                                   value={taskForm.description}
//                                   onChange={(e) => setTaskForm({...taskForm, description: e.target.value})}
//                                   className="px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-sm resize-none"
//                                   rows={3}
//                                 />
//                                 <input
//                                   type="date"
//                                   value={taskForm.deadline}
//                                   onChange={(e) => setTaskForm({...taskForm, deadline: e.target.value})}
//                                   className="px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-sm"
//                                 />
//                               </div>
//                               <button
//                                 onClick={() => handleCreateTask(team.id)}
//                                 disabled={submitting || !taskForm.title || !taskForm.description}
//                                 className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium disabled:bg-blue-400 disabled:cursor-not-allowed text-sm"
//                               >
//                                 {submitting ? 'Creating...' : 'Create Task'}
//                               </button>
//                             </div>
//                           )}

//                           <div className="space-y-2 max-h-64 overflow-y-auto">
//                             {tasks.length > 0 ? (
//                               tasks.map((task) => (
//                                 <div key={task.id} className="bg-white rounded-lg p-3 shadow-sm border border-blue-100 hover:shadow-md transition-shadow">
//                                   <div className="flex justify-between items-start">
//                                     <div className="flex-1">
//                                       <h5 className="font-medium text-gray-800 text-sm">{task.title}</h5>
//                                       <p className="text-xs text-gray-600 mt-1">{task.description}</p>
//                                       <p className="text-xs text-gray-500 mt-2">Deadline: {task.deadline ? new Date(task.deadline).toLocaleDateString() : 'No deadline'}</p>

//                                       {/* Submissions Display */}
//                                       {task.submissions && task.submissions.length > 0 && (
//                                         <div className="mt-3">
//                                           <h6 className="text-xs font-semibold text-gray-700 mb-2">Submissions:</h6>
//                                           <div className="space-y-2">
//                                             {task.submissions.map((submission, index) => (
//                                               <div key={index} className="bg-gray-50 rounded p-2 border">
//                                                 <div className="flex justify-between items-start">
//                                                   <div className="flex-1">
//                                                     <p className="text-xs text-gray-800 font-medium">{submission.student_name}</p>
//                                                     <p className="text-xs text-gray-600">Type: {submission.submission_type}</p>
//                                                     <p className="text-xs text-gray-500">Submitted: {new Date(submission.submitted_at).toLocaleString()}</p>
//                                                   </div>
//                                                   {submission.file_url && (
//                                                     <a
//                                                       href={submission.file_url}
//                                                       target="_blank"
//                                                       rel="noopener noreferrer"
//                                                       className="text-xs text-blue-600 hover:text-blue-800 underline ml-2"
//                                                     >
//                                                       📎 View File
//                                                     </a>
//                                                   )}
//                                                 </div>
//                                               </div>
//                                             ))}
//                                           </div>
//                                         </div>
//                                       )}
//                                     </div>
//                                     <div className="flex space-x-2">
//                                       <button
//                                         onClick={() => handleDeleteTask(task.id, team.id)}
//                                         className="px-2 py-1 bg-red-500 text-white rounded text-xs hover:bg-red-600 transition-colors"
//                                       >
//                                         Delete
//                                       </button>
//                                     </div>
//                                   </div>
//                                 </div>
//                               ))
//                             ) : (
//                               <div className="text-center py-6">
//                                 <div className="text-3xl mb-2">📋</div>
//                                 <p className="text-sm text-gray-500">No tasks available</p>
//                               </div>
//                             )}
//                           </div>
//                         </div>
//                       )}

//                       {/* Messages Section */}
//                       {activeSections[team.id]?.messages && (
//                         <div className="mt-6 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-4 border border-purple-200">
//                           <h4 className="text-lg font-semibold text-purple-800 mb-3 flex items-center">
//                             <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
//                             </svg>
//                             Team Messages
//                           </h4>

//                           {/* Send Message Form */}
//                           <div className="bg-white rounded-lg p-3 mb-4 border border-purple-100 shadow-sm">
//                             <div className="flex space-x-2">
//                               <textarea
//                                 placeholder="Type your message..."
//                                 value={messageForm.content}
//                                 onChange={(e) => setMessageForm({...messageForm, content: e.target.value})}
//                                 className="flex-1 px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 resize-none text-sm"
//                                 rows={2}
//                               />
//                               <button
//                                 onClick={() => handleSendMessage(team.id)}
//                                 disabled={submitting || !messageForm.content.trim()}
//                                 className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors duration-200 font-medium disabled:bg-purple-400 disabled:cursor-not-allowed text-sm"
//                               >
//                                 {submitting ? 'Sending...' : 'Send'}
//                               </button>
//                             </div>
//                           </div>

//                           <div className="space-y-2 max-h-64 overflow-y-auto">
//                             {messages.length > 0 ? (
//                               messages.map((message) => (
//                                 <div key={message.id} className="bg-white rounded-lg p-3 shadow-sm border border-purple-100">
//                                   <p className="text-sm text-gray-800">{message.message}</p>
//                                   {message.file_url && (
//                                     <div className="mt-2">
//                                       <a href={message.file_url} target="_blank" rel="noopener noreferrer" className="text-xs text-purple-600 hover:text-purple-800 underline">
//                                         📎 {message.file_name || 'Attachment'}
//                                       </a>
//                                     </div>
//                                   )}
//                                   <div className="flex justify-between items-center mt-2">
//                                     <span className="text-xs font-medium text-purple-600">{message.sender_name}</span>
//                                     <span className="text-xs text-gray-500">{new Date(message.created_at).toLocaleString()}</span>
//                                   </div>
//                                 </div>
//                               ))
//                             ) : (
//                               <div className="text-center py-6">
//                                 <div className="text-3xl mb-2">💭</div>
//                                 <p className="text-sm text-gray-500">No messages yet</p>
//                               </div>
//                             )}
//                           </div>
//                         </div>
//                       )}
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>

//           </div>
//         </div>
//       </div>

//       {/* Submit Task Modal */}
//       {showSubmitModal && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//           <div className="bg-white rounded-2xl shadow-xl p-6 max-w-md w-full mx-4">
//             <div className="flex justify-between items-center mb-4">
//               <h3 className="text-lg font-semibold text-gray-800">Submit Task</h3>
//               <button
//                 onClick={() => {
//                   setShowSubmitModal(false);
//                   setSubmitFile(null);
//                   setSelectedTaskId(null);
//                 }}
//                 className="text-gray-400 hover:text-gray-600"
//               >
//                 <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//                 </svg>
//               </button>
//             </div>

//             <div className="space-y-4">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Select File to Submit
//                 </label>
//                 <input
//                   type="file"
//                   accept="image/*,video/*,audio/*,application/*"
//                   onChange={(e) => setSubmitFile(e.target.files[0])}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                 />
//                 {submitFile && (
//                   <p className="mt-2 text-sm text-gray-600">
//                     Selected: {submitFile.name}
//                   </p>
//                 )}
//               </div>

//               <div className="flex justify-end space-x-3">
//                 <button
//                   onClick={() => {
//                     setShowSubmitModal(false);
//                     setSubmitFile(null);
//                     setSelectedTaskId(null);
//                   }}
//                   className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   onClick={() => handleTaskSubmit(selectedTaskId)}
//                   disabled={!submitFile || submittingSubmit}
//                   className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-400 disabled:cursor-not-allowed"
//                 >
//                   {submittingSubmit ? 'Submitting...' : 'Submit Task'}
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Tasks;












import React, { useState, useEffect } from 'react';
import SiteBar from '../sitebar/SiteBar';
import TopBar from '../TopBar/TopBar';
import { useAuth } from '../../context/AuthContext';

const Tasks = () => {
  const { user } = useAuth();
  const [teams, setTeams] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [taskForm, setTaskForm] = useState({ title: '', description: '', deadline: '' });
  const [messageForm, setMessageForm] = useState({ content: '' });
  const [submitting, setSubmitting] = useState(false);
  const [activeSections, setActiveSections] = useState({});
  const [showCreateTask, setShowCreateTask] = useState({});
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState(null);
  const [submitFile, setSubmitFile] = useState(null);
  const [submittingSubmit, setSubmittingSubmit] = useState(false);

  const API_BASE = 'https://projectmanagement-production-e252.up.railway.app/api';

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetchTeams();
    } else {
      setLoading(false);
      setError('No authentication token found');
    }
  }, []);

  const fetchTeams = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    setLoading(true);
    try {
      // Only supervisor APIs - fetch teams
      const response = await fetch(`${API_BASE}/supervisor/my-teams`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        console.log('Teams data:', data.teams);
        setTeams(data.teams || []);
      } else {
        setError('Failed to fetch teams');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  const fetchTeamTasks = async (teamId) => {
    const token = localStorage.getItem('token');
    console.log('Fetching tasks for team:', teamId);
    try {
      const response = await fetch(`${API_BASE}/teams/${teamId}/tasks`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      console.log('Tasks fetch response status:', response.status);
      if (response.ok) {
        const data = await response.json();
        console.log('Tasks data:', data.tasks);
        setTasks(data.tasks || []);
      } else {
        const errorText = await response.text();
        console.error('Failed to fetch tasks:', response.status, response.statusText, errorText);
      }
    } catch (err) {
      console.error('Error fetching tasks:', err);
    }
  };

  const fetchTeamMessages = async (teamId) => {
    const token = localStorage.getItem('token');
    console.log('Fetching messages with token:', token ? 'Token exists' : 'No token');
    try {
      const response = await fetch(`${API_BASE}/teams/${teamId}/messages`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      console.log('Response status:', response.status);
      if (response.ok) {
        const data = await response.json();
        setMessages(data.messages || []);
        console.log('Fetched messages:', data.messages);
      } else {
        const errorText = await response.text();
        console.error('Failed to fetch messages:', response.status, response.statusText, errorText);
        setError(`Failed to fetch messages: ${response.status} ${response.statusText}`);
      }
    } catch (err) {
      console.error('Error fetching messages:', err);
      setError(`Error fetching messages: ${err.message}`);
    }
  };

  const handleCreateTask = async (teamId) => {
    const token = localStorage.getItem('token');
    console.log('Creating task for team:', teamId);
    console.log('Task form data:', taskForm);
    setSubmitting(true);
    try {
      const taskData = {
        title: taskForm.title.trim(),
        description: taskForm.description.trim(),
        deadline: taskForm.deadline ? new Date(taskForm.deadline).toISOString() : null
      };
      console.log('Sending task data:', taskData);
      console.log('Title length:', taskData.title.length);
      console.log('Description length:', taskData.description.length);
      const response = await fetch(`${API_BASE}/teams/${teamId}/tasks`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(taskData)
      });
      console.log('Task creation response status:', response.status);
      if (response.ok) {
        const responseData = await response.json();
        console.log('Task creation success:', responseData);
        alert('Task created successfully!');
        setTaskForm({ title: '', description: '', deadline: '' });
        fetchTeamTasks(teamId);
      } else {
        const errorText = await response.text();
        console.error('Task creation failed:', response.status, response.statusText, errorText);
        setError(`Failed to create task: ${errorText}`);
      }
    } catch (err) {
      console.error('Network error creating task:', err);
      setError(`Network error: ${err.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteTask = async (taskId, teamId) => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`${API_BASE}/tasks/${taskId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        alert('Task deleted successfully!');
        fetchTeamTasks(teamId);
      } else {
        setError('Failed to delete task');
      }
    } catch (err) {
      setError(err.message);
    }
  };


  const handleSendMessage = async (teamId) => {
    const token = localStorage.getItem('token');
    console.log('Sending message to team:', teamId);
    console.log('Token exists:', !!token);
    console.log('Message content:', messageForm.content);
    setSubmitting(true);
    try {
      // Send message without file upload
      const messageContent = messageForm.content.trim();
      const payload = {
        message: messageContent
      };

      console.log('Sending message payload:', payload);
      const response = await fetch(`${API_BASE}/teams/${teamId}/messages`, {
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

  const handleFileUpload = async () => {
    const token = localStorage.getItem('token');
    if (!file) return;
    const formData = new FormData();
    formData.append('file', file);
    setSubmitting(true);
    try {
      const response = await fetch(`${API_BASE}/upload`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData
      });
      if (response.ok) {
        alert('File uploaded successfully!');
        setFile(null);
      } else {
        setError('Failed to upload file');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleTaskSubmit = async (taskId) => {
    const token = localStorage.getItem('token');
    console.log('Task Submit - Token:', token);
    console.log('Task Submit - User:', user);
    console.log('Task Submit - Task ID:', taskId);
    console.log('Task Submit - File:', submitFile ? submitFile.name : 'No file');

    if (!submitFile) {
      alert('Please select a file to submit');
      return;
    }

    if (!token) {
      alert('Authentication token not found. Please log in again.');
      return;
    }

    // Check if user is logged in and has proper role
    // if (!user || !user.role) {
    //   alert('User authentication required. Please log in again.');
    //   return;
    // }

    // // Allow both students and supervisors to submit tasks
    // if (user.role !== 'student' && user.role !== 'supervisor') {
    //   alert('Unauthorized user role for task submission.');
    //   return;
    // }

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
        file_name: submitFile.name
      };
      console.log('Task Submit - Submit payload:', submitPayload);

      const submitResponse = await fetch(`${API_BASE}/tasks/${taskId}/submit`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          file_url: fileUrl,
       
        })
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
        // Refresh tasks for the current team
        if (selectedTeam) {
          fetchTeamTasks(selectedTeam.id);
        }
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
    <div className="flex h-screen bg-gray-50">
      <SiteBar />
      <div className="flex-1 ml-64 flex flex-col">
        <TopBar />
        <div className="flex-1 p-8 overflow-y-auto pt-24">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                Supervisor Tasks
              </h1>
              <p className="text-gray-600">
                Manage your teams and track task progress
              </p>
            </div>

            {/* Teams List */}
            <div className="mb-8">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-semibold text-gray-800 mb-2">Your Teams</h2>
                <div className="w-16 h-1 bg-blue-500 mx-auto rounded-full"></div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {teams.map(team => (
                  <div
                    key={team.id}
                    className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 border border-gray-200"
                  >
                    {/* Team Header */}
                    <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-5">
                      <div className="flex items-center justify-between">
                        <div className="text-white">
                          <h3 className="text-lg font-semibold">{team.name}</h3>
                          <p className="text-blue-100 text-sm">ID: {team.id}</p>
                        </div>
                        <div className="bg-white bg-opacity-20 rounded-full p-2">
                          <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                          </svg>
                        </div>
                      </div>
                    </div>

                    {/* Team Info */}
                    <div className="p-5">
                      <div className="grid grid-cols-3 gap-4 mb-5">
                        <div className="text-center p-3 bg-blue-50 rounded-lg">
                          <div className="text-xl font-bold text-blue-600">{team.tasks_count || 0}</div>
                          <div className="text-xs text-gray-600 uppercase tracking-wide">Tasks</div>
                        </div>
                        <div className="text-center p-3 bg-green-50 rounded-lg">
                          <div className="text-xl font-bold text-green-600">{team.members ? team.members.length : 0}</div>
                          <div className="text-xs text-gray-600 uppercase tracking-wide">Members</div>
                        </div>
                        <div className="text-center p-3 bg-purple-50 rounded-lg">
                          <div className="text-xl font-bold text-purple-600">{team.project_name ? 1 : 0}</div>
                          <div className="text-xs text-gray-600 uppercase tracking-wide">Projects</div>
                        </div>
                      </div>
                      {team.project_name && (
                        <div className="bg-gray-50 rounded-lg p-3 mb-4">
                          <div className="text-xs text-gray-600 uppercase tracking-wide mb-1">Current Project</div>
                          <div className="text-gray-900 font-medium text-sm">{team.project_name}</div>
                        </div>
                      )}

                      <div className="flex justify-center space-x-3">
                        <button
                          onClick={() => {
                            const newActiveSections = { ...activeSections };
                            if (newActiveSections[team.id]?.tasks) {
                              delete newActiveSections[team.id].tasks;
                            } else {
                              if (!newActiveSections[team.id]) newActiveSections[team.id] = {};
                              newActiveSections[team.id].tasks = true;
                              fetchTeamTasks(team.id);
                            }
                            setActiveSections(newActiveSections);
                          }}
                          className={`px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 ${
                            activeSections[team.id]?.tasks
                              ? 'bg-blue-600 text-white'
                              : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                          }`}
                        >
                          📋 Tasks
                        </button>
                        <button
                          onClick={() => {
                            const newActiveSections = { ...activeSections };
                            if (newActiveSections[team.id]?.messages) {
                              delete newActiveSections[team.id].messages;
                            } else {
                              if (!newActiveSections[team.id]) newActiveSections[team.id] = {};
                              newActiveSections[team.id].messages = true;
                              fetchTeamMessages(team.id);
                            }
                            setActiveSections(newActiveSections);
                          }}
                          className={`px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 ${
                            activeSections[team.id]?.messages
                              ? 'bg-purple-600 text-white'
                              : 'bg-purple-100 text-purple-700 hover:bg-purple-200'
                          }`}
                        >
                          💬 Messages
                        </button>
                      </div>

                      {/* Tasks Section */}
                      {activeSections[team.id]?.tasks && (
                        <div className="mt-5 bg-blue-50 rounded-lg p-4 border border-blue-200">
                          <div className="flex justify-between items-center mb-4">
                            <h4 className="text-lg font-semibold text-blue-800 flex items-center">
                              <span className="mr-2">📋</span>
                              Team Tasks
                            </h4>
                            <button
                              onClick={() => {
                                const newShowCreateTask = { ...showCreateTask };
                                newShowCreateTask[team.id] = !newShowCreateTask[team.id];
                                setShowCreateTask(newShowCreateTask);
                              }}
                              className={`px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 ${
                                showCreateTask[team.id]
                                  ? 'bg-gray-600 text-white hover:bg-gray-700'
                                  : 'bg-blue-600 text-white hover:bg-blue-700'
                              }`}
                            >
                              {showCreateTask[team.id] ? 'Hide Form' : '+ Create Task'}
                            </button>
                          </div>

                          {/* Create Task Form */}
                          {showCreateTask[team.id] && (
                            <div className="bg-white rounded-lg p-4 mb-4 border border-gray-200 shadow-sm">
                              <h5 className="text-md font-semibold mb-4 text-gray-800">Create New Task</h5>
                              <div className="grid grid-cols-1 gap-4 mb-4">
                                <input
                                  type="text"
                                  placeholder="Task Title"
                                  value={taskForm.title}
                                  onChange={(e) => setTaskForm({...taskForm, title: e.target.value})}
                                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-sm"
                                />
                                <textarea
                                  placeholder="Task Description"
                                  value={taskForm.description}
                                  onChange={(e) => setTaskForm({...taskForm, description: e.target.value})}
                                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-sm resize-none"
                                  rows={3}
                                />
                                <input
                                  type="date"
                                  value={taskForm.deadline}
                                  onChange={(e) => setTaskForm({...taskForm, deadline: e.target.value})}
                                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-sm"
                                />
                              </div>
                              <button
                                onClick={() => handleCreateTask(team.id)}
                                disabled={submitting || !taskForm.title || !taskForm.description}
                                className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium disabled:bg-blue-400 disabled:cursor-not-allowed text-sm"
                              >
                                {submitting ? 'Creating...' : 'Create Task'}
                              </button>
                            </div>
                          )}

                          <div className="space-y-3 max-h-64 overflow-y-auto">
                            {tasks.length > 0 ? (
                              tasks.map((task) => (
                                <div key={task.id} className="bg-white rounded-lg p-3 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                                  <div className="flex justify-between items-start">
                                    <div className="flex-1">
                                      <div className="flex items-center mb-2">
                                        <h5 className="font-medium text-gray-800 text-sm mr-2">{task.title}</h5>
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                          task.status === 'completed' ? 'bg-green-100 text-green-800' :
                                          task.status === 'in_progress' ? 'bg-yellow-100 text-yellow-800' :
                                          'bg-blue-100 text-blue-800'
                                        }`}>
                                          {task.status || 'pending'}
                                        </span>
                                      </div>
                                      <p className="text-xs text-gray-600 mb-2">{task.description}</p>
                                      <p className="text-xs text-gray-500">📅 {task.deadline ? new Date(task.deadline).toLocaleDateString() : 'No deadline'}</p>

                                      {/* Submissions Display */}
                                      {task.submissions && task.submissions.length > 0 && (
                                        <div className="mt-3 bg-gray-50 rounded p-2">
                                          <h6 className="text-xs font-semibold text-gray-700 mb-2">📤 Submissions ({task.submissions.length})</h6>
                                          <div className="space-y-2">
                                            {task.submissions.map((submission, index) => (
                                              <div key={index} className="bg-white rounded p-2 border border-gray-200">
                                                <div className="flex justify-between items-start">
                                                  <div className="flex-1">
                                                    <p className="text-xs text-gray-800 font-medium">{submission.student_name}</p>
                                                    <p className="text-xs text-gray-600">Type: {submission.submission_type}</p>
                                                    <p className="text-xs text-gray-500">Submitted: {new Date(submission.submitted_at).toLocaleString()}</p>
                                                  </div>
                                                  {submission.file_url && (
                                                    <a
                                                      href={submission.file_url}
                                                      target="_blank"
                                                      rel="noopener noreferrer"
                                                      className="px-2 py-1 bg-blue-500 text-white rounded text-xs hover:bg-blue-600 transition-colors"
                                                    >
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
                                    <div className="flex space-x-2 ml-3">
                                      <button
                                        onClick={() => handleDeleteTask(task.id, team.id)}
                                        className="px-3 py-1 bg-red-500 text-white rounded text-xs hover:bg-red-600 transition-colors"
                                      >
                                        Delete
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              ))
                            ) : (
                              <div className="text-center py-8">
                                <div className="text-4xl mb-3">📋</div>
                                <p className="text-sm text-gray-500">No tasks available</p>
                                <p className="text-xs text-gray-400 mt-1">Create your first task to get started</p>
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Messages Section */}
                      {activeSections[team.id]?.messages && (
                        <div className="mt-5 bg-purple-50 rounded-lg p-4 border border-purple-200">
                          <h4 className="text-lg font-semibold text-purple-800 mb-4 flex items-center">
                            <span className="mr-2">💬</span>
                            Team Messages
                          </h4>

                          {/* Send Message Form */}
                          <div className="bg-white rounded-lg p-3 mb-4 border border-gray-200 shadow-sm">
                            <div className="flex space-x-2">
                              <textarea
                                placeholder="Type your message..."
                                value={messageForm.content}
                                onChange={(e) => setMessageForm({...messageForm, content: e.target.value})}
                                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 resize-none text-sm"
                                rows={2}
                              />
                              <button
                                onClick={() => handleSendMessage(team.id)}
                                disabled={submitting || !messageForm.content.trim()}
                                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors duration-200 font-medium disabled:bg-purple-400 disabled:cursor-not-allowed text-sm"
                              >
                                {submitting ? 'Sending...' : 'Send'}
                              </button>
                            </div>
                          </div>

                          <div className="space-y-3 max-h-64 overflow-y-auto">
                            {messages.length > 0 ? (
                              messages.map((message) => (
                                <div key={message.id} className="bg-white rounded-lg p-3 shadow-sm border border-gray-200">
                                  <p className="text-sm text-gray-800 mb-2">{message.message}</p>
                                  {message.file_url && (
                                    <div className="mb-2">
                                      <a href={message.file_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center px-2 py-1 bg-purple-500 text-white rounded text-xs hover:bg-purple-600 transition-colors">
                                        📎 {message.file_name || 'Attachment'}
                                      </a>
                                    </div>
                                  )}
                                  <div className="flex justify-between items-center">
                                    <span className="text-xs font-medium text-purple-600">{message.sender_name}</span>
                                    <span className="text-xs text-gray-500">{new Date(message.created_at).toLocaleString()}</span>
                                  </div>
                                </div>
                              ))
                            ) : (
                              <div className="text-center py-8">
                                <div className="text-4xl mb-3">💭</div>
                                <p className="text-sm text-gray-500">No messages yet</p>
                                <p className="text-xs text-gray-400 mt-1">Start the conversation</p>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
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

export default Tasks;



