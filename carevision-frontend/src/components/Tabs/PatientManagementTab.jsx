import React, { useState, useEffect } from 'react';
import {
  Users, UserPlus, ClipboardList, Search, Trash2,
  UploadCloud, User, ShieldAlert, Building
} from 'lucide-react';
import './PatientManagementTab.css';

const API_URL = import.meta.env.VITE_API_URL;

const PatientManagementTab = ({
  showRegisterForm,
  setShowRegisterForm,
  patientData,
  setPatientData,
  handleImageChange,
  imageFile,
  handleRegisterPatient,
  isUploading,
  patientsList,
  searchQuery,
  setSearchQuery,
  handleDeletePatient,
  isEmergencyLockdown = false
}) => {
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    if (!imageFile) {
      setImagePreview(null);
      return;
    }
    const objectUrl = URL.createObjectURL(imageFile);
    setImagePreview(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [imageFile]);

  const filteredPatients = Array.isArray(patientsList)
    ? patientsList.filter((patient) => {
      const name = patient.name ? String(patient.name).toLowerCase() : '';
      const id = patient.patient_id ? String(patient.patient_id).toLowerCase() : '';
      const query = searchQuery ? String(searchQuery).toLowerCase() : '';
      return name.includes(query) || id.includes(query);
    })
    : [];

  const stats = [
    {
      label: 'Total Patients',
      value: patientsList.length,
      icon: <Users size={20} color="#0D6EFD" />,
      iconBg: '#eff6ff',
      accent: '#0D6EFD',
    },
    {
      label: 'Registered Today',
      value: patientsList.filter((p) => {
        const today = new Date().toISOString().split('T')[0];
        return p.registered_date && p.registered_date.startsWith(today);
      }).length,
      icon: <UserPlus size={20} color="#10b981" />,
      iconBg: '#f0fdf4',
      accent: '#10b981',
    },
    {
      label: 'Active Records',
      value: patientsList.length,
      icon: <ClipboardList size={20} color="#f97316" />,
      iconBg: '#fff7ed',
      accent: '#f97316',
    },
    {
      label: 'High Risk Patients',
      value: patientsList.filter((p) => p.risk_level === 'High').length,
      icon: <ShieldAlert size={20} color="#ef4444" />,
      iconBg: '#fef2f2',
      accent: '#ef4444',
    },
  ];

  const renderRiskBadge = (risk) => {
    const riskVal = risk || 'Low';
    let className = 'risk-badge risk-low';
    if (riskVal === 'High') className = 'risk-badge risk-high';
    else if (riskVal === 'Medium') className = 'risk-badge risk-medium';
    return <span className={className}>{riskVal}</span>;
  };

  return (
    <div className="patient-wrapper">
      <div className="page-header-flex">
        <div className="header">
          <h1>Patient Management</h1>
          <p>Register and monitor high-risk patients with AI face tracking</p>
        </div>
      </div>

      {showRegisterForm ? (
        <div className="register-container card-box animate-fadeIn">
          <div className="register-header">
            <div className="register-header-icon">
              <UserPlus size={22} color="#0D6EFD" />
            </div>
            <div>
              <h3>New Patient Registration</h3>
              <p>Add details and upload a photo for AI facial recognition & wandering alerts.</p>
            </div>
          </div>

          <form onSubmit={handleRegisterPatient} className="register-form-grid">
            <div className="form-fields-section">
              <div className="form-grid-2col">
                <div className="form-group-custom">
                  <label className="form-label-custom">Patient ID <span className="req-star">*</span></label>
                  <div className="input-with-icon-wrap">
                    <span className="input-inner-icon">ID</span>
                    <input
                      type="text"
                      className="form-input-custom"
                      placeholder="e.g. PT-204"
                      required
                      value={patientData.patientId}
                      onChange={(e) => setPatientData({ ...patientData, patientId: e.target.value })}
                      disabled={isEmergencyLockdown}
                    />
                  </div>
                </div>

                <div className="form-group-custom">
                  <label className="form-label-custom">Patient Name <span className="req-star">*</span></label>
                  <div className="input-with-icon-wrap">
                    <User className="input-inner-icon" size={16} color="#64748b" />
                    <input
                      type="text"
                      className="form-input-custom"
                      placeholder="e.g. John Doe"
                      required
                      value={patientData.name}
                      onChange={(e) => setPatientData({ ...patientData, name: e.target.value })}
                      disabled={isEmergencyLockdown}
                    />
                  </div>
                </div>

                <div className="form-group-custom">
                  <label className="form-label-custom">Ward Name</label>
                  <div className="input-with-icon-wrap">
                    <Building className="input-inner-icon" size={16} color="#64748b" />
                    <input
                      type="text"
                      className="form-input-custom"
                      placeholder="e.g. ICU, General Ward"
                      value={patientData.ward}
                      onChange={(e) => setPatientData({ ...patientData, ward: e.target.value })}
                      disabled={isEmergencyLockdown}
                    />
                  </div>
                </div>

                <div className="form-group-custom">
                  <label className="form-label-custom">Ward ID</label>
                  <div className="input-with-icon-wrap">
                    <span className="input-inner-icon">#</span>
                    <input
                      type="text"
                      className="form-input-custom"
                      placeholder="e.g. WD-02"
                      value={patientData.wardId}
                      onChange={(e) => setPatientData({ ...patientData, wardId: e.target.value })}
                      disabled={isEmergencyLockdown}
                    />
                  </div>
                </div>
              </div>

              <div className="form-group-custom risk-select-group">
                <label className="form-label-custom">Wandering Risk Level</label>
                <div className="risk-options-row">
                  {['Low', 'Medium', 'High'].map((level) => {
                    const isActive = patientData.risk === level;
                    return (
                      <button
                        type="button"
                        key={level}
                        onClick={() => setPatientData({ ...patientData, risk: level })}
                        className={`risk-option-btn risk-option-${level.toLowerCase()} ${isActive ? 'active' : ''}`}
                        disabled={isEmergencyLockdown}
                      >
                        <ShieldAlert size={14} />
                        {level} Risk
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="form-upload-section">
              <label className="form-label-custom">Patient Photo <span className="req-star">*</span></label>

              <div className="photo-upload-container">
                <input
                  type="file"
                  id="patient-photo-file"
                  accept="image/*"
                  required
                  onChange={handleImageChange}
                  className="real-file-input"
                  disabled={isEmergencyLockdown}
                />

                <label htmlFor="patient-photo-file" className={`file-dropzone-label ${isEmergencyLockdown ? 'disabled-dropzone' : ''}`}>
                  {imagePreview ? (
                    <div className="photo-preview-wrapper">
                      <img src={imagePreview} className="photo-preview-img" alt="Patient preview" />
                      <div className="photo-preview-overlay">
                        <UploadCloud size={16} />
                        <span>Change Photo</span>
                      </div>
                    </div>
                  ) : (
                    <div className="dropzone-placeholder">
                      <div className="dropzone-icon-circle">
                        <UploadCloud size={24} color={isEmergencyLockdown ? "#94a3b8" : "#0D6EFD"} />
                      </div>
                      <span className="dropzone-main-text">Upload Portrait</span>
                      <span className="dropzone-sub-text">Click to browse files</span>
                      <span className="dropzone-format-info">JPG, PNG (Max 5MB)</span>
                    </div>
                  )}
                </label>
              </div>
            </div>

            <div className="form-actions-full">
              <button type="submit" className="btn-register-pro" disabled={isUploading || isEmergencyLockdown}>
                {isEmergencyLockdown ? (
                  <>
                    <ShieldAlert size={16} />
                    <span>Disabled 🚨</span>
                  </>
                ) : isUploading ? (
                  <>
                    <span className="spinner-loader"></span>
                    <span>Registering Patient...</span>
                  </>
                ) : (
                  'Register Patient'
                )}
              </button>
              <button
                type="button"
                className="btn-cancel-pro"
                onClick={() => setShowRegisterForm(false)}
                disabled={isUploading || isEmergencyLockdown}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      ) : (
        <>
          <div className="stats-grid">
            {stats.map((s, i) => (
              <div
                className="stat-card"
                key={i}
                style={{ '--icon-bg': s.iconBg, '--stat-accent': s.accent }}
              >
                <div className="stat-card-icon-corner">{s.icon}</div>
                <h4 className="stat-card-label">{s.label}</h4>
                <h2 className="stat-card-value">{s.value}</h2>
              </div>
            ))}
          </div>

          <div className="table-container card-box patient-list-card">
            <div className="patient-list-header">
              <h3>Registered Patients Database</h3>
              <div className="patient-list-actions">
                <div className="search-bar-wrapper">
                  <Search size={16} className="search-icon" color="#94a3b8" />
                  <input
                    type="text"
                    className="search-bar-custom"
                    placeholder="Search by name or patient ID..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    disabled={isEmergencyLockdown}
                  />
                </div>
                <button
                  className="primary-btn register-trigger-btn"
                  onClick={() => setShowRegisterForm(true)}
                  disabled={isEmergencyLockdown}
                >
                  {isEmergencyLockdown ? <ShieldAlert size={16} /> : <UserPlus size={16} />}
                  {isEmergencyLockdown ? ' Disabled 🚨' : ' Register Patient'}
                </button>
              </div>
            </div>

            <div className="patient-table-scroll">
              <table className="data-table-custom">
                <thead>
                  <tr>
                    <th className="col-avatar-name">Patient Info</th>
                    <th className="col-risk">Risk Level</th>
                    <th className="col-ward-id">Ward Zone</th>
                    <th className="col-date-registered">Registered Date</th>
                    <th className="col-actions-delete">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPatients.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="table-empty-cell-pro">
                        <div className="empty-state-icon">
                          <Users size={28} color="#94a3b8" />
                        </div>
                        <p className="empty-main-text">No patients registered yet</p>
                        <p className="empty-sub-text">Get started by clicking the Register Patient button above.</p>
                      </td>
                    </tr>
                  ) : (
                    filteredPatients.map((patient, index) => {
                      const imageUrl = patient.image_path
                        ? `${API_URL}/uploads/${patient.image_path}`
                        : null;

                      return (
                        <tr key={index} className="patient-table-row">
                          <td>
                            <div className="patient-avatar-info">
                              <div className="patient-avatar-circle">
                                {imageUrl ? (
                                  <img
                                    src={imageUrl}
                                    className="patient-avatar-img"
                                    alt={patient.name}
                                    onError={(e) => {
                                      e.target.onerror = null;
                                      e.target.src = '';
                                    }}
                                  />
                                ) : null}
                                {!imageUrl && <User size={16} color="#64748b" />}
                              </div>
                              <div className="patient-name-id">
                                <span className="patient-name-bold">{patient.name}</span>
                                <span className="patient-id-sub">ID: {patient.patient_id}</span>
                              </div>
                            </div>
                          </td>
                          <td>
                            {renderRiskBadge(patient.risk_level)}
                          </td>
                          <td>
                            <div className="ward-display">
                              <Building size={14} color="#64748b" />
                              <span>{patient.ward || 'N/A'}</span>
                            </div>
                          </td>
                          <td className="date-registered-cell">
                            {patient.registered_date}
                          </td>
                          <td>
                            <button
                              className="action-delete-btn"
                              onClick={() => handleDeletePatient(patient.patient_id)}
                              title="Delete Patient Record"
                              disabled={isEmergencyLockdown}
                            >
                              <Trash2 size={15} />
                              <span>{isEmergencyLockdown ? 'Locked' : 'Delete'}</span>
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default PatientManagementTab;