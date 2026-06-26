import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { LanguageProvider } from './context/LanguageContext';
import { NotificationProvider } from './context/NotificationContext';

// Common Components
import Navbar from './components/Navbar/Navbar';
import Footer from './components/Footer/Footer';
import AIAssistant from './components/AI/AIAssistant';
import NotificationToast from './components/Common/NotificationToast';
import OnboardingTour from './components/Onboarding/OnboardingTour';

// Error Pages
import { Error401, Error403, Error404, Error500, OfflinePage } from './pages/ErrorPages';

// Lazy Load Pages
const Home = lazy(() => import('./pages/Home'));
const Destinations = lazy(() => import('./pages/Destinations'));
const DestinationDetails = lazy(() => import('./pages/DestinationDetails'));
const Hotels = lazy(() => import('./pages/Hotels'));
const Food = lazy(() => import('./pages/Food'));
const Planner = lazy(() => import('./pages/Planner'));
const Gallery = lazy(() => import('./pages/Gallery'));
const Contact = lazy(() => import('./pages/Contact'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const Utilities = lazy(() => import('./pages/Utilities'));

// Protected Route Wrapper for Tourist
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="flex-center" style={{ height: '100vh', color: 'var(--color-mustard)' }}>Loading Tourist Profile...</div>;
  if (!user) return <Navigate to="/login" replace />;
  return children;
};

// Protected Route Wrapper for Admins
const AdminRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="flex-center" style={{ height: '100vh', color: 'var(--color-mustard)' }}>Loading Admin Panel...</div>;
  if (!user || (user.role !== 'Super Admin' && user.role !== 'Admin')) {
    return <Navigate to="/403" replace />; // Redirect forbidden to 403 screen
  }
  return children;
};

const LoadingSpinner = () => (
  <div className="flex-center" style={{ height: '80vh', flexDirection: 'column', gap: '16px' }}>
    <div style={{
      width: '40px',
      height: '40px',
      border: '4px solid var(--border-color)',
      borderTop: '4px solid var(--color-mustard)',
      borderRadius: '50%',
      animation: 'spin 1s linear infinite'
    }} />
    <span style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', fontWeight: '600', letterSpacing: '1px' }}>
      LOADING PUNJAB TOUR...
    </span>
  </div>
);

function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <NotificationProvider>
          <AuthProvider>
            <Router>
              <div className="app-layout">
                <Navbar />
                <main id="main-content" className="main-content" style={{ minHeight: '80vh' }} tabIndex="-1">
                  <Suspense fallback={<LoadingSpinner />}>
                    <Routes>
                      {/* Public Routes */}
                      <Route path="/" element={<Home />} />
                      <Route path="/destinations" element={<Destinations />} />
                      <Route path="/destinations/:id" element={<DestinationDetails />} />
                      <Route path="/hotels" element={<Hotels />} />
                      <Route path="/food" element={<Food />} />
                      <Route path="/planner" element={<Planner />} />
                      <Route path="/gallery" element={<Gallery />} />
                      <Route path="/contact" element={<Contact />} />
                      <Route path="/login" element={<Login />} />
                      <Route path="/register" element={<Register />} />
                      <Route path="/utilities" element={<Utilities />} />

                      {/* Specific Error Routes */}
                      <Route path="/401" element={<Error401 />} />
                      <Route path="/403" element={<Error403 />} />
                      <Route path="/500" element={<Error500 />} />
                      <Route path="/offline" element={<OfflinePage />} />

                      {/* Protected Routes */}
                      <Route 
                        path="/dashboard" 
                        element={
                          <ProtectedRoute>
                            <Dashboard />
                          </ProtectedRoute>
                        } 
                      />
                      <Route 
                        path="/admin" 
                        element={
                          <AdminRoute>
                            <AdminDashboard />
                          </AdminRoute>
                        } 
                      />

                      {/* Fallback to 404 */}
                      <Route path="*" element={<Error404 />} />
                    </Routes>
                  </Suspense>
                </main>
                <Footer />
                <AIAssistant />
                <NotificationToast />
                <OnboardingTour />
              </div>
            </Router>
          </AuthProvider>
        </NotificationProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}

export default App;
