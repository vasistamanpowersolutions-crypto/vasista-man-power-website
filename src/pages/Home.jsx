import React from 'react';
import { ArrowRight, Users, Building2, ShieldCheck, CheckCircle, Briefcase } from 'lucide-react';
import teamFinal from '../assets/team-final.png';
import logo from '../assets/logo.jpeg';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import usePWA from '../hooks/usePWA';


const Home = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { isInstallable, installApp } = usePWA();

  const handleGetStarted = () => {
    if (isInstallable) {
      installApp();
      return;
    }
    if (user) {
      navigate('/profile');
    } else {
      navigate('/login');
    }
  };
  return (
    <div className="min-h-screen bg-white font-outfit relative">

      {/* ==================================================
          MOBILE VIEW ONLY (max-width: 768px)
          ================================================== */}
      <style>{`
        @media (max-width: 768px) {
          .mobile-section-container {
            padding-left: 24px !important;
            padding-right: 24px !important;
            padding-top: 16px !important;
            padding-bottom: 40px !important;
          }

          .mobile-welcome-text {
            font-size: 16px !important;
            font-weight: 500 !important;
            line-height: 1.3 !important;
            color: #111827 !important;
            margin-bottom: 6px !important;
          }

          .mobile-main-heading {
            font-size: 32px !important;
            font-weight: 700 !important;
            line-height: 1.08 !important;
            letter-spacing: -0.5px !important;
            color: #0B2C6D !important;
            max-width: 280px !important;
            margin-bottom: 10px !important;
          }

          .mobile-subtitle {
            font-size: 15px !important;
            font-weight: 500 !important;
            line-height: 1.4 !important;
            color: #111827 !important;
            margin-bottom: 16px !important;
          }

          .mobile-divider {
            width: 48px !important;
            height: 3px !important;
            background: #F4B400 !important;
            border-radius: 999px !important;
            margin-bottom: 18px !important;
          }

          .mobile-description {
            font-size: 14px !important;
            font-weight: 400 !important;
            line-height: 1.75 !important;
            color: #4B5563 !important;
            margin-bottom: 24px !important;
          }

          .mobile-cta-button {
            width: 100% !important;
            height: 52px !important;
            border-radius: 16px !important;
            font-size: 18px !important;
            font-weight: 600 !important;
            background: linear-gradient(90deg, #0B57D0, #0047CC) !important;
            box-shadow: 0 8px 20px rgba(11,87,208,0.20) !important;
            margin-bottom: 28px !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            gap: 10px !important;
            color: white !important;
            border: none !important;
          }

          .mobile-feature-item {
            display: flex !important;
            align-items: flex-start !important;
            gap: 14px !important;
            margin-bottom: 22px !important;
          }

          .mobile-feature-icon-box {
            width: 56px !important;
            height: 56px !important;
            min-width: 56px !important;
            border-radius: 14px !important;
            background: #EEF5FF !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
          }

          .mobile-feature-title {
            font-size: 18px !important;
            font-weight: 600 !important;
            line-height: 1.3 !important;
            color: #111827 !important;
            margin-bottom: 4px !important;
          }

          .mobile-feature-desc {
            font-size: 14px !important;
            font-weight: 400 !important;
            line-height: 1.6 !important;
            color: #4B5563 !important;
          }

          .mobile-hero-img-section {
            margin-bottom: 28px !important;
          }

          /* Remove Footer Wave on Mobile */
          .footer-wave {
            display: none !important;
          }
        }
      `}</style>

      <div className="block md:hidden w-full bg-white relative">

        {/* MOBILE CONTENT CONTAINER */}
        <div className="mobile-section-container w-full bg-white">

          {/* 1. Hero Image Section */}
          <div className="mobile-hero-img-section w-full flex flex-col justify-center items-center relative pt-0">
            {/* Soft Blob Background */}
            <div className="absolute top-[20%] left-1/2 -translate-x-1/2 w-[110%] h-[90%] bg-[#F2F8FF] rounded-full blur-[40px] -z-10 opacity-70"></div>

            <div className="relative w-full max-w-[320px]">
              {/* Main Image */}
              <img
                src={teamFinal}
                alt="Vasista Team"
                className="w-full h-auto object-contain relative z-10"
              />

              {/* Floating Icons */}
              <div className="absolute top-[40%] -left-4 w-[52px] h-[52px] rounded-full bg-white shadow-[0_8px_24px_rgba(0,0,0,0.08)] flex items-center justify-center z-20">
                <Users className="text-[#0B57D0]" size={24} />
              </div>
              <div className="absolute top-[18%] -right-4 w-[52px] h-[52px] rounded-full bg-white shadow-[0_8px_24px_rgba(0,0,0,0.08)] flex items-center justify-center z-20">
                <Briefcase className="text-[#0B57D0]" size={24} />
              </div>
            </div>
          </div>

          {/* 2. Welcome Text Content */}
          <div className="text-left relative z-10">
            <h2 className="mobile-welcome-text">Welcome to</h2>
            <h1 className="mobile-main-heading">
              Vasista Man Power <br /> Solutions
            </h1>
            <p className="mobile-subtitle">
              Connecting Talent. Powering Businesses.
            </p>

            {/* Yellow Divider Line */}
            <div className="mobile-divider"></div>

            <p className="mobile-description">
              We bridge the gap between skilled professionals and growing businesses.
              Whether you are looking for the right opportunity or the right talent,
              we are here to help you succeed.
            </p>
          </div>

          {/* 3. Get Started Button */}
          <button
            onClick={handleGetStarted}
            className="mobile-cta-button transition-transform active:scale-[0.98]"
          >
            {isInstallable ? 'Install App' : 'Get Started'} <ArrowRight size={20} />
          </button>

          {/* 4. Feature Cards List */}
          <div className="flex flex-col relative z-10">
            <div className="mobile-feature-item">
              <div className="mobile-feature-icon-box">
                <Users className="text-[#0B57D0]" size={24} />
              </div>
              <div>
                <h3 className="mobile-feature-title">Find the Right Talent</h3>
                <p className="mobile-feature-desc">Access a wide pool of verified and skilled candidates across industries.</p>
              </div>
            </div>

            <div className="mobile-feature-item">
              <div className="mobile-feature-icon-box">
                <Building2 className="text-[#0B57D0]" size={24} />
              </div>
              <div>
                <h3 className="mobile-feature-title">Grow Your Business</h3>
                <p className="mobile-feature-desc">Reliable manpower solutions tailored to your business needs.</p>
              </div>
            </div>

            <div className="mobile-feature-item">
              <div className="mobile-feature-icon-box">
                <ShieldCheck className="text-[#0B57D0]" size={24} />
              </div>
              <div>
                <h3 className="mobile-feature-title">Trusted & Reliable</h3>
                <p className="mobile-feature-desc">We ensure transparency, quality, and long-term partnerships.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ==================================================
          TABLET VIEW ONLY (768px - 1024px)
          ================================================== */}
      <div className="hidden md:block lg:hidden w-full bg-[#f4f7fa] min-h-screen relative">
        <style>{`
          @media (min-width: 768px) and (max-width: 1024px) {
            .tablet-master-wrapper {
              background-color: #f4f7fa;
              min-height: 100vh;
              padding: 24px 0;
              width: 100%;
              display: flex;
              justify-content: center;
              align-items: flex-start;
            }

            .tablet-master-card {
              width: 96%;
              background-color: #ffffff;
              border-radius: 40px;
              box-shadow: 0 30px 100px rgba(0,0,0,0.08);
              overflow: hidden;
              display: flex;
              flex-direction: column;
              border: 1px solid rgba(0,0,0,0.02);
            }

            .tablet-navbar {
              height: 96px;
              width: 100%;
              display: flex;
              align-items: center;
              justify-content: space-between;
              padding: 0 40px;
              background: #ffffff;
              position: relative;
            }

            .tablet-container {
              display: flex;
              flex-direction: column;
              align-items: center;
              padding: 0 40px 60px;
              width: 100%;
              gap: 32px;
            }

            .tablet-card-layer {
              width: 100%;
              background: #f8fafc;
              border-radius: 36px;
              padding: 6px;
              display: flex;
              justify-content: center;
              align-items: center;
            }

            .tablet-hero-section {
              width: 100%;
              max-width: 800px;
              background: #ffffff;
              padding: 20px 32px 10px;
              position: relative;
              display: flex;
              justify-content: center;
              overflow: hidden;
            }

            .tablet-heading {
              font-size: 56px;
              font-weight: 900;
              color: #0B2C6D;
              line-height: 1.02;
              text-align: left;
              max-width: none;
            }

            .tablet-feature-card {
              width: 100%;
              background: #ffffff;
              padding: 24px 32px;
              border-radius: 30px;
              display: flex;
              align-items: center;
              gap: 28px;
              box-shadow: 0 8px 32px rgba(0,0,0,0.02);
              border: 1px solid rgba(255,255,255,0.8);
            }

            .tablet-stats-container {
              width: 100%;
              background: #ffffff;
              border-radius: 32px;
              padding: 40px 32px;
              display: flex;
              justify-content: space-between;
              box-shadow: 0 10px 40px rgba(0,0,0,0.03);
              border: 1px solid rgba(255,255,255,0.8);
            }
          }
        `}</style>

        <div className="tablet-master-wrapper">
          <div className="tablet-master-card">

            {/* Tablet Navbar Inside Card */}
            <div className="tablet-navbar">
              <Link to="/">
                <img src={logo} alt="Logo" className="w-[140px] object-contain" />
              </Link>

              <div className="flex gap-5 absolute left-1/2 -translate-x-1/2">
                <Link to="/" className="text-[14px] font-bold text-[#F59E0B]">Home</Link>
                <Link to="/login" className="text-[14px] font-bold text-[#0B2C6D]">Login</Link>
                <Link to="/otp" className="text-[14px] font-bold text-[#0B2C6D]">OTP</Link>
                <Link to="/profile" className="text-[14px] font-bold text-[#0B2C6D]">Profile</Link>
              </div>

              <button
                onClick={handleGetStarted}
                className="h-[48px] px-8 bg-[#062B67] text-white rounded-full text-[15px] font-bold flex items-center justify-center shadow-lg transition-transform active:scale-95"
              >
                {isInstallable ? 'Install App' : 'Get Started'}
              </button>
            </div>

            <div className="tablet-container">
              {/* 1. Hero Image Section */}
              <div className="tablet-hero-section">
                {/* Soft Abstract Background */}
                <div className="absolute top-[10%] left-1/2 -translate-x-1/2 w-[120%] h-[80%] bg-[#F2F8FF] rounded-full blur-[60px] -z-10 opacity-80"></div>

                {/* Decorative Dots Pattern */}
                <div className="absolute top-10 left-8 w-20 h-10 opacity-30 z-0" style={{ backgroundImage: 'radial-gradient(circle, #002147 2px, transparent 0)', backgroundSize: '14px 14px' }}></div>
                <div className="absolute top-16 left-1/2 -translate-x-1/2 w-28 h-12 opacity-20 z-0" style={{ backgroundImage: 'radial-gradient(circle, #FFB800 2px, transparent 0)', backgroundSize: '16px 16px' }}></div>

                <div className="relative w-full max-w-[400px] flex items-end">
                  <img src={teamFinal} alt="Vasista Team" className="w-[105%] max-none ml-[-2.5%] h-auto object-contain relative z-10 origin-bottom" />

                  {/* Floating Icons */}
                  <div className="absolute top-[40%] -left-6 w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-lg z-20 border border-gray-50/50">
                    <Users className="text-[#0B57D0]" size={26} />
                  </div>
                  <div className="absolute top-[18%] -right-6 w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-lg z-20 border border-gray-50/50">
                    <Briefcase className="text-[#0B57D0]" size={26} />
                  </div>
                </div>
              </div>

              {/* 2. Welcome Text Content */}
              <div className="w-full max-w-full text-left px-4">
                <h2 className="text-[18px] font-bold text-gray-800 mb-1.5">Welcome to</h2>
                <h1 className="tablet-heading mb-4">Vasista Man Power Solutions</h1>

                <div className="flex flex-col gap-1.5 mb-6">
                  <p className="text-[18px] font-bold text-[#0B2C6D]">Connecting Talent. Powering Businesses.</p>
                  <div className="w-12 h-1 bg-[#F4B400] rounded-full"></div>
                </div>

                <p className="text-gray-500 text-[16px] leading-[1.65] max-w-[700px] mb-8 font-medium opacity-90">
                  We bridge the gap between skilled professionals and growing businesses.
                  Whether you are looking for the right opportunity or the right talent,
                  we are here to help you succeed.
                </p>

                {/* 3. CTA Button */}
                <button
                  onClick={handleGetStarted}
                  className="bg-[#0B2C6D] text-white w-[240px] h-[52px] rounded-full font-bold text-[16px] flex items-center justify-center gap-2.5 shadow-[0_10px_24px_rgba(11,87,208,0.15)] hover:bg-[#093ec2] transition-all active:scale-[0.98]"
                >
                  {isInstallable ? 'Install App' : 'Get Started'} <ArrowRight size={20} />
                </button>
              </div>

              <div className="w-full max-w-full flex flex-col gap-6 px-4">
                <div className="tablet-card-layer">
                  <div className="tablet-feature-card">
                    <div className="w-16 h-16 bg-[#EEF5FF] rounded-2xl flex items-center justify-center text-[#0B57D0] shrink-0">
                      <Users size={32} />
                    </div>
                    <div>
                      <h3 className="text-[20px] font-bold text-gray-900 mb-1">Find the Right Talent</h3>
                      <p className="text-gray-500 text-[15px] font-medium leading-relaxed opacity-90">Access a wide pool of verified and skilled candidates across industries.</p>
                    </div>
                  </div>
                </div>

                <div className="tablet-card-layer">
                  <div className="tablet-feature-card">
                    <div className="w-16 h-16 bg-[#EEF5FF] rounded-2xl flex items-center justify-center text-[#0B57D0] shrink-0">
                      <Building2 size={32} />
                    </div>
                    <div>
                      <h3 className="text-[20px] font-bold text-gray-900 mb-1">Grow Your Business</h3>
                      <p className="text-gray-500 text-[15px] font-medium leading-relaxed opacity-90">Reliable manpower solutions tailored to your business needs.</p>
                    </div>
                  </div>
                </div>

                <div className="tablet-card-layer">
                  <div className="tablet-feature-card">
                    <div className="w-16 h-16 bg-[#EEF5FF] rounded-2xl flex items-center justify-center text-[#0B57D0] shrink-0">
                      <ShieldCheck size={32} />
                    </div>
                    <div>
                      <h3 className="text-[20px] font-bold text-gray-900 mb-1">Trusted & Reliable</h3>
                      <p className="text-gray-500 text-[15px] font-medium leading-relaxed opacity-90">We ensure transparency, quality, and long-term partnerships.</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* 5. Statistics Section */}
              <div className="w-full px-4">
                <div className="tablet-card-layer">
                  <div className="tablet-stats-container">
                    <div className="flex-1 flex flex-col items-center gap-2">
                      <Users size={28} className="text-[#0B57D0]" />
                      <h4 className="text-[32px] font-black text-[#0B2C6D] leading-none">10K+</h4>
                      <p className="text-[12px] text-gray-400 font-bold uppercase tracking-widest mt-1">Candidates</p>
                    </div>
                    <div className="w-[1px] h-16 bg-gray-100/80"></div>
                    <div className="flex-1 flex flex-col items-center gap-2">
                      <Building2 size={28} className="text-[#0B57D0]" />
                      <h4 className="text-[32px] font-black text-[#0B2C6D] leading-none">500+</h4>
                      <p className="text-[12px] text-gray-400 font-bold uppercase tracking-widest mt-1">Businesses</p>
                    </div>
                    <div className="w-[1px] h-16 bg-gray-100/80"></div>
                    <div className="flex-1 flex flex-col items-center gap-2">
                      <CheckCircle size={28} className="text-[#0B57D0]" />
                      <h4 className="text-[32px] font-black text-[#0B2C6D] leading-none">98%</h4>
                      <p className="text-[12px] text-gray-400 font-bold uppercase tracking-widest mt-1">Satisfaction</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 6. Bottom Curved Footer Wave - PERFECTLY INTEGRATED */}
            <div className="w-full bg-[#062B67] py-12 px-8 flex flex-col items-center text-center">
              <div className="flex items-center justify-center mb-5">
                <span className="text-white text-4xl opacity-20 font-serif leading-none h-6">“</span>
              </div>
              <p className="text-white text-[17px] font-medium max-w-[500px] leading-relaxed opacity-90">
                Our mission is to empower people and businesses to achieve more together.
              </p>
            </div>

          </div>
        </div>
      </div>

      {/* ==================================================
          DESKTOP VIEW ONLY (min-width: 1024px)
          ================================================== */}
      <div className="hidden lg:block pt-16 md:pt-24 lg:pt-5">
        {/* Hero Section */}
        <section className="container mx-auto max-w-7xl px-8 lg:px-16 py-0">
          <div className="flex flex-col lg:flex-row items-start justify-between gap-6 lg:gap-16">

            {/* Left Side: Content */}
            <div className="w-full lg:w-[48%] flex flex-col pt-10">
              <div className="flex flex-col gap-2">
                <h2 className="text-xl md:text-2xl font-bold text-gray-800 tracking-tight">Welcome to</h2>
                <h1 className="text-[42px] md:text-5xl lg:text-[64px] font-black text-primary leading-[1.05] tracking-tight">
                  Vasista Man Power <br /> Solutions
                </h1>
              </div>

              <div className="mt-6 mb-6">
                <div className="inline-block relative">
                  <p className="text-xl font-bold text-gray-700">
                    Connecting Talent. Powering Businesses.
                  </p>
                  <div className="absolute -bottom-2 left-0 w-12 h-1 bg-secondary rounded-full"></div>
                </div>
              </div>

              <p className="text-gray-500 max-w-lg leading-relaxed text-sm md:text-base font-medium opacity-85 mb-8">
                We bridge the gap between skilled professionals and growing businesses.
                Whether you are looking for the right opportunity or the right talent,
                we are here to help you succeed.
              </p>

              {/* Feature Rows - Highly Compact */}
              <div className="flex flex-col gap-4 mt-2">
                <div className="flex items-center gap-4 group">
                  <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all duration-300 shadow-sm shrink-0">
                    <Users size={22} />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800 text-sm md:text-base">Find the Right Talent</h3>
                    <p className="text-[12px] text-gray-400 font-medium">Access a wide pool of verified and skilled candidates across industries.</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 group">
                  <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all duration-300 shadow-sm shrink-0">
                    <Building2 size={22} />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800 text-sm md:text-base">Grow Your Business</h3>
                    <p className="text-[12px] text-gray-400 font-medium">Reliable manpower solutions tailored to your business needs.</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 group">
                  <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all duration-300 shadow-sm shrink-0">
                    <ShieldCheck size={22} />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800 text-sm md:text-base">Trusted & Reliable</h3>
                    <p className="text-[12px] text-gray-400 font-medium">We ensure transparency, quality, and long-term partnerships.</p>
                  </div>
                </div>
              </div>

              {/* CTA */}
              <div className="mt-10 mb-8">
                <button
                  onClick={handleGetStarted}
                  className="bg-primary text-white px-12 py-4 rounded-full font-bold text-base flex items-center gap-2 hover:bg-primary-light transition-all shadow-[0_15px_30px_rgba(0,33,71,0.2)]"
                >
                  {isInstallable ? 'Install App' : 'Get Started'} <ArrowRight size={22} />
                </button>
                <p className="text-[12px] text-gray-400 mt-4 font-medium opacity-80">
                  Join us today and take the first step towards success.
                </p>
              </div>
            </div>

            {/* Right Side: Re-aligned Reference Build (Taller) */}
            <div className="w-full lg:w-[48%] relative flex justify-center items-start pt-12">

              {/* Main Premium Card (Taller Portrait-Landscape balance) */}
              <div className="relative w-full max-w-[500px] bg-white rounded-[50px] shadow-[0_30px_80px_rgba(0,0,0,0.1)] border border-gray-100/50 overflow-hidden min-h-[600px] flex flex-col">

                {/* Soft Blob Shape */}
                <div className="absolute top-[5%] left-1/2 -translate-x-1/2 w-[120%] h-[80%] bg-[#F2F8FF] rounded-full blur-[60px] -z-10 opacity-80"></div>

                {/* Decorative Dots Pattern */}
                <div className="absolute top-14 left-1/2 -translate-x-1/2 w-36 h-18 opacity-35 z-0" style={{ backgroundImage: 'radial-gradient(circle, #002147 2.5px, transparent 0)', backgroundSize: '18px 18px' }}></div>
                <div className="absolute top-[28%] left-12 w-12 h-12 opacity-25 z-0" style={{ backgroundImage: 'radial-gradient(circle, #FFB800 2.5px, transparent 0)', backgroundSize: '14px 14px' }}></div>

                <div className="relative pt-24 px-2 flex-grow flex items-end">
                  {/* Final Team Image - Positioned higher and scaled up */}
                  <img
                    src={teamFinal}
                    alt="Vasista Team"
                    className="w-[105%] max-none ml-[-2.5%] h-auto relative z-10 origin-bottom"
                  />

                  {/* Floating Icons */}
                  <div className="absolute top-[38%] left-2 w-15 h-15 bg-white rounded-full flex items-center justify-center shadow-xl z-20 border border-gray-50/50">
                    <Users className="text-primary" size={28} />
                  </div>
                  <div className="absolute top-[18%] right-8 w-15 h-15 bg-white rounded-full flex items-center justify-center shadow-xl z-20 border border-gray-50/50">
                    <Briefcase className="text-primary" size={28} />
                  </div>
                </div>

                {/* Stats Card - Integrated at Bottom */}
                <div className="relative z-30 bg-white border-t border-gray-100 py-8 px-4 shadow-[0_-15px_40px_rgba(0,0,0,0.03)]">
                  <div className="flex justify-between items-center text-center">
                    <div className="flex-1 flex flex-col items-center gap-1.5">
                      <Users className="text-primary mb-1" size={20} strokeWidth={2} />
                      <h4 className="text-[24px] md:text-[28px] font-black text-primary leading-none">10K+</h4>
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1.5">Happy Candidates</p>
                    </div>
                    <div className="w-[1px] h-14 bg-gray-100"></div>
                    <div className="flex-1 flex flex-col items-center gap-1.5">
                      <Building2 className="text-primary mb-1" size={20} strokeWidth={2} />
                      <h4 className="text-[24px] md:text-[28px] font-black text-primary leading-none">500+</h4>
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mt-1.5">Trusted Businesses</p>
                    </div>
                    <div className="w-[1px] h-14 bg-gray-100"></div>
                    <div className="flex-1 flex flex-col items-center gap-1.5">
                      <CheckCircle className="text-primary mb-1" size={20} strokeWidth={2} />
                      <h4 className="text-[24px] md:text-[28px] font-black text-primary leading-none">98%</h4>
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mt-1.5">Satisfaction Rate</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

    </div>
  );
};

export default Home;
