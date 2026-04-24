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
      <div className="page-header-flex"><div className="header"><h1>Patient Management</h1><p>Register and monitor high-risk patients</p></div>{!showRegisterForm && <button className="primary-btn" onClick={() => setShowRegisterForm(true)}>+ Register Patient</button>}</div>
      {showRegisterForm ? (
        <form onSubmit={handleRegisterPatient} className="register-form-card card-box">
          <div className="form-row"><label>Patient ID :</label><input type="text" className="form-input" required value={patientData.patientId} onChange={(e) => setPatientData({...patientData, patientId: e.target.value})} /></div>
          <div className="form-row"><label>Patient Name :</label><input type="text" className="form-input" required value={patientData.name} onChange={(e) => setPatientData({...patientData, name: e.target.value})} /></div>
          <div className="form-row"><label>Ward :</label><input type="text" className="form-input" value={patientData.ward} onChange={(e) => setPatientData({...patientData, ward: e.target.value})} /></div>
          <div className="form-row"><label>Ward ID :</label><input type="text" className="form-input" value={patientData.wardId} onChange={(e) => setPatientData({...patientData, wardId: e.target.value})} /></div>
          <div className="form-row"><label>Risk Level :</label>
            <div className="radio-group">
              <label><input type="radio" name="risk" value="High" checked={patientData.risk === 'High'} onChange={(e) => setPatientData({...patientData, risk: e.target.value})} /> High</label>
              <label><input type="radio" name="risk" value="Medium" checked={patientData.risk === 'Medium'} onChange={(e) => setPatientData({...patientData, risk: e.target.value})} /> Medium</label>
              <label><input type="radio" name="risk" value="Low" checked={patientData.risk === 'Low'} onChange={(e) => setPatientData({...patientData, risk: e.target.value})} /> Low</label>
            </div>
          </div>
          <div className="form-row align-start"><label className="mt-2">Add Image :</label><div style={{ padding: '10px 0' }}><input type="file" accept="image/*" required onChange={handleImageChange} className="form-input" style={{ border: 'none', padding: '0' }} />{imageFile && <p style={{fontSize: '13px', color: '#16a34a', marginTop: '8px', fontWeight: 'bold'}}>✓ Selected: {imageFile.name}</p>}</div></div>
          <div className="form-actions" style={{marginTop: '20px'}}><button type="submit" className="btn-register" disabled={isUploading}>{isUploading ? 'Saving...' : 'Register Patient'}</button><button type="button" className="btn-cancel" onClick={() => setShowRegisterForm(false)} disabled={isUploading}>Cancel</button></div>
        </form>
      ) : (
        <>
          <div style={{ display: 'flex', gap: '20px', marginBottom: '20px' }}>
            <div className="stat-card flex-between" style={{ flex: 1, margin: 0 }}><div><h4>Total Patients</h4><h2>{patientsList.length}</h2></div><div className="icon-circle blue-circle">!</div></div>
            <div className="stat-card flex-between" style={{ flex: 1, margin: 0 }}><div><h4>High Risk</h4><h2>{patientsList.filter(p => p.risk_level === 'High').length}</h2></div><div className="icon-circle red-circle">!</div></div>
          </div>
          <div className="table-container card-box">
            <h3>Registered Patients</h3><input type="text" className="search-bar" placeholder="Search Patients by Name or ID..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
            <table className="data-table">
              <thead><tr><th>Name (ID)</th><th>Ward</th><th>Risk Level</th><th>Registered Date</th><th>Actions</th></tr></thead>
              <tbody>
                {filteredPatients.length === 0 ? (<tr><td colSpan="5" style={{textAlign: 'center', padding: '20px', color: '#666'}}>No matching patients found.</td></tr>) : (
                  filteredPatients.map((patient, index) => (
                    <tr key={index} style={searchQuery ? { backgroundColor: '#e0f2fe', transition: '0.3s' } : {}}>
                      <td><strong>{patient.name}</strong> <span style={{fontSize: '12px', color: '#666'}}>({patient.patient_id})</span></td><td>{patient.ward || 'N/A'}</td><td className={patient.risk_level === 'High' ? 'text-red font-bold' : patient.risk_level === 'Medium' ? 'text-orange font-bold' : 'text-green font-bold'}>{patient.risk_level}</td><td>{patient.registered_date}</td><td><span className="action-delete" style={{cursor: 'pointer', color: '#ef4444', fontWeight: 'bold'}} onClick={() => handleDeletePatient(patient.patient_id)}>Delete</span></td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
};
export default PatientManagementTab;