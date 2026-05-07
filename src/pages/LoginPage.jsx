import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Phone, Lock, CheckCircle2, ChevronLeft } from 'lucide-react';
import axios from 'axios';
import API_BASE_URL from '../config';
import Logo from '../components/Logo';
import { toast } from 'react-toastify';
import '../css/LoginPage.css';

const LoginPage = () => {
  const [role, setRole] = useState('candidate'); // 'candidate' or 'business'
  const [step, setStep] = useState(1); // 1: Phone, 2: OTP
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSendOTP = async (e) => {
    e.preventDefault();
    if (!phoneNumber || phoneNumber.length < 10) {
      toast.error('Please enter a valid phone number');
      return;
    }

    setLoading(true);
    try {
      const sanitizedPhone = phoneNumber.replace(/\s/g, '');
      const formattedPhone = sanitizedPhone.startsWith('+') ? sanitizedPhone : `+91${sanitizedPhone}`;
      const response = await axios.post(`${API_BASE_URL}/auth/login/mobile/send`, {
        phoneNumber: formattedPhone
      });
      
      if (response.data.success) {
        setStep(2);
        toast.success('OTP sent successfully!');
      }
    } catch (error) {
      toast.error(error.response?.data?.error?.message || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    if (!otp || otp.trim().length < 4) {
      toast.error('Please enter a valid OTP');
      return;
    }

    setLoading(true);
    try {
      const sanitizedPhone = phoneNumber.replace(/\s/g, '');
      const trimmedOtp = otp.trim();
      const formattedPhone = sanitizedPhone.startsWith('+') ? sanitizedPhone : `+91${sanitizedPhone}`;
      const response = await axios.post(`${API_BASE_URL}/auth/login/mobile/verify`, {
        phoneNumber: formattedPhone,
        otp: trimmedOtp
      });

      if (response.data.success) {
        let { authInfo } = response.data;
        console.log('Full AuthInfo received:', authInfo);
        
        // Handle wrapped data structure
        if (authInfo?.data) {
          authInfo = authInfo.data;
        }

        // Handle different possible structures for sessionToken
        const sessionToken = authInfo?.sessionToken?.jwt || authInfo?.sessionToken || authInfo?.jwt;
        
        // Handle different possible structures for user
        const user = authInfo?.user || authInfo?.me || authInfo;

        if (!user || (!user.userId && !user.id && !user.externalIds)) {
          console.error('User object missing or incomplete in authInfo:', authInfo);
          throw new Error('Authentication succeeded but user data is incomplete');
        }

        localStorage.setItem('token', sessionToken);
        localStorage.setItem('user', JSON.stringify(user));
        localStorage.setItem('role', role);

        try {
          const uid = user.userId || user.id || user.externalIds?.[0];
          if (!uid) throw new Error('User UID not found in profile data');

          console.log('Fetching candidates for UID:', uid);
          const response = await axios.get(`${API_BASE_URL}/collection/candidates`);
          const existingUser = response.data.find(c => c.uid === uid);
          
          if (existingUser) {
            console.log('Existing user found:', existingUser);
            navigate('/profile');
          } else {
            console.log('New user detected, creating profile...');
            const candidateData = {
              uid: uid,
              phoneNumber: formattedPhone,
              email: user.email || '',
              role: 'candidate',
              status: 'onboarding'
            };
            await axios.post(`${API_BASE_URL}/collection/candidates`, candidateData);
            navigate('/onboarding');
          }
        } catch (error) {
          console.error('Profile Management Error:', error);
          toast.error(`Auth success but profile sync failed: ${error.message}`);
        }
      }
    } catch (error) {
      console.error('OTP Verify Error:', error);
      toast.error(error.response?.data?.error?.message || 'Invalid OTP');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page-container">
      <div className="login-header">
        <button onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6b7280' }}>
          <ChevronLeft size={24} />
        </button>
        <div style={{ height: '40px' }}>
          <Logo />
        </div>
        <div style={{ width: '40px' }}></div>
      </div>

      <div className="login-content">
        <div className="login-welcome-section">
          <h2 className="login-welcome-title">Welcome Back</h2>
          <p className="login-welcome-subtitle">Login to access your account</p>
        </div>

        <div className="login-role-toggle">
          <button
            onClick={() => setRole('candidate')}
            className={`login-role-btn ${role === 'candidate' ? 'login-role-btn-active' : 'login-role-btn-inactive'}`}
          >
            Candidate
          </button>
          <button
            onClick={() => setRole('business')}
            className={`login-role-btn ${role === 'business' ? 'login-role-btn-active' : 'login-role-btn-inactive'}`}
          >
            Business Owner
          </button>
        </div>

        <AnimatePresence mode="wait">
          {step === 1 ? (
            <motion.form
              key="phone-step"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              onSubmit={handleSendOTP}
              style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}
            >
              <div className="login-form-group">
                <label className="login-label">Mobile Number</label>
                <div className="login-input-wrapper">
                  <Phone className="login-input-icon" size={20} />
                  <input
                    type="tel"
                    placeholder="Enter 10 digit mobile number"
                    className="vasista-input login-input"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="vasista-btn vasista-btn-primary login-submit-btn"
                style={{ opacity: loading ? 0.7 : 1 }}
              >
                {loading ? 'Sending...' : 'Send OTP'}
              </button>
            </motion.form>
          ) : (
            <motion.form
              key="otp-step"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              onSubmit={handleVerifyOTP}
              style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}
            >
              <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '3rem', height: '3rem', backgroundColor: '#f0fdf4', color: '#16a34a', borderRadius: '9999px', marginBottom: '0.5rem' }}>
                  <CheckCircle2 size={24} />
                </div>
                <p style={{ color: '#4b5563' }}>
                  OTP sent to <span style={{ fontWeight: 'bold', color: 'var(--primary)' }}>{phoneNumber}</span>
                </p>
                <button 
                  type="button" 
                  onClick={() => setStep(1)}
                  style={{ fontSize: '0.875rem', color: 'var(--secondary)', fontWeight: '600', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}
                >
                  Change Number
                </button>
              </div>

              <div className="login-form-group">
                <label className="login-label" style={{ textAlign: 'center' }}>Enter OTP</label>
                <div className="login-input-wrapper">
                  <Lock className="login-input-icon" size={20} />
                  <input
                    type="text"
                    placeholder="Enter 6-digit OTP"
                    className="vasista-input login-input login-otp-input"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    maxLength={6}
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="vasista-btn vasista-btn-primary login-submit-btn"
                style={{ opacity: loading ? 0.7 : 1 }}
              >
                {loading ? 'Verifying...' : 'Verify & Login'}
              </button>
              
              <p style={{ textAlign: 'center', fontSize: '0.875rem', color: '#6b7280' }}>
                Didn't receive OTP? <button type="button" onClick={handleSendOTP} style={{ color: 'var(--secondary)', fontWeight: '600', background: 'none', border: 'none', cursor: 'pointer' }}>Resend</button>
              </p>
            </motion.form>
          )}
        </AnimatePresence>

        <div className="login-footer">
          <p className="login-footer-text">
            By logging in, you agree to our <br />
            <a href="#" className="login-link">Terms of Service</a> and <a href="#" className="login-link">Privacy Policy</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
