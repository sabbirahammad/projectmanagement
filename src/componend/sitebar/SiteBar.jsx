// import React, { useEffect, useState } from 'react';
// import { Link, useLocation } from 'react-router-dom';

// const SiteBar = () => {
//   const location = useLocation();

//   const [isLoggedIn, setIsLoggedIn] = useState(false);
//     const [userName, setUserName] = useState('');
//     const [userType, setUserType] = useState('');

//     useEffect(() => {
//       const token = localStorage.getItem('token');
//       const name = localStorage.getItem('userName');
//       const type = localStorage.getItem('userType');
  
//       if (token && name) {
//         setIsLoggedIn(true);
//         setUserName(name);
//         setUserType(type);
//       }
//     }, []);
//   const menuItems = [
//     { name: 'Dashboard', path: '/dashboard', icon: '🏠' },
//     { name: 'Projects', path: '/projects', icon: '📋' },
//     { name: 'Supervisor Tasks', path: '/tasks', icon: '✅' },
//     { name: 'Student Tasks', path: '/studenttask', icon: '✅' },
//     { name: 'Student', path: '/student/list', icon: '👨‍🎓' },
//      { name: 'Supervisor', path:'/supervisorList', icon: '👨‍🎓' },
//     { name: 'Team', path: '/myteam', icon: '👥' },
//     { name: 'Reports', path: '/reports', icon: '📊' },
//     { name: 'Settings', path: '/settings', icon: '⚙️' },
//     { name: 'Profile', path: '/profile', icon: '👤' },
//   ];

//   return (
//     <div className="h-screen w-64 bg-gray-900 text-white shadow-lg fixed left-0 top-0 overflow-y-auto border-r border-gray-700">
//       <div className="p-6">
//         {/* Logo Section */}
//         <div className="text-center mb-8">
//           <div className="w-12 h-12 mx-auto mb-3 bg-blue-600 rounded-lg flex items-center justify-center">
//             <span className="text-xl">🚀</span>
//           </div>
//           <h2 className="text-xl font-bold text-blue-400">
//             ProjectFlow
//           </h2>
//           <p className="text-xs text-gray-400 mt-1">Manage • Collaborate • Succeed</p>
//         </div>

//         {/* Navigation */}
//         <nav>
//           <ul className="space-y-2">
//             {menuItems.map((item) => (
//               <li key={item.path}>
//                 <Link
//                   to={item.path}
//                   className={`flex items-center px-4 py-3 rounded-lg transition-colors duration-200 ${
//                     location.pathname === item.path
//                       ? 'bg-blue-600 text-white'
//                       : 'text-gray-300 hover:bg-gray-800 hover:text-white'
//                   }`}
//                 >
//                   <span className="text-lg mr-3">{item.icon}</span>
//                   <span className="font-medium">{item.name}</span>
//                 </Link>
//               </li>
//             ))}
//           </ul>
//         </nav>
//       </div>

//       {/* User Profile Section */}
//       <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-700 bg-gray-800">
//         <div className="flex items-center space-x-3">
//           <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
//             <span className="text-xs font-bold">{userName.split(' ').map(n => n[0]).join('').toUpperCase()}</span>
//           </div>
//           <div className="flex-1 min-w-0">
//             <p className="text-sm font-medium truncate">{userName}</p>
//             <p className="text-xs text-gray-400 capitalize">{userType}</p>
//           </div>
//         </div>
//         <div className="text-center mt-2">
//           <p className="text-xs text-gray-500">© 2024 ProjectFlow</p>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default SiteBar;





import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const SiteBar = () => {
  const location = useLocation();
  const { user } = useAuth();
  const [key, setKey] = useState(0);

  useEffect(() => {
    // Force re-render when user changes
    setKey(prev => prev + 1);
  }, [user]);

  console.log('SiteBar - user:', user);

  const allMenuItems = [
    { name: 'Dashboard', path: '/', icon: '🏠' },
    { name: 'Projects', path: '/project', icon: '📋' },
    { name: 'Supervisor Tasks', path: '/tasks', icon: '✅', roles: ['supervisor'] },
    { name: 'Student Tasks', path: '/studenttask', icon: '✅', roles: ['student'] },
    { name: 'Student', path: '/student/list', icon: '👨‍🎓' },
    { name: 'Supervisor', path: '/supervisorList', icon: '👨‍🎓' },
    { name: 'Team', path: '/myteam', icon: '👥' },
    // { name: 'Reports', path: '/reports', icon: '📊' },
    // { name: 'Settings', path: '/settings', icon: '⚙️' },
    { name: 'Profile', path: '/profile', icon: '👤' },
  ];

  const menuItems = allMenuItems.filter(item => !item.roles || item.roles.includes(user?.type));

  console.log('SiteBar - menuItems:', menuItems);

  return (
    <div key={key} className="h-screen w-64 bg-gray-900 text-white shadow-lg fixed left-0 top-0 overflow-y-auto border-r border-gray-700">
      <div className="p-6">
        {/* Logo Section */}
        <div className="text-center mb-8">
          <div className="w-12 h-12 mx-auto mb-3 bg-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-xl">🚀</span>
          </div>
          <h2 className="text-xl font-bold text-blue-400">
            ProjectFlow
          </h2>
          <p className="text-xs text-gray-400 mt-1">Manage • Collaborate • Succeed</p>
        </div>

        {/* Navigation */}
        <nav>
          <ul className="space-y-2">
            {menuItems.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`flex items-center px-4 py-3 rounded-lg transition-colors duration-200 ${
                    location.pathname === item.path
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                  }`}
                >
                  <span className="text-lg mr-3">{item.icon}</span>
                  <span className="font-medium">{item.name}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {/* User Profile Section */}
      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-700 bg-gray-800">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
            <span className="text-xs font-bold">{user?.name?.split(' ').map(n => n[0]).join('').toUpperCase()}</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{user?.name}</p>
            <p className="text-xs text-gray-400 capitalize">{user?.type}</p>
          </div>
        </div>
        <div className="text-center mt-2">
          <p className="text-xs text-gray-500">© 2024 ProjectFlow</p>
        </div>
      </div>
    </div>
  );
};

export default SiteBar;



