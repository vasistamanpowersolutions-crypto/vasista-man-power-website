import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Phone, ArrowLeft, ShieldCheck, ChevronRight, MessageSquare } from 'lucide-react';
import axios from 'axios';
import API_BASE_URL from '../config';
import { toast } from 'react-toastify';
import Logo from '../components/Logo';
import '../css/LoginPage.css';

const LoginPage = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [role, setRole] = useState('candidate');
  const navigate = useNavigate();

  const handleSendOTP = async (e) => {
    e.preventDefault();
    if (!phoneNumber || phoneNumber.length < 10) {
      toast.error('Please enter a valid mobile number');
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
        if (authInfo?.data) authInfo = authInfo.data;

        const sessionToken = authInfo?.sessionToken?.jwt || authInfo?.sessionToken || authInfo?.jwt;
        const user = authInfo?.user || authInfo?.me || authInfo;

        localStorage.setItem('token', sessionToken);
        localStorage.setItem('user', JSON.stringify(user));
        localStorage.setItem('role', role);

        try {
          const uid = user.userId || user.id || user.externalIds?.[0];
          const response = await axios.get(`${API_BASE_URL}/collection/candidates`);
          const existingUser = response.data.find(c => c.uid === uid);
          
          if (existingUser) {
            navigate('/profile');
          } else {
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
          console.error('Profile Error:', error);
          toast.error('Authentication successful but profile sync failed');
        }
      }
    } catch (error) {
      toast.error(error.response?.data?.error?.message || 'Invalid OTP');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page-container">
      <header className="login-header">
        <button onClick={() => navigate(-1)} className="login-back-btn">
          <ArrowLeft size={20} />
        </button>
        <span style={{ fontWeight: 700, fontSize: '0.875rem' }}>Help Support</span>
      </header>

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="login-card"
      >
        <div className="login-logo-section">
          <Logo className="h-12" />
          <h2 className="login-welcome-title">Welcome Back</h2>
          <p className="login-welcome-subtitle">Sign in to continue your journey</p>
        </div>

        <div className="login-role-selector">
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
            Business
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
            >
              <div className="login-form-group">
                <label className="login-label">Mobile Number</label>
                <div className="login-input-wrapper">
                  <Phone className="login-input-icon" size={20} />
                  <input
                    type="tel"
                    placeholder="Enter 10 digit number"
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
              >
                {loading ? 'Sending...' : 'Get OTP Code'} <ChevronRight size={20} />
              </button>
            </motion.form>
          ) : (
            <motion.form
              key="otp-step"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              onSubmit={handleVerifyOTP}
            >
              <div className="login-otp-header">
                <p className="login-welcome-subtitle">Enter the 6-digit code sent to</p>
                <span className="login-otp-phone">+91 {phoneNumber}</span>
              </div>

              <div className="login-form-group">
                <div className="login-input-wrapper">
                  <ShieldCheck className="login-input-icon" size={20} />
                  <input
                    type="text"
                    placeholder="Enter OTP"
                    className="vasista-input login-input"
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
              >
                {loading ? 'Verifying...' : 'Verify & Continue'} <ShieldCheck size={20} />
              </button>

              <div className="login-otp-resend">
                <button type="button" onClick={() => setStep(1)} className="login-otp-resend-btn">
                  Change Number?
                </button>
              </div>
            </motion.form>
          )}
        </AnimatePresence>

        <p className="login-footer-text">
          Secure authentication powered by Descope
        </p>
      </motion.div>

      <div style={{ marginTop: 'auto', textAlign: 'center', padding: '2rem', color: 'rgba(255,255,255,0.7)', fontSize: '0.75rem', position: 'relative', zIndex: 1 }}>
        By continuing, you agree to our Terms & Privacy Policy
      </div>
    </div>
  );
};

export default LoginPage;
