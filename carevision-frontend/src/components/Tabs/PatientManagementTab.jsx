import React from 'react';

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
          
          <div className="form-row align-start"><label className="mt-2">Add Image :</label><div style={{ padding: '10px 0' }}><input type="file" accept="image/*" required onChange={handleImageChange} className="form-input" style={{ border: 'none', padding: '0' }} />{imageFile && <p style={{fontSize: '13px', color: '#16a34a', marginTop: '8px', fontWeight: 'bold'}}>✓ Selected: {imageFile.name}</p>}</div></div>
          <div className="form-actions" style={{marginTop: '20px'}}><button type="submit" className="btn-register" disabled={isUploading}>{isUploading ? 'Saving...' : 'Register Patient'}</button><button type="button" className="btn-cancel" onClick={() => setShowRegisterForm(false)} disabled={isUploading}>Cancel</button></div>
        </form>
      ) : (
        <>
          <div style={{ display: 'flex', gap: '20px', marginBottom: '20px' }}>
            <div className="stat-card flex-between" style={{ flex: 1, margin: 0 }}>
              <div><h4>Total Patients</h4><h2>{patientsList.length}</h2></div>
              <div className="icon-circle blue-circle">!</div>
            </div>
          </div>
          
          <div className="table-container card-box">
            <h3>Registered Patients</h3>
            <input type="text" className="search-bar" placeholder="Search Patients by Name or ID..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
            
            {/* Scrollable Container Area */}
            <div style={{ maxHeight: '480px', overflowY: 'auto', borderBottom: '1px solid #e2e8f0', paddingRight: '5px' }}>
              <table className="data-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead style={{ position: 'sticky', top: 0, backgroundColor: '#f8fafc', zIndex: 1, boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
                  <tr>
                    {/* Widths adjusted to fill the gap perfectly */}
                    <th style={{ width: '35%', padding: '12px 15px' }}>Name (ID)</th>
                    <th style={{ width: '25%', padding: '12px 15px' }}>Ward</th>
                    <th style={{ width: '25%', padding: '12px 15px' }}>Registered Date</th>
                    <th style={{ width: '15%', padding: '12px 15px' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPatients.length === 0 ? (
                    <tr><td colSpan="4" style={{textAlign: 'center', padding: '30px', color: '#64748b'}}>No matching patients found.</td></tr>
                  ) : (
                    filteredPatients.map((patient, index) => (
                      <tr key={index} style={searchQuery ? { backgroundColor: '#e0f2fe', transition: '0.3s' } : {}}>
                        <td style={{ padding: '12px 15px' }}>
                          <strong>{patient.name}</strong> <span style={{fontSize: '12px', color: '#64748b'}}>({patient.patient_id})</span>
                        </td>
                        <td style={{ padding: '12px 15px' }}>{patient.ward || 'N/A'}</td>
                        <td style={{ padding: '12px 15px' }}>{patient.registered_date}</td>
                        <td style={{ padding: '12px 15px' }}>
                          <span className="action-delete" style={{cursor: 'pointer', color: '#ef4444', fontWeight: 'bold'}} onClick={() => handleDeletePatient(patient.patient_id)}>Delete</span>
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