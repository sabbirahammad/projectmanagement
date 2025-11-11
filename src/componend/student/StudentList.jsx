import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import SiteBar from '../sitebar/SiteBar';
import TopBar from '../TopBar/TopBar';

const StudentList = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    department: '',
    session: ''
  });

  const fetchStudents = async (department = '', session = '') => {
    setLoading(true);
    setError('');

    const token = localStorage.getItem('token');
    console.log('Token from localStorage:', token);

    if (!token) {
      setError('No authorization token found. Please log in.');
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
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const handleFilterSubmit = (e) => {
    e.preventDefault();
    fetchStudents(filters.department, filters.session);
  };

  const filteredStudents = Array.isArray(students) ? students.filter(student =>
    student.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.registration_number.toLowerCase().includes(searchTerm.toLowerCase())
  ) : [];

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
            <div className="mb-8">
              <div className="flex justify-between items-center">
                <div>
                  <h1 className="text-4xl font-bold text-gray-800 mb-4">Student Directory</h1>
                  <p className="text-gray-600">Manage and view all registered students</p>
                </div>
                <Link
                  to="/team"
                  className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors duration-200 font-medium shadow-lg"
                >
                  Create Team
                </Link>
              </div>
            </div>

            {/* Filter Form */}
            <div className="mb-6 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Filter Students</h2>
              <form onSubmit={handleFilterSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                    type="submit"
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors duration-200"
                  >
                    Apply Filters
                  </button>
                </div>
              </form>
            </div>

            {/* Search Bar */}
            <div className="mb-6">
              <input
                type="text"
                placeholder="Search by name, email, or registration number..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white"
              />
            </div>

            {/* Student Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredStudents.map((student, index) => (
                <div key={index} className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 p-6 border border-gray-100">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg mr-4">
                      {student.first_name[0]}{student.last_name[0]}
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-800">{student.first_name} {student.last_name}</h3>
                      <p className="text-sm text-gray-500">{student.role}</p>
                    </div>
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Email:</span>
                      <span className="text-gray-800 font-medium">{student.email}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Department:</span>
                      <span className="text-gray-800 font-medium">{student.department}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Session:</span>
                      <span className="text-gray-800 font-medium">{student.session}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Registration:</span>
                      <span className="text-gray-800 font-medium">{student.registration_number}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Batch:</span>
                      <span className="text-gray-800 font-medium">{student.batch}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Status:</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        student.status === 'active' ? 'bg-green-100 text-green-800' :
                        student.status === 'inactive' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {student.status}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Has Team:</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        student.has_team ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {student.has_team ? 'Yes' : 'No'}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {filteredStudents.length === 0 && (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">👨‍🎓</div>
                <h3 className="text-xl font-semibold text-gray-600 mb-2">No students found</h3>
                <p className="text-gray-500">Try adjusting your search criteria</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentList;