import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { User, MapPin, Briefcase, Shield, Phone, Upload, Check } from 'lucide-react';

const CandidateOnboarding = () => {
  const { user, login, logout } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Critical: If token is "undefined" (string) or missing, force logout and re-login
  React.useEffect(() => {
    if (user && (user.token === 'undefined' || !user.token)) {
      console.warn('Invalid token detected on onboarding, redirecting to login');
      logout();
      navigate('/login');
    }
  }, [user, logout, navigate]);
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    type: 'Full-time', // Part-time or Full-time
    experienceLevel: 'Fresher', // Fresher or Experienced
    previousJobTitle: '',
    experienceYears: '',
    wantedJobTitle: '',
    skills: '',
    fatherName: '',
    fatherMobileNumber: '',
    address: '',
    city: '',
    state: ''
  });

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const payload = {
        ...formData,
        mobileNumber: user.phoneNumber,
        candidateStatus: 'Open to Work',
        kycStatus: 'Pending'
      };

      const response = await fetch(`${import.meta.env.VITE_API_URL}/candidates`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (response.ok) {
        login({ ...user, ...data });
        navigate('/profile');
      } else {
        const errorMsg = data.error?.message || data.message || 'Failed to save details';
        setError(errorMsg);
      }
    } catch (err) {
      setError('Something went wrong. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50/50 py-12 px-4 font-outfit">
      <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
        <div className="bg-[#062B67] p-8 text-white text-center">
          <h1 className="text-3xl font-bold mb-2">Candidate Onboarding</h1>
          <p className="text-white/80">Help us understand your profile better to find the right jobs for you.</p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-8">
          {error && <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm font-medium">{typeof error === 'object' ? JSON.stringify(error) : error}</div>}

          {/* Basic Information */}
          <section>
            <div className="flex items-center gap-2 mb-6 text-[#062B67]">
              <User size={20} />
              <h2 className="text-xl font-bold">Basic Information</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700">First Name *</label>
                <input required name="firstName" value={formData.firstName} onChange={handleInputChange} className="w-full h-12 px-4 rounded-xl border border-gray-200 focus:border-[#0a46d8] outline-none transition-all" placeholder="Enter first name" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700">Last Name *</label>
                <input required name="lastName" value={formData.lastName} onChange={handleInputChange} className="w-full h-12 px-4 rounded-xl border border-gray-200 focus:border-[#0a46d8] outline-none transition-all" placeholder="Enter last name" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700">Mobile Number</label>
                <input disabled value={user?.phoneNumber || ''} className="w-full h-12 px-4 rounded-xl border border-gray-100 bg-gray-50 text-gray-500 outline-none cursor-not-allowed" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700">Job Type *</label>
                <select required name="type" value={formData.type} onChange={handleInputChange} className="w-full h-12 px-4 rounded-xl border border-gray-200 focus:border-[#0a46d8] outline-none transition-all">
                  <option value="Full-time">Full-time</option>
                  <option value="Part-time">Part-time</option>
                </select>
              </div>
            </div>
          </section>

          {/* Professional Details */}
          <section>
            <div className="flex items-center gap-2 mb-6 text-[#062B67]">
              <Briefcase size={20} />
              <h2 className="text-xl font-bold">Professional Details</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700">Experience Level *</label>
                <select required name="experienceLevel" value={formData.experienceLevel} onChange={handleInputChange} className="w-full h-12 px-4 rounded-xl border border-gray-200 focus:border-[#0a46d8] outline-none transition-all">
                  <option value="Fresher">Fresher</option>
                  <option value="Experienced">Experienced</option>
                </select>
              </div>

              {formData.experienceLevel === 'Experienced' && (
                <>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700">Previous Job Title *</label>
                    <input required name="previousJobTitle" value={formData.previousJobTitle} onChange={handleInputChange} className="w-full h-12 px-4 rounded-xl border border-gray-200 focus:border-[#0a46d8] outline-none transition-all" placeholder="e.g. Sales Executive" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700">Total Experience (Years) *</label>
                    <input required type="number" name="experienceYears" value={formData.experienceYears} onChange={handleInputChange} className="w-full h-12 px-4 rounded-xl border border-gray-200 focus:border-[#0a46d8] outline-none transition-all" placeholder="Years of experience" />
                  </div>
                </>
              )}
            </div>

            <div className="grid grid-cols-1 gap-6 mt-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700">Wanted Job Title (Comma separated) *</label>
                <textarea required name="wantedJobTitle" value={formData.wantedJobTitle} onChange={handleInputChange} className="w-full p-4 rounded-xl border border-gray-200 focus:border-[#0a46d8] outline-none transition-all" placeholder="e.g. Driver, Cook, Security Guard" rows="2" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700">Skills (Comma separated) *</label>
                <textarea required name="skills" value={formData.skills} onChange={handleInputChange} className="w-full p-4 rounded-xl border border-gray-200 focus:border-[#0a46d8] outline-none transition-all" placeholder="e.g. Driving, Cooking, First Aid" rows="2" />
              </div>
            </div>
          </section>

          {/* Family Details */}
          <section>
            <div className="flex items-center gap-2 mb-6 text-[#062B67]">
              <Shield size={20} />
              <h2 className="text-xl font-bold">Family Details</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700">Father's Name *</label>
                <input required name="fatherName" value={formData.fatherName} onChange={handleInputChange} className="w-full h-12 px-4 rounded-xl border border-gray-200 focus:border-[#0a46d8] outline-none transition-all" placeholder="Enter father's name" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700">Father's Mobile Number *</label>
                <input required name="fatherMobileNumber" value={formData.fatherMobileNumber} onChange={handleInputChange} className="w-full h-12 px-4 rounded-xl border border-gray-200 focus:border-[#0a46d8] outline-none transition-all" placeholder="Enter mobile number" />
              </div>
            </div>
          </section>

          {/* Address Details */}
          <section>
            <div className="flex items-center gap-2 mb-6 text-[#062B67]">
              <MapPin size={20} />
              <h2 className="text-xl font-bold">Address Details</h2>
            </div>
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700">Full Address *</label>
                <textarea required name="address" value={formData.address} onChange={handleInputChange} className="w-full p-4 rounded-xl border border-gray-200 focus:border-[#0a46d8] outline-none transition-all" placeholder="Enter full address" rows="2" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700">City *</label>
                  <input required name="city" value={formData.city} onChange={handleInputChange} className="w-full h-12 px-4 rounded-xl border border-gray-200 focus:border-[#0a46d8] outline-none transition-all" placeholder="City" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700">State *</label>
                  <input required name="state" value={formData.state} onChange={handleInputChange} className="w-full h-12 px-4 rounded-xl border border-gray-200 focus:border-[#0a46d8] outline-none transition-all" placeholder="State" />
                </div>
              </div>
            </div>
          </section>

          <button type="submit" disabled={loading} className="w-full h-14 bg-[#0a46d8] text-white rounded-xl font-bold text-lg shadow-lg hover:bg-[#093ec2] transition-all disabled:opacity-70 active:scale-[0.98]">
            {loading ? 'Saving Details...' : 'Save & Continue'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CandidateOnboarding;
