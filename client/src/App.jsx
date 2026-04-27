import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import DashboardLayout from './layouts/DashboardLayout';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import EligibilityForm from './pages/EligibilityForm';
import EMICalculator from './pages/EMICalculator';
import Profile from './pages/Profile';
import Settings from './pages/Settings';

import { ThemeProvider } from './context/ThemeContext';
import { Toaster } from 'react-hot-toast';

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

function App() {
  return (
    <ThemeProvider>
      <Toaster position="top-right" />
      <BrowserRouter>
        <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        
        {/* Protected Routes (Dashboard Layout) */}
        <Route path="/" element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="eligibility" element={<EligibilityForm />} />
          <Route path="calculator" element={<EMICalculator />} />
          <Route path="profile" element={<Profile />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
