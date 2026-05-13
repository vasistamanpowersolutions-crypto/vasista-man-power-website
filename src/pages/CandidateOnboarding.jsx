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
    dateOfBirth: '',
    city: '',
    state: '',
    qualification: '',
    experience: '',
    skills: '',
    aadharNumber: '',
    panNumber: '',
    emergencyContactName: '',
    emergencyContactRelation: '',
    emergencyContactMobile: ''
  });

  const [images, setImages] = useState({
    aadharFront: null,
    aadharBack: null,
    panCard: null,
    profilePhoto: null
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

      const response = await fetch('http://localhost:3000/api/candidates', {
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
        // Extract message string from error object to avoid React crash
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
          <h1 className="text-3xl font-bold mb-2">Complete Your Profile</h1>
          <p className="text-white/80">Tell us more about yourself to get started with opportunities.</p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-8">
          {error && <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm font-medium">{typeof error === 'object' ? JSON.stringify(error) : error}</div>}

          {/* Personal Info */}
          <section>
            <div className="flex items-center gap-2 mb-6 text-[#062B67]">
              <User size={20} />
              <h2 className="text-xl font-bold">Personal Information</h2>
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
                <label className="text-sm font-bold text-gray-700">Date of Birth *</label>
                <input required type="date" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleInputChange} className="w-full h-12 px-4 rounded-xl border border-gray-200 focus:border-[#0a46d8] outline-none transition-all" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700">Profile Photo *</label>
                <div className="relative">
                  <input required type="file" name="profilePhoto" onChange={handleImageChange} className="hidden" id="profilePhoto" />
                  <label htmlFor="profilePhoto" className="flex items-center justify-center gap-2 w-full h-12 px-4 rounded-xl border-2 border-dashed border-gray-200 cursor-pointer hover:bg-gray-50 transition-all">
                    {images.profilePhoto ? <Check className="text-green-500" size={18} /> : <Upload size={18} />}
                    <span className="text-sm font-medium text-gray-600">{images.profilePhoto ? 'Photo Selected' : 'Upload Photo'}</span>
                  </label>
                </div>
              </div>
            </div>
          </section>

          {/* Location & Education */}
          <section>
            <div className="flex items-center gap-2 mb-6 text-[#062B67]">
              <MapPin size={20} />
              <h2 className="text-xl font-bold">Location & Background</h2>
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
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700">Qualification</label>
                <input name="qualification" value={formData.qualification} onChange={handleInputChange} className="w-full h-12 px-4 rounded-xl border border-gray-200 focus:border-[#0a46d8] outline-none transition-all" placeholder="Education qualification" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700">Experience (Years)</label>
                <input name="experience" value={formData.experience} onChange={handleInputChange} className="w-full h-12 px-4 rounded-xl border border-gray-200 focus:border-[#0a46d8] outline-none transition-all" placeholder="Years of experience" />
              </div>
            </div>
            <div className="space-y-2 mt-6">
              <label className="text-sm font-bold text-gray-700">Skills</label>
              <textarea name="skills" value={formData.skills} onChange={handleInputChange} className="w-full p-4 rounded-xl border border-gray-200 focus:border-[#0a46d8] outline-none transition-all" placeholder="Enter skills (comma separated)" rows="3" />
            </div>
          </section>

          {/* Identity Verification */}
          <section>
            <div className="flex items-center gap-2 mb-6 text-[#062B67]">
              <Shield size={20} />
              <h2 className="text-xl font-bold">Identity Verification</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700">Aadhar Number *</label>
                <input required name="aadharNumber" value={formData.aadharNumber} onChange={handleInputChange} className="w-full h-12 px-4 rounded-xl border border-gray-200 focus:border-[#0a46d8] outline-none transition-all" placeholder="12-digit Aadhar" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700">PAN Number *</label>
                <input required name="panNumber" value={formData.panNumber} onChange={handleInputChange} className="w-full h-12 px-4 rounded-xl border border-gray-200 focus:border-[#0a46d8] outline-none transition-all" placeholder="PAN Number" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700">Aadhar Front *</label>
                <input required type="file" name="aadharFront" onChange={handleImageChange} className="hidden" id="aadharFront" />
                <label htmlFor="aadharFront" className="flex items-center justify-center gap-2 w-full h-12 px-4 rounded-xl border-2 border-dashed border-gray-200 cursor-pointer hover:bg-gray-50 transition-all">
                  {images.aadharFront ? <Check className="text-green-500" size={18} /> : <Upload size={18} />}
                  <span className="text-sm font-medium text-gray-600">Upload Aadhar Front</span>
                </label>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700">Aadhar Back *</label>
                <input required type="file" name="aadharBack" onChange={handleImageChange} className="hidden" id="aadharBack" />
                <label htmlFor="aadharBack" className="flex items-center justify-center gap-2 w-full h-12 px-4 rounded-xl border-2 border-dashed border-gray-200 cursor-pointer hover:bg-gray-50 transition-all">
                  {images.aadharBack ? <Check className="text-green-500" size={18} /> : <Upload size={18} />}
                  <span className="text-sm font-medium text-gray-600">Upload Aadhar Back</span>
                </label>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700">PAN Card *</label>
                <input required type="file" name="panCard" onChange={handleImageChange} className="hidden" id="panCard" />
                <label htmlFor="panCard" className="flex items-center justify-center gap-2 w-full h-12 px-4 rounded-xl border-2 border-dashed border-gray-200 cursor-pointer hover:bg-gray-50 transition-all">
                  {images.panCard ? <Check className="text-green-500" size={18} /> : <Upload size={18} />}
                  <span className="text-sm font-medium text-gray-600">Upload PAN Card</span>
                </label>
              </div>
            </div>
          </section>

          {/* Emergency Contact */}
          <section>
            <div className="flex items-center gap-2 mb-6 text-[#062B67]">
              <Phone size={20} />
              <h2 className="text-xl font-bold">Emergency Contact</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700">Contact Name *</label>
                <input required name="emergencyContactName" value={formData.emergencyContactName} onChange={handleInputChange} className="w-full h-12 px-4 rounded-xl border border-gray-200 focus:border-[#0a46d8] outline-none transition-all" placeholder="Name" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700">Relation *</label>
                <select required name="emergencyContactRelation" value={formData.emergencyContactRelation} onChange={handleInputChange} className="w-full h-12 px-4 rounded-xl border border-gray-200 focus:border-[#0a46d8] outline-none transition-all">
                  <option value="">Select relation</option>
                  <option value="Father">Father</option>
                  <option value="Mother">Mother</option>
                  <option value="Brother">Brother</option>
                  <option value="Sister">Sister</option>
                  <option value="Spouse">Spouse</option>
                  <option value="Son">Son</option>
                  <option value="Daughter">Daughter</option>
                  <option value="Friend">Friend</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700">Mobile Number *</label>
                <input required name="emergencyContactMobile" value={formData.emergencyContactMobile} onChange={handleInputChange} className="w-full h-12 px-4 rounded-xl border border-gray-200 focus:border-[#0a46d8] outline-none transition-all" placeholder="Contact number" />
              </div>
            </div>
          </section>

          <button type="submit" disabled={loading} className="w-full h-14 bg-[#0a46d8] text-white rounded-xl font-bold text-lg shadow-lg hover:bg-[#093ec2] transition-all disabled:opacity-70 active:scale-[0.98]">
            {loading ? 'Saving Details...' : 'Complete Registration'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CandidateOnboarding;
