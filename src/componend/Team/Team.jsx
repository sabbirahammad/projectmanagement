import React, { useState, useEffect } from 'react';
import SiteBar from '../sitebar/SiteBar';
import TopBar from '../TopBar/TopBar';

const Team = () => {
  const [students, setStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [formData, setFormData] = useState({
    to_student_id: '',
    team_name: '',
    project_name: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [filters, setFilters] = useState({
    department: '',
    session: ''
  });

  const fetchStudents = async (department = '', session = '') => {
    setLoading(true);

    const token = localStorage.getItem('token');
    console.log('Token from localStorage:', token);

    if (!token) {
      setLoading(false);
      return;
    }

    try {
      let url = 'https://projectmanagement-production-e252.up.railway.app/api/students';
      const params = new URLSearchParams();

      if (department) params.append('department', department);
      if (session) params.append('session', session);

      if (params.toString()) {
        url += `?${params.toString()}`;
      }

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
        // If API endpoint doesn't exist, use mock data for development
        console.log('API endpoint not found, using mock data');
        console.log('Response status text:', response.statusText);

        // Filter mock data based on department and session
        let mockStudents = [
        
        ];

        if (department) {
          mockStudents = mockStudents.filter(student =>
            student.department.toLowerCase().includes(department)
          );
        }

        if (session) {
          mockStudents = mockStudents.filter(student =>
            student.session === session
          );
        }

        setStudents(mockStudents);
        return;
      }

      const data = await response.json();
      console.log('Fetched data:', data);
      // API returns {total: number, students: array}
      setStudents(data.students || []);
    } catch (err) {
      console.log('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  // Filter students based on search term
  const filteredStudents = students.filter(student =>
    student.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.registration_number.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleStudentSelect = (student) => {
    setSelectedStudent(student);
    setFormData({
      ...formData,
      to_student_id: student.id
    });
    setSearchTerm(`${student.first_name} ${student.last_name} (${student.registration_number})`);
    setShowSuggestions(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    const token = localStorage.getItem('token');

    try {
      const response = await fetch('https://projectmanagement-production-e252.up.railway.app/api/team-requests', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to_student_id: parseInt(formData.to_student_id),
          team_name: formData.team_name,
          project_name: formData.project_name
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('Team request sent successfully!');
        setFormData({
          to_student_id: '',
          team_name: '',
          project_name: ''
        });
        setSelectedStudent(null);
        setSearchTerm('');
      } else {
        setMessage(data.error || data.message || 'Failed to send team request');
      }
    } catch (err) {
      setMessage('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <SiteBar />
      <div className="flex-1 ml-64 flex flex-col">
        <TopBar />
        <div className="flex-1 p-8 overflow-y-auto pt-24">
          <div className="max-w-2xl mx-auto">
            <div className="mb-8">
              <h1 className="text-4xl font-bold text-gray-800 mb-4">Create Team Request</h1>
              <p className="text-gray-600">Send a team invitation to another student</p>
            </div>

            <div className="bg-white rounded-2xl shadow-xl p-8">
              {/* Filter Section */}
              <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Filter Students</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Department</label>
                    <input
                      type="text"
                      placeholder="e.g., Computer Science"
                      value={filters.department}
                      onChange={(e) => setFilters({...filters, department: e.target.value.toLowerCase()})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Session</label>
                    <input
                      type="text"
                      placeholder="e.g., 2023-2024"
                      value={filters.session}
                      onChange={(e) => setFilters({...filters, session: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div className="flex items-end">
                    <button
                      type="button"
                      onClick={() => fetchStudents(filters.department, filters.session)}
                      className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors duration-200"
                    >
                      Apply Filters
                    </button>
                  </div>
                </div>
              </div>

              {message && (
                <div className={`mb-6 p-4 rounded-lg ${
                  message.includes('successfully')
                    ? 'bg-green-100 border border-green-400 text-green-700'
                    : 'bg-red-100 border border-red-400 text-red-700'
                }`}>
                  {message}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Student Search */}
                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Student
                  </label>
                  <input
                    type="text"
                    placeholder="Search by name, email, or registration number..."
                    value={searchTerm}
                    onChange={(e) => {
                      setSearchTerm(e.target.value);
                      setShowSuggestions(true);
                    }}
                    onFocus={() => setShowSuggestions(true)}
                    onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white"
                    required
                  />

                  {/* Suggestions Dropdown */}
                  {showSuggestions && (
                    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                      {filteredStudents.length > 0 ? (
                        filteredStudents.map((student) => (
                          <div
                            key={student.id}
                            onClick={() => handleStudentSelect(student)}
                            className="px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                          >
                            <div className="font-medium text-gray-800">
                              {student.first_name} {student.last_name}
                            </div>
                            <div className="text-sm text-gray-500">
                              {student.registration_number} • {student.email}
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="px-4 py-3 text-gray-500">No students found</div>
                      )}
                    </div>
                  )}
                </div>

                {/* Team Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Team Name
                  </label>
                  <input
                    type="text"
                    name="team_name"
                    value={formData.team_name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white"
                    placeholder="Enter team name (3-100 characters)"
                    minLength="3"
                    maxLength="100"
                    required
                  />
                </div>

                {/* Project Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Project Name
                  </label>
                  <input
                    type="text"
                    name="project_name"
                    value={formData.project_name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white"
                    placeholder="Enter project name (5-200 characters)"
                    minLength="5"
                    maxLength="200"
                    required
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading || !selectedStudent}
                  className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Sending Request...
                    </div>
                  ) : (
                    'Send Team Request'
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Team;
