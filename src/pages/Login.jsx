import React, { useState } from 'react';
import { User, Briefcase, ArrowRight, ShieldCheck, Building2, Users, ChevronDown } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import logo from '../assets/logo.jpeg';
import teamImage from '../assets/team-final.jpg';

const Login = () => {
  const [userType, setUserType] = useState('candidate');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleGetOTP = async () => {
    if (!phoneNumber || phoneNumber.length < 10) {
      setError('Please enter a valid mobile number');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Normalize phone number to get last 10 digits
      const normalizedPhone = phoneNumber.replace(/\D/g, '').slice(-10);
      const fullPhone = `+91${normalizedPhone}`;

      // 1. Check if number exists and its role
      const checkResponse = await fetch(`${import.meta.env.VITE_API_URL}/auth/check-role/${encodeURIComponent(fullPhone)}`);
      
      if (!checkResponse.ok) {
        const errorText = await checkResponse.text();
        console.error('API Error Response:', errorText);
        throw new Error(`Server returned ${checkResponse.status}. Please check your API URL configuration.`);
      }

      const checkData = await checkResponse.json();

      if (checkData.success && checkData.exists) {
        // Validation: user is in the other list
        if (userType === 'candidate' && checkData.role === 'business') {
          setError('This number is already a Business Owner. Please click on the Business Owner toggle above to login.');
          setLoading(false);
          return;
        }
        if (userType === 'business' && checkData.role === 'candidate') {
          setError('This number is a Candidate number. Please click on the Candidate toggle above to login.');
          setLoading(false);
          return;
        }
      }

      // 2. Send OTP
      const sendResponse = await fetch(`${import.meta.env.VITE_API_URL}/auth/login/mobile/send`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phoneNumber: fullPhone })
      });

      if (!sendResponse.ok) {
        throw new Error(`Failed to send OTP (Status: ${sendResponse.status})`);
      }

      const sendData = await sendResponse.json();

      if (sendData.success) {
        // Navigate to OTP page with data
        navigate('/otp', {
          state: {
            phoneNumber: fullPhone,
            userType,
            isNewUser: !checkData.exists
          }
        });
      } else {
        setError(sendData.error || 'Failed to send OTP');
      }
    } catch (err) {
      setError('Something went wrong. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white md:bg-gray-50/50 flex items-center justify-center lg:items-start lg:justify-center md:p-8 lg:pt-5 font-outfit relative">

      {/* ==================================================
          MOBILE VIEW ONLY (max-width: 768px)
          ================================================== */}
      <style>{`
        @media (max-width: 767px) {
          .mobile-login-container {
            width: 100% !important;
            min-height: 100vh !important;
            background: #ffffff !important;
            padding-left: 24px !important;
            padding-right: 24px !important;
            padding-top: 4px !important;
            padding-bottom: 40px !important;
            display: block !important;
          }

          .mobile-logo-box {
            display: none !important;
          }

          .mobile-hero-section {
            display: flex !important;
            justify-content: center !important;
            align-items: center !important;
            margin-top: -10px !important;
            padding-top: 0 !important;
            margin-bottom: 16px !important;
          }

          .mobile-hero-img {
            width: 100% !important;
            max-width: 320px !important;
            height: auto !important;
            object-fit: contain !important;
          }

          .mobile-welcome-title {
            font-size: 24px !important;
            font-weight: 700 !important;
            line-height: 1.2 !important;
            color: #111827 !important;
            margin-bottom: 2px !important;
          }

          .mobile-welcome-subtitle {
            font-size: 24px !important;
            font-weight: 700 !important;
            line-height: 1.2 !important;
            color: #0B2C6D !important;
            margin-bottom: 14px !important;
          }

          .mobile-yellow-divider {
            width: 52px !important;
            height: 3px !important;
            background: #F4B400 !important;
            border-radius: 999px !important;
            margin-bottom: 20px !important;
          }

          .mobile-desc-text {
            font-size: 15px !important;
            font-weight: 400 !important;
            line-height: 1.7 !important;
            color: #4B5563 !important;
            margin-bottom: 14px !important;
            max-width: 100% !important;
          }

          .mobile-toggle-wrapper {
            display: flex !important;
            align-items: center !important;
            width: 100% !important;
            height: 56px !important;
            background: #ffffff !important;
            border: 1px solid #E5E7EB !important;
            border-radius: 14px !important;
            padding: 4px !important;
            margin-bottom: 12px !important;
            box-sizing: border-box !important;
          }

          .mobile-toggle-btn {
            flex: 1 !important;
            height: 100% !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            gap: 8px !important;
            border-radius: 10px !important;
            font-size: 15px !important;
            font-weight: 600 !important;
            transition: all 0.3s ease !important;
            border: none !important;
            background: transparent;
            color: #6B7280;
          }

          .mobile-toggle-btn.active {
            background: linear-gradient(90deg, #0B57D0, #0047CC) !important;
            color: white !important;
            box-shadow: 0 6px 16px rgba(11,87,208,0.18) !important;
          }

          .mobile-form-title {
            font-size: 20px !important;
            font-weight: 700 !important;
            color: #111827 !important;
            margin-top: 0 !important;
            padding-top: 0 !important;
            margin-bottom: 4px !important;
          }

          .mobile-form-desc {
            font-size: 14px !important;
            font-weight: 400 !important;
            color: #6B7280 !important;
            margin-bottom: 10px !important;
          }

          .mobile-input-group {
            display: flex !important;
            gap: 12px !important;
            margin-bottom: 12px !important;
          }

          .mobile-country-wrapper {
            position: relative !important;
            width: 90px !important;
          }

          .mobile-country-select {
            width: 100% !important;
            height: 48px !important;
            border: 1px solid #E5E7EB !important;
            border-radius: 10px !important;
            font-size: 15px !important;
            font-weight: 600 !important;
            background: #ffffff !important;
            padding-left: 14px !important;
            padding-right: 28px !important;
            appearance: none !important;
            color: #111827 !important;
            outline: none !important;
          }

          .mobile-dropdown-arrow {
            position: absolute !important;
            right: 12px !important;
            top: 50% !important;
            transform: translateY(-50%) translateY(1px) !important;
            color: #6B7280 !important;
            opacity: 0.9 !important;
            pointer-events: none !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
          }

          .mobile-phone-input {
            flex: 1 !important;
            height: 52px !important;
            border: 1px solid #E5E7EB !important;
            border-radius: 12px !important;
            padding-left: 16px !important;
            font-size: 15px !important;
            background: #ffffff !important;
            outline: none !important;
          }

          .mobile-send-btn {
            width: 100% !important;
            height: 54px !important;
            border-radius: 14px !important;
            background: linear-gradient(90deg, #0B57D0, #0047CC) !important;
            font-size: 17px !important;
            font-weight: 600 !important;
            color: white !important;
            box-shadow: 0 8px 20px rgba(11,87,208,0.18) !important;
            border: none !important;
            margin-bottom: 12px !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            gap: 10px !important;
          }

          .mobile-google-btn {
            width: 100% !important;
            height: 58px !important;
            background: #ffffff !important;
            border: 1px solid #E5E7EB !important;
            border-radius: 14px !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            gap: 12px !important;
            font-size: 16px !important;
            font-weight: 600 !important;
            color: #111827 !important;
            margin-top: 10px !important;
          }

          .mobile-terms-text {
            font-size: 13px !important;
            line-height: 1.6 !important;
            text-align: center !important;
            color: #6B7280 !important;
            margin-top: 12px !important;
          }

          .mobile-or-divider {
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            gap: 12px !important;
            margin-top: 10px !important;
            margin-bottom: 10px !important;
          }

          .mobile-or-line {
            height: 1px !important;
            flex: 1 !important;
            background: #F3F4F6 !important;
          }

          .mobile-or-text {
            font-size: 13px !important;
            color: #9CA3AF !important;
          }
        }
      `}</style>

      {/* MOBILE PAGE CONTENT */}
      <div className="mobile-login-container block md:hidden">
        {/* Logo */}
        <div className="flex justify-start">
          <img src={logo} alt="Vasista Logo" className="mobile-logo-box" />
        </div>

        {/* Hero Image */}
        <div className="mobile-hero-section">
          <img src={teamImage} alt="Vasista Team" className="mobile-hero-img" />
        </div>

        {/* Welcome Text */}
        <div className="text-left">
          <h1 className="mobile-welcome-title">Welcome Back!</h1>
          <h2 className="mobile-welcome-subtitle">Glad to have you here.</h2>
          <div className="mobile-yellow-divider"></div>
          <p className="mobile-desc-text">
            Login to your account and explore opportunities that grow careers and businesses.
          </p>
        </div>

        {/* User Type Toggle */}
        <div className="mobile-toggle-wrapper">
          <button
            onClick={() => setUserType('candidate')}
            className={`mobile-toggle-btn ${userType === 'candidate' ? 'active' : ''}`}
          >
            <User size={18} /> Candidate
          </button>
          <button
            onClick={() => setUserType('business')}
            className={`mobile-toggle-btn ${userType === 'business' ? 'active' : ''}`}
          >
            <Briefcase size={18} /> Business Owner
          </button>
        </div>

        {/* OR Divider */}
        <div className="mobile-or-divider">
          <div className="mobile-or-line"></div>
          <span className="mobile-or-text">or</span>
          <div className="mobile-or-line"></div>
        </div>

        {/* Login Form */}
        <div>
          <h3 className="mobile-form-title">Login with Mobile Number</h3>
          <p className="mobile-form-desc">We will send you a 6 digit OTP</p>

          <div className="mobile-input-group">
            <div className="mobile-country-wrapper">
              <select className="mobile-country-select">
                <option>+91</option>
                <option>+1</option>
              </select>
              <div className="mobile-dropdown-arrow">
                <ChevronDown size={14} />
              </div>
            </div>
            <input
              type="tel"
              placeholder="Enter mobile number"
              className="mobile-phone-input"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, '').slice(0, 10))}
            />
          </div>

          {error && <p className="text-red-500 text-xs mb-3 font-medium">{error}</p>}

          <button
            onClick={handleGetOTP}
            disabled={loading}
            className={`mobile-send-btn active:scale-[0.98] transition-transform ${loading ? 'opacity-70' : ''}`}
          >
            {loading ? 'Sending...' : 'Send OTP'} <ArrowRight size={20} />
          </button>
        </div>

        {/* OR Divider */}
        <div className="mobile-or-divider">
          <div className="mobile-or-line"></div>
          <span className="mobile-or-text">or</span>
          <div className="mobile-or-line"></div>
        </div>

        {/* Google Login */}
        {/* <button className="mobile-google-btn active:scale-[0.98] transition-transform">
          <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-5 h-5" />
          <div className="flex flex-col items-start">
            <span>Continue with Google</span>
            <span className="text-[10px] text-gray-400 font-medium">(Business Owner only)</span>
          </div>
        </button> */}

        {/* Terms */}
        <p className="mobile-terms-text">
          By continuing, you agree to our<br />
          <a href="#" className="text-[#0B2C6D] font-bold underline">Terms & Conditions</a>
        </p>
      </div>

      {/* ==================================================
          TABLET VIEW ONLY (768px - 1024px)
          ================================================== */}
      <div className="hidden md:block lg:hidden w-full bg-[#f4f7fa] min-h-screen relative py-4 px-1">
        <style>{`
          @media (min-width: 768px) and (max-width: 1023px) {
            .tablet-login-master {
              display: flex;
              justify-content: center;
              align-items: center;
              width: 100%;
              min-height: calc(100vh - 48px);
            }

            .tablet-master-card {
              width: 100%;
              max-width: 1100px;
              background: #ffffff;
              border-radius: 40px;
              box-shadow: 0 30px 100px rgba(0,0,0,0.08);
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
              grid-template-columns: 1fr 1.3fr;
              min-height: 950px;
              width: 100%;
            }

            .tablet-left-hero {
              background: #f4f8fd;
              padding: 80px 40px;
              display: flex;
              flex-direction: column;
              position: relative;
              overflow: hidden;
            }

            .tablet-right-form {
              padding: 80px 40px;
              display: flex;
              flex-direction: column;
              justify-content: center;
              background: #ffffff;
            }

            .tablet-heading {
              font-size: 42px;
              font-weight: 800;
              color: #062b66;
              line-height: 1.15;
              margin-bottom: 14px;
              position: relative;
              z-index: 10;
              letter-spacing: -0.02em;
            }

            .tablet-subheading {
              font-size: 17px;
              color: #64748b;
              font-weight: 500;
              line-height: 1.75;
              max-width: 360px;
              margin-bottom: 0;
              position: relative;
              z-index: 10;
            }

            .tablet-form-title {
              font-size: 26px;
              font-weight: 800;
              color: #062b66;
              margin-bottom: 6px;
              letter-spacing: -0.01em;
            }

            .tablet-form-subtitle {
              font-size: 15px;
              color: #9ca3af;
              font-weight: 500;
              margin-bottom: 0;
            }

            .tablet-input-group {
              margin-bottom: 20px;
            }

            .tablet-input {
              width: 100%;
              height: 52px;
              border: 1px solid #e5e7eb;
              border-radius: 14px;
              padding: 0 16px;
              font-size: 15px;
              font-weight: 600;
              color: #062b66;
              background: #ffffff;
              outline: none;
              transition: border 0.2s ease;
            }

            .tablet-input:focus {
              border-color: #0a46d8;
            }

            .tablet-btn {
              width: 100%;
              height: 56px;
              background: #0a46d8;
              color: #ffffff;
              border-radius: 14px;
              font-size: 18px;
              font-weight: 700;
              display: flex;
              align-items: center;
              justify-content: center;
              gap: 12px;
              border: none;
              box-shadow: 0 8px 24px rgba(10,70,216,0.18);
              transition: transform 0.2s ease;
            }

            .tablet-btn:active {
              transform: scale(0.98);
            }

            .tablet-google-btn {
              width: 100%;
              height: 64px;
              background: #ffffff;
              border: 1px solid #e5e7eb;
              border-radius: 14px;
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
              gap: 2px;
            }
          }
        `}</style>

        <div className="tablet-login-master">
          <div className="tablet-master-card">
            {/* 1. Internal Tablet Navbar */}
            <div className="tablet-navbar">
              <Link to="/" className="shrink-0">
                <img src={logo} alt="Logo" className="w-[160px] h-auto object-contain" />
              </Link>
              <div className="flex items-center gap-6">
                <Link to="/" className="text-[14px] font-bold text-[#0B2C6D]">Home</Link>
                <Link to="/login" className="text-[14px] font-bold text-[#F59E0B]">Login</Link>
                <Link to="/otp" className="text-[14px] font-bold text-[#0B2C6D]">OTP</Link>
                <Link to="/profile" className="text-[14px] font-bold text-[#0B2C6D]">Profile</Link>
              </div>
              <Link to="/login" className="h-[44px] px-6 bg-[#062B67] text-white rounded-full text-[14px] font-bold flex items-center justify-center">
                Get Started
              </Link>
            </div>

            {/* 2. Main Tablet Grid */}
            <div className="tablet-grid">
              {/* Left: Branding & Hero (Redesigned to match reference) */}
              <div className="tablet-left-hero">
                {/* Top-Right Decorative Dots */}
                <div className="absolute top-12 right-12 w-20 h-14 opacity-20" style={{ backgroundImage: 'radial-gradient(circle, #002147 2px, transparent 0)', backgroundSize: '12px 12px' }}></div>

                {/* Hero Image Section (Moved to Top) */}
                <div className="relative z-10 w-full flex justify-center mb-10 pt-4">
                  <img
                    src={teamImage}
                    alt="Team"
                    className="w-full max-w-[360px] h-auto object-contain"
                  />
                </div>

                {/* Text Section */}
                <div className="relative z-10">
                  <h1 className="tablet-heading">Welcome Back! <br /> Glad to have <br /> you here.</h1>
                  <div className="w-14 h-[4px] bg-[#F59E0B] rounded-full mb-8"></div>
                  <p className="tablet-subheading">
                    Login to your account and explore opportunities that grow careers and businesses.
                  </p>
                </div>

                {/* Bottom Decorative Patterns */}
                <div className="absolute bottom-32 left-12 w-14 h-14 opacity-15" style={{ backgroundImage: 'radial-gradient(circle, #F59E0B 2px, transparent 0)', backgroundSize: '12px 12px' }}></div>
                <div className="absolute bottom-16 left-12 w-24 h-10 opacity-15" style={{ backgroundImage: 'radial-gradient(circle, #002147 2px, transparent 0)', backgroundSize: '12px 12px' }}></div>
                <div className="absolute bottom-24 right-12 w-16 h-16 opacity-15" style={{ backgroundImage: 'radial-gradient(circle, #002147 2px, transparent 0)', backgroundSize: '12px 12px' }}></div>
              </div>

              {/* Right: Form Section */}
              <div className="tablet-right-form">
                <div className="text-center mb-10">
                  <h2 className="tablet-form-title">Login to Continue</h2>
                  <p className="tablet-form-subtitle">Access your account to continue</p>
                </div>

                {/* User Type Toggle */}
                <div className="bg-[#fcfdfe] p-1.5 rounded-xl flex mb-8 border border-[#f1f3f7] shadow-sm">
                  <button
                    onClick={() => setUserType('candidate')}
                    className={`flex-1 py-3 rounded-lg font-bold text-[15px] flex items-center justify-center gap-2.5 transition-all ${userType === 'candidate' ? 'bg-[#0a46d8] text-white shadow-lg' : 'text-[#6b7280]'}`}
                  >
                    <User size={16} /> Candidate
                  </button>
                  <button
                    onClick={() => setUserType('business')}
                    className={`flex-1 py-3 rounded-lg font-bold text-[15px] flex items-center justify-center gap-2.5 transition-all ${userType === 'business' ? 'bg-[#0a46d8] text-white shadow-lg' : 'text-[#6b7280]'}`}
                  >
                    <Briefcase size={16} /> Business Owner
                  </button>
                </div>

                {/* Form */}
                <div className="space-y-5">
                  <div className="flex gap-4">
                    <div className="relative w-24">
                      <select className="tablet-input pr-10 appearance-none cursor-pointer text-[14px]">
                        <option>+91</option>
                        <option>+1</option>
                      </select>
                      <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    </div>
                    <input
                      type="tel"
                      placeholder="Enter mobile number"
                      className="tablet-input flex-1 text-[14px] placeholder:font-normal placeholder:text-gray-400"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, '').slice(0, 10))}
                    />
                  </div>

                  {error && <p className="text-red-500 text-sm font-medium">{error}</p>}

                  <button
                    onClick={handleGetOTP}
                    disabled={loading}
                    className={`tablet-btn active:scale-[0.97] ${loading ? 'opacity-70' : ''}`}
                  >
                    {loading ? 'Sending...' : 'Send OTP'} <ArrowRight size={20} />
                  </button>
                </div>

                <div className="flex items-center gap-5 my-10">
                  <div className="h-px flex-1 bg-gray-100"></div>
                  <span className="text-[13px] text-gray-400 font-bold uppercase tracking-wider">or</span>
                  <div className="h-px flex-1 bg-gray-100"></div>
                </div>

                <button className="tablet-google-btn active:scale-[0.97] transition-transform">
                  <div className="flex items-center gap-3.5">
                    <svg className="w-6 h-6" viewBox="0 0 24 24">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1c-4.3 0-8.01 2.53-9.82 6.18l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                    </svg>
                    <span className="font-bold text-[#374151] text-[16px]">Continue with Google</span>
                  </div>
                  <span className="text-[11px] text-gray-400 font-bold uppercase tracking-widest mt-1">(Business Owner Only)</span>
                </button>

                <p className="text-center mt-10 text-[13px] text-gray-400 font-medium">
                  By continuing, you agree to our <a href="#" className="font-bold text-[#062b66] hover:underline">Terms & Conditions</a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ==================================================
          DESKTOP VIEW ONLY (min-width: 1024px)
          ================================================== */}
      {/* Main Container */}
      <div className="hidden lg:flex w-full max-w-6xl bg-white rounded-[32px] shadow-[0_20px_60px_rgba(0,0,0,0.06)] border border-gray-100 overflow-hidden flex-col md:flex-row min-h-[780px]">

        {/* Left Section: Branding & Image (Rebuilt for Pixel-Perfect Accuracy) */}
        <div className="w-full md:w-[42%] bg-[#f4f8fd] relative flex flex-col overflow-hidden">

          {/* Decorative Top-Right Dot Pattern */}
          <div className="absolute top-10 right-10 w-20 h-10 opacity-20 z-0" style={{ backgroundImage: 'radial-gradient(circle, #002147 2px, transparent 0)', backgroundSize: '12px 12px' }}></div>


          {/* Branding Section */}
          <div className="pt-16 px-12 relative z-10">
            {/* Heading Section */}
            <div className="mb-6">
              <h1 className="text-[38px] font-bold text-[#062b66] leading-[1.1] tracking-tight">
                Welcome Back! <br />
                Glad to have you here.
              </h1>
              <div className="w-12 h-[3px] bg-secondary rounded-full mt-4"></div>
            </div>

            {/* Description Section */}
            <p className="text-gray-500 text-[15px] font-medium leading-[1.6] max-w-[280px]">
              Login to your account and explore opportunities that grow careers and businesses.
            </p>
          </div>

          {/* Layered Background Composition */}
          <div className="absolute inset-0 flex flex-col items-center justify-end pointer-events-none">
            {/* 1. Large Soft Abstract Blob */}
            <div className="absolute top-[40%] left-1/2 -translate-x-1/2 w-[120%] h-[60%] bg-[#eef5fd] rounded-[100px] rotate-[-5deg] blur-[20px] opacity-80"></div>

            {/* 2. City Skyline Silhouette */}
            <div className="absolute bottom-[28%] left-0 w-full opacity-[0.03] px-10">
              <svg viewBox="0 0 800 200" className="w-full h-auto fill-primary">
                <path d="M0,200 L50,200 L50,150 L80,150 L80,120 L100,120 L100,160 L130,160 L130,140 L160,140 L160,100 L190,100 L190,180 L220,180 L220,130 L250,130 L250,170 L280,170 L280,110 L310,110 L310,150 L340,150 L340,90 L370,90 L370,180 L400,180 L400,140 L430,140 L430,160 L460,160 L460,100 L490,100 L490,150 L520,150 L520,120 L550,120 L550,180 L580,180 L580,140 L610,140 L610,160 L640,160 L640,110 L670,110 L670,150 L700,150 L700,130 L730,130 L730,170 L760,170 L760,100 L800,100 L800,200 L0,200 Z" />
              </svg>
            </div>

            {/* 3. Decorative Dot Patterns */}
            <div className="absolute top-[42%] left-12 w-10 h-10 opacity-20" style={{ backgroundImage: 'radial-gradient(circle, #FFB800 2px, transparent 0)', backgroundSize: '10px 10px' }}></div>
            <div className="absolute top-[38%] right-16 w-16 h-8 opacity-15" style={{ backgroundImage: 'radial-gradient(circle, #002147 2px, transparent 0)', backgroundSize: '12px 12px' }}></div>
          </div>

          {/* People Image - Positioned in front of the layered background */}
          <div className="mt-auto relative z-10 flex justify-center w-full px-4">
            <img
              src={teamImage}
              alt="Team"
              className="w-full max-w-[420px] h-auto relative top-10"
            />
          </div>

          {/* Bottom Stats Card - Overlapping the image slightly */}
          <div className="bg-[#002147] text-white py-10 px-6 rounded-tr-[40px] relative z-20 shadow-[0_-20px_50px_rgba(0,33,71,0.15)]">
            <div className="flex justify-between items-start text-center">
              <div className="flex-1 flex flex-col items-center">
                <ShieldCheck size={20} className="mb-3 text-white/90" />
                <h4 className="text-[12px] font-bold leading-tight">Verified <br /> Candidates</h4>
                <p className="text-[9px] text-gray-400 font-medium mt-2">Quality you can trust</p>
              </div>
              <div className="w-[1px] h-12 bg-white/10 mt-2"></div>
              <div className="flex-1 flex flex-col items-center">
                <Building2 size={20} className="mb-3 text-white/90" />
                <h4 className="text-[12px] font-bold leading-tight">Reliable <br /> Businesses</h4>
                <p className="text-[9px] text-gray-400 font-medium mt-2">Partners in growth</p>
              </div>
              <div className="w-[1px] h-12 bg-white/10 mt-2"></div>
              <div className="flex-1 flex flex-col items-center">
                <Users size={20} className="mb-3 text-white/90" />
                <h4 className="text-[12px] font-bold leading-tight">Better <br /> Opportunities</h4>
                <p className="text-[9px] text-gray-400 font-medium mt-2">For a stronger tomorrow</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Section: Login Form (Pixel-Perfect Design) */}
        <div className="w-full md:w-[58%] px-10 md:px-20 py-12 flex flex-col justify-center relative bg-white rounded-r-[32px]">

          {/* Header Section */}
          <div className="text-center mb-8">
            <h2 className="text-[22px] font-bold text-[#062b66] mb-1 tracking-tight">Login to Continue</h2>
            <p className="text-[#9ca3af] text-[13px] font-normal leading-relaxed">Access your account to continue</p>
          </div>

          {/* User Type Selector - Refined Tabs */}
          <div className="bg-[#fcfdfe] p-[3px] rounded-lg flex mb-7 border border-[#f1f3f7] shadow-[0_2px_8px_rgba(0,0,0,0.03)]">
            <button
              onClick={() => setUserType('candidate')}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-md font-semibold text-[13px] transition-all duration-300 ${userType === 'candidate' ? 'bg-[#0a46d8] text-white shadow-[0_4px_12px_rgba(10,70,216,0.2)]' : 'text-[#6b7280] bg-transparent'}`}
            >
              <User size={15} />
              Candidate
            </button>
            <button
              onClick={() => setUserType('business')}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-md font-semibold text-[13px] transition-all duration-300 ${userType === 'business' ? 'bg-[#0a46d8] text-white shadow-[0_4px_12px_rgba(10,70,216,0.2)]' : 'text-[#6b7280] bg-transparent'}`}
            >
              <Briefcase size={15} />
              Business Owner
            </button>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-4 mb-7">
            <div className="h-[1px] flex-grow bg-gray-100"></div>
            <span className="text-[#9ca3af] text-[11px] font-medium">or</span>
            <div className="h-[1px] flex-grow bg-gray-100"></div>
          </div>

          {/* Login with Mobile Section */}
          <div className="mb-7">
            <h3 className="text-[14px] font-bold text-[#062b66] mb-0.5">Login with Mobile Number</h3>
            <p className="text-[#9ca3af] text-[11px] font-medium mb-4">We will send you a 6 digit OTP</p>

            <div className="flex gap-3 mb-4">
              <div className="relative group">
                <select className="appearance-none bg-white border border-[#e5e7eb] px-4 h-[44px] rounded-lg font-semibold text-[#062b66] text-[13px] focus:outline-none focus:border-[#0a46d8]/30 transition-all shadow-[0_1px_2px_rgba(0,0,0,0.02)] min-w-[72px] cursor-pointer">
                  <option>+91</option>
                  <option>+1</option>
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-[#9ca3af]">
                  <svg width="8" height="5" viewBox="0 0 12 8" fill="none"><path d="M1 1.5L6 6.5L11 1.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                </div>
              </div>
              <input
                type="tel"
                placeholder="Enter mobile number"
                className="flex-grow bg-white border border-[#e5e7eb] px-4 h-[44px] rounded-lg font-semibold text-[#062b66] text-[13px] focus:outline-none focus:border-[#0a46d8]/30 transition-all shadow-[0_1px_2px_rgba(0,0,0,0.02)] placeholder:text-[#d1d5db] placeholder:font-normal"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, '').slice(0, 10))}
              />
            </div>

            {error && <p className="text-red-500 text-xs mb-3 font-medium">{error}</p>}

            <button
              onClick={handleGetOTP}
              disabled={loading}
              className={`w-full bg-[#0a46d8] text-white h-[46px] rounded-lg font-semibold text-[14px] flex items-center justify-center gap-2 hover:bg-[#093ec2] transition-all shadow-[0_4px_12px_rgba(10,70,216,0.15)] ${loading ? 'opacity-70' : ''}`}
            >
              {loading ? 'Sending...' : 'Send OTP'} <ArrowRight size={16} />
            </button>
          </div>

          {/* Second Divider */}
          <div className="flex items-center gap-4 mb-7">
            <div className="h-[1px] flex-grow bg-gray-100"></div>
            <span className="text-[#9ca3af] text-[11px] font-medium">or</span>
            <div className="h-[1px] flex-grow bg-gray-100"></div>
          </div>

          {/* Google Login Button */}
          <button className="w-full bg-white border border-[#e5e7eb] h-[64px] rounded-lg flex flex-col items-center justify-center transition-all hover:bg-gray-50 shadow-[0_2px_6px_rgba(0,0,0,0.02)]">
            <div className="flex items-center gap-3">
              <svg className="w-[18px] h-[18px]" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1c-4.3 0-8.01 2.53-9.82 6.18l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              </svg>
              <span className="font-bold text-[#374151] text-[14px]">Continue with Google</span>
            </div>
            <span className="text-[10px] text-[#9ca3af] font-medium mt-0.5">(BUSINESS OWNER ONLY)</span>
          </button>

          {/* Bottom Right Dot Pattern */}
          <div className="absolute bottom-8 right-8 w-12 h-12 opacity-40 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, #FFD700 2px, transparent 0)', backgroundSize: '10px 10px' }}></div>

          <p className="text-center mt-10 text-[11px] font-medium text-[#9ca3af]">
            By continuing, you agree to our <a href="#" className="text-[#062b66] font-bold hover:underline">Terms & Conditions</a>
          </p>
        </div>

      </div>
    </div>
  );
};

export default Login;
