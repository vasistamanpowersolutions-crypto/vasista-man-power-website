import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, GraduationCap, CreditCard, 
  Heart, ChevronRight, ChevronLeft,
  Upload, CheckCircle2, Camera
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
          [field === 'profileImage' ? 'profileImageUrl' : `${field}Url`]: response.data.url
        }));
        toast.success('Image uploaded successfully');
      }
    } catch (error) {
      toast.error('Failed to upload image');
    } finally {
      setLoading(false);
    }
  };

  const handleNext = () => {
    if (step === 1) {
      if (!formData.firstName || !formData.lastName || !formData.dob) {
        toast.error('Please fill basic details');
        return;
      }
    }
    setStep(prev => prev + 1);
    window.scrollTo(0, 0);
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const uid = user.userId || user.id || user.externalIds?.[0];
      const searchResponse = await axios.get(`${API_BASE_URL}/collection/candidates`);
      const candidateDoc = searchResponse.data.find(c => c.uid === uid);

      if (!candidateDoc) throw new Error('Profile not found');

      await axios.put(`${API_BASE_URL}/collection/candidates/${candidateDoc.id}`, {
        ...formData,
        status: 'active',
        profileCompleted: true,
        updatedAt: new Date()
      });

      toast.success('Profile setup complete!');
      navigate('/profile');
    } catch (error) {
      toast.error('Failed to complete setup');
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    { title: 'Personal', icon: User },
    { title: 'Education', icon: GraduationCap },
    { title: 'Documents', icon: CreditCard },
    { title: 'Guardian', icon: Heart }
  ];

  return (
    <div className="onboard-page">
      <div className="onboard-header">
        <h1>Complete Your Profile</h1>
        <p>Step {step} of 4: {steps[step-1].title}</p>
      </div>

      <div className="onboard-stepper">
        <div className="onboard-stepper-inner">
          {steps.map((s, i) => (
            <div key={i} className="onboard-step-item">
              <div className={`onboard-step-circle ${
                step > i + 1 ? 'onboard-step-circle-completed' : 
                step === i + 1 ? 'onboard-step-circle-active' : 'onboard-step-circle-inactive'
              }`}>
                {step > i + 1 ? <CheckCircle2 size={18} /> : <s.icon size={18} />}
              </div>
              <span className={`onboard-step-label ${step === i + 1 ? 'onboard-step-label-active' : ''}`}>
                {s.title}
              </span>
            </div>
          ))}
        </div>
      </div>

      <main className="onboard-content">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="onboard-form-card"
          >
            {step === 1 && (
              <>
                <div className="onboard-profile-upload">
                  <div className="onboard-profile-circle">
                    {formData.profileImageUrl ? (
                      <img src={formData.profileImageUrl} alt="Profile" className="onboard-profile-img" />
                    ) : (
                      <User size={48} color="#cbd5e1" />
                    )}
                  </div>
                  <label className="onboard-profile-edit">
                    <Camera size={16} />
                    <input type="file" hidden accept="image/*" onChange={(e) => handleFileUpload(e, 'profileImage')} />
                  </label>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="onboard-field-group">
                    <label className="onboard-label">First Name</label>
                    <input className="vasista-input" name="firstName" value={formData.firstName} onChange={handleChange} placeholder="First Name" />
                  </div>
                  <div className="onboard-field-group">
                    <label className="onboard-label">Last Name</label>
                    <input className="vasista-input" name="lastName" value={formData.lastName} onChange={handleChange} placeholder="Last Name" />
                  </div>
                </div>

                <div className="onboard-field-group">
                  <label className="onboard-label">Email Address</label>
                  <input className="vasista-input" name="email" value={formData.email} onChange={handleChange} placeholder="email@example.com" />
                </div>

                <div className="onboard-field-group">
                  <label className="onboard-label">Date of Birth</label>
                  <input className="vasista-input" type="date" name="dob" value={formData.dob} onChange={handleChange} />
                </div>

                <div className="onboard-field-group">
                  <label className="onboard-label">Full Address</label>
                  <textarea className="vasista-input" name="address" value={formData.address} onChange={handleChange} placeholder="Residential address" rows="3" style={{ height: 'auto' }} />
                </div>
              </>
            )}

            {step === 2 && (
              <>
                <h2 className="onboard-title">Qualification</h2>
                <div className="onboard-field-group">
                  <label className="onboard-label">Highest Degree</label>
                  <select className="vasista-input" name="qualification" value={formData.qualification} onChange={handleChange}>
                    <option value="">Select Option</option>
                    <option value="10th">10th Pass</option>
                    <option value="12th">12th Pass</option>
                    <option value="Graduate">Graduate</option>
                    <option value="Post Graduate">Post Graduate</option>
                  </select>
                </div>
                <div className="onboard-field-group">
                  <label className="onboard-label">Experience</label>
                  <select className="vasista-input" name="experience" value={formData.experience} onChange={handleChange}>
                    <option value="">Select Experience</option>
                    <option value="Fresher">Fresher</option>
                    <option value="1-2 Years">1-2 Years</option>
                    <option value="3-5 Years">3-5 Years</option>
                    <option value="5+ Years">5+ Years</option>
                  </select>
                </div>
              </>
            )}

            {step === 3 && (
              <>
                <h2 className="onboard-title">Identity Proof</h2>
                <div className="onboard-field-group">
                  <label className="onboard-label">Aadhar Number</label>
                  <input className="vasista-input" name="aadharNumber" value={formData.aadharNumber} onChange={handleChange} placeholder="1234 5678 9012" />
                </div>
                
                <div className="onboard-field-group">
                  <label className="onboard-label">Front Side</label>
                  <div className="onboard-upload-box" onClick={() => document.getElementById('aadharFrontInput').click()}>
                    {formData.aadharFrontUrl ? (
                      <img src={formData.aadharFrontUrl} alt="Aadhar Front" className="onboard-preview-img" />
                    ) : (
                      <>
                        <Upload size={32} color="#94a3b8" style={{ marginBottom: '0.5rem' }} />
                        <p style={{ fontSize: '0.875rem', color: '#64748b' }}>Upload Aadhar Front</p>
                      </>
                    )}
                    <input id="aadharFrontInput" type="file" hidden accept="image/*" onChange={(e) => handleFileUpload(e, 'aadharFront')} />
                  </div>
                </div>

                <div className="onboard-field-group">
                  <label className="onboard-label">Back Side</label>
                  <div className="onboard-upload-box" onClick={() => document.getElementById('aadharBackInput').click()}>
                    {formData.aadharBackUrl ? (
                      <img src={formData.aadharBackUrl} alt="Aadhar Back" className="onboard-preview-img" />
                    ) : (
                      <>
                        <Upload size={32} color="#94a3b8" style={{ marginBottom: '0.5rem' }} />
                        <p style={{ fontSize: '0.875rem', color: '#64748b' }}>Upload Aadhar Back</p>
                      </>
                    )}
                    <input id="aadharBackInput" type="file" hidden accept="image/*" onChange={(e) => handleFileUpload(e, 'aadharBack')} />
                  </div>
                </div>
              </>
            )}

            {step === 4 && (
              <>
                <h2 className="onboard-title">Guardian Details</h2>
                <div className="onboard-field-group">
                  <label className="onboard-label">Relationship</label>
                  <select className="vasista-input" name="guardianRelation" value={formData.guardianRelation} onChange={handleChange}>
                    <option value="">Select Relation</option>
                    <option value="Father">Father</option>
                    <option value="Mother">Mother</option>
                    <option value="Spouse">Spouse</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div className="onboard-field-group">
                  <label className="onboard-label">Guardian Name</label>
                  <input className="vasista-input" name="guardianName" value={formData.guardianName} onChange={handleChange} placeholder="Enter full name" />
                </div>
                <div className="onboard-field-group">
                  <label className="onboard-label">Guardian Mobile</label>
                  <input className="vasista-input" type="tel" name="guardianMobile" value={formData.guardianMobile} onChange={handleChange} placeholder="Contact number" />
                </div>
              </>
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      <div className="onboard-footer">
        <div className="onboard-footer-inner">
          {step > 1 && (
            <button onClick={() => setStep(s => s - 1)} className="vasista-btn onboard-back-btn">
              <ChevronLeft size={20} /> Back
            </button>
          )}
          <button 
            onClick={step === 4 ? handleSubmit : handleNext} 
            disabled={loading}
            className="vasista-btn vasista-btn-primary onboard-next-btn"
          >
            {loading ? 'Processing...' : step === 4 ? 'Complete Registration' : 'Next Step'} 
            {step < 4 && <ChevronRight size={20} />}
          </button>
        </div>
      </div>
    </div>
  );
};

export default OnboardingPage;
