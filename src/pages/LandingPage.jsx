import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Users, Briefcase, ShieldCheck, Headphones, 
  ChevronRight, Play, LayoutDashboard, 
  TrendingUp, Activity, UserPlus, Building2
} from 'lucide-react';
import Logo from '../components/Logo';
import heroImg from '../assets/hero-image.png';
import '../css/LandingPage.css';

const LandingPage = () => {
  const navigate = useNavigate();

  const stats = [
    { icon: Users, count: '10,000+', label: 'Active Candidates' },
    { icon: Building2, count: '500+', label: 'Trusted Companies' },
    { icon: ShieldCheck, count: '95%', label: 'Placement Success' },
    { icon: Headphones, count: '24/7', label: 'Customer Support' }
  ];

  const features = [
    { 
      title: 'Direct Hiring', 
      desc: 'Connect directly with verified and skilled candidates.', 
      icon: Briefcase,
      color: '#E8771A'
    },
    { 
      title: 'Verified Profiles', 
      desc: 'All candidates are background checked and verified.', 
      icon: Users,
      color: '#002D5B'
    },
    { 
      title: 'Secure Platform', 
      desc: 'Your data security and privacy is our top priority.', 
      icon: ShieldCheck,
      color: '#E8771A'
    }
  ];

  return (
    <div className="landing-page">
      <nav className="navbar">
        <Logo className="h-12" />
        <div className="nav-links">
          <a href="#" className="nav-link active">Home</a>
          <a href="#" className="nav-link">Jobs</a>
          <a href="#" className="nav-link">Candidates</a>
          <a href="#" className="nav-link">Clients</a>
          <a href="#" className="nav-link">About Us</a>
          <a href="#" className="nav-link">Contact</a>
        </div>
        <div className="nav-auth">
          <button onClick={() => navigate('/login')} className="nav-login-btn">
            <UserPlus size={18} /> Login
          </button>
          <button onClick={() => navigate('/login')} className="nav-get-started">
            Get Started <ChevronRight size={18} />
          </button>
        </div>
      </nav>

      <section className="hero-section">
        <motion.div 
          className="hero-content"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="welcome-badge">
            <Users size={14} /> Welcome to Vasista
          </div>
          <h1 className="hero-title">
            Find Your Next <br/>Professional <span>Opportunity</span>
          </h1>
          <p className="hero-subtitle">
            Connecting top talent with the best business owners across India. The right people. Right skills. Right solution.
          </p>
          <div className="hero-btns">
            <button onClick={() => navigate('/login')} className="vasista-btn vasista-btn-secondary hero-btn-main">
              Get Started Now <ChevronRight size={20} />
            </button>
            <button className="vasista-btn btn-learn-more">
              Learn More <Play size={18} fill="currentColor" />
            </button>
          </div>
          <div className="candidate-social">
            <div className="avatar-group">
              {[1,2,3,4].map(i => (
                <div key={i} className="avatar"></div>
              ))}
              <div className="avatar avatar-count">10K+</div>
            </div>
            <div className="social-text">
              <strong>10,000+</strong> Happy Candidates
            </div>
          </div>
        </motion.div>

        <motion.div 
          className="hero-visual"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
        >
          <div className="hero-main-img-wrapper">
            <div className="hero-bg-circle"></div>
            <img src={heroImg} alt="Professionals" className="hero-main-img" />
            
            <motion.div 
              className="dashboard-card glass-card"
              animate={{ y: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 4 }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <span style={{ fontWeight: 700, fontSize: '0.875rem' }}>Dashboard Overview</span>
                <div style={{ fontSize: '0.625rem', padding: '2px 8px', background: '#f1f5f9', borderRadius: '4px' }}>This Month</div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <p style={{ fontSize: '0.625rem', color: '#64748b' }}>Total Candidates</p>
                  <p style={{ fontWeight: 800, fontSize: '1.125rem' }}>12,458 <span style={{ color: '#10B981', fontSize: '0.625rem' }}>↑ 12.5%</span></p>
                </div>
                <div>
                  <p style={{ fontSize: '0.625rem', color: '#64748b' }}>Active Assignments</p>
                  <p style={{ fontWeight: 800, fontSize: '1.125rem' }}>856 <span style={{ color: '#10B981', fontSize: '0.625rem' }}>↑ 15.2%</span></p>
                </div>
              </div>
              <div style={{ marginTop: '1rem', borderTop: '1px solid #f1f5f9', paddingTop: '1rem' }}>
                <p style={{ fontSize: '0.75rem', fontWeight: 700, marginBottom: '0.5rem' }}>Recent Activity</p>
                <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <div style={{ width: '1.5rem', height: '1.5rem', borderRadius: '4px', background: 'rgba(0,45,91,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><UserPlus size={10} color="var(--primary)" /></div>
                  <div style={{ fontSize: '0.625rem' }}>New candidate John Doe added successfully. <span style={{ color: '#94a3b8' }}>10 mins ago</span></div>
                </div>
              </div>
            </motion.div>

            <motion.div 
              className="trusted-badge"
              initial={{ x: 20 }}
              animate={{ x: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Building2 size={24} />
              <div>
                <p style={{ fontSize: '0.875rem', fontWeight: 700 }}>Trusted by 500+</p>
                <p style={{ fontSize: '0.625rem', opacity: 0.8 }}>Leading Companies</p>
              </div>
            </motion.div>
          </div>
        </motion.div>Section
      </section>

      <section className="stats-bar">
        {stats.map((s, i) => (
          <div key={i} className="stat-item">
            <div className="stat-icon">
              <s.icon size={28} />
            </div>
            <div className="stat-info">
              <h3>{s.count}</h3>
              <p>{s.label}</p>
            </div>
          </div>
        ))}
      </section>

      <section className="features-section">
        <h2 className="section-title">Why Choose <span>Vasista?</span></h2>
        <div className="features-grid">
          {features.map((f, i) => (
            <div key={i} className="feature-card">
              <div className="feature-icon" style={{ backgroundColor: f.color }}>
                <f.icon size={24} />
              </div>
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="trusted-logos">
        <p>Trusted by Leading Companies</p>
        <div className="logos-strip">
          {/* Using text representations or common icons for logos since we don't have all assets */}
          <span style={{ fontWeight: 800, fontSize: '1.5rem', color: '#94a3b8' }}>TATA</span>
          <span style={{ fontWeight: 800, fontSize: '1.5rem', color: '#94a3b8' }}>Reliance</span>
          <span style={{ fontWeight: 800, fontSize: '1.5rem', color: '#94a3b8' }}>adani</span>
          <span style={{ fontWeight: 800, fontSize: '1.5rem', color: '#94a3b8' }}>Infosys</span>
          <span style={{ fontWeight: 800, fontSize: '1.5rem', color: '#94a3b8' }}>wipro</span>
          <span style={{ fontWeight: 800, fontSize: '1.5rem', color: '#94a3b8' }}>HDFC BANK</span>
        </div>
      </section>

      <footer className="main-footer">
        &copy; {new Date().getFullYear()} Vasista Man Power Solution. All rights reserved.
      </footer>
    </div>
  );
};

export default LandingPage;
