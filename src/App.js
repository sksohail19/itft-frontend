import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

/* CONTEXT IMPORT */
import DataProvider from './context/DataContext';
import AuthProvider from './context/AuthContext';
import { useAuth } from './context/AuthContext';

/* ADMIN PAGES IMPORT */
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminEvents from './pages/admin/AdminEvents';
import AdminResults from './pages/admin/AdminResults';
import AdminTeam from './pages/admin/AdminTeam';
import AdminProfessors from './pages/admin/AdminProfessors';
import AdminAnnouncements from './pages/admin/AdminAnnouncements';
import AdminStudents from './pages/admin/AdminStudents';

/* LOGIN & Register PAGE IMPORT */
import Login from './pages/login';
import SignUp from './pages/signup';
import StudentRegister from './pages/StudentRegister';

/* PAGES IMPORT */
import PageNotFound from './pages/PageNotFound';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};



function App() {
  return (
    <AuthProvider>
      <DataProvider>
        <Router>
          <Routes>
            <Route path="/" element={<h1>Home Page</h1>} />
            <Route path="/about" element={<h1>About Page</h1>} />
            <Route path="login" element={<Login />} />
            
            <Route path="/editNote/:id" element={<h1>Edit Note</h1>} />
            <Route path="/contact" element={<h1>Contact Page</h1>} />
            <Route path="/signup" element={<SignUp />} />
            {/* Admin routes - all protected */}
            <Route path="/admin" element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            } />
            <Route path="/admin/events" element={
              <ProtectedRoute>
                <AdminEvents />
              </ProtectedRoute>
            } />
            <Route path="/admin/results" element={
              <ProtectedRoute>
                <AdminResults />
              </ProtectedRoute>
            } />
            <Route path="/admin/team" element={
              <ProtectedRoute>
                <AdminTeam />
              </ProtectedRoute>
            } />
            <Route path="/admin/professors" element={
              <ProtectedRoute>
                <AdminProfessors />
              </ProtectedRoute>
            } />
            <Route path="/admin/announcements" element={
              <ProtectedRoute>
                <AdminAnnouncements />
              </ProtectedRoute>
            } />

            <Route path="/admin/students" element={
              <ProtectedRoute>
                <AdminStudents />
              </ProtectedRoute>
            } />

            <Route path="/students/register" element={<StudentRegister />} />
            <Route path="*" element={<PageNotFound />} />
          </Routes>
        </Router>
      </DataProvider>
    </AuthProvider>
  );
}

export default App;
