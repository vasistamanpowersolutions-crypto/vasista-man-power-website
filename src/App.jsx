import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import MobileNavbar from './components/MobileNavbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import OTP from './pages/OTP';
import Profile from './pages/Profile';
import CandidateOnboarding from './pages/CandidateOnboarding';
import BusinessOnboarding from './pages/BusinessOnboarding';
import { useAuth } from './context/AuthContext';
import UpdatePrompt from './components/UpdatePrompt';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (!user) return <Navigate to="/login" />;
  return children;
};

const AuthRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();
  
  if (loading) return null;
  
  // If user is logged in, redirect away from Home/Login
  // But allow them to stay on OTP if they are currently in the middle of a flow
  if (user && location.pathname !== '/otp') {
    return <Navigate to="/profile" />;
  }
  
  return children;
};

const AppContent = () => {
  const location = useLocation();
  const { user } = useAuth();
  
  // Hide Desktop Navbar/Footer on specific pages
  const hideLayout = ['/login', '/otp', '/profile', '/onboarding'].some(path => location.pathname.startsWith(path));

  return (
    <>
      <style>{`
        @media (max-width: 768px) {
          html, body {
            overflow-x: hidden !important;
            max-width: 100% !important;
            width: 100% !important;
          }
        }
      `}</style>

      <MobileNavbar />
      <Navbar />
      
      <main>
        <Routes>
          <Route path="/" element={
            <AuthRoute>
              <Home />
            </AuthRoute>
          } />
          <Route path="/login" element={
            <AuthRoute>
              <Login />
            </AuthRoute>
          } />
          <Route path="/otp" element={
            <AuthRoute>
              <OTP />
            </AuthRoute>
          } />
          
          <Route path="/profile" element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          } />
          
          <Route path="/onboarding/candidate" element={
            <ProtectedRoute>
              <CandidateOnboarding />
            </ProtectedRoute>
          } />
          <Route path="/onboarding/business" element={
            <ProtectedRoute>
              <BusinessOnboarding />
            </ProtectedRoute>
          } />
        </Routes>
      </main>

      <UpdatePrompt />
      {!hideLayout && !user && <Footer />}
    </>
  );
};

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
