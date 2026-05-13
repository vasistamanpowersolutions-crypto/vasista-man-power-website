import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import logo from '../assets/logo.jpeg';
import { LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import usePWA from '../hooks/usePWA';

const MobileNavbar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const { isInstallable, installApp } = usePWA();

  return (
    <div className="block md:hidden">
      {/* ==================================================
          MOBILE NAVBAR STYLES
          ================================================== */}
      <style>{`
        @media (max-width: 768px) {
          /* Hide global desktop navbar on mobile */
          nav:not(.mobile-nav-only) { display: none !important; }

          .mobile-navbar-container {
            width: 100% !important;
            height: 72px !important;
            display: flex !important;
            align-items: center !important;
            justify-content: space-between !important;
            padding-left: 18px !important;
            padding-right: 18px !important;
            background: #ffffff !important;
            border-bottom: 1px solid #EEF2F7 !important;
            position: sticky !important;
            top: 0 !important;
            z-index: 99999 !important;
            box-sizing: border-box !important;
          }

          .mobile-logo-img {
            width: 120px !important;
            height: auto !important;
            object-fit: contain !important;
          }

          .mobile-logout-btn {
            background: #ef4444 !important;
            color: white !important;
            padding: 8px 16px !important;
            border-radius: 8px !important;
            font-size: 14px !important;
            font-weight: 600 !important;
            display: flex !important;
            align-items: center !important;
            gap: 6px !important;
            border: none !important;
          }
          
          .mobile-get-started {
            background: #062B67 !important;
            color: white !important;
            padding: 8px 16px !important;
            border-radius: 8px !important;
            font-size: 14px !important;
            font-weight: 600 !important;
            text-decoration: none !important;
          }
        }
      `}</style>

      {/* NAVBAR */}
      <nav className="mobile-nav-only mobile-navbar-container">
        {/* Logo */}
        <Link to="/" className="flex items-center">
          <img src={logo} alt="Vasista Logo" className="mobile-logo-img" />
        </Link>

        {/* Action Button */}
        {user ? (
          <button onClick={logout} className="mobile-logout-btn">
            <LogOut size={16} /> Logout
          </button>
        ) : location.pathname === '/' ? (
          isInstallable ? (
            <button onClick={installApp} className="mobile-get-started">
              Install App
            </button>
          ) : (
            <Link to="/login" className="mobile-get-started">
              Get Started
            </Link>
          )
        ) : null}
      </nav>
    </div>
  );
};

export default MobileNavbar;
