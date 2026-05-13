import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Pencil, Lock, ShieldCheck, Mail } from 'lucide-react';
import logo from '../assets/logo.jpeg';
import otpSideImage from '../assets/otp side.png';

import { useAuth } from '../context/AuthContext';
import { useLocation } from 'react-router-dom';

const OTP = () => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [timer, setTimer] = useState(45);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const inputRefs = useRef([]);
  const location = useLocation();
  const navigate = useNavigate();
  const { login } = useAuth();
  const { phoneNumber, userType, isNewUser } = location.state || {};

  useEffect(() => {
    if (!phoneNumber) {
      navigate('/login');
    }
  }, [phoneNumber, navigate]);

  const handleVerifyOTP = async () => {
    const otpString = otp.join('');
    if (otpString.length < 6) {
      setError('Please enter the 6-digit OTP');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:3000/api/auth/login/mobile/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phoneNumber, otp: otpString })
      });
      const data = await response.json();

      if (data.success) {
        // Fetch user data if existing
        let userData = { 
          phoneNumber, 
          role: userType,
          token: data.authInfo?.sessionToken?.jwt || data.authInfo?.sessionToken // Robust token extraction
        };
        
        // 1. Check if number exists and its role
        const checkResponse = await fetch(`http://localhost:3000/api/auth/check-role/${encodeURIComponent(phoneNumber)}`);
        const checkData = await checkResponse.json();
        if (checkData.success && checkData.user) {
          userData = { ...userData, ...checkData.user };
        }

        console.log('OTP Verified. isNewUser:', isNewUser, 'userType:', userType);
        login(userData);

        if (isNewUser) {
          console.log('Redirecting to onboarding...');
          if (userType === 'candidate') navigate('/onboarding/candidate');
          else navigate('/onboarding/business');
        } else {
          console.log('Redirecting to profile...');
          navigate('/profile');
        }
      } else {
        setError(data.error || 'Invalid OTP');
      }
    } catch (err) {
      setError('Verification failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => setTimer(prev => prev - 1), 1000);
      return () => clearInterval(interval);
    }
  }, [timer]);

  const handleChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);

    if (value && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `0${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className="min-h-screen bg-white md:bg-gray-50/50 flex items-center justify-center lg:items-start lg:justify-center lg:flex-col lg:pt-8 lg:pb-12 font-outfit relative overflow-x-hidden">

      {/* ==================================================
          MOBILE VIEW ONLY (max-width: 768px)
          ================================================== */}
      {/* ==================================================
          MOBILE VIEW ONLY (max-width: 768px)
          ================================================== */}
      <style>{`
        .edit-number-btn {
          background: transparent !important;
          border: none !important;
          cursor: pointer !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          padding: 0 !important;
          margin-left: 6px !important;
          transition: all 0.2s ease !important;
          outline: none !important;
        }

        .edit-number-btn:hover {
          opacity: 0.8 !important;
          transform: scale(0.96) !important;
        }

        .edit-number-btn svg {
          width: 18px !important;
          height: 18px !important;
          color: #8B95A7 !important;
        }

        @media (max-width: 767px) {
          .mobile-otp-container {
            width: 100% !important;
            min-height: 100vh !important;
            background: #ffffff !important;
            padding-left: 24px !important;
            padding-right: 24px !important;
            padding-top: 12px !important;
            padding-bottom: 18px !important;
            display: flex !important;
            flex-direction: column !important;
            align-items: center !important;
          }

          .mobile-back-btn {
            font-size: 15px !important;
            font-weight: 500 !important;
            color: #111827 !important;
            display: flex !important;
            align-items: center !important;
            gap: 8px !important;
            width: 100% !important;
            margin-bottom: 14px !important;
            border: none !important;
            background: transparent !important;
          }

          .mobile-center-logo {
            width: 145px !important;
            height: auto !important;
            object-fit: contain !important;
            margin-bottom: 18px !important;
          }

          .mobile-icon-circle {
            width: 92px !important;
            height: 92px !important;
            border-radius: 999px !important;
            background: #F3F7FF !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            margin-bottom: 18px !important;
          }

          .mobile-otp-heading {
            font-size: 34px !important;
            font-weight: 800 !important;
            line-height: 1.05 !important;
            text-align: center !important;
            color: #0B2C6D !important;
            margin-bottom: 10px !important;
          }

          .mobile-otp-desc {
            font-size: 15px !important;
            font-weight: 500 !important;
            line-height: 1.5 !important;
            text-align: center !important;
            color: #6B7280 !important;
            margin-bottom: 8px !important;
          }

          .mobile-phone-row {
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            gap: 6px !important;
            font-size: 18px !important;
            font-weight: 700 !important;
            color: #0B2C6D !important;
            margin-bottom: 22px !important;
          }

          .mobile-otp-input-group {
            display: flex !important;
            justify-content: center !important;
            gap: 8px !important;
            width: 100% !important;
            margin-bottom: 24px !important;
          }

          .mobile-otp-box {
            width: 48px !important;
            height: 54px !important;
            border-radius: 10px !important;
            border: 1.5px solid #D1D5DB !important;
            background: #ffffff !important;
            text-align: center !important;
            font-size: 24px !important;
            font-weight: 700 !important;
            color: #111827 !important;
            transition: all 0.2s ease !important;
            outline: none !important;
          }

          .mobile-otp-box:focus {
            border: 2px solid #0B2C6D !important;
            box-shadow: 0 0 0 3px rgba(11,44,109,0.08) !important;
          }

          .mobile-resend-text {
            font-size: 15px !important;
            font-weight: 500 !important;
            line-height: 1.6 !important;
            text-align: center !important;
            color: #6B7280 !important;
            margin-bottom: 24px !important;
          }

          .mobile-timer-highlight {
            color: #0B2C6D !important;
            font-weight: 700 !important;
          }

          .mobile-verify-btn {
            width: 100% !important;
            height: 54px !important;
            border-radius: 12px !important;
            background: #0B5BFF !important;
            color: #ffffff !important;
            font-size: 18px !important;
            font-weight: 700 !important;
            border: none !important;
            box-shadow: 0 10px 24px rgba(11,91,255,0.18) !important;
            margin-bottom: 28px !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
          }

          .mobile-security-footer {
            display: flex !important;
            justify-content: center !important;
            align-items: center !important;
            gap: 8px !important;
            font-size: 14px !important;
            font-weight: 500 !important;
            color: #9CA3AF !important;
            padding-top: 14px !important;
            border-top: 1px solid #F3F4F6 !important;
            width: 100% !important;
          }
        }
      `}</style>

      {/* MOBILE PAGE CONTENT */}
      <div className="mobile-otp-container block md:hidden">
        {/* Back Button */}
        <button onClick={() => navigate('/login')} className="mobile-back-btn">
          <ArrowLeft size={18} /> Back
        </button>

        {/* Center Logo */}
        <img src={logo} alt="Vasista Logo" className="mobile-center-logo" />

        {/* Icon Section */}
        <div className="mobile-icon-circle">
          <svg
            width="42"
            height="42"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#163D8F"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="relative z-10"
          >
            {/* Envelope Path */}
            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
            <polyline points="22,6 12,13 2,6" />

            {/* Shield/Check Verification Overlay (Bottom Right) */}
            <circle cx="18" cy="18" r="5" fill="white" stroke="#163D8F" strokeWidth="1.8" />
            <path d="M16 18l1.5 1.5 2.5-3" stroke="#163D8F" strokeWidth="1.8" />
          </svg>
        </div>

        {/* Heading */}
        <h1 className="mobile-otp-heading">Enter OTP</h1>

        {/* Description */}
        <p className="mobile-otp-desc">Enter the 6 digit code sent to</p>

        {/* Phone Row */}
        <div className="mobile-phone-row">
          <span>{phoneNumber}</span>
          <button onClick={() => navigate('/login')} className="edit-number-btn">
            <Pencil />
          </button>
        </div>
        
        {error && <p className="text-red-500 text-xs mb-3 font-medium">{error}</p>}

        {/* OTP Inputs */}
        <div className="mobile-otp-input-group">
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={el => inputRefs.current[index] = el}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              className="mobile-otp-box"
            />
          ))}
        </div>

        {/* Resend Section */}
        <div className="mobile-resend-text">
          <div>Didn't receive the code?</div>
          <div>
            Resend OTP in <span className="mobile-timer-highlight">{formatTime(timer)}</span>
          </div>
        </div>

        {/* Verify Button */}
        <button
          onClick={handleVerifyOTP}
          disabled={loading}
          className={`mobile-verify-btn active:scale-[0.98] transition-transform ${loading ? 'opacity-70' : ''}`}
        >
          {loading ? 'Verifying...' : 'Verify OTP'}
        </button>

        {/* Security Footer */}
        <div className="mobile-security-footer">
          <Lock size={15} />
          <span>Secure • Private • Trusted</span>
        </div>
      </div>

      {/* ==================================================
          TABLET VIEW ONLY (768px - 1024px)
          ================================================== */}
      <div className="hidden md:block lg:hidden w-full bg-[#f4f7fa] min-h-screen py-6 px-3">
        <style>{`
          @media (min-width: 768px) and (max-width: 1023px) {
            .tablet-otp-master {
              display: flex;
              justify-content: center;
              align-items: center;
              width: 100%;
              min-height: calc(100vh - 48px);
            }

            .tablet-master-card {
              width: 98%;
              max-width: 1000px;
              background: #ffffff;
              border-radius: 40px;
              box-shadow: 0 30px 100px rgba(0,0,0,0.06);
              overflow: hidden;
              display: flex;
              flex-direction: column;
              border: 1px solid rgba(0,0,0,0.02);
            }

            .tablet-navbar {
              height: 90px;
              width: 100%;
              display: flex;
              align-items: center;
              justify-content: space-between;
              padding: 0 40px;
              background: #ffffff;
              border-bottom: 1px solid #f1f3f7;
            }

            .tablet-grid {
              display: grid;
              grid-template-columns: 50% 50%;
              min-height: 850px;
              width: 100%;
            }

            .tablet-left-hero {
              background: #f4f8fd;
              padding: 80px 60px;
              display: flex;
              flex-direction: column;
              position: relative;
              overflow: hidden;
            }

            .tablet-right-form {
              padding: 80px 60px;
              display: flex;
              flex-direction: column;
              background: #ffffff;
              position: relative;
            }

            .tablet-otp-heading {
              font-size: 44px;
              font-weight: 800;
              color: #062b66;
              line-height: 1.15;
              margin-bottom: 12px;
              letter-spacing: -0.02em;
            }

            .tablet-otp-input {
              width: 48px;
              height: 48px;
              border: 1.5px solid #e5e7eb;
              border-radius: 10px;
              text-align: center;
              font-size: 20px;
              font-weight: 700;
              color: #062b66;
              outline: none;
              transition: all 0.2s ease;
              background: #ffffff;
            }

            .tablet-otp-input:focus {
              border-color: #0a46d8;
              box-shadow: 0 0 0 4px rgba(10,70,216,0.05);
            }

            .tablet-verify-btn {
              width: 100%;
              height: 58px;
              background: #0a46d8;
              color: white;
              border-radius: 14px;
              font-size: 18px;
              font-weight: 700;
              border: none;
              box-shadow: 0 10px 24px rgba(10,70,216,0.15);
              transition: transform 0.2s ease;
            }

            .tablet-verify-btn:active {
              transform: scale(0.97);
            }
          }
        `}</style>

        <div className="tablet-otp-master">
          <div className="tablet-master-card">
            {/* 1. Internal Tablet Navbar */}
            <div className="tablet-navbar">
              <div onClick={() => navigate('/')} className="shrink-0 cursor-pointer">
                <img src={logo} alt="Logo" className="w-[160px] h-auto object-contain" />
              </div>
              <div className="flex items-center gap-6">
                <div onClick={() => navigate('/')} className="text-[14px] font-bold text-[#0B2C6D] cursor-pointer">Home</div>
                <div onClick={() => navigate('/login')} className="text-[14px] font-bold text-[#0B2C6D] cursor-pointer">Login</div>
                <div onClick={() => navigate('/otp')} className="text-[14px] font-bold text-[#F59E0B] cursor-pointer">OTP</div>
                <div onClick={() => navigate('/profile')} className="text-[14px] font-bold text-[#0B2C6D] cursor-pointer">Profile</div>
              </div>
              <button onClick={() => navigate('/login')} className="h-[44px] px-6 bg-[#062B67] text-white rounded-full text-[14px] font-bold">
                Get Started
              </button>
            </div>

            {/* 2. Main Tablet Grid */}
            <div className="tablet-grid">
              {/* Left Section: Branding & Info */}
              <div className="tablet-left-hero">
                <div className="absolute top-12 right-12 w-20 h-14 opacity-20" style={{ backgroundImage: 'radial-gradient(circle, #002147 2px, transparent 0)', backgroundSize: '12px 12px' }}></div>

                <div className="mb-10">
                  <h1 className="tablet-otp-heading">Verify Your <br /> Number</h1>
                  <p className="text-[18px] text-[#0a46d8] font-bold mb-4">Just one step away!</p>
                  <div className="w-14 h-[4px] bg-[#F59E0B] rounded-full mb-8"></div>

                  <div className="space-y-2 mb-6">
                    <p className="text-[#64748b] font-medium text-[16px]">We have sent a 6 digit OTP to</p>
                    <p className="text-[#062b66] font-extrabold text-[18px] tracking-wide">{phoneNumber}</p>
                  </div>
                  
                  {error && <p className="text-red-500 text-sm font-medium mb-4">{error}</p>}

                  <div className="bg-white/80 backdrop-blur-md p-5 rounded-xl border border-white/60 shadow-sm flex items-center gap-3.5 max-w-[320px]">
                    <div className="w-12 h-12 bg-[#e8f1ff] rounded-full flex items-center justify-center flex-shrink-0">
                      <ShieldCheck size={24} className="text-[#0a46d8]" />
                    </div>
                    <div>
                      <p className="text-[#062b66] font-bold text-[14px]">Your information is safe with us.</p>
                      <p className="text-[#94a3b8] text-[12px] font-medium">We never share your data.</p>
                    </div>
                  </div>
                </div>

                {/* Illustration at Bottom */}
                <div className="mt-auto flex justify-start relative pt-8 pb-4">
                  <div className="absolute inset-0 bg-[#eef5fd] rounded-full blur-[40px] opacity-60 scale-90 translate-x-[-20%] translate-y-10"></div>
                  <img src={otpSideImage} alt="Illustration" className="w-full max-w-[370px] h-auto object-contain relative z-10" />
                </div>
              </div>

              {/* Right Section: Form */}
              <div className="tablet-right-form">
                {/* Back Button */}
                <div className="absolute top-10 left-10">
                  <button onClick={() => navigate('/login')} className="flex items-center gap-2 text-[#64748b] font-bold text-[15px] hover:text-[#062b66] transition-colors">
                    <ArrowLeft size={18} /> Back
                  </button>
                </div>

                <div className="flex flex-col items-center flex-1 justify-center">
                  {/* Centered Mail Icon */}
                  <div className="w-20 h-20 bg-[#f4f7ff] rounded-full flex items-center justify-center mb-8 shadow-sm border border-[#eff3ff]">
                    <Mail size={32} className="text-[#062b66] stroke-[1.5px]" />
                  </div>

                  <h2 className="text-[34px] font-extrabold text-[#062b66] mb-3">Enter OTP</h2>
                  <p className="text-[#94a3b8] font-semibold text-[15px] mb-6">Enter the 6 digit code sent to</p>

                  {/* Phone Badge */}
                  <div className="bg-[#f8faff] px-6 py-2.5 rounded-full border border-[#f1f5f9] flex items-center gap-3 mb-10 shadow-sm">
                    <span className="text-[#062b66] font-extrabold text-[16px] tracking-wide">{phoneNumber}</span>
                    <button onClick={() => navigate('/login')} className="p-1 hover:bg-white rounded-md transition-all active:scale-95">
                      <Pencil size={14} className="text-[#94a3b8]" />
                    </button>
                  </div>

                  {/* OTP Inputs */}
                  <div className="flex gap-2 mb-10">
                    {otp.map((digit, index) => (
                      <input
                        key={index}
                        ref={el => inputRefs.current[index] = el}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleChange(index, e.target.value)}
                        onKeyDown={(e) => handleKeyDown(index, e)}
                        className="tablet-otp-input"
                      />
                    ))}
                  </div>

                  <div className="text-center mb-10">
                    <p className="text-[#64748b] text-[15px] mb-1 font-medium">Didn't receive the code?</p>
                    <button className="text-[#0a46d8] font-extrabold text-[16px] hover:underline">
                      Resend OTP in <span className="opacity-80">{formatTime(timer)}</span>
                    </button>
                  </div>

                  <button
                    onClick={handleVerifyOTP}
                    disabled={loading}
                    className={`tablet-verify-btn mb-10 max-w-[340px] ${loading ? 'opacity-70' : ''}`}
                  >
                    {loading ? 'Verifying...' : 'Verify OTP'}
                  </button>

                  {/* Security Footer */}
                  <div className="flex items-center justify-center gap-3 text-[#94a3b8] text-[14px] font-bold tracking-wide uppercase opacity-70">
                    <div className="flex items-center gap-1.5">
                      <Lock size={14} /> Secure
                    </div>
                    <div className="w-1 h-1 bg-gray-200 rounded-full"></div>
                    <div className="flex items-center gap-1.5">
                      <ShieldCheck size={14} /> Private
                    </div>
                    <div className="w-1 h-1 bg-gray-200 rounded-full"></div>
                    <div className="flex items-center gap-1.5">
                      <ShieldCheck size={14} /> Trusted
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ==================================================
          DESKTOP VIEW ONLY (min-width: 1024px)
          ================================================== */}
      {/* Main Container Card */}
      <div className="hidden lg:flex w-full max-w-[1180px] mx-auto p-10 bg-[#f5f8ff] rounded-[28px] shadow-[0_10px_40px_rgba(0,0,0,0.02)] flex-col md:flex-row items-start justify-center gap-[40px] overflow-hidden">

        {/* LEFT SECTION: Illustration & Info */}
        <div className="w-full md:w-1/2 max-w-[480px] flex flex-col justify-center items-start relative">



          {/* Text Content */}
          <div className="relative z-10">
            <h1 className="text-[64px] font-bold text-[#082b66] leading-[1.05] mb-4">
              Verify Your <br /> Number
            </h1>
            <p className="text-[#2453ff] text-[18px] font-semibold mb-4">
              Just one step away!
            </p>
            <div className="w-[56px] h-1 bg-[#f4b000] rounded-full mb-6"></div>

            <div className="mb-2">
              <p className="text-[#6b7280] text-[16px] leading-[1.6]">We have sent a 6 digit OTP to</p>
            </div>
            <p className="text-[#082b66] text-[18px] font-bold mb-6">{phoneNumber}</p>
            
            {error && <p className="text-red-500 text-sm font-medium mb-4">{error}</p>}

            {/* Safe Info Card */}
            <div className="w-full max-w-[340px] h-[72px] bg-white/72 backdrop-blur-[8px] rounded-[18px] flex items-center gap-[14px] px-[18px] py-4 mb-10 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-white/40">
              <div className="w-[42px] h-[42px] bg-[#e8f1ff] rounded-full flex items-center justify-center flex-shrink-0">
                <ShieldCheck size={20} className="text-[#2453ff]" />
              </div>
              <div>
                <p className="text-[#082b66] text-[13px] font-bold leading-tight">Your information is safe with us.</p>
                <p className="text-[#9ca3af] text-[12px] font-medium leading-tight">We never share your data.</p>
              </div>
            </div>
          </div>

          {/* Illustration Container */}
          <div className="relative w-full flex justify-center items-end select-none pointer-events-none mt-2">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[320px] h-[320px] bg-[#e6effc] rounded-full blur-[50px] opacity-60"></div>
            <img
              src={otpSideImage}
              alt="OTP Illustration"
              className="w-full max-w-[360px] h-auto object-contain relative z-10"
            />
          </div>
        </div>

        {/* RIGHT SECTION: OTP Form Card */}
        <div className="w-full md:w-1/2 max-w-[480px] flex items-center justify-center lg:-mt-[60px]">
          <div className="bg-white w-full min-h-[760px] rounded-[28px] shadow-[0_10px_30px_rgba(15,23,42,0.06)] p-10 pt-14 pb-10 relative overflow-hidden flex flex-col justify-start gap-4">

            {/* Back Button */}
            <button
              onClick={() => navigate('/login')}
              className="flex items-center gap-2 text-[#111827] font-medium text-[16px] hover:text-[#1652f0] transition-colors mb-4"
            >
              <ArrowLeft size={18} className="text-gray-600" />
              Back
            </button>

            {/* Top Icon Section */}
            <div className="flex flex-col items-center gap-4">
              <div className="w-16 h-16 bg-[#f4f7ff] rounded-full flex items-center justify-center">
                <Mail size={28} className="text-[#082b66] stroke-[1.5px]" />
              </div>

              <h2 className="text-[44px] font-bold text-[#082b66] leading-none">Enter OTP</h2>

              <div className="flex flex-col items-center">
                <p className="text-[#6b7280] text-[16px] font-medium mb-2">Enter the 6 digit code sent to</p>
                <div className="flex items-center gap-2 bg-[#f7f8fc] px-4 py-2 rounded-full">
                  <span className="text-[#082b66] font-bold text-[16px]">+91 98765 43210</span>
                  <button onClick={() => navigate('/login')} className="edit-number-btn">
                    <Pencil />
                  </button>
                </div>
              </div>

              {/* OTP Inputs */}
              <div className="flex gap-[10px]">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    ref={el => inputRefs.current[index] = el}
                    type="text"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    className="w-14 h-14 text-center text-[26px] font-semibold rounded-[12px] border-[1.5px] border-[#e5e7eb] focus:border-[#1d4ed8] focus:ring-4 focus:ring-[#1d4ed8]/5 outline-none transition-all"
                  />
                ))}
              </div>

              {/* Resend Section */}
              <div className="text-center">
                <p className="text-[#4b5563] text-[15px]">Didn't receive the code?</p>
                <p className="text-[15px] font-medium text-[#4b5563]">
                  Resend OTP in <span className="text-[#1652f0] font-semibold">{formatTime(timer)}</span>
                </p>
              </div>

              {/* Verify Button */}
              <button
                onClick={handleVerifyOTP}
                disabled={loading}
                className={`w-full bg-[#1652f0] text-white h-14 rounded-[14px] font-semibold text-[18px] shadow-[0_8px_20px_rgba(37,99,235,0.22)] hover:bg-[#093ec2] transition-all flex items-center justify-center ${loading ? 'opacity-70' : ''}`}
              >
                {loading ? 'Verifying...' : 'Verify OTP'}
              </button>

              {/* Bottom Labels */}
              <div className="flex items-center gap-3 text-[#9ca3af] text-[14px] font-medium mt-2">
                <div className="flex items-center gap-1.5">
                  <Lock size={14} className="stroke-[1.5px]" />
                  <span>Secure</span>
                </div>
                <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
                <span>Private</span>
                <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
                <span>Trusted</span>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};

export default OTP;
