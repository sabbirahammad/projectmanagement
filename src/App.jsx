import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import Deshboard from './componend/Deshboard/Deshboard'
import StudentAuth from './componend/Auth/StudentAuth'
import StudentRegister from './componend/Auth/StudentRegister'
import SupervisorAuth from './componend/Auth/SupervisorAuth'
import SupervisorRegister from './componend/Auth/SupervisorRegister'
import Sequrity from './componend/Admin/Sequrity'
import Admin from './componend/Admin/Admin'
import StudentList from './componend/student/StudentList'
import Supervisor from './componend/supervisor/Supervisor'
import Team from './componend/Team/Team'
import MyTeam from './componend/Team/MyTeam'
import Tasks from './componend/Tasks/Tasks'
import StudentTask from './componend/StudentTaks/StudentTask'
import Profile from './componend/Profile/Profile'
import Project from './componend/Project/Project'

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
      <Routes>
        <Route path='/' element={<Deshboard/>}/>
        <Route path='/student/auth' element={<StudentAuth/>}/>
        <Route path='/student/register' element={<StudentRegister/>}/>
        <Route path='/student/list' element={<StudentList/>}/>
        <Route path='/supervisor/auth' element={<SupervisorAuth/>}/>
        <Route path='/supervisor/register' element={<SupervisorRegister/>}/>
        <Route path='/security' element={<Sequrity/>}/>
        <Route path='/admin' element={<Admin/>}/>
        {/* <Route path='/approval' element={<Approval/>}/> */}
        <Route path='/supervisorList' element={<Supervisor/>}/>
        <Route path='/team' element={<Team/>}/>
        <Route path='/myteam' element={<MyTeam/>}/>
        <Route path='/tasks' element={<Tasks/>}/>
        <Route path='/studenttask' element={<StudentTask/>}/>
        <Route path='/profile' element={<Profile/>}/>
        <Route path='/project' element={<Project/>}/>
      </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
