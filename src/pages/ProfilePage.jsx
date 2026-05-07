import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  User, LogOut, Phone, Mail, MapPin, 
  Briefcase, GraduationCap, Calendar, 
  ShieldCheck, Heart, UserCheck
} from 'lucide-react';
import axios from 'axios';
import API_BASE_URL from '../config';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import '../css/ProfilePage.css';

const ProfilePage = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      const storedUser = localStorage.getItem('user');
      if (!storedUser) {
        navigate('/login');
        return;
      }

      const user = JSON.parse(storedUser);
      const uid = user.userId || user.id || user.externalIds?.[0];
      try {
        const response = await axios.get(`${API_BASE_URL}/collection/candidates`);
        const found = response.data.find(c => c.uid === uid);
        if (found) {
          setProfile(found);
        } else {
          navigate('/onboarding');
        }
      } catch (error) {
        toast.error('Failed to load profile');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1rem' }}>
      <div className="pulse-animation" style={{ width: '3rem', height: '3rem', borderRadius: '50%', background: 'var(--primary)' }}></div>
      <p style={{ fontWeight: 700, color: 'var(--primary)' }}>Loading Profile...</p>
    </div>
  );

  return (
    <div className="profile-page">
      <header className="profile-hero">
        <div className="profile-hero-inner">
          <motion.h1 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >Dashboard</motion.h1>
          <motion.button 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={handleLogout} 
            className="profile-logout-btn"
          >
            <LogOut size={18} /> Logout
          </motion.button>
        </div>
      </header>

      <main className="profile-main">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="profile-user-card"
        >
          <div className="profile-avatar-wrapper">
            {profile?.profileImageUrl ? (
              <img src={profile.profileImageUrl} alt="Profile" className="profile-avatar-img" />
            ) : (
              <User size={64} color="#cbd5e1" />
            )}
          </div>
          <h2 className="profile-user-name">
            {profile?.firstName} {profile?.lastName}
          </h2>
          <div className="profile-user-badge">
            <ShieldCheck size={16} className="profile-status-verified" />
            {profile?.status === 'active' ? 'Verified Candidate' : 'Verification Pending'}
          </div>
        </motion.div>

        <div className="profile-grid">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="profile-info-card"
          >
            <h3 className="profile-card-title"><UserCheck size={20} /> Contact Details</h3>
            <div className="profile-info-list">
              <div className="profile-info-item">
                <div className="profile-info-icon-box"><Phone size={18} /></div>
                <div className="profile-info-content">
                  <p className="profile-info-label">Mobile</p>
                  <p className="profile-info-value">{profile?.mobileNumber}</p>
                </div>
              </div>
              <div className="profile-info-item">
                <div className="profile-info-icon-box"><Mail size={18} /></div>
                <div className="profile-info-content">
                  <p className="profile-info-label">Email</p>
                  <p className="profile-info-value">{profile?.email || 'Not provided'}</p>
                </div>
              </div>
              <div className="profile-info-item">
                <div className="profile-info-icon-box"><MapPin size={18} /></div>
                <div className="profile-info-content">
                  <p className="profile-info-label">Location</p>
                  <p className="profile-info-value">{profile?.city}, {profile?.state}</p>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="profile-info-card"
          >
            <h3 className="profile-card-title"><Briefcase size={20} /> Professional</h3>
            <div className="profile-info-list">
              <div className="profile-info-item">
                <div className="profile-info-icon-box"><GraduationCap size={18} /></div>
                <div className="profile-info-content">
                  <p className="profile-info-label">Education</p>
                  <p className="profile-info-value">{profile?.qualification}</p>
                </div>
              </div>
              <div className="profile-info-item">
                <div className="profile-info-icon-box"><Briefcase size={18} /></div>
                <div className="profile-info-content">
                  <p className="profile-info-label">Experience</p>
                  <p className="profile-info-value">{profile?.experience}</p>
                </div>
              </div>
              <div className="profile-info-item">
                <div className="profile-info-icon-box"><Calendar size={18} /></div>
                <div className="profile-info-content">
                  <p className="profile-info-label">Member Since</p>
                  <p className="profile-info-value">{new Date(profile?.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="profile-info-card"
            style={{ gridColumn: 'span 2' }}
          >
            <h3 className="profile-card-title"><Heart size={20} /> Family Details</h3>
            <div className="profile-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginTop: '0.5rem' }}>
              <div>
                <p className="profile-info-label">Relation</p>
                <p className="profile-info-value">{profile?.guardianRelation}</p>
              </div>
              <div>
                <p className="profile-info-label">Guardian Name</p>
                <p className="profile-info-value">{profile?.guardianName}</p>
              </div>
              <div>
                <p className="profile-info-label">Contact</p>
                <p className="profile-info-value">{profile?.guardianMobile}</p>
              </div>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default ProfilePage;
