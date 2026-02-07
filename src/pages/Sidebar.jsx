import { Link, useLocation } from "react-router-dom";
import "../css/Theme.css";

function Sidebar() {
  const location = useLocation();

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <Link to="/" className="sidebar-logo">
          MovieClub.
        </Link>
      </div>
      <nav className="sidebar-nav">
        <Link 
          to="/" 
          className={`nav-item ${location.pathname === "/" ? "active" : ""}`}
        >
          <span>🏠</span> Home
        </Link>
        <Link 
          to="/favorites" 
          className={`nav-item ${location.pathname === "/favorites" ? "active" : ""}`}
        >
          <span>❤️</span> Favorites
        </Link>
      </nav>
    </div>
  );
}

export default Sidebar;