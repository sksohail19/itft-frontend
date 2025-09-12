import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { 
  Calendar, 
  LayoutDashboard, 
  Trophy, 
  Users, 
  UserCog, 
  BellRing,
  List,
  X,
  LogOut
} from "lucide-react";

const AdminLayout = ({ children }) => {
  const { logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const navItems = [
    { name: "Dashboard", path: "/admin", icon: <LayoutDashboard size={18} /> },
    { name: "Events", path: "/admin/events", icon: <Calendar size={18} /> },
    { name: "Results", path: "/admin/results", icon: <Trophy size={18} /> },
    { name: "Team", path: "/admin/team", icon: <Users size={18} /> },
    { name: "Professors", path: "/admin/professors", icon: <UserCog size={18} /> },
    { name: "Announcements", path: "/admin/announcements", icon: <BellRing size={18} /> },
    { name: "Students", path: "/admin/students", icon: <Users size={18} /> },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <div className="d-flex min-vh-100 bg-light">
      {/* Sidebar for desktop */}
      <aside className="d-none d-md-flex flex-column flex-shrink-0 bg-white border-end vh-100 position-sticky top-0" style={{ width: "250px" }}>
        <div className="p-3 border-bottom">
          <Link to="/" className="d-flex align-items-center text-decoration-none">
            <span className="fw-bold text-primary fs-5">ITFT</span>
            <span className="ms-2 text-muted small">Admin</span>
          </Link>
        </div>

        <nav className="flex-grow-1 overflow-auto p-2">
          <ul className="nav flex-column">
            {navItems.map((item) => (
              <li className="nav-item" key={item.path}>
                <Link
                  to={item.path}
                  className={`nav-link d-flex align-items-center gap-2 px-3 py-2 rounded ${
                    isActive(item.path)
                      ? "active bg-primary text-white"
                      : "text-secondary"
                  }`}
                >
                  {item.icon}
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="p-3 border-top">
          <button
            className="btn btn-outline-danger w-100 d-flex align-items-center gap-2"
            onClick={handleLogout}
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </aside>

      {/* Mobile header */}
      <div className="d-md-none fixed-top bg-white border-bottom shadow-sm">
        <div className="d-flex justify-content-between align-items-center px-3 py-2">
          <Link to="/" className="d-flex align-items-center text-decoration-none">
            <span className="fw-bold text-primary fs-5">ITFT</span>
            <span className="ms-2 text-muted small">Admin</span>
          </Link>
          <button
            className="btn btn-light"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={22} /> : <List size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="d-md-none position-fixed top-0 start-0 w-100 h-100 bg-white z-3 overflow-auto mt-5">
          <nav className="p-3">
            <ul className="nav flex-column">
              {navItems.map((item) => (
                <li className="nav-item" key={item.path}>
                  <Link
                    to={item.path}
                    className={`nav-link d-flex align-items-center gap-2 px-3 py-2 rounded ${
                      isActive(item.path)
                        ? "active bg-primary text-white"
                        : "text-secondary"
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {item.icon}
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="mt-3">
              <button
                className="btn btn-outline-danger w-100 d-flex align-items-center gap-2"
                onClick={handleLogout}
              >
                <LogOut size={16} />
                Logout
              </button>
            </div>
          </nav>
        </div>
      )}

      {/* Main content */}
      <div className="flex-grow-1 d-flex flex-column">
        <main className="flex-grow-1 p-3 p-md-4 pt-5 pt-md-3">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
