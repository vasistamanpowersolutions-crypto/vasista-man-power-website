import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, GraduationCap, CreditCard, 
  Heart, ChevronRight, ChevronLeft,
  Upload, CheckCircle2
} from 'lucide-react';
import axios from 'axios';
import API_BASE_URL from '../config';
import { toast } from 'react-toastify';
import '../css/OnboardingPage.css';

const OnboardingPage = () => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    mobileNumber: '',
    dob: '',
    address: '',
    city: '',
    state: '',
    profileImageUrl: '',
    qualification: '',
    experience: '',
    aadharNumber: '',
    aadharFront: null,
    aadharBack: null,
    aadharFrontUrl: '',
    aadharBackUrl: '',
    guardianRelation: '',
    guardianName: '',
    guardianMobile: ''
  });

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      setFormData(prev => ({
        ...prev,
        mobileNumber: parsedUser.phone || '',
        email: parsedUser.email || ''
      }));
    } else {
      navigate('/login');
    }
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileUpload = async (e, field) => {
    const file = e.target.files[0];
    if (!file) return;

    const uploadData = new FormData();
    uploadData.append('image', file);

    setLoading(true);
    try {
      const response = await axios.post(`${API_BASE_URL}/upload/image`, uploadData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      if (response.data.success) {
        setFormData(prev => ({
          ...prev,
          [`${field}Url`]: response.data.url,
          // Handle profileImageUrl specifically since it doesn't have "Url" suffix in the key if I want to be consistent
          [field === 'profileImage' ? 'profileImageUrl' : `${field}Url`]: response.data.url
        }));
        toast.success(`${field.replace(/([A-Z])/g, ' $1')} uploaded!`);
      }
    } catch (error) {
      toast.error('Failed to upload image');
    } finally {
      setLoading(false);
    }
  };

  const handleNext = () => {
    if (step === 1) {
      if (!formData.firstName || !formData.lastName || !formData.dob || !formData.address) {
        toast.error('Please fill all required fields');
        return;
      }
    }
    setStep(prev => prev + 1);
  };

  const handleBack = () => setStep(prev => prev - 1);

  const handleSubmit = async () => {
    if (!formData.aadharFrontUrl || !formData.aadharBackUrl) {
      toast.error('Please upload Aadhar card photos');
      return;
    }

    setLoading(true);
    try {
      const uid = user.userId || user.externalIds[0];
      const searchResponse = await axios.get(`${API_BASE_URL}/collection/candidates`);
      const candidates = searchResponse.data;
      const candidateDoc = candidates.find(c => c.uid === uid);

      if (!candidateDoc) {
        throw new Error('Candidate profile not found');
      }

      await axios.put(`${API_BASE_URL}/collection/candidates/${candidateDoc.id}`, {
        ...formData,
        status: 'completed',
        profileCompleted: true,
        updatedAt: new Date()
      });

      toast.success('Onboarding complete!');
      navigate('/profile');
    } catch (error) {
      toast.error('Failed to save details');
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    { title: 'Personal', icon: User },
    { title: 'Qualification', icon: GraduationCap },
    { title: 'Aadhar', icon: CreditCard },
    { title: 'Guardian', icon: Heart }
  ];

  return (
    <div className="onboard-page">
      <div className="onboard-stepper">
        <div className="onboard-stepper-inner">
          {steps.map((s, i) => (
            <div key={i} className="onboard-step-item">
              <div className={`onboard-step-circle ${
                step > i + 1 ? 'onboard-step-circle-completed' : 
                step === i + 1 ? 'onboard-step-circle-active' : 'onboard-step-circle-inactive'
              }`}>
                {step > i + 1 ? <CheckCircle2 size={20} /> : <s.icon size={20} />}
              </div>
              <span className="onboard-step-label" style={{ color: step === i + 1 ? 'var(--primary)' : '#9ca3af' }}>{s.title}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="onboard-content">
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="onboard-form-section"
            >
              <h2 className="onboard-title">Personal Details</h2>
              
              {/* Profile Photo Upload */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '2rem' }}>
                <div className="onboard-profile-upload">
                  {formData.profileImageUrl ? (
                    <img src={formData.profileImageUrl} alt="Profile" className="onboard-profile-preview" />
                  ) : (
                    <div className="onboard-profile-placeholder">
                      <User size={40} style={{ color: '#9ca3af' }} />
                    </div>
                  )}
                  <label className="onboard-profile-edit-btn">
                    <Upload size={16} />
                    <input type="file" style={{ display: 'none' }} accept="image/*" onChange={(e) => handleFileUpload(e, 'profileImage')} />
                  </label>
                </div>
                <span style={{ fontSize: '0.75rem', fontWeight: '700', color: '#6b7280', marginTop: '0.5rem', textTransform: 'uppercase' }}>
                  {formData.profileImageUrl ? 'Change Profile Photo' : 'Upload Profile Photo'}
                </span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="onboard-field-group">
                  <label className="onboard-label">First Name</label>
                  <input className="vasista-input" name="firstName" value={formData.firstName} onChange={handleChange} placeholder="John" required />
                </div>
                <div className="onboard-field-group">
                  <label className="onboard-label">Last Name</label>
                  <input className="vasista-input" name="lastName" value={formData.lastName} onChange={handleChange} placeholder="Doe" required />
                </div>
              </div>
              <div className="onboard-field-group">
                <label className="onboard-label">Mobile Number</label>
                <input className="vasista-input" name="mobileNumber" value={formData.mobileNumber} readOnly style={{ backgroundColor: '#f3f4f6' }} />
              </div>
              <div className="onboard-field-group">
                <label className="onboard-label">Email (Optional)</label>
                <input className="vasista-input" name="email" value={formData.email} onChange={handleChange} placeholder="john@example.com" />
              </div>
              <div className="onboard-field-group">
                <label className="onboard-label">Date of Birth</label>
                <input className="vasista-input" name="dob" type="date" value={formData.dob} onChange={handleChange} required />
              </div>
              <div className="onboard-field-group">
                <label className="onboard-label">Address</label>
                <textarea className="vasista-input" name="address" value={formData.address} onChange={handleChange} placeholder="Full address" rows="3" style={{ height: 'auto' }} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="onboard-field-group">
                  <label className="onboard-label">City</label>
                  <input className="vasista-input" name="city" value={formData.city} onChange={handleChange} placeholder="City" />
                </div>
                <div className="onboard-field-group">
                  <label className="onboard-label">State</label>
                  <input className="vasista-input" name="state" value={formData.state} onChange={handleChange} placeholder="State" />
                </div>
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="onboard-form-section"
            >
              <h2 className="onboard-title">Qualification & Exp</h2>
              <div className="onboard-field-group">
                <label className="onboard-label">Highest Qualification</label>
                <select className="vasista-input" name="qualification" value={formData.qualification} onChange={handleChange}>
                  <option value="">Select Qualification</option>
                  <option value="10th">10th Pass</option>
                  <option value="12th">12th Pass</option>
                  <option value="Graduate">Graduate</option>
                  <option value="Post Graduate">Post Graduate</option>
                  <option value="Diploma">Diploma</option>
                </select>
              </div>
              <div className="onboard-field-group">
                <label className="onboard-label">Total Experience</label>
                <select className="vasista-input" name="experience" value={formData.experience} onChange={handleChange}>
                  <option value="">Select Experience</option>
                  <option value="fresher">Fresher</option>
                  <option value="1-2 years">1-2 Years</option>
                  <option value="3-5 years">3-5 Years</option>
                  <option value="5+ years">5+ Years</option>
                </select>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="onboard-form-section"
            >
              <h2 className="onboard-title">Aadhar Details</h2>
              <div className="onboard-field-group">
                <label className="onboard-label">Aadhar Card Number</label>
                <input className="vasista-input" name="aadharNumber" value={formData.aadharNumber} onChange={handleChange} placeholder="1234 5678 9012" maxLength={12} />
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div className="onboard-field-group">
                  <label className="onboard-label">Front Side Photo</label>
                  <div className="onboard-upload-box">
                    {formData.aadharFrontUrl ? (
                      <div style={{ position: 'relative' }}>
                        <img src={formData.aadharFrontUrl} alt="Front" className="onboard-preview-img" />
                        <button onClick={() => setFormData(prev => ({...prev, aadharFrontUrl: ''}))} style={{ position: 'absolute', top: '0.5rem', right: '0.5rem', backgroundColor: '#ef4444', color: 'white', borderRadius: '9999px', padding: '0.25rem', border: 'none', cursor: 'pointer' }}><ChevronLeft size={16}/></button>
                      </div>
                    ) : (
                      <label style={{ cursor: 'pointer', display: 'block' }}>
                        <Upload style={{ margin: '0 auto 0.5rem', color: '#9ca3af' }} size={32} />
                        <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>Click to upload Aadhar Front</span>
                        <input type="file" style={{ display: 'none' }} accept="image/*" onChange={(e) => handleFileUpload(e, 'aadharFront')} />
                      </label>
                    )}
                  </div>
                </div>

                <div className="onboard-field-group">
                  <label className="onboard-label">Back Side Photo</label>
                  <div className="onboard-upload-box">
                    {formData.aadharBackUrl ? (
                      <div style={{ position: 'relative' }}>
                        <img src={formData.aadharBackUrl} alt="Back" className="onboard-preview-img" />
                        <button onClick={() => setFormData(prev => ({...prev, aadharBackUrl: ''}))} style={{ position: 'absolute', top: '0.5rem', right: '0.5rem', backgroundColor: '#ef4444', color: 'white', borderRadius: '9999px', padding: '0.25rem', border: 'none', cursor: 'pointer' }}><ChevronLeft size={16}/></button>
                      </div>
                    ) : (
                      <label style={{ cursor: 'pointer', display: 'block' }}>
                        <Upload style={{ margin: '0 auto 0.5rem', color: '#9ca3af' }} size={32} />
                        <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>Click to upload Aadhar Back</span>
                        <input type="file" style={{ display: 'none' }} accept="image/*" onChange={(e) => handleFileUpload(e, 'aadharBack')} />
                      </label>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {step === 4 && (
            <motion.div
              key="step4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="onboard-form-section"
            >
              <h2 className="onboard-title">Guardian Details</h2>
              <div className="onboard-field-group">
                <label className="onboard-label">Relation</label>
                <select className="vasista-input" name="guardianRelation" value={formData.guardianRelation} onChange={handleChange}>
                  <option value="">Select Relation</option>
                  <option value="Father">Father</option>
                  <option value="Mother">Mother</option>
                  <option value="Spouse">Spouse</option>
                  <option value="Brother">Brother</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div className="onboard-field-group">
                <label className="onboard-label">Guardian Name</label>
                <input className="vasista-input" name="guardianName" value={formData.guardianName} onChange={handleChange} placeholder="Guardian Full Name" />
              </div>
              <div className="onboard-field-group">
                <label className="onboard-label">Guardian Mobile</label>
                <input className="vasista-input" name="guardianMobile" type="tel" value={formData.guardianMobile} onChange={handleChange} placeholder="Guardian Mobile Number" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="onboard-footer">
        <div className="onboard-footer-inner">
          {step > 1 && (
            <button
              onClick={handleBack}
              className="vasista-btn onboard-back-btn"
            >
              <ChevronLeft size={20} /> Back
            </button>
          )}
          <button
            onClick={step === 4 ? handleSubmit : handleNext}
            disabled={loading}
            className="vasista-btn vasista-btn-primary onboard-next-btn"
            style={{ opacity: loading ? 0.7 : 1 }}
          >
            {loading ? 'Processing...' : step === 4 ? 'Complete Setup' : 'Continue'} 
            {step < 4 && <ChevronRight size={20} />}
          </button>
        </div>
      </div>
    </div>
  );
};

export default OnboardingPage;
