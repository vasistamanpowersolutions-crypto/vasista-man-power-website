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
  ShieldCheck
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import './Profile.css';

const Profile = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('info');
  const [allotments, setAllotments] = useState([]);
  const [loading, setLoading] = useState(true);

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
            <div className="info-data-row"><span className="info-data-label">Email</span><span className="info-data-value">{user.email || 'N/A'}</span></div>
            <div className="info-data-row"><span className="info-data-label">DOB</span><span className="info-data-value">{user.dateOfBirth || user.dob || 'N/A'}</span></div>
            <div className="info-data-row"><span className="info-data-label">Location</span><span className="info-data-value">{user.city}, {user.state}</span></div>
          </div>

          <div className="info-card-section">
            <div className="info-card-header">
              <Briefcase size={20} /> Professional Details
            </div>
            <div className="info-data-row"><span className="info-data-label">Qualification</span><span className="info-data-value">{user.qualification || 'N/A'}</span></div>
            <div className="info-data-row"><span className="info-data-label">Experience</span><span className="info-data-value">{user.experience ? `${user.experience} Years` : 'N/A'}</span></div>
            <div className="info-data-row"><span className="info-data-label">Skills</span><span className="info-data-value">{user.skills || 'N/A'}</span></div>
          </div>

          <div className="info-card-section">
            <div className="info-card-header">
              <CreditCard size={20} /> Status & Identity
            </div>
            <div className="info-data-row"><span className="info-data-label">Allotment</span><span className="info-data-value">{user.candidateStatus || 'Available'}</span></div>
            <div className="info-data-row"><span className="info-data-label">KYC Status</span><span className="info-data-value">{user.kycStatus || 'Pending'}</span></div>
            <div className="info-data-row"><span className="info-data-label">Aadhar No</span><span className="info-data-value">{user.aadharNumber || 'N/A'}</span></div>
            <div className="info-data-row"><span className="info-data-label">PAN No</span><span className="info-data-value">{user.panNumber || 'N/A'}</span></div>
          </div>

          <div className="info-card-section">
            <div className="info-card-header">
              <Shield size={20} /> Emergency Contact
            </div>
            <div className="info-data-row"><span className="info-data-label">Name</span><span className="info-data-value">{user.emergencyContactName || 'N/A'}</span></div>
            <div className="info-data-row"><span className="info-data-label">Relation</span><span className="info-data-value">{user.emergencyContactRelation || 'N/A'}</span></div>
            <div className="info-data-row"><span className="info-data-label">Mobile</span><span className="info-data-value">{user.emergencyContactMobile || 'N/A'}</span></div>
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
              <span>{isCandidate ? user.qualification || 'Candidate' : user.ownerName || 'Business Owner'}</span>
              <span className="dot-separator"></span>
              <span>{user.mobileNumber}</span>
            </p>
            <div className="status-badges-container">
              <span className={`badge ${user.kycStatus === 'verified' ? 'badge-kyc-verified' : 'badge-kyc-pending'}`}>
                <ShieldCheck size={14} /> {user.kycStatus || 'Pending'}
              </span>
              {isCandidate && (
                <span className={`badge ${user.candidateStatus === 'allotted' ? 'badge-status-allotted' : 'badge-status-available'}`}>
                  <Briefcase size={14} /> {user.candidateStatus || 'Available'}
                </span>
              )}
            </div>
          </div>
        </div>
        {/* <button onClick={logout} className="logout-button">
          <LogOut size={18} /> Logout
        </button> */}
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
