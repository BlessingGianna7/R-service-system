import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/Signup';
import AddEmployee from './pages/AddEmployee';
import EmployeeList from './pages/EmployeeList';
import EditEmployee from './pages/EditEmployee';  

function App() {
  const isAuthenticated = !!localStorage.getItem('token');

  console.log("User is authenticated:", isAuthenticated);

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<Signup />} />
      <Route
        path="/add-employee"
        element={isAuthenticated ? <AddEmployee /> : <Navigate to="/" />}
      />
      <Route
        path="/employee-list"
        element={isAuthenticated ? <EmployeeList /> : <Navigate to="/" />}
      />
      <Route
        path="/edit-employee/:id"
        element={isAuthenticated ? <EditEmployee /> : <Navigate to="/" />} 
      />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default App;
