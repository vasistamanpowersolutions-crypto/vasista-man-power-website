import React, { useState, useEffect } from 'react';
import {
  User,
  MapPin,
  Phone,
  Mail,
  Briefcase,
  Shield,
  Calendar,
  FileText,
  CheckCircle2,
  Clock,
  ChevronRight,
  LogOut,
  Building,
  GraduationCap,
  Award,
  Download,
  AlertCircle,
  Eye,
  Image as ImageIcon,
  Users,
  CreditCard,
  Building2,
  ShieldCheck,
  Upload
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import './Profile.css';

const Profile = () => {
  const { user, logout, login } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('info');
  const [allotments, setAllotments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const fetchAllotments = async () => {
      try {
        const filterKey = user.role === 'candidate' ? 'candidateId' : 'businessId';
        const filterVal = user.id || user.candidateId || user.uid;
        const response = await fetch(`${import.meta.env.VITE_API_URL}/allotments/user-allotments?${filterKey}=${filterVal}`);
        const data = await response.json();
        setAllotments(data);
      } catch (error) {
        console.error('Error fetching allotments:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllotments();
  }, [user, navigate]);

  const handleDocumentUpload = async (e) => {
    const file = e.target.files[0];
    const fieldName = e.target.name;
    if (!file) return;

    setUploading(true);
    setError('');

    try {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64Data = reader.result;
        const candidateId = user.id || user.uid || user.candidateId;
        
        const response = await fetch(`${import.meta.env.VITE_API_URL}/candidates/${candidateId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${user.token}`
          },
          body: JSON.stringify({ [fieldName]: base64Data })
        });

        const data = await response.json();
        if (response.ok) {
          login({ ...user, ...data });
          
          // Check if all documents are now present to update KYC status
          const updatedUser = { ...user, ...data };
          if (updatedUser.aadharFront && updatedUser.aadharBack && updatedUser.panCard && updatedUser.profilePhoto && updatedUser.aadharNumber && updatedUser.panNumber) {
             if (updatedUser.kycStatus === 'Pending') {
                const kycResponse = await fetch(`${import.meta.env.VITE_API_URL}/candidates/${candidateId}`, {
                  method: 'PUT',
                  headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token}`
                  },
                  body: JSON.stringify({ kycStatus: 'Verification in Progress' })
                });
                const kycData = await kycResponse.json();
                if (kycResponse.ok) {
                  login({ ...updatedUser, ...kycData });
                }
             }
          }
        } else {
          console.error('Upload failed:', data);
          setError(data.error?.message || data.message || 'Failed to upload document');
        }
        setUploading(false);
      };
      reader.readAsDataURL(file);
    } catch (err) {
      setError('Error uploading document');
      setUploading(false);
    }
  };

  const handleInputChange = async (e) => {
    const { name, value } = e.target;
    const candidateId = user.id || user.uid || user.candidateId;

    // For numbers like Aadhar and PAN
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/candidates/${candidateId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        },
        body: JSON.stringify({ [name]: value })
      });

      const data = await response.json();
      if (response.ok) {
        login({ ...user, ...data });
        
        // KYC status update logic
        const updatedUser = { ...user, ...data };
        if (updatedUser.aadharFront && updatedUser.aadharBack && updatedUser.panCard && updatedUser.profilePhoto && updatedUser.aadharNumber && updatedUser.panNumber) {
           if (updatedUser.kycStatus === 'Pending') {
              await fetch(`${import.meta.env.VITE_API_URL}/candidates/${candidateId}`, {
                method: 'PUT',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${user.token}`
                },
                body: JSON.stringify({ kycStatus: 'Verification in Progress' })
              });
              login({ ...updatedUser, kycStatus: 'Verification in Progress' });
           }
        }
      }
    } catch (err) {
      console.error('Error updating field:', err);
    }
  };

  if (!user) return null;

  const isCandidate = user.role === 'candidate';

  const renderInfoTab = () => {
    if (isCandidate) {
      return (
        <div className="info-tab-grid">
          <div className="info-card-section">
            <div className="info-card-header">
              <User size={20} /> Personal Information
            </div>
            <div className="info-data-row"><span className="info-data-label">Full Name</span><span className="info-data-value">{user.firstName} {user.lastName}</span></div>
            <div className="info-data-row"><span className="info-data-label">Mobile</span><span className="info-data-value">{user.mobileNumber}</span></div>
            <div className="info-data-row"><span className="info-data-label">Father's Name</span><span className="info-data-value">{user.fatherName || 'N/A'}</span></div>
            <div className="info-data-row"><span className="info-data-label">Father's Mobile</span><span className="info-data-value">{user.fatherMobileNumber || 'N/A'}</span></div>
          </div>

          <div className="info-card-section">
            <div className="info-card-header">
              <Briefcase size={20} /> Professional Details
            </div>
            <div className="info-data-row"><span className="info-data-label">Job Type</span><span className="info-data-value">{user.type || 'N/A'}</span></div>
            <div className="info-data-row"><span className="info-data-label">Exp Level</span><span className="info-data-value">{user.experienceLevel || 'N/A'}</span></div>
            {user.experienceLevel === 'Experienced' && (
              <>
                <div className="info-data-row"><span className="info-data-label">Prev Job</span><span className="info-data-value">{user.previousJobTitle || 'N/A'}</span></div>
                <div className="info-data-row"><span className="info-data-label">Exp Years</span><span className="info-data-value">{user.experienceYears || '0'}</span></div>
              </>
            )}
            <div className="info-data-row"><span className="info-data-label">Wanted Jobs</span><span className="info-data-value">{user.wantedJobTitle || 'N/A'}</span></div>
            <div className="info-data-row"><span className="info-data-label">Skills</span><span className="info-data-value">{user.skills || 'N/A'}</span></div>
          </div>

          <div className="info-card-section">
            <div className="info-card-header">
              <MapPin size={20} /> Location Details
            </div>
            <div className="info-data-row"><span className="info-data-label">Address</span><span className="info-data-value">{user.address || 'N/A'}</span></div>
            <div className="info-data-row"><span className="info-data-label">City</span><span className="info-data-value">{user.city}</span></div>
            <div className="info-data-row"><span className="info-data-label">State</span><span className="info-data-value">{user.state}</span></div>
          </div>

          <div className="info-card-section">
            <div className="info-card-header">
              <CreditCard size={20} /> Status & Identity
            </div>
            <div className="info-data-row"><span className="info-data-label">Status</span><span className="info-data-value">{user.candidateStatus || 'Open to Work'}</span></div>
            <div className="info-data-row"><span className="info-data-label">KYC Status</span><span className="info-data-value">{user.kycStatus || 'Pending'}</span></div>
            <div className="info-data-row"><span className="info-data-label">Aadhar No</span><span className="info-data-value">{user.aadharNumber || 'N/A'}</span></div>
            <div className="info-data-row"><span className="info-data-label">PAN No</span><span className="info-data-value">{user.panNumber || 'N/A'}</span></div>
          </div>
        </div>
      );
    } else {
      // Business Owner Info
      return (
        <div className="info-tab-grid">
          <div className="info-card-section">
            <div className="info-card-header">
              <Building2 size={20} /> Business Information
            </div>
            <div className="info-data-row"><span className="info-data-label">Business Name</span><span className="info-data-value">{user.businessName}</span></div>
            <div className="info-data-row"><span className="info-data-label">Owner Name</span><span className="info-data-value">{user.ownerName}</span></div>
            <div className="info-data-row"><span className="info-data-label">Mobile</span><span className="info-data-value">{user.mobileNumber}</span></div>
            <div className="info-data-row"><span className="info-data-label">Email</span><span className="info-data-value">{user.email || 'N/A'}</span></div>
            <div className="info-data-row"><span className="info-data-label">Wanted Roles</span><span className="info-data-value">{user.wantedJobRoles || 'N/A'}</span></div>
          </div>

          <div className="info-card-section">
            <div className="info-card-header">
              <MapPin size={20} /> Location Details
            </div>
            <div className="info-data-row"><span className="info-data-label">City</span><span className="info-data-value">{user.city}</span></div>
            <div className="info-data-row"><span className="info-data-label">State</span><span className="info-data-value">{user.state}</span></div>
            <div className="info-data-row"><span className="info-data-label">Address</span><span className="info-data-value">{user.address}</span></div>
          </div>
        </div>
      );
    }
  };

  const renderAllotmentsTab = () => (
    <div className="allotment-tab-container">
      {allotments.length === 0 ? (
        <div className="profile-empty-state">
          <Briefcase size={48} />
          <h2>No Allotment History</h2>
          <p>You have not been assigned to any {isCandidate ? 'business' : 'manpower'} yet.</p>
        </div>
      ) : (
        <div className="allotment-history-list">
          {allotments.map((allot, idx) => (
            <div key={idx} className="allotment-item-card">
              <div className="allotment-card-top">
                <div className="allotment-org">
                  <div className="org-icon-box">
                    {isCandidate ? allot.businessName[0] : allot.candidateName[0]}
                  </div>
                  <div>
                    <h3 className="org-name">{isCandidate ? allot.businessName : allot.candidateName}</h3>
                    <span className="allotment-role-tag">
                      <Briefcase size={12} /> {allot.role}
                    </span>
                  </div>
                </div>
                <span className={`allotment-status-pill ${allot.status}`}>
                  {allot.status}
                </span>
              </div>
              <div className="allotment-details-footer">
                <div className="allotment-footer-item">
                  <Calendar size={14} /> Allotted: {new Date(allot.allottedDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                </div>
                <div className="allotment-footer-item">
                  <Building size={14} /> ID: {isCandidate ? `#${allot.businessId.substring(0, 8)}` : `#${allot.candidateId.substring(0, 8)}`}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderDocumentsTab = () => {
    if (isCandidate && user.kycStatus === 'Pending') {
      return (
        <div className="kyc-completion-section p-6 bg-white rounded-2xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 mb-6 text-[#062B67]">
            <ShieldCheck size={24} />
            <h2 className="text-xl font-bold">Complete Your KYC</h2>
          </div>
          <p className="text-gray-600 mb-8">Please upload the following documents to verify your profile. Your status will change to "Verification in Progress" once all items are submitted.</p>
          
          {error && <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm">{error}</div>}
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Numbers */}
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700">Aadhar Number</label>
                <input 
                  name="aadharNumber" 
                  defaultValue={user.aadharNumber} 
                  onBlur={handleInputChange}
                  className="w-full h-12 px-4 rounded-xl border border-gray-200 focus:border-blue-500 outline-none transition-all" 
                  placeholder="12-digit Aadhar" 
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700">PAN Number</label>
                <input 
                  name="panNumber" 
                  defaultValue={user.panNumber} 
                  onBlur={handleInputChange}
                  className="w-full h-12 px-4 rounded-xl border border-gray-200 focus:border-blue-500 outline-none transition-all" 
                  placeholder="PAN Number" 
                />
              </div>
            </div>

            {/* Uploads */}
            <div className="space-y-6">
              {[
                { label: 'Profile Photo', name: 'profilePhoto', value: user.profilePhoto },
                { label: 'Aadhar Front', name: 'aadharFront', value: user.aadharFront },
                { label: 'Aadhar Back', name: 'aadharBack', value: user.aadharBack },
                { label: 'PAN Card', name: 'panCard', value: user.panCard }
              ].map(item => (
                <div key={item.name} className="flex flex-col gap-2">
                  <label className="text-sm font-bold text-gray-700">{item.label}</label>
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-lg bg-gray-100 border border-gray-200 overflow-hidden flex items-center justify-center">
                      {item.value ? <img src={item.value} className="w-full h-full object-cover" /> : <ImageIcon className="text-gray-400" size={24} />}
                    </div>
                    <label className="flex-1">
                      <input 
                        type="file" 
                        name={item.name} 
                        onChange={handleDocumentUpload} 
                        className="hidden" 
                        disabled={uploading}
                      />
                      <div className={`h-12 px-4 rounded-xl border-2 border-dashed border-gray-200 flex items-center justify-center gap-2 cursor-pointer hover:bg-gray-50 transition-all ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}>
                        {uploading ? <Clock className="animate-spin" size={16} /> : <Upload size={16} />}
                        <span className="text-sm font-medium text-gray-600">{item.value ? 'Change File' : 'Upload File'}</span>
                      </div>
                    </label>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      );
    }

    const docs = isCandidate ? [
      { id: 'd1', title: 'Aadhar Front', url: user.aadharFront, category: 'Identity' },
      { id: 'd2', title: 'Aadhar Back', url: user.aadharBack, category: 'Identity' },
      { id: 'd3', title: 'PAN Card', url: user.panCard, category: 'Tax' },
      { id: 'd4', title: 'Profile Photo', url: user.profilePhoto, category: 'Profile' },
    ] : [
      { id: 'b1', title: 'Business Document', url: user.docImageUrl, category: user.docType || 'Verification' },
    ];

    return (
      <div className="documents-display-grid">
        {docs.map(doc => (
          <div key={doc.id} className="document-file-card">
            <div className="document-file-header">
              <div className="document-type-icon"><FileText size={20} /></div>
              <div className="document-meta">
                <h3>{doc.title}</h3>
                <p>{doc.category}</p>
              </div>
            </div>
            <div className="document-preview-box">
              {doc.url ? (
                <img src={doc.url} alt={doc.title} />
              ) : (
                <div className="no-image-placeholder">
                  <ImageIcon size={32} />
                  <span>Not Uploaded</span>
                </div>
              )}
            </div>
            <div className="document-action-btns">
              <button
                className="doc-action-btn"
                onClick={() => doc.url && window.open(doc.url, '_blank')}
                disabled={!doc.url}
              >
                <Eye size={14} /> View
              </button>
              <a
                href={doc.url}
                download
                className={`doc-action-btn ${!doc.url ? 'pointer-events-none opacity-50' : ''}`}
                target="_blank"
                rel="noreferrer"
              >
                <Download size={14} /> Download
              </a>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="profile-page-container">
      <div className="profile-header-card">
        <div className="header-card-bg"></div>
        <div className="header-left-content">
          <div className="profile-avatar-large">
            {isCandidate ? (
              user.profilePhoto ? <img src={user.profilePhoto} alt="Profile" /> : <User size={40} />
            ) : (
              user.businessFrontUrl ? <img src={user.businessFrontUrl} alt="Business" /> : <Building2 size={40} />
            )}
          </div>
          <div className="profile-summary-text">
            <h1>{isCandidate ? `${user.firstName} ${user.lastName}` : user.businessName}</h1>
            <p>
              <span>{isCandidate ? (user.wantedJobTitle?.split(',')[0] || user.experienceLevel || 'Candidate') : user.ownerName || 'Business Owner'}</span>
              <span className="dot-separator"></span>
              <span>{user.mobileNumber}</span>
            </p>
            <div className="status-badges-container">
              <span className={`badge ${user.kycStatus === 'Verified' ? 'badge-kyc-verified' : user.kycStatus === 'Verification in Progress' ? 'badge-kyc-progress' : 'badge-kyc-pending'}`}>
                <ShieldCheck size={14} /> {user.kycStatus || 'Pending'}
              </span>
              {isCandidate && (
                <span className={`badge ${user.candidateStatus === 'allotted' ? 'badge-status-allotted' : 'badge-status-available'}`}>
                  <Briefcase size={14} /> {user.candidateStatus || 'Open to Work'}
                </span>
              )}
            </div>
            {isCandidate && user.kycStatus === 'Pending' && (
              <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-xl flex items-center gap-3 text-amber-800 text-sm animate-pulse">
                <AlertCircle size={18} />
                <p className="font-semibold">Add all required info in documents to complete the profile.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="profile-tabs-nav desktop-only-tabs">
        <button
          className={`profile-tab-btn ${activeTab === 'info' ? 'active' : ''}`}
          onClick={() => setActiveTab('info')}
        >
          <User size={18} /> Info
        </button>
        <button
          className={`profile-tab-btn ${activeTab === 'allotments' ? 'active' : ''}`}
          onClick={() => setActiveTab('allotments')}
        >
          <Briefcase size={18} /> Allotments
        </button>
        <button
          className={`profile-tab-btn ${activeTab === 'documents' ? 'active' : ''}`}
          onClick={() => setActiveTab('documents')}
        >
          <FileText size={18} /> Documents
        </button>
      </div>

      {/* MOBILE BOTTOM NAVIGATION BAR */}
      <div className="mobile-bottom-nav">
        <button
          className={`mobile-nav-btn ${activeTab === 'info' ? 'active' : ''}`}
          onClick={() => setActiveTab('info')}
        >
          <User size={24} />
          <span>Info</span>
        </button>
        <button
          className={`mobile-nav-btn ${activeTab === 'allotments' ? 'active' : ''}`}
          onClick={() => setActiveTab('allotments')}
        >
          <Briefcase size={24} />
          <span>Allotments</span>
        </button>
        <button
          className={`mobile-nav-btn ${activeTab === 'documents' ? 'active' : ''}`}
          onClick={() => setActiveTab('documents')}
        >
          <FileText size={24} />
          <span>Documents</span>
        </button>
      </div>

      <div className="tab-content-area">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <Clock size={40} className="animate-spin text-blue-600" />
            <p className="text-gray-500 font-medium">Loading your profile details...</p>
          </div>
        ) : (
          <>
            {activeTab === 'info' && renderInfoTab()}
            {activeTab === 'allotments' && renderAllotmentsTab()}
            {activeTab === 'documents' && renderDocumentsTab()}
          </>
        )}
      </div>
    </div>
  );
};

export default Profile;
