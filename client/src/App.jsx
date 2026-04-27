import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import DashboardLayout from './layouts/DashboardLayout';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import EligibilityForm from './pages/EligibilityForm';
import EMICalculator from './pages/EMICalculator';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import Marketplace from './pages/Marketplace';

import { ThemeProvider } from './context/ThemeContext';
import { NotificationProvider } from './context/NotificationContext';
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
      <NotificationProvider>
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: '#0d1220',
              color: '#e2e8f0',
              border: '1px solid rgba(99,102,241,0.25)',
              borderRadius: '12px',
              fontSize: '13px',
              boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
            },
            success: { iconTheme: { primary: '#34d399', secondary: '#0d1220' } },
            error: { iconTheme: { primary: '#fb7185', secondary: '#0d1220' } },
          }}
          containerStyle={{ top: 20, right: 20 }}
        />
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
            <Route path="marketplace" element={<Marketplace />} />
            <Route path="eligibility" element={<EligibilityForm />} />
            <Route path="calculator" element={<EMICalculator />} />
            <Route path="profile" element={<Profile />} />
            <Route path="settings" element={<Settings />} />
          </Route>
        </Routes>
        </BrowserRouter>
      </NotificationProvider>
    </ThemeProvider>
  );
}

export default App;
