import React from 'react';
import './PatientManagementTab.css';

const PatientManagementTab = ({ showRegisterForm, setShowRegisterForm, patientData, setPatientData, handleImageChange, imageFile, handleRegisterPatient, isUploading, patientsList, searchQuery, setSearchQuery, handleDeletePatient }) => {
  const filteredPatients = Array.isArray(patientsList) ? patientsList.filter(patient => {
    const pName = patient.name ? String(patient.name).toLowerCase() : '';
    const pId = patient.patient_id ? String(patient.patient_id).toLowerCase() : '';
    const query = searchQuery ? String(searchQuery).toLowerCase() : '';
    return pName.includes(query) || pId.includes(query);
  }) : [];

  return (
    <div className="patient-wrapper">
      <div className="page-header-flex">
        <div className="header">
          <h1>Patient Management</h1>
          <p>Register and monitor high-risk patients</p>
        </div>
        {!showRegisterForm && <button className="primary-btn" onClick={() => setShowRegisterForm(true)}>+ Register Patient</button>}
      </div>
      
      {showRegisterForm ? (
        <form onSubmit={handleRegisterPatient} className="register-form-card card-box">
          <div className="form-row"><label>Patient ID :</label><input type="text" className="form-input" required value={patientData.patientId} onChange={(e) => setPatientData({...patientData, patientId: e.target.value})} /></div>
          <div className="form-row"><label>Patient Name :</label><input type="text" className="form-input" required value={patientData.name} onChange={(e) => setPatientData({...patientData, name: e.target.value})} /></div>
          <div className="form-row"><label>Ward :</label><input type="text" className="form-input" value={patientData.ward} onChange={(e) => setPatientData({...patientData, ward: e.target.value})} /></div>
          <div className="form-row"><label>Ward ID :</label><input type="text" className="form-input" value={patientData.wardId} onChange={(e) => setPatientData({...patientData, wardId: e.target.value})} /></div>
          
          <div className="form-row align-start">
            <label className="mt-2">Add Image :</label>
            <div className="file-input-wrapper">
              <input type="file" accept="image/*" required onChange={handleImageChange} className="form-input file-input-clean" />
              {imageFile && <p className="image-selected-msg">✓ Selected: {imageFile.name}</p>}
            </div>
          </div>
          <div className="form-actions form-actions--patient">
            <button type="submit" className="btn-register" disabled={isUploading}>{isUploading ? 'Saving...' : 'Register Patient'}</button>
            <button type="button" className="btn-cancel" onClick={() => setShowRegisterForm(false)} disabled={isUploading}>Cancel</button>
          </div>
        </form>
      ) : (
        <>
          <div className="patient-stats-row">
            <div className="stat-card flex-between patient-stat-card">
              <div><h4>Total Patients</h4><h2>{patientsList.length}</h2></div>
              <div className="icon-circle blue-circle">!</div>
            </div>
          </div>
          
          <div className="table-container card-box">
            <h3>Registered Patients</h3>
            <input type="text" className="search-bar" placeholder="Search Patients by Name or ID..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
            

            <div className="patient-table-scroll">
              <table className="data-table">
                <thead className="patient-table-head">
                  <tr>
                    <th className="col-name">Name (ID)</th>
                    <th className="col-ward">Ward</th>
                    <th className="col-date">Registered Date</th>
                    <th className="col-actions">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPatients.length === 0 ? (
                    <tr><td colSpan="4" className="table-empty-cell">No matching patients found.</td></tr>
                  ) : (
                    filteredPatients.map((patient, index) => (
                      <tr key={index} className={searchQuery ? 'patient-row--highlight' : ''}>
                        <td className="td-cell">
                          <strong>{patient.name}</strong> <span className="patient-id-label">({patient.patient_id})</span>
                        </td>
                        <td className="td-cell">{patient.ward || 'N/A'}</td>
                        <td className="td-cell">{patient.registered_date}</td>
                        <td className="td-cell">
                          <span className="action-delete" onClick={() => handleDeletePatient(patient.patient_id)}>Delete</span>
                        </td>
                      </tr>
                    ))
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