import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, LogOut, Phone, Mail, MapPin, Briefcase, GraduationCap } from 'lucide-react';
import axios from 'axios';
import API_BASE_URL from '../config';
import { toast } from 'react-toastify';
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
      const uid = user.userId || user.externalIds[0];
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

  if (loading) return <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Loading...</div>;

  return (
    <div className="profile-page">
      <div className="profile-header">
        <div className="profile-header-inner">
          <h1 className="profile-title">My Profile</h1>
          <button onClick={handleLogout} className="profile-logout-btn">
            <LogOut size={20} />
          </button>
        </div>
      </div>

      <div className="profile-main">
        <div className="profile-cards-container">
          <div className="profile-user-card">
            <div className="profile-avatar-wrapper">
              {profile?.profileImageUrl ? (
                <img src={profile.profileImageUrl} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <User size={64} style={{ color: '#9ca3af', marginTop: '1rem' }} />
              )}
            </div>
            <h2 className="profile-user-name">
              {profile?.firstName} {profile?.lastName}
            </h2>
            <p className="profile-user-meta">{profile?.qualification} | {profile?.experience}</p>
          </div>

          <div className="profile-info-card">
            <div className="profile-card-header">
              Contact Information
            </div>
            <div className="profile-card-content">
              <div className="profile-info-item">
                <Phone className="profile-info-icon" size={20} />
                <div>
                  <div className="profile-info-label">Phone</div>
                  <div className="profile-info-value">{profile?.mobileNumber}</div>
                </div>
              </div>
              <div className="profile-info-item">
                <Mail className="profile-info-icon" size={20} />
                <div>
                  <div className="profile-info-label">Email</div>
                  <div className="profile-info-value">{profile?.email || 'Not provided'}</div>
                </div>
              </div>
              <div className="profile-info-item">
                <MapPin className="profile-info-icon" size={20} />
                <div>
                  <div className="profile-info-label">Location</div>
                  <div className="profile-info-value">{profile?.city}, {profile?.state}</div>
                </div>
              </div>
            </div>
          </div>

          <div className="profile-info-card">
            <div className="profile-card-header">
              Professional details
            </div>
            <div className="profile-card-content">
              <div className="profile-info-item">
                <GraduationCap className="profile-info-icon" size={20} />
                <div>
                  <div className="profile-info-label">Qualification</div>
                  <div className="profile-info-value">{profile?.qualification}</div>
                </div>
              </div>
              <div className="profile-info-item">
                <Briefcase className="profile-info-icon" size={20} />
                <div>
                  <div className="profile-info-label">Experience</div>
                  <div className="profile-info-value">{profile?.experience}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
