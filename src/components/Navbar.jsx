import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import logo from '../assets/logo.jpeg';
import { useAuth } from '../context/AuthContext';
import usePWA from '../hooks/usePWA';

const Navbar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const { isInstallable, installApp } = usePWA();

  return (
    <header className="hidden lg:flex navbar-container">
      {/* ... styles omitted for brevity, but I should keep them ... */}
      <style>{`
        @media (min-width: 1024px) {
          .navbar-container {
            height: 88px !important;
            width: 100% !important;
            display: flex !important;
            align-items: center !important;
            justify-content: space-between !important;
            padding-left: 48px !important;
            padding-right: 48px !important;
            background: #ffffff !important;
            position: sticky !important;
            top: 0 !important;
            z-index: 9999 !important;
            border-bottom: 1px solid rgba(0,0,0,0.04) !important;
            box-sizing: border-box !important;
          }

          .desktop-logo-link {
            display: flex !important;
            align-items: center !important;
            flex-shrink: 0 !important;
            text-decoration: none !important;
          }

          .desktop-logo-img {
            max-width: 240px !important;
            height: auto !important;
            object-fit: contain !important;
          }

          .desktop-cta-button {
            height: 56px !important;
            padding: 0 34px !important;
            border-radius: 999px !important;
            background: #062B67 !important;
            color: #ffffff !important;
            font-size: 18px !important;
            font-weight: 600 !important;
            box-shadow: 0 8px 18px rgba(6,43,103,0.18) !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            text-decoration: none !important;
            border: none !important;
            cursor: pointer !important;
            transition: all 0.2s ease !important;
            white-space: nowrap !important;
          }

          .desktop-cta-button:hover {
            transform: translateY(-2px) !important;
            box-shadow: 0 10px 22px rgba(6,43,103,0.25) !important;
            background: #083a8a !important;
          }
          
          .logout-btn {
            background: #ef4444 !important;
          }
          .logout-btn:hover {
             background: #dc2626 !important;
          }
        }
      `}</style>

      {/* Logo Section */}
      <Link to="/" className="desktop-logo-link">
        <img src={logo} alt="Vasista Logo" className="desktop-logo-img" />
      </Link>

      {/* Action Section */}
      {user ? (
        <button onClick={logout} className="desktop-cta-button logout-btn">
          Logout
        </button>
      ) : location.pathname === '/' ? (
        isInstallable ? (
          <button onClick={installApp} className="desktop-cta-button">
            Install App
          </button>
        ) : (
          <Link to="/login" className="desktop-cta-button">
            Get Started
          </Link>
        )
      ) : null}
    </header>
  );
};

export default Navbar;
