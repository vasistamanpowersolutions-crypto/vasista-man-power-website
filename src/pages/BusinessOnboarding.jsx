import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Building, User, MapPin, Mail, Upload, Check, Shield, ChevronDown, Search } from 'lucide-react';
import { State, City } from 'country-state-city';
import { geoData } from '../utils/geoData';

// Custom searchable dropdown component for single-select
const CustomDropdown = ({
  options = [],
  value = '',
  onChange,
  placeholder = 'Select option',
  disabled = false,
  required = false,
  label = '',
  showOthers = false
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const dropdownRef = React.useRef(null);

  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  let filteredOptions = options.filter(option =>
    option.toLowerCase().includes(search.toLowerCase())
  );

  if (showOthers) {
    const hasOthers = filteredOptions.some(opt => opt.toLowerCase() === 'others');
    if (!hasOthers) {
      if (!search || 'others'.includes(search.toLowerCase()) || filteredOptions.length === 0) {
        filteredOptions = [...filteredOptions, 'Others'];
      }
    }
  }

  const handleSelect = (option) => {
    onChange(option);
    setIsOpen(false);
    setSearch('');
  };

  return (
    <div className="relative space-y-2 w-full text-left" ref={dropdownRef}>
      {label && (
        <label className="text-sm font-bold text-gray-700 block">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <div
        onClick={() => !disabled && setIsOpen(!isOpen)}
        className={`w-full h-12 px-4 rounded-xl border flex items-center justify-between cursor-pointer transition-all bg-white ${
          disabled ? 'bg-gray-50 border-gray-100 text-gray-400 cursor-not-allowed' : 'border-gray-200 focus-within:border-[#0a46d8] hover:border-gray-300'
        }`}
      >
        <span className={value ? 'text-gray-900 font-medium' : 'text-gray-400'}>
          {value || placeholder}
        </span>
        <ChevronDown size={18} className={`text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </div>

      {isOpen && !disabled && (
        <div className="absolute z-50 w-full mt-1 bg-white rounded-xl border border-gray-100 shadow-xl max-h-60 overflow-hidden flex flex-col">
          <div className="p-2 border-b border-gray-50 flex items-center gap-2 bg-gray-50/50">
            <Search size={16} className="text-gray-400 shrink-0" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search..."
              className="w-full bg-transparent outline-none text-sm text-gray-700 placeholder-gray-400"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
          <div className="overflow-y-auto flex-1 max-h-48 scrollbar-thin">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option, idx) => (
                <div
                  key={idx}
                  onClick={() => handleSelect(option)}
                  className={`px-4 py-3 text-sm cursor-pointer transition-all hover:bg-gray-50 ${
                    value === option ? 'bg-blue-50/50 text-[#0a46d8] font-semibold' : 'text-gray-700'
                  }`}
                >
                  {option}
                </div>
              ))
            ) : (
              <div className="px-4 py-3 text-sm text-gray-400 text-center">
                No options found
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

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
    city: '',
    district: '',
    state: '',
    wantedJobRoles: '',
    docType: 'GST'
  });

  // Get states from npm package
  const statesList = State.getStatesOfCountry("IN").map(s => s.name);

  // Resolve districts from static local geoData
  const getDistrictsList = () => {
    if (!formData.state) return [];
    let lookupName = formData.state;
    if (lookupName === 'Jammu and Kashmir') lookupName = 'Jammu & Kashmir';
    return Object.keys(geoData[lookupName] || {});
  };

  // Resolve cities from package + local geoData
  const getCitiesList = () => {
    if (!formData.state) return [];
    const selectedStateObj = State.getStatesOfCountry("IN").find(s => {
      const n1 = s.name.toLowerCase().replace(/and/g, '&');
      const n2 = formData.state?.toLowerCase().replace(/and/g, '&');
      return n1 === n2 || s.name === formData.state;
    });
    const stateCode = selectedStateObj ? selectedStateObj.isoCode : "";
    const packageCities = stateCode ? City.getCitiesOfState("IN", stateCode).map(c => c.name) : [];
    
    let lookupName = formData.state;
    if (lookupName === 'Jammu and Kashmir') lookupName = 'Jammu & Kashmir';
    const localCities = (formData.district && geoData[lookupName]?.[formData.district]) || [];
    
    return Array.from(new Set([...localCities, ...packageCities]));
  };

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
    
    if (!images.businessFrontUrl) {
      setError('Please upload a business front photo.');
      return;
    }

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
                <label className="text-sm font-bold text-gray-700">Business Front Photo *</label>
                <div className="relative">
                  <input type="file" name="businessFrontUrl" onChange={handleImageChange} className="hidden" id="businessFront" />
                  <label htmlFor="businessFront" className={`flex items-center justify-center gap-2 w-full h-32 px-4 rounded-xl border-2 border-dashed ${!images.businessFrontUrl && error.includes('photo') ? 'border-red-300 bg-red-50/30' : 'border-gray-200 bg-gray-50'} cursor-pointer hover:bg-gray-50 transition-all overflow-hidden`}>
                    {images.businessFrontUrl ? (
                      <img src={images.businessFrontUrl} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <div className="flex flex-col items-center gap-2">
                        <Upload size={24} className="text-gray-400" />
                        <span className="text-sm font-medium text-gray-500">Upload Business Front</span>
                      </div>
                    )}
                  </label>
                </div>
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-bold text-gray-700">Wanted Job Roles (Comma separated) *</label>
                <textarea required name="wantedJobRoles" value={formData.wantedJobRoles} onChange={handleInputChange} rows="2" className="w-full p-4 rounded-xl border border-gray-200 focus:border-[#0a46d8] outline-none transition-all resize-none" placeholder="e.g. Security Guard, Housekeeping, Delivery Boy"></textarea>
              </div>
            </div>
          </section>

          {/* Location */}
          <section>
            <div className="flex items-center gap-2 mb-6 text-[#062B67]">
              <MapPin size={20} />
              <h2 className="text-xl font-bold">Address</h2>
            </div>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700">Full Address</label>
                <textarea name="address" value={formData.address} onChange={handleInputChange} rows="3" className="w-full p-4 rounded-xl border border-gray-200 focus:border-[#0a46d8] outline-none transition-all resize-none" placeholder="Enter business address"></textarea>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <CustomDropdown
                  label="State"
                  required
                  options={statesList}
                  value={formData.state}
                  onChange={(val) => {
                    setFormData(prev => ({ ...prev, state: val, district: '', city: '' }));
                  }}
                  placeholder="Select State"
                  showOthers={true}
                />
                <CustomDropdown
                  label="District"
                  required
                  disabled={!formData.state}
                  options={formData.state && formData.state !== 'Others' ? getDistrictsList() : []}
                  value={formData.district}
                  onChange={(val) => {
                    setFormData(prev => ({ ...prev, district: val, city: '' }));
                  }}
                  placeholder={formData.state ? "Select District" : "Select State First"}
                  showOthers={true}
                />
                <CustomDropdown
                  label="City / Town"
                  required
                  disabled={!formData.district}
                  options={formData.district && formData.district !== 'Others' && formData.state !== 'Others' ? getCitiesList() : []}
                  value={formData.city}
                  onChange={(val) => {
                    setFormData(prev => ({ ...prev, city: val }));
                  }}
                  placeholder={formData.district ? "Select City / Town" : "Select District First"}
                  showOthers={true}
                />
              </div>
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
                <label htmlFor="docImage" className="flex items-center justify-center gap-2 w-full h-32 px-4 rounded-xl border-2 border-dashed border-gray-200 cursor-pointer hover:bg-gray-50 transition-all overflow-hidden bg-gray-50">
                  {images.docImageUrl ? (
                    <img src={images.docImageUrl} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <div className="flex flex-col items-center gap-2">
                      <Upload size={24} className="text-gray-400" />
                      <span className="text-sm font-medium text-gray-500">Upload Document</span>
                    </div>
                  )}
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
