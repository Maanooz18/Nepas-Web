import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { Calculator, BookOpen, ArrowRightLeft } from "lucide-react";
// import {logo} from '../assets/Nepas-logo.png'
export default function SideBar({
  collapsed,
  setCollapsed,
  mobileOpen,
  setMobileOpen,
}) {
  // const [collapsed, setCollapsed] = useState(false);
  // const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  // close sidebar on route change (mobile)
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  return (
    <>
      <style>{css}</style>

      {/* MOBILE OVERLAY */}
      {mobileOpen && (
        <div className="overlay" onClick={() => setMobileOpen(false)} />
      )}

      {/* MOBILE TOP BAR */}
      <div className="mobile-bar">
        <button onClick={() => setMobileOpen(true)}>☰</button>
        <img src="/Nepas-logo.png" alt="logo" className="mobile-logo" />
      </div>

      <div
        className={`sidebar 
        ${collapsed ? "collapsed" : ""} 
        ${mobileOpen ? "open" : ""}`}
      >
        {/* HEADER */}
        <div className="sidebar-header">
          {!collapsed && <span className="logo-text">NEPAS</span>}

          <button
            className="toggle-btn"
            onClick={() => setCollapsed(!collapsed)}
          >
            <ArrowRightLeft size={18} />
          </button>
        </div>

        {/* LOGO */}
        <div className="logo-container">
          <img src="/Nepas-logo.png" alt="NEPAS Logo" className="logo" />
        </div>

        {/* NAV */}
        <nav className="nav-links">
          <Link
            to="/calculators"
            className={location.pathname === "/calculators" ? "active" : ""}
          >
            {collapsed ? <Calculator size={22} /> : "Calculators"}
          </Link>

          <Link
            to="/guidelines"
            className={location.pathname === "/guidelines" ? "active" : ""}
          >
            {collapsed ? <BookOpen size={22} /> : "Guidelines"}
          </Link>
          <Link
            to="/Audio"
            className={location.pathname === "/Audio" ? "active" : ""}
          >
            {collapsed ? <BookOpen size={22} /> : "Audio"}
          </Link>
        </nav>
      </div>
    </>
  );
}

const css = `
.sidebar {
  width: 220px;
  height: 100vh;
  background: #EDC7C6;
  position: fixed;
  top: 0;
  left: 0;
  padding: 15px;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  z-index: 1001;
}

/* COLLAPSED (desktop only) */
.sidebar.collapsed {
  width: 70px;
}

/* HEADER */
.sidebar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

/* TOGGLE */
.toggle-btn {
  border: none;
  background: rgba(255,255,255,0.3);
  padding: 6px 10px;
  border-radius: 6px;
  cursor: pointer;
}

/* LOGO */
/* LOGO CONTAINER */
.logo-container {
  display: flex;
  // justify-content: center; 
  align-items: center;
  margin: 20px 0;
}

/* LOGO */
.logo {
  width: 45px;
  height: 45px;
  object-fit: contain;
}

/* MOBILE LOGO */
.mobile-logo {
  height: 32px;
  object-fit: contain;
}

/* NAV */
.nav-links {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.nav-links a {
  text-decoration: none;
  color: #333;
  padding: 10px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  gap: 10px;
  transition: 0.2s;
}

.nav-links a:hover {
  background: rgba(0,0,0,0.1);
}

.nav-links a.active {
  background: rgba(0,0,0,0.2);
}

/* MOBILE BAR */
.mobile-bar {
  display: none;
  height: 50px;
  background: #EDC7C6;
  align-items: center;
  justify-content: space-between;
  padding: 0 15px;
  position: fixed;
  width: 100%;
  top: 0;
  z-index: 1002;
}

.mobile-bar button {
  border: none;
  background: none;
  font-size: 20px;
}

/* OVERLAY */
.overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0,0,0,0.4);
  z-index: 1000;
}

/* TABLET & MOBILE */
@media (max-width: 768px) {
  .sidebar {
    transform: translateX(-100%);
    width: 250px;
  }

  .sidebar.open {
    transform: translateX(0);
  }

  .mobile-bar {
    display: flex;
  }
}`;
