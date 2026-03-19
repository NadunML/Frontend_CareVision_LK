import React, { useState, useEffect, useRef } from 'react';
import { auth } from '../firebase'; 
// මෙන්න මේක තමයි අලුත් Professional Icons ටික
import { Home, Camera, Users, ShieldAlert, Flame, BellRing, FileText, UserCog, Settings, LogOut, User, AlertTriangle, Download, Phone } from 'lucide-react';
import './Dashboard.css';

const Dashboard = ({ onLogout }) => {
  const user = auth.currentUser; 

  const [activeTab, setActiveTab] = useState('dashboard');
  const [showRegisterForm, setShowRegisterForm] = useState(false);
  const videoRef = useRef(null);

  const [patientData, setPatientData] = useState({ patientId: '', name: '', ward: '', wardId: '', risk: 'Low' });
  const [imageFile, setImageFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  const [patientsList, setPatientsList] = useState([]);

  const handleTabChange = (tabName) => {
    setActiveTab(tabName);
    setShowRegisterForm(false);
  };

  const fetchPatients = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/patients');
      const data = await response.json();
      if (response.ok) {
        setPatientsList(data);
      }
    } catch (error) {
      console.error("Error fetching patients:", error);
    }
  };

  useEffect(() => {
    if (activeTab === 'patient') {
      fetchPatients();
    }
  }, [activeTab]);

  useEffect(() => {
    let stream = null;
    const startCamera = async () => {
      if (activeTab === 'cctv') {
        try {
          stream = await navigator.mediaDevices.getUserMedia({ video: true });
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        } catch (err) {
          console.error("Camera access denied or error:", err);
        }
      }
    };
    startCamera();
    return () => {
      if (stream) stream.getTracks().forEach(track => track.stop());
    };
  }, [activeTab]);

  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  const handleRegisterPatient = async (e) => {
    e.preventDefault();
    if (!patientData.patientId || !patientData.name || !imageFile) {
      alert("Please fill all required fields and select an image!");
      return;
    }
    setIsUploading(true);
    const formData = new FormData();
    formData.append('patientId', patientData.patientId);
    formData.append('name', patientData.name);
    formData.append('ward', patientData.ward);
    formData.append('wardId', patientData.wardId);
    formData.append('riskLevel', patientData.risk);
    formData.append('image', imageFile); 

    try {
      const response = await fetch('http://localhost:5000/api/register-patient', {
        method: 'POST',
        body: formData, 
      });
      const result = await response.json();
      if (response.ok) {
        alert("Patient Registered Successfully in MySQL!");
        setPatientData({ patientId: '', name: '', ward: '', wardId: '', risk: 'Low' });
        setImageFile(null);
        setShowRegisterForm(false);
        fetchPatients(); 
      } else {
        alert("Error: " + result.error);
      }
    } catch (error) {
      console.error("Error saving patient: ", error);
      alert("Server connection failed. Is Python running?");
    } finally {
      setIsUploading(false);
    }
  };

  // පොඩි රතු පාට Dot එකක් හදනවා Emojis වෙනුවට කැමරා නමට ඉස්සරහින් දාන්න
  const LiveDot = () => <span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#ef4444', marginRight: '6px' }}></span>;

  const NoSignalBox = ({ camName }) => (
    <div className="cctv-box" style={{ padding: 0, overflow: 'hidden', backgroundColor: '#111', display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', position: 'relative' }}>
      <div className="cctv-top-bar" style={{ position: 'absolute', top: '10px', left: '10px', right: '10px', zIndex: 2 }}>
        <div className="cam-name" style={{ backgroundColor: 'rgba(255,255,255,0.1)', color: '#aaa', border: '1px solid #444', display: 'flex', alignItems: 'center' }}>
          <Camera size={14} style={{ marginRight: '6px' }} /> {camName}
        </div>
        <div className="cam-time" style={{ color: '#666', fontSize: '12px' }}>Disconnected</div>
      </div>
      <div style={{ textAlign: 'center', color: '#555', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <AlertTriangle size={48} color="#555" style={{ marginBottom: '10px' }} />
        <div style={{ fontSize: '20px', fontWeight: 'bold', letterSpacing: '2px', color: '#666' }}>NO SIGNAL</div>
        <div style={{ fontSize: '11px', color: '#444', marginTop: '5px' }}>CAMERA NOT CONNECTED</div>
      </div>
      <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'linear-gradient(rgba(255,255,255,0.03) 50%, transparent 50%)', backgroundSize: '100% 4px', pointerEvents: 'none' }}></div>
    </div>
  );

  return (
    <div className="dashboard-container">
      
      {/* Left Sidebar Navigation */}
      <div className="sidebar">
        <div className="sidebar-header">
          <div className="logo-box">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
            </svg>
          </div>
          <div>
            <h3 className="sidebar-brand">CareVision LK</h3>
            <p className="sidebar-subtitle">Hospital Security AI</p>
          </div>
        </div>

        {/* Emojis වෙනුවට Professional Icons දැම්මා */}
        <ul className="sidebar-menu">
          <li className={activeTab === 'dashboard' ? 'active' : ''} onClick={() => handleTabChange('dashboard')}>
            <Home size={18} style={{marginRight: '12px'}} /> Dashboard
          </li>
          <li className={activeTab === 'cctv' ? 'active' : ''} onClick={() => handleTabChange('cctv')}>
            <Camera size={18} style={{marginRight: '12px'}} /> Live CCTV Feeds
          </li>
          <li className={activeTab === 'patient' ? 'active' : ''} onClick={() => handleTabChange('patient')}>
            <Users size={18} style={{marginRight: '12px'}} /> Patient Management
          </li>
          <li className={activeTab === 'access' ? 'active' : ''} onClick={() => handleTabChange('access')}>
            <ShieldAlert size={18} style={{marginRight: '12px'}} /> Access Control
          </li>
          <li className={activeTab === 'fire' ? 'active' : ''} onClick={() => handleTabChange('fire')}>
            <Flame size={18} style={{marginRight: '12px'}} /> Fire Monitoring
          </li>
          <li className={activeTab === 'alerts' ? 'active' : ''} onClick={() => handleTabChange('alerts')}>
            <BellRing size={18} style={{marginRight: '12px'}} /> Alerts
          </li>
          <li className={activeTab === 'reports' ? 'active' : ''} onClick={() => handleTabChange('reports')}>
            <FileText size={18} style={{marginRight: '12px'}} /> Reports & Logs
          </li>
          <li className={activeTab === 'user' ? 'active' : ''} onClick={() => handleTabChange('user')}>
            <UserCog size={18} style={{marginRight: '12px'}} /> User Management
          </li>
          <li className={activeTab === 'setting' ? 'active' : ''} onClick={() => handleTabChange('setting')}>
            <Settings size={18} style={{marginRight: '12px'}} /> Setting
          </li>
        </ul>

        {/* Sidebar Footer with Icons */}
        <div className="sidebar-footer">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px', padding: '10px', backgroundColor: '#f8f9fa', borderRadius: '8px', border: '1px solid #e9ecef' }}>
            <div style={{ width: '35px', height: '35px', borderRadius: '50%', backgroundColor: '#0D6EFD', display: 'flex', justifyContent: 'center', alignItems: 'center', color: 'white' }}>
              <User size={20} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
              <span style={{ color: '#333', fontSize: '14px', fontWeight: 'bold', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                {user?.displayName || 'Admin User'}
              </span>
              <span style={{ color: '#666', fontSize: '11px', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                {user?.email || 'admin@carevision.lk'}
              </span>
            </div>
          </div>

          <button className="logout-btn" onClick={onLogout} style={{display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'}}>
            <LogOut size={16} /> Logout
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="main-content">
        
        {activeTab === 'dashboard' && (
          <>
            <div className="header">
              <h1>Dashboard Overview</h1>
              <p>Real-time hospital monitoring and security status</p>
            </div>
            
            <div className="stats-grid">
              <div className="stat-card"><h4>Total Cameras</h4><h2>24</h2><p className="stat-sub">+2 this week</p></div>
              <div className="stat-card"><h4>Registered Patients</h4><h2>156</h2><p className="stat-sub">+12 today</p></div>
              <div className="stat-card"><h4>Today's Alerts</h4><h2>8</h2><p className="stat-sub">3 critical</p></div>
              <div className="stat-card"><h4>Mask Violations</h4><h2>3</h2><p className="stat-sub">-2 from yesterday</p></div>
            </div>
            
            <div className="bottom-grid">
              <div className="alerts-section card-box">
                <h3 style={{display: 'flex', alignItems: 'center', gap: '8px'}}><AlertTriangle size={18} color="#ef4444" /> Active Alerts</h3>
                <div className="alert-item"><span className="dot red-dot"></span> Fire</div>
                <div className="alert-item"><span className="dot orange-dot"></span> Patient Wandering</div>
                <div className="alert-item"><span className="dot yellow-dot"></span> Mask Violation</div>
                <div className="alert-item"><span className="dot orange-dot"></span> Unauthorized Access</div>
              </div>
              
              <div className="chart-section card-box">
                <h3>Weekly Alerts Overview</h3>
                <div className="mock-chart">
                  <div className="bar-group"><div className="bar grey" style={{height: '50%'}}></div><div className="bar orange" style={{height: '30%'}}></div><div className="bar red" style={{height: '60%'}}></div><span>Mon</span></div>
                  <div className="bar-group"><div className="bar grey" style={{height: '30%'}}></div><div className="bar orange" style={{height: '70%'}}></div><div className="bar red" style={{height: '50%'}}></div><span>Tue</span></div>
                  <div className="bar-group"><div className="bar grey" style={{height: '50%'}}></div><div className="bar orange" style={{height: '60%'}}></div><div className="bar red" style={{height: '20%'}}></div><span>Wed</span></div>
                  <div className="bar-group"><div className="bar grey" style={{height: '60%'}}></div><div className="bar orange" style={{height: '75%'}}></div><div className="bar red" style={{height: '45%'}}></div><span>Thu</span></div>
                  <div className="bar-group"><div className="bar grey" style={{height: '85%'}}></div><div className="bar orange" style={{height: '45%'}}></div><div className="bar red" style={{height: '60%'}}></div><span>Fri</span></div>
                  <div className="bar-group"><div className="bar grey" style={{height: '40%'}}></div><div className="bar orange" style={{height: '85%'}}></div><div className="bar red" style={{height: '20%'}}></div><span>Sat</span></div>
                  <div className="bar-group"><div className="bar grey" style={{height: '40%'}}></div><div className="bar orange" style={{height: '40%'}}></div><div className="bar red" style={{height: '60%'}}></div><span>Sun</span></div>
                </div>
              </div>
            </div>
          </>
        )}

        {activeTab === 'cctv' && (
          <div className="cctv-wrapper card-box">
            <div className="header">
              <h1>Live CCTV Feeds</h1>
              <p>Real-time hospital monitoring and security status</p>
            </div>
            <div className="cctv-grid">
              <div className="cctv-box" style={{ padding: 0, overflow: 'hidden', position: 'relative' }}>
                <div className="cctv-top-bar" style={{ position: 'absolute', top: '10px', left: '10px', right: '10px', zIndex: 2 }}>
                  <div className="cam-name" style={{ backgroundColor: 'rgba(0,0,0,0.6)', color: 'white', border: 'none', display: 'flex', alignItems: 'center' }}>
                    <LiveDot /> Local WebCam (Live)
                  </div>
                  <div className="cam-time" style={{ backgroundColor: 'rgba(0,0,0,0.6)', color: 'white', padding: '2px 8px', borderRadius: '4px' }}>Live</div>
                </div>
                <video ref={videoRef} autoPlay playsInline muted style={{ width: '100%', height: '100%', objectFit: 'cover' }}></video>
              </div>
              <NoSignalBox camName="ICU Ward 01" />
              <NoSignalBox camName="Lab Entrance" />
              <NoSignalBox camName="Emergency Exit" />
            </div>
          </div>
        )}

        {activeTab === 'patient' && (
          <div className="patient-wrapper">
            <div className="page-header-flex">
              <div className="header">
                <h1>Patient Management</h1>
                <p>Register and monitor high-risk patients</p>
              </div>
              {!showRegisterForm && (
                <button className="primary-btn" onClick={() => setShowRegisterForm(true)}>+ Register Patient</button>
              )}
            </div>
            
            {showRegisterForm ? (
              <form onSubmit={handleRegisterPatient} className="register-form-card card-box">
                <div className="form-row">
                  <label>Patient ID :</label>
                  <input type="text" className="form-input" required value={patientData.patientId} onChange={(e) => setPatientData({...patientData, patientId: e.target.value})} />
                </div>
                <div className="form-row">
                  <label>Patient Name :</label>
                  <input type="text" className="form-input" required value={patientData.name} onChange={(e) => setPatientData({...patientData, name: e.target.value})} />
                </div>
                <div className="form-row">
                  <label>Ward :</label>
                  <input type="text" className="form-input" value={patientData.ward} onChange={(e) => setPatientData({...patientData, ward: e.target.value})} />
                </div>
                <div className="form-row">
                  <label>Ward ID :</label>
                  <input type="text" className="form-input" value={patientData.wardId} onChange={(e) => setPatientData({...patientData, wardId: e.target.value})} />
                </div>
                <div className="form-row">
                  <label>Risk Level :</label>
                  <div className="radio-group">
                    <label><input type="radio" name="risk" value="High" checked={patientData.risk === 'High'} onChange={(e) => setPatientData({...patientData, risk: e.target.value})} /> High</label>
                    <label><input type="radio" name="risk" value="Medium" checked={patientData.risk === 'Medium'} onChange={(e) => setPatientData({...patientData, risk: e.target.value})} /> Medium</label>
                    <label><input type="radio" name="risk" value="Low" checked={patientData.risk === 'Low'} onChange={(e) => setPatientData({...patientData, risk: e.target.value})} /> Low</label>
                  </div>
                </div>
                
                <div className="form-row align-start">
                  <label className="mt-2">Add Image :</label>
                  <div style={{ padding: '10px 0' }}>
                    <input type="file" accept="image/*" required onChange={handleImageChange} className="form-input" style={{ border: 'none', padding: '0' }} />
                    {imageFile && <p style={{fontSize: '13px', color: '#16a34a', marginTop: '8px', fontWeight: 'bold'}}>✓ Selected: {imageFile.name}</p>}
                  </div>
                </div>

                <div className="form-actions" style={{marginTop: '20px'}}>
                  <button type="submit" className="btn-register" disabled={isUploading}>
                    {isUploading ? 'Saving...' : 'Register Patient'}
                  </button>
                  <button type="button" className="btn-cancel" onClick={() => setShowRegisterForm(false)} disabled={isUploading}>Cancel</button>
                </div>
              </form>
            ) : (
              <>
                <div className="patient-stats-grid">
                  <div className="stat-card flex-between">
                    <div><h4>Total Patients</h4><h2>{patientsList.length}</h2></div>
                    <div className="icon-circle blue-circle">!</div>
                  </div>
                  <div className="stat-card flex-between">
                    <div><h4>High Risk</h4><h2>{patientsList.filter(p => p.risk_level === 'High').length}</h2></div>
                    <div className="icon-circle red-circle">!</div>
                  </div>
                  <div className="stat-card flex-between">
                    <div><h4>Exit Alerts Today</h4><h2>0</h2></div>
                    <div className="icon-circle orange-circle">!</div>
                  </div>
                </div>
                
                <div className="table-container card-box">
                  <h3>Registered Patients</h3>
                  <input type="text" className="search-bar" placeholder="Search Patients..." />
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Name (ID)</th>
                        <th>Ward</th>
                        <th>Risk Level</th>
                        <th>Registered Date</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {patientsList.length === 0 ? (
                        <tr><td colSpan="5" style={{textAlign: 'center', padding: '20px', color: '#666'}}>No patients registered yet.</td></tr>
                      ) : (
                        patientsList.map((patient, index) => (
                          <tr key={index}>
                            <td><strong>{patient.name}</strong> <span style={{fontSize: '12px', color: '#666'}}>({patient.patient_id})</span></td>
                            <td>{patient.ward || 'N/A'}</td>
                            <td className={patient.risk_level === 'High' ? 'text-red font-bold' : patient.risk_level === 'Medium' ? 'text-orange font-bold' : 'text-green font-bold'}>
                              {patient.risk_level}
                            </td>
                            <td>{patient.registered_date}</td>
                            <td><span className="action-edit" style={{cursor: 'pointer'}}>Edit</span> / <span className="action-delete" style={{cursor: 'pointer'}}>Delete</span></td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </>
            )}
          </div>
        )}

        {activeTab === 'access' && (
          <div className="access-wrapper">
             <div className="header">
              <h1>Access Control</h1>
              <p>Real-time hospital monitoring and security status</p>
            </div>
            <div className="stats-grid">
              <div className="stat-card"><div className="flex-between align-start"><div><h4>Total Access Attempts</h4><h2>234</h2><p className="stat-sub">+28 this week</p></div><div className="outline-icon-box border-blue"><Users size={20} /></div></div></div>
              <div className="stat-card"><div className="flex-between align-start"><div><h4>Access Granted</h4><h2>198</h2><p className="stat-sub">84.6% compliance</p></div><div className="outline-icon-box border-green"><ShieldAlert size={20} /></div></div></div>
              <div className="stat-card"><div className="flex-between align-start"><div><h4>Access Denied</h4><h2>36</h2><p className="stat-sub">15.4% violations</p></div><div className="outline-icon-box border-red"><AlertTriangle size={20} /></div></div></div>
              <div className="stat-card"><div className="flex-between align-start"><div><h4>Active Cameras</h4><h2>4</h2><p className="stat-sub">All operational</p></div><div className="outline-icon-box border-yellow"><Camera size={20} /></div></div></div>
            </div>
            <div className="table-container card-box mt-4">
              <h3 className="mb-4">Access Control Logs</h3>
              <table className="data-table">
                <thead>
                  <tr><th>Camera ID</th><th>Mask Detected</th><th>Confidence</th><th>Access Result</th><th>Timestamp</th></tr>
                </thead>
                <tbody>
                  <tr><td>Lab Entry - Cam 08</td><td className="text-green font-bold">Yes</td><td>98%</td><td className="text-green font-bold">Granted</td><td>2024-02-24 14:45:30</td></tr>
                  <tr><td>ICU Entry - Cam 12</td><td className="text-red font-bold">No</td><td>95%</td><td className="text-red font-bold">Denied</td><td>2024-02-24 14:30:15</td></tr>
                  <tr><td>Lab Entry - Cam 08</td><td className="text-green font-bold">Yes</td><td>92%</td><td className="text-green font-bold">Granted</td><td>2024-02-24 14:15:20</td></tr>
                  <tr><td>Lab Entry - Cam 08</td><td className="text-green font-bold">Yes</td><td>96%</td><td className="text-green font-bold">Granted</td><td>2024-02-24 13:50:10</td></tr>
                  <tr><td>ICU Entry - Cam 12</td><td className="text-red font-bold">No</td><td>97%</td><td className="text-red font-bold">Denied</td><td>2024-02-24 13:20:45</td></tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'fire' && (
          <div className="fire-wrapper">
            <div className="header">
              <h1>Fire & Smoke Detection</h1>
              <p>Real-time fire and smoke monitoring system</p>
            </div>
            <div className="stats-grid">
              <div className="stat-card"><div className="flex-between align-start"><div><h4>Active Alerts</h4><h2>1</h2><p className="stat-sub">+28 this week</p></div><div className="outline-icon-box border-red"><AlertTriangle size={20} /></div></div></div>
              <div className="stat-card"><div className="flex-between align-start"><div><h4>Total Events (24h)</h4><h2>4</h2><p className="stat-sub">84.6% compliance</p></div><div className="outline-icon-box border-orange"><Flame size={20} /></div></div></div>
              <div className="stat-card"><div className="flex-between align-start"><div><h4>Resolved Events</h4><h2>3</h2><p className="stat-sub">15.4% violations</p></div><div className="outline-icon-box border-green"><ShieldAlert size={20} /></div></div></div>
              <div className="stat-card"><div className="flex-between align-start"><div><h4>Monitoring Cameras</h4><h2>6</h2><p className="stat-sub">All operational</p></div><div className="outline-icon-box border-yellow"><Camera size={20} /></div></div></div>
            </div>
            <div className="fire-alert-banner">
              <h3 className="alert-title" style={{display: 'flex', alignItems: 'center', gap: '8px'}}><Flame size={20} /> Active Fire/Smoke Alert</h3>
              <div className="alert-details-grid">
                <div><div className="detail-label">Location</div><div className="detail-value">ICU - Camera 12</div></div>
                <div><div className="detail-label">Confidence Level</div><div className="detail-value">95%</div></div>
                <div><div className="detail-label">Event Type</div><div className="detail-value">Smoke Detected</div></div>
                <div><div className="detail-label">Detection Time</div><div className="detail-value">2024-02-24 14:30:25</div></div>
              </div>
              <div className="alert-actions">
                <button className="btn-notify" style={{display: 'flex', alignItems: 'center', gap: '6px'}}><BellRing size={16} /> Notify Emergency Service</button>
                <button className="btn-resolve">Mark as Resolved</button>
              </div>
            </div>
            <div className="table-container card-box mt-4">
              <h3 className="mb-4">Fire & Smoke Event Logs</h3>
              <table className="data-table">
                <thead><tr><th>Event Type</th><th>Confidence</th><th>Severity</th><th>Status</th><th>Timestamp</th></tr></thead>
                <tbody>
                  <tr><td>Smoke Detected</td><td>95%</td><td className="text-red font-bold">High</td><td className="text-red font-bold">Active</td><td>2024-02-24 14:45:30</td></tr>
                  <tr><td>Fire Detected</td><td>88%</td><td className="text-orange font-bold">Critical</td><td className="text-green font-bold">Resolved</td><td>2024-02-24 14:30:15</td></tr>
                  <tr><td>Smoke Detected</td><td>76%</td><td className="text-yellow font-bold">Medium</td><td className="text-green font-bold">Resolved</td><td>2024-02-24 14:15:20</td></tr>
                  <tr><td>Smoke Detected</td><td>82%</td><td className="text-yellow font-bold">Medium</td><td className="text-green font-bold">Resolved</td><td>2024-02-24 13:50:10</td></tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'alerts' && (
          <div className="alerts-wrapper">
            <div className="header">
              <h1>Alert Management</h1>
              <p>Monitor and manage system alerts and notifications</p>
            </div>
            <div className="stats-grid">
              <div className="stat-card"><h4>Total Alerts</h4><h2>3</h2></div>
              <div className="stat-card"><h4>High Priority</h4><h2 className="text-red">2</h2></div>
              <div className="stat-card"><h4>Pending</h4><h2 className="text-orange">1</h2></div>
              <div className="stat-card"><h4>Resolved</h4><h2 className="text-green">0</h2></div>
            </div>
            <div className="table-container card-box mt-4">
              <h3 style={{marginBottom: '5px'}}>Alert Feed</h3>
              <p className="detail-label" style={{marginBottom: '20px'}}>Filter alerts by type and manage responses</p>
              <div className="alert-list">
                <div className="alert-feed-item">
                  <div className="alert-icon-box bg-red"><Flame size={20} color="white" /></div>
                  <div className="alert-details">
                    <h4 className="alert-item-title">Fire</h4>
                    <p className="alert-item-desc">Fire detected in Ward 3 Corridor</p>
                    <p className="alert-item-meta">Camera: Ward 3 Corridor | Feb 24, 2026 08:30</p>
                  </div>
                  <button className="btn-resolve-green">Mark as Resolved</button>
                </div>
                <div className="alert-feed-item">
                  <div className="alert-icon-box bg-red"><User size={20} color="white" /></div>
                  <div className="alert-details">
                    <h4 className="alert-item-title">Patient Wandering</h4>
                    <p className="alert-item-desc">Patient John Anderson detected at Emergency Exit A</p>
                    <p className="alert-item-meta">Camera: Emergency Exit A | Feb 24, 2026 09:15</p>
                  </div>
                  <button className="btn-resolve-green">Mark as Resolved</button>
                </div>
                <div className="alert-feed-item">
                  <div className="alert-icon-box bg-red"><ShieldAlert size={20} color="white" /></div>
                  <div className="alert-details">
                    <h4 className="alert-item-title">Mask Violation</h4>
                    <p className="alert-item-desc">Staff entered ICU without proper mask</p>
                    <p className="alert-item-meta">Camera: ICU Wing | Feb 24, 2026 10:00</p>
                  </div>
                  <button className="btn-resolve-green">Mark as Resolved</button>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'reports' && (
          <div className="reports-wrapper">
            <div className="header">
              <h1>Reports & Logs</h1>
              <p>Generate and download detailed system reports</p>
            </div>
            <div className="reports-filter-card card-box">
              <div className="filter-group">
                <label>Report Type</label>
                <select className="form-input select-input">
                  <option>Daily Alert Report</option>
                  <option>Weekly Summary</option>
                  <option>Monthly Overview</option>
                </select>
              </div>
              <div className="filter-group">
                <label>Select Date</label>
                <input type="text" className="form-input" placeholder="Select a date..." />
              </div>
              <div className="filter-action">
                <button className="btn-download-pdf" style={{display: 'flex', alignItems: 'center', gap: '8px'}}><Download size={16} /> Download PDF</button>
              </div>
            </div>
            <div className="reports-stats-grid">
              <div className="report-stat-card"><h2 className="text-black">0</h2><p>Total Alerts</p></div>
              <div className="report-stat-card"><h2 className="text-red">0</h2><p>Fire Events</p></div>
              <div className="report-stat-card"><h2 className="text-orange">0</h2><p>Patient Exits</p></div>
              <div className="report-stat-card"><h2 className="text-blue">0</h2><p>Access Logs</p></div>
            </div>
            <div className="table-container card-box mt-4">
              <h3 className="mb-4">Alert Details</h3>
              <table className="data-table">
                <thead><tr><th>Time</th><th>Type</th><th>Message</th><th>Priority</th><th>Status</th></tr></thead>
                <tbody><tr><td colSpan="5" className="empty-state-text">No alerts for selected date</td></tr></tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'user' && (
          <div className="user-wrapper">
            <div className="header">
              <h1>User Management</h1>
              <p>Manage staff accounts and system access</p>
            </div>
            <div className="patient-stats-grid">
              <div className="stat-card flex-between"><div><h4>Total Staff</h4><h2>5</h2></div><div className="icon-circle blue-circle">!</div></div>
              <div className="stat-card flex-between"><div><h4>Active Users</h4><h2>2</h2></div><div className="icon-circle red-circle">!</div></div>
              <div className="stat-card flex-between"><div><h4>Inactive Users</h4><h2>3</h2></div><div className="icon-circle orange-circle">!</div></div>
            </div>
            <div className="table-container card-box mt-4 border-blue-wrap">
              <h3 className="mb-4">Staff Accounts</h3>
              <table className="data-table">
                <thead><tr><th>Username</th><th>Email</th><th>Status</th><th>Created</th></tr></thead>
                <tbody>
                  <tr><td>admin</td><td>admin@hospital.lk</td><td className="text-green font-bold">Active</td><td>2024-02-24</td></tr>
                  <tr><td>sjohnson</td><td>sarah.j@hospital.lk</td><td className="text-green font-bold">Active</td><td>2024-02-24</td></tr>
                  <tr><td>mikesmith</td><td>mike.s@hospital.lk</td><td className="text-green font-bold">Active</td><td>2024-02-24</td></tr>
                  <tr><td>jonny</td><td>jonny.s@hospital.lk</td><td className="text-green font-bold">Active</td><td>2024-02-24</td></tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'setting' && (
          <div className="setting-wrapper">
            
            <div className="header">
              <h1>System Setting</h1>
              <p>Configure cameras, monitoring zones, and system preferences</p>
            </div>

            <div className="card-box mt-4">
              <div className="camera-header-wrap">
                <h3 style={{display: 'flex', alignItems: 'center', gap: '8px', margin: '0 0 5px 0'}}>
                  <Camera size={20} /> Camera Management
                </h3>
                <p className="detail-label" style={{marginBottom: '20px'}}>Add, edit, or remove cameras from the system</p>
              </div>

              <table className="data-table text-left-table">
                <thead>
                  <tr>
                    <th>Camera Name</th>
                    <th>IP Address</th>
                    <th>Zone</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Main Entrance</td>
                    <td>192.168.1.101</td>
                    <td>Entrance</td>
                    <td>Active</td>
                    <td><span className="action-edit font-bold">Edit</span> <span className="action-delete font-bold ml-2 text-black">Delete</span></td>
                  </tr>
                  <tr>
                    <td>Lab Entrance</td>
                    <td>192.168.1.101</td>
                    <td>Lab</td>
                    <td>Active</td>
                    <td><span className="action-edit font-bold">Edit</span> <span className="action-delete font-bold ml-2 text-black">Delete</span></td>
                  </tr>
                  <tr>
                    <td>ICU Wing</td>
                    <td>192.168.1.101</td>
                    <td>ICU</td>
                    <td>Active</td>
                    <td><span className="action-edit font-bold">Edit</span> <span className="action-delete font-bold ml-2 text-black">Delete</span></td>
                  </tr>
                  <tr>
                    <td>Ward 3</td>
                    <td>192.168.1.101</td>
                    <td>Ward</td>
                    <td>Active</td>
                    <td><span className="action-edit font-bold">Edit</span> <span className="action-delete font-bold ml-2 text-black">Delete</span></td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="card-box mt-4">
              <h3 className="mb-4">Contact Support</h3>
              <div className="support-btn-container">
                <button className="support-phone-btn" style={{display: 'flex', alignItems: 'center', gap: '6px'}}><Phone size={14} /> +94765293838</button>
                <button className="support-phone-btn" style={{display: 'flex', alignItems: 'center', gap: '6px'}}><Phone size={14} /> +94766486769</button>
                <button className="support-phone-btn" style={{display: 'flex', alignItems: 'center', gap: '6px'}}><Phone size={14} /> +94766486769</button>
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};

export default Dashboard;