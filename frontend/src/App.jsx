import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext';
import Login from './pages/Login';
import DashboardLayout from './pages/Dashboard';
import DashboardOverview from './pages/DashboardOverview';
import Trips from './pages/Trips';
import Vehicles from './pages/Vehicles';
import Drivers from './pages/Drivers';
import Finances from './pages/Finances';
import Customers from './pages/Customers';
import ExpenseLedger from './pages/ExpenseLedger';
import AiAssistant from './pages/AiAssistant';
import Maintenance from './pages/Maintenance';
import Billing from './pages/Billing';
import WeighmentSlip from './pages/WeighmentSlip';
import PaymentReceipt from './pages/PaymentReceipt';
import Inventory from './pages/Inventory';
import Reports from './pages/Reports';
import Settings from './pages/Settings';
import Archive from './pages/Archive';
import ActivityLog from './pages/ActivityLog';
import DriverPortalLayout from './pages/DriverPortalLayout';
import DriverHome from './pages/DriverHome';
import DriverTrips from './pages/DriverTrips';
import DriverTracking from './pages/DriverTracking';
import LandingPage from './pages/LandingPage';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-gray-50"><div className="w-8 h-8 border-4 border-brand-500 border-t-transparent rounded-full animate-spin"></div></div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // If admin tries to go to driver portal, send to dashboard.
    // If driver tries to go to dashboard, send to driver portal.
    return <Navigate to={user.role === 'DRIVER' ? '/driver-portal' : '/dashboard'} replace />;
  }

  return children;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute allowedRoles={['SUPER_ADMIN', 'ADMIN', 'STAFF']}>
                <DashboardLayout />
              </ProtectedRoute>
            } 
          >
            <Route index element={<DashboardOverview />} />
            <Route path="vehicles" element={<Vehicles />} />
            <Route path="customers" element={<Customers />} />
            <Route path="drivers" element={<Drivers />} />
            <Route path="inventory" element={<Inventory />} />
            <Route path="trips" element={<Trips />} />
            <Route path="finances" element={<Finances />} />
            <Route path="reports" element={<Reports />} />
            <Route path="billing" element={<Billing />} />
            <Route path="ledger" element={<ExpenseLedger />} />
            <Route path="maintenance" element={<Maintenance />} />
            <Route path="documents/slip" element={<WeighmentSlip />} />
            <Route path="documents/receipt" element={<PaymentReceipt />} />
            <Route path="ai" element={<AiAssistant />} />
            <Route path="settings" element={<Settings />} />
            <Route path="archive" element={<Archive />} />
            <Route path="activity" element={<ActivityLog />} />
          </Route>

          <Route 
            path="/driver-portal" 
            element={
              <ProtectedRoute allowedRoles={['DRIVER']}>
                <DriverPortalLayout />
              </ProtectedRoute>
            } 
          >
            <Route index element={<DriverHome />} />
            <Route path="trips" element={<DriverTrips />} />
          </Route>

          <Route path="/track/:tripId" element={<DriverTracking />} />

          <Route path="/" element={<LandingPage />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
