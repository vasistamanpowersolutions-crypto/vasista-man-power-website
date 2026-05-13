import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Building, User, MapPin, Mail, Upload, Check, Shield } from 'lucide-react';

const BusinessOnboarding = () => {
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
    businessName: '',
    ownerName: '',
    email: '',
    address: '',
    docType: 'GST'
  });

  const [images, setImages] = useState({
    docImageUrl: null,
    businessFrontUrl: null
  });

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImages({ ...images, [e.target.name]: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const payload = {
        ...formData,
        mobileNumber: user.phoneNumber,
        ...images
      };

      const response = await fetch(`${import.meta.env.VITE_API_URL}/businesses`, {
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
        <div className="bg-[#062B67] p-8 text-white">
          <h1 className="text-3xl font-bold mb-2">Register Your Business</h1>
          <p className="text-white/80">Help us understand your business needs better.</p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-8">
          {error && <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm font-medium">{typeof error === 'object' ? JSON.stringify(error) : error}</div>}

          {/* Business Info */}
          <section>
            <div className="flex items-center gap-2 mb-6 text-[#062B67]">
              <Building size={20} />
              <h2 className="text-xl font-bold">Business Information</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700">Business Name *</label>
                <input required name="businessName" value={formData.businessName} onChange={handleInputChange} className="w-full h-12 px-4 rounded-xl border border-gray-200 focus:border-[#0a46d8] outline-none transition-all" placeholder="Enter business name" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700">Owner Name *</label>
                <input required name="ownerName" value={formData.ownerName} onChange={handleInputChange} className="w-full h-12 px-4 rounded-xl border border-gray-200 focus:border-[#0a46d8] outline-none transition-all" placeholder="Enter owner name" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input type="email" name="email" value={formData.email} onChange={handleInputChange} className="w-full h-12 pl-12 pr-4 rounded-xl border border-gray-200 focus:border-[#0a46d8] outline-none transition-all" placeholder="business@example.com" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700">Business Front Photo</label>
                <div className="relative">
                  <input type="file" name="businessFrontUrl" onChange={handleImageChange} className="hidden" id="businessFront" />
                  <label htmlFor="businessFront" className="flex items-center justify-center gap-2 w-full h-12 px-4 rounded-xl border-2 border-dashed border-gray-200 cursor-pointer hover:bg-gray-50 transition-all">
                    {images.businessFrontUrl ? <Check className="text-green-500" size={18} /> : <Upload size={18} />}
                    <span className="text-sm font-medium text-gray-600">Upload Business Front</span>
                  </label>
                </div>
              </div>
            </div>
          </section>

          {/* Location */}
          <section>
            <div className="flex items-center gap-2 mb-6 text-[#062B67]">
              <MapPin size={20} />
              <h2 className="text-xl font-bold">Address</h2>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700">Full Address</label>
              <textarea name="address" value={formData.address} onChange={handleInputChange} rows="3" className="w-full p-4 rounded-xl border border-gray-200 focus:border-[#0a46d8] outline-none transition-all resize-none" placeholder="Enter business address"></textarea>
            </div>
          </section>

          {/* Verification */}
          <section>
            <div className="flex items-center gap-2 mb-6 text-[#062B67]">
              <Shield size={20} />
              <h2 className="text-xl font-bold">Verification Documents</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700">Document Type</label>
                <select name="docType" value={formData.docType} onChange={handleInputChange} className="w-full h-12 px-4 rounded-xl border border-gray-200 focus:border-[#0a46d8] outline-none transition-all bg-white">
                  <option value="GST">GST Certificate</option>
                  <option value="License">Trade License</option>
                  <option value="Udyam">Udyam Registration</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700">Document Image</label>
                <input type="file" name="docImageUrl" onChange={handleImageChange} className="hidden" id="docImage" />
                <label htmlFor="docImage" className="flex items-center justify-center gap-2 w-full h-12 px-4 rounded-xl border-2 border-dashed border-gray-200 cursor-pointer hover:bg-gray-50 transition-all">
                  {images.docImageUrl ? <Check className="text-green-500" size={18} /> : <Upload size={18} />}
                  <span className="text-sm font-medium text-gray-600">Upload Document</span>
                </label>
              </div>
            </div>
          </section>

          <button type="submit" disabled={loading} className="w-full h-14 bg-[#0a46d8] text-white rounded-xl font-bold text-lg shadow-lg hover:bg-[#093ec2] transition-all disabled:opacity-70 active:scale-[0.98]">
            {loading ? 'Registering...' : 'Register Business'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default BusinessOnboarding;
