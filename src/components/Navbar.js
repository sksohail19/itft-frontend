import { Link, NavLink } from "react-router-dom";

const Navbar = () => {
    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-primary shadow-sm">
            <div className="container">
                {/* Brand */}
                <Link className="navbar-brand fw-bold" to="/">
                    ITFT
                </Link>

                {/* Toggler for mobile */}
                <button
                    className="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarNav"
                    aria-controls="navbarNav"
                    aria-expanded="false"
                    aria-label="Toggle navigation"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>

                {/* Menu */}
                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                        <li className="nav-item">
                            <NavLink to="/events" className="nav-link">
                                Events
                            </NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink to="/results" className="nav-link">
                                Results
                            </NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink to="/team" className="nav-link">
                                Teams
                            </NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink to="/announcements" className="nav-link">
                                Announcements
                            </NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink to="/contact" className="nav-link">
                                Contact
                            </NavLink>
                        </li>
                    </ul>

                    {/* Admin Login on right */}
                    <ul className="navbar-nav">
                        <li className="nav-item">
                            <NavLink to="/admin" className="nav-link">
                                Admin Login
                            </NavLink>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
