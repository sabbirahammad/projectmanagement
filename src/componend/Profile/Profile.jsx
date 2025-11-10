import React, { useState, useEffect } from 'react';
import SiteBar from '../sitebar/SiteBar';
import TopBar from '../TopBar/TopBar';
import { useAuth } from '../../context/AuthContext';

const Profile = () => {
  const { user } = useAuth();
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    phone: '',
    department: '',
    semester: '',
    rollNumber: '',
    profileImage: ''
  });
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    console.log('Profile component - user from context:', user);
    fetchProfile();
  }, [user]);

  const fetchProfile = async () => {
    const token = localStorage.getItem('token');

    if (!token || !user || !user.id) {
      // setMessage('Authentication required');
      console.log('Missing auth data:', { token: !!token, user, userId: user?.id });
      return;
    }

    setLoading(true);
    console.log('Fetching profile for user ID:', user.id);
    try {
      const response = await fetch(`http://192.168.0.106:8081/api/students/${user.id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      console.log('Profile fetch response status:', response.status);
      if (response.ok) {
        const data = await response.json();
        console.log('Profile data received:', data);
        console.log('Available fields in response:', Object.keys(data));
        setProfileData({
          name: data.first_name || data.name || '',
          email: data.email || '',
          phone: data.phone || '',
          department: data.department || '',
          semester: data.session || data.semester || '',
          rollNumber: data.registration_number || data.rollNumber || '',
          profileImage: data.image || data.profile_image || ''
        });

        // Store role in localStorage for sidebar
        if (data.role) {
          localStorage.setItem('userRole', data.role);
        }
      } else {
        const errorData = await response.text();
        console.log('Profile fetch error:', errorData);
        console.log('Response headers:', [...response.headers.entries()]);
        setMessage('Failed to fetch profile data');
      }
    } catch (err) {
      console.log('Error fetching profile:', err);
      setMessage('Error fetching profile data');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    if (!token || !user || !user.id) {
    
      console.log('Missing auth data for update:', { token: !!token, user, userId: user?.id });
      return;
    }

    setLoading(true);
    console.log('Updating profile for user ID:', user.id);
    try {
      const updateData = {
        first_name: profileData.name,
        email: profileData.email,
        phone: profileData.phone,
        department: profileData.department,
        session: profileData.semester,
        registration_number: profileData.rollNumber,
        image: profileData.profileImage
      };

      console.log('Sending update data:', updateData);
      const response = await fetch(`http://192.168.0.106:8081/api/students/${user.id}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      });

      console.log('Update response status:', response.status);
      if (response.ok) {
        const result = await response.json();
        console.log('Update successful:', result);
        setMessage('Profile updated successfully');
        setIsEditing(false);
        // Update localStorage with new name
        localStorage.setItem('userName', profileData.name);
      } else {
        const errorText = await response.text();
        console.log('Update failed:', errorText);
        setMessage('Failed to update profile');
      }
    } catch (err) {
      console.log('Error updating profile:', err);
      setMessage('Error updating profile');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const token = localStorage.getItem('token');
    if (!token) {
      setMessage('Authentication required');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    setLoading(true);
    try {
      const response = await fetch('http://192.168.0.106:8081/api/upload', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        setProfileData(prev => ({
          ...prev,
          profileImage: data.url
        }));
        setMessage('Image uploaded successfully');
      } else {
        setMessage('Failed to upload image');
      }
    } catch (err) {
      console.log('Error uploading image:', err);
      setMessage('Error uploading image');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <SiteBar />
      <div className="flex-1 ml-64 flex flex-col">
        <TopBar />
        <div className="flex-1 p-8 overflow-y-auto pt-24">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-lg shadow-md p-8">
              <div className="flex items-center justify-between mb-8">
                <h1 className="text-3xl font-bold text-gray-800">Profile</h1>
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                >
                  {isEditing ? 'Cancel' : 'Edit Profile'}
                </button>
              </div>

              {/* Profile Image Section */}
              <div className="flex flex-col items-center mb-8">
                <div className="w-32 h-32 bg-gray-200 rounded-full overflow-hidden mb-4">
                  {profileData.profileImage ? (
                    <img
                      src={profileData.profileImage}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      <svg className="w-16 h-16" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                      </svg>
                    </div>
                  )}
                </div>
                {isEditing && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Profile Image</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                      disabled={loading}
                    />
                  </div>
                )}
              </div>

              {message && (
                <div className={`mb-6 p-4 rounded-lg ${message.includes('success') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                  {message}
                </div>
              )}

              <form onSubmit={handleUpdate} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                    <input
                      type="text"
                      name="name"
                      value={profileData.name}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={profileData.email}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                    <input
                      type="tel"
                      name="phone"
                      value={profileData.phone}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Department</label>
                    <input
                      type="text"
                      name="department"
                      value={profileData.department}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Semester</label>
                    <input
                      type="text"
                      name="semester"
                      value={profileData.semester}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Roll Number</label>
                    <input
                      type="text"
                      name="rollNumber"
                      value={profileData.rollNumber}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                    />
                  </div>
                </div>

                {isEditing && (
                  <div className="flex justify-end space-x-4">
                    <button
                      type="button"
                      onClick={() => setIsEditing(false)}
                      className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors duration-200"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? 'Updating...' : 'Update Profile'}
                    </button>
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;