import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import Records from './pages/Records';
import Users from './pages/Users';
import Profile from './pages/Profile';

const ProtectedRoute = ({ children, roles }) => {
  const { user, loading } = useAuth();
  if (loading) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="w-8 h-8 border-2 border-ink/20 border-t-ink rounded-full animate-spin" />
    </div>
  );
  if (!user) return <Navigate to="/login" />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/" />;
  return children;
};

function App() {
  return (
    <AuthProvider>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: '#f5f2ea',
            color: '#0f0e0b',
            border: '1px solid rgba(15,14,11,0.2)',
            borderRadius: '14px',
            boxShadow: '3px 3px 0px rgba(15,14,11,0.12)',
            fontWeight: '600',
            fontSize: '14px',
          },
          success: { iconTheme: { primary: '#2d6a4f', secondary: '#f5f2ea' } },
          error:   { iconTheme: { primary: '#b5291c', secondary: '#f5f2ea' } },
          loading: { iconTheme: { primary: '#0f0e0b', secondary: '#f5f2ea' } },
        }}
      />
      <div className="min-h-screen font-sans selection:bg-ink/10 selection:text-ink">
        <Navbar />
        <main className="max-w-6xl mx-auto px-4 pt-6 pb-16">
          <Routes>
            <Route path="/login"    element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/" element={
              <ProtectedRoute><Dashboard /></ProtectedRoute>
            } />
            <Route path="/records" element={
              <ProtectedRoute roles={['analyst', 'admin']}><Records /></ProtectedRoute>
            } />
            <Route path="/users" element={
              <ProtectedRoute roles={['admin']}><Users /></ProtectedRoute>
            } />
            <Route path="/profile" element={
              <ProtectedRoute><Profile /></ProtectedRoute>
            } />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>
      </div>
    </AuthProvider>
  );
}

export default App;
