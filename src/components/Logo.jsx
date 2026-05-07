import React from 'react';
import logoImg from '../assets/logo-vasista.png';
import '../css/Logo.css';

const Logo = ({ className = "" }) => {
  return (
    <div className={`logo-container ${className}`}>
      <img 
        src={logoImg} 
        alt="Vasista Man Power Solution" 
        className="logo-image"
      />
    </div>
  );
};

export default Logo;
