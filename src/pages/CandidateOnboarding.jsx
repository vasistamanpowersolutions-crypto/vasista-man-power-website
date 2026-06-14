import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { User, MapPin, Briefcase, Shield, Phone, Upload, Check, ChevronDown, Search, X } from 'lucide-react';
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

// Custom searchable dropdown component for multi-select
const CustomMultiSelectDropdown = ({
  options = [],
  selectedValues = [],
  onChange,
  placeholder = 'Select options',
  label = '',
  required = false
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

  const filteredOptions = options.filter(option =>
    option.toLowerCase().includes(search.toLowerCase())
  );

  const toggleOption = (option) => {
    let newSelected;
    if (selectedValues.includes(option)) {
      newSelected = selectedValues.filter(val => val !== option);
    } else {
      newSelected = [...selectedValues, option];
    }
    onChange(newSelected);
  };

  return (
    <div className="relative space-y-2 w-full text-left" ref={dropdownRef}>
      {label && (
        <label className="text-sm font-bold text-gray-700 block">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="w-full min-h-[48px] py-2 px-4 rounded-xl border border-gray-200 flex items-center justify-between cursor-pointer transition-all bg-white focus-within:border-[#0a46d8] hover:border-gray-300"
      >
        <span className={selectedValues.length > 0 ? 'text-gray-900 font-medium' : 'text-gray-400'}>
          {selectedValues.length > 0
            ? `${selectedValues.length} selected`
            : placeholder
          }
        </span>
        <ChevronDown size={18} className={`text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </div>

      {isOpen && (
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
              filteredOptions.map((option, idx) => {
                const isSelected = selectedValues.includes(option);
                return (
                  <div
                    key={idx}
                    onClick={() => toggleOption(option)}
                    className="px-4 py-3 text-sm cursor-pointer transition-all hover:bg-gray-50 flex items-center gap-3"
                  >
                    <input
                      type="checkbox"
                      checked={isSelected}
                      readOnly
                      className="rounded text-[#0a46d8] border-gray-300 focus:ring-[#0a46d8]"
                    />
                    <span className={isSelected ? 'text-[#0a46d8] font-semibold' : 'text-gray-700'}>
                      {option}
                    </span>
                  </div>
                );
              })
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

const CandidateOnboarding = () => {
  const { user, login, logout } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [jobRoles, setJobRoles] = useState([]);
  const [selectedJobTitles, setSelectedJobTitles] = useState([]);

  // Critical: If token is "undefined" (string) or missing, force logout and re-login
  React.useEffect(() => {
    if (user && (user.token === 'undefined' || !user.token)) {
      console.warn('Invalid token detected on onboarding, redirecting to login');
      logout();
      navigate('/login');
    }
  }, [user, logout, navigate]);

  // Fetch job roles from database
  React.useEffect(() => {
    const fetchJobRoles = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/collection/job-roles`);
        if (response.ok) {
          const data = await response.json();
          setJobRoles(data.map(role => role.title));
        } else {
          throw new Error('Failed to fetch job roles');
        }
      } catch (err) {
        console.error('Error fetching job roles, using fallbacks:', err);
        setJobRoles([
          'Mason', 'Welder', 'Electrician', 'Plumber', 'Carpenter', 'Helper',
          'Driver', 'Cook', 'Security Guard', 'Housekeeper', 'Delivery Boy',
          'Sales Executive', 'Receptionist', 'Office Assistant', 'Accountant',
          'Supervisor', 'Tailor', 'Painter', 'Fitter', 'Gardener', 'Caregiver'
        ]);
      }
    };
    fetchJobRoles();
  }, []);
  
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

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    dob: '',
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
    district: '',
    state: ''
  });

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleJobTitlesChange = (titles) => {
    setSelectedJobTitles(titles);
    setFormData(prev => ({ ...prev, wantedJobTitle: titles.join(', ') }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!formData.dob) {
      setError('Please enter your Date of Birth.');
      setLoading(false);
      return;
    }

    if (!formData.wantedJobTitle) {
      setError('Please select at least one Wanted Job Title.');
      setLoading(false);
      return;
    }

    if (!formData.state || !formData.district || !formData.city) {
      setError('Please select State, District, and City.');
      setLoading(false);
      return;
    }

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
                <label className="text-sm font-bold text-gray-700">Date of Birth *</label>
                <input required type="date" name="dob" value={formData.dob} onChange={handleInputChange} className="w-full h-12 px-4 rounded-xl border border-gray-200 focus:border-[#0a46d8] outline-none transition-all" />
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
                <CustomMultiSelectDropdown
                  label="Wanted Job Title"
                  required
                  placeholder="Search and select job titles"
                  options={jobRoles}
                  selectedValues={selectedJobTitles}
                  onChange={handleJobTitlesChange}
                />
                
                {/* Selected Job Titles displayed below */}
                {selectedJobTitles.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3 p-3 bg-gray-50 rounded-xl border border-gray-100">
                    {selectedJobTitles.map((title) => (
                      <span key={title} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-50 text-[#0a46d8] text-sm font-semibold border border-blue-100 animate-fadeIn">
                        {title}
                        <button
                          type="button"
                          onClick={() => {
                            const updated = selectedJobTitles.filter((t) => t !== title);
                            handleJobTitlesChange(updated);
                          }}
                          className="hover:text-red-500 focus:outline-none transition-colors"
                        >
                          <X size={14} />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
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
              {/* Dynamic Cascading Dropdowns */}
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

              {/* Address Line 1 */}
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700">Address Line 1 *</label>
                <textarea required name="address" value={formData.address} onChange={handleInputChange} className="w-full p-4 rounded-xl border border-gray-200 focus:border-[#0a46d8] outline-none transition-all" placeholder="Enter House No, Street Name, Area, etc." rows="2" />
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
