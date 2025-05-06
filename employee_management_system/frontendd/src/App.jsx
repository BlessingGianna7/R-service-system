import { Route, Routes } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import Layout from "./components/layout/Layout";
import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";
import Dashboard from "./pages/dashboard/Dashboard";
import AddEmployeePage from "./pages/employee/AddEmployeePage";
import EditEmployeePage from "./pages/employee/EditEmployeePage";
import EmployeesPage from "./pages/employee/EmployeesPage";

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/employees" element={<EmployeesPage />} />
        <Route path="/employees/add" element={<AddEmployeePage />} />
        <Route path="/employees/edit/:id" element={<EditEmployeePage />} />
      </Route>
      <Route path="*" element={<Login />} />
    </Routes>
  );
}

export default App;
