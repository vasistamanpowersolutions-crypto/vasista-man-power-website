import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Users, Briefcase } from 'lucide-react';
import Logo from '../components/Logo';
import '../css/LandingPage.css';

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="landing-page-container">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="landing-card"
      >
        <div className="landing-logo-wrapper">
          <Logo />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <h1 className="landing-title">
            Empowering Your Future
          </h1>
          <p className="landing-description">
            Connecting talented individuals with the right opportunities. Start your journey with Vasista Man Power today.
          </p>
        </div>

        <div style={{ paddingTop: '2rem' }}>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate('/login')}
            className="vasista-btn vasista-btn-primary landing-cta-btn"
          >
            Get Started <ArrowRight size={24} />
          </motion.button>
        </div>

        <div className="landing-features-grid">
          <div className="landing-feature-item">
            <Users className="landing-feature-icon" style={{ color: 'var(--secondary)' }} size={32} />
            <div className="landing-feature-text">For Candidates</div>
          </div>
          <div className="landing-feature-item">
            <Briefcase className="landing-feature-icon" style={{ color: 'var(--primary)' }} size={32} />
            <div className="landing-feature-text">For Businesses</div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default LandingPage;
