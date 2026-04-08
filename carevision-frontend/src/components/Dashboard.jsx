import React, { useState, useEffect } from 'react';
import { auth } from '../firebase'; 
import { Home, Camera, Users, ShieldAlert, Flame, BellRing, FileText, UserCog, Settings, LogOut, User, AlertTriangle, Download, Phone, Cpu, Maximize } from 'lucide-react';
import './Dashboard.css';

const Dashboard = ({ onLogout }) => {
  const user = auth.currentUser; 

  const [activeTab, setActiveTab] = useState('dashboard');
  const [showRegisterForm, setShowRegisterForm] = useState(false);

  const [patientData, setPatientData] = useState({ patientId: '', name: '', ward: '', wardId: '', risk: 'Low' });
  const [imageFile, setImageFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [patientsList, setPatientsList] = useState([]);
  
  const [accessLogs, setAccessLogs] = useState([]);
  const [fireLogs, setFireLogs] = useState([]);
  const [systemAlerts, setSystemAlerts] = useState([]);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [reportDate, setReportDate] = useState('');

  const [aiControls, setAiControls] = useState({
    patientIdent: false,
    maskDetect: false,
    fireDetect: false
  });

  const [cameraIps, setCameraIps] = useState({ '1': '', '2': '', '3': '', '4': '', '5': '', '6': '', '7': '', '8': '', '9': '' });
  const [inputIps, setInputIps] = useState({ '1': '', '2': '', '3': '', '4': '', '5': '', '6': '', '7': '', '8': '', '9': '' });

  useEffect(() => {
    const fetchCurrentModes = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/get_modes');
        if (response.ok) {
          const data = await response.json();
          setAiControls(data);
        }
      } catch (error) {
        console.error("Error fetching AI modes:", error);
      }
    };
    fetchCurrentModes();
  }, []);

  useEffect(() => {
    fetch('http://localhost:5000/api/get_cameras')
      .then(res => res.json())
      .then(data => {
        setCameraIps(prev => ({...prev, ...data}));
        setInputIps(prev => ({...prev, ...data}));
      })
      .catch(err => console.log(err));
  }, []);

  const handleTabChange = (tabName) => {
    setActiveTab(tabName);
    setShowRegisterForm(false);
    setSearchQuery(''); 
    setReportDate(''); 
  };

  const fetchPatients = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/patients');
      const data = await response.json();
      if (response.ok) {
        if (Array.isArray(data)) {
          setPatientsList(data);
        } else {
          console.error("Database Error:", data.error);
          setPatientsList([]); 
        }
      }
    } catch (error) {
      console.error("Error fetching patients:", error);
      setPatientsList([]);
    }
  };

  useEffect(() => {
    if (activeTab === 'patient') {
      fetchPatients();
    }
  }, [activeTab]);

  const fetchAccessLogs = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/access_logs');
      const data = await response.json();
      if (response.ok && Array.isArray(data)) {
        setAccessLogs(data);
      }
    } catch (error) {
      console.error("Error fetching access logs:", error);
    }
  };

  useEffect(() => {
    if (activeTab === 'access' || activeTab === 'reports') {
      fetchAccessLogs();
      const interval = setInterval(fetchAccessLogs, 3000);
      return () => clearInterval(interval);
    }
  }, [activeTab]);

  const fetchFireLogs = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/fire_logs');
      const data = await response.json();
      if (response.ok && Array.isArray(data)) {
        setFireLogs(data);
      }
    } catch (error) {
      console.error("Error fetching fire logs:", error);
    }
  };

  useEffect(() => {
    if (activeTab === 'fire' || activeTab === 'reports') {
      fetchFireLogs();
      const interval = setInterval(fetchFireLogs, 3000);
      return () => clearInterval(interval);
    }
  }, [activeTab]);

  const fetchSystemAlerts = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/system_alerts');
      const data = await response.json();
      if (response.ok && Array.isArray(data)) {
        setSystemAlerts(data);
      }
    } catch (error) {
      console.error("Error fetching system alerts:", error);
    }
  };

  useEffect(() => {
    if (activeTab === 'alerts' || activeTab === 'reports') {
      fetchSystemAlerts();
      const interval = setInterval(fetchSystemAlerts, 3000);
      return () => clearInterval(interval);
    }
  }, [activeTab]);

  const handleResolveFireAlert = async (logId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/resolve_fire_alert/${logId}`, {
        method: 'POST',
      });
      if (response.ok) {
        fetchFireLogs(); 
      }
    } catch (error) {
      console.error("Error resolving alert:", error);
    }
  };

  const handleResolveSystemAlert = async (alertId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/resolve_system_alert/${alertId}`, {
        method: 'POST',
      });
      if (response.ok) {
        fetchSystemAlerts(); 
      }
    } catch (error) {
      console.error("Error resolving system alert:", error);
    }
  };

  const handleNotifyEmergency = (location) => {
    alert(`🚨 URGENT: Emergency Services have been notified for ${location}!`);
  };

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

  const handleDeletePatient = async (patientId) => {
    if (window.confirm("Are you sure you want to delete this patient?")) {
      try {
        const response = await fetch(`http://localhost:5000/api/delete-patient/${patientId}`, {
          method: 'DELETE',
        });
        const result = await response.json();
        
        if (response.ok && result.status === 'success') {
          alert("Patient deleted successfully!");
          fetchPatients(); 
        } else {
          alert("Error: " + result.message);
        }
      } catch (error) {
        console.error("Error deleting patient:", error);
        alert("Failed to delete patient. Check server.");
      }
    }
  };

  const toggleAI = async (feature) => {
    try {
      const response = await fetch(`http://localhost:5000/toggle_mode/${feature}`, {
        method: 'POST',
      });
      if (response.ok) {
        const data = await response.json();
        if (data.status === 'success') {
          setAiControls(data.modes);
        }
      }
    } catch (error) {
      console.error("AI Server Error:", error);
      alert("AI Server connection failed! Make sure your Python backend is running.");
    }
  };

  const handleSaveCamera = async (camId) => {
    const url = inputIps[camId];
    const formData = new FormData();
    formData.append('cam_id', camId);
    formData.append('url', url);

    try {
      const response = await fetch('http://localhost:5000/api/update_camera', { method: 'POST', body: formData });
      if (response.ok) {
        setCameraIps(prev => ({ ...prev, [camId]: url }));
        alert(`Camera 0${camId} connected successfully!`);
      }
    } catch (error) {
      alert("Failed to save camera IP.");
    }
  };

  const handleRemoveCamera = async (camId) => {
    const formData = new FormData();
    formData.append('cam_id', camId);
    formData.append('url', ''); 

    try {
      const response = await fetch('http://localhost:5000/api/update_camera', { method: 'POST', body: formData });
      if (response.ok) {
        setCameraIps(prev => ({ ...prev, [camId]: '' }));
        setInputIps(prev => ({ ...prev, [camId]: '' }));
      }
    } catch (error) {
      alert("Failed to remove camera.");
    }
  };

  const toggleFullScreen = (e) => {
    const elem = e.currentTarget.parentElement; 
    if (!document.fullscreenElement) {
      if (elem.requestFullscreen) {
        elem.requestFullscreen();
      } else if (elem.webkitRequestFullscreen) { 
        elem.webkitRequestFullscreen();
      } else if (elem.msRequestFullscreen) { 
        elem.msRequestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  };

  const handlePrintPDF = () => {
    window.print();
  };

  const filteredPatients = Array.isArray(patientsList) ? patientsList.filter(patient => {
    const pName = patient.name ? String(patient.name).toLowerCase() : '';
    const pId = patient.patient_id ? String(patient.patient_id).toLowerCase() : '';
    const query = searchQuery ? String(searchQuery).toLowerCase() : '';
    return pName.includes(query) || pId.includes(query);
  }) : [];

  const filteredReports = Array.isArray(systemAlerts) ? systemAlerts.filter(alert => {
    if (!reportDate) return true;
    const alertDate = alert.timestamp ? alert.timestamp.split(' ')[0] : '';
    return alertDate === reportDate;
  }) : [];

  const LiveDot = () => <span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#ef4444', marginRight: '6px' }}></span>;

  const NoSignalBox = ({ camName }) => (
    <div className="cctv-box" style={{ padding: 0, overflow: 'hidden', backgroundColor: '#111', display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', position: 'relative', height: '250px', borderRadius: '12px', border: '1px solid #444' }}>
      <div className="cctv-top-bar" style={{ position: 'absolute', top: '10px', left: '10px', right: '10px', zIndex: 2 }}>
        <div className="cam-name" style={{ backgroundColor: 'rgba(255,255,255,0.1)', color: '#aaa', border: '1px solid #444', display: 'flex', alignItems: 'center', padding: '4px 10px', borderRadius: '6px', fontSize: '12px' }}>
          <Camera size={12} style={{ marginRight: '6px' }} /> {camName}
        </div>
      </div>
      <div style={{ textAlign: 'center', color: '#555', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <AlertTriangle size={32} color="#555" style={{ marginBottom: '10px' }} />
        <div style={{ fontSize: '16px', fontWeight: 'bold', letterSpacing: '2px', color: '#666' }}>NO SIGNAL</div>
      </div>
      <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'linear-gradient(rgba(255,255,255,0.03) 50%, transparent 50%)', backgroundSize: '100% 4px', pointerEvents: 'none' }}></div>
    </div>
  );

  const totalAccess = accessLogs.length;
  const grantedAccess = accessLogs.filter(log => log.access_result === 'Granted').length;
  const deniedAccess = accessLogs.filter(log => log.access_result === 'Denied').length;
  const activeCamCount = Object.values(cameraIps).filter(ip => ip !== '').length;

  const activeFireAlerts = fireLogs.filter(log => log.status === 'Active');
  const resolvedFireAlerts = fireLogs.filter(log => log.status === 'Resolved');
  const activeFireCamsCount = ['7', '8', '9'].filter(cam => cameraIps[cam] !== '').length;
  const latestActiveFire = activeFireAlerts.length > 0 ? activeFireAlerts[0] : null;

  const totalSystemAlerts = systemAlerts.length;
  const pendingSystemAlerts = systemAlerts.filter(a => a.status === 'Pending');
  const resolvedSystemAlertsCount = systemAlerts.filter(a => a.status === 'Resolved').length;
  const highPrioritySystemAlertsCount = systemAlerts.filter(a => a.priority === 'High' && a.status === 'Pending').length;

  return (
    <div className="dashboard-container">
      
      {/* Sidebar */}
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

        <ul className="sidebar-menu">
          <li className={activeTab === 'dashboard' ? 'active' : ''} onClick={() => handleTabChange('dashboard')}><Home size={18} style={{marginRight: '12px'}} /> Dashboard</li>
          <li className={activeTab === 'cctv' ? 'active' : ''} onClick={() => handleTabChange('cctv')}><Camera size={18} style={{marginRight: '12px'}} /> Live CCTV Feeds</li>
          <li className={activeTab === 'patient' ? 'active' : ''} onClick={() => handleTabChange('patient')}><Users size={18} style={{marginRight: '12px'}} /> Patient Management</li>
          <li className={activeTab === 'access' ? 'active' : ''} onClick={() => handleTabChange('access')}><ShieldAlert size={18} style={{marginRight: '12px'}} /> Mask Detection</li>
          <li className={activeTab === 'fire' ? 'active' : ''} onClick={() => handleTabChange('fire')}><Flame size={18} style={{marginRight: '12px'}} /> Fire Monitoring</li>
          <li className={activeTab === 'alerts' ? 'active' : ''} onClick={() => handleTabChange('alerts')}><BellRing size={18} style={{marginRight: '12px'}} /> Alerts</li>
          <li className={activeTab === 'reports' ? 'active' : ''} onClick={() => handleTabChange('reports')}><FileText size={18} style={{marginRight: '12px'}} /> Reports & Logs</li>
          <li className={activeTab === 'user' ? 'active' : ''} onClick={() => handleTabChange('user')}><UserCog size={18} style={{marginRight: '12px'}} /> User Management</li>
          <li className={activeTab === 'setting' ? 'active' : ''} onClick={() => handleTabChange('setting')}><Settings size={18} style={{marginRight: '12px'}} /> Setting</li>
        </ul>

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

      <div className="main-content">
        
        {/* DASHBOARD TAB */}
        {activeTab === 'dashboard' && (
          <>
            <div className="header">
              <h1>Dashboard Overview</h1>
              <p>Real-time hospital monitoring and security status</p>
            </div>
            
            <div className="stats-grid">
              <div className="stat-card"><h4>Total Cameras</h4><h2>9</h2><p className="stat-sub">Enterprise Mode</p></div>
              <div className="stat-card"><h4>Registered Patients</h4><h2>{patientsList.length}</h2><p className="stat-sub">Total Base</p></div>
              <div className="stat-card"><h4>Today's Alerts</h4><h2>{pendingSystemAlerts.length}</h2><p className="stat-sub">{highPrioritySystemAlertsCount} critical</p></div>
              <div className="stat-card"><h4>Mask Violations</h4><h2>{deniedAccess}</h2><p className="stat-sub">From access control</p></div>
            </div>

            <div className="card-box" style={{ marginTop: '20px', marginBottom: '20px', backgroundColor: '#fff', border: '1px solid #e2e8f0' }}>
              <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px', color: '#1e293b' }}>
                <Cpu size={22} color="#0D6EFD" /> AI Security Modules Configuration
              </h3>
              
              <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
                <div style={{ flex: 1, minWidth: '280px', border: aiControls.patientIdent ? '2px solid #0D6EFD' : '1px solid #e2e8f0', borderRadius: '12px', padding: '15px', backgroundColor: aiControls.patientIdent ? '#eff6ff' : '#f8fafc', transition: 'all 0.3s' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '15px' }}>
                    <div>
                      <h4 style={{ margin: '0 0 5px 0', color: '#1e293b', display: 'flex', alignItems: 'center', gap: '6px' }}><Camera size={16}/> Cams 1,2,3</h4>
                      <span style={{ fontSize: '12px', color: '#64748b', fontWeight: 'bold' }}>📍 Wards Monitoring</span>
                    </div>
                    <button onClick={() => toggleAI('patientIdent')} style={{ padding: '6px 14px', borderRadius: '20px', border: 'none', backgroundColor: aiControls.patientIdent ? '#0D6EFD' : '#cbd5e1', color: 'white', fontWeight: 'bold', cursor: 'pointer' }}>
                      {aiControls.patientIdent ? 'ON' : 'OFF'}
                    </button>
                  </div>
                  <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                    <Users size={32} color={aiControls.patientIdent ? '#0D6EFD' : '#94a3b8'} />
                    <div>
                      <div style={{ fontSize: '14px', fontWeight: 'bold', color: aiControls.patientIdent ? '#0D6EFD' : '#475569' }}>Patient Identification</div>
                      <div style={{ fontSize: '11px', color: '#64748b', marginTop: '4px', lineHeight: '1.4' }}>Alerts if a registered patient attempts to leave.</div>
                    </div>
                  </div>
                </div>

                <div style={{ flex: 1, minWidth: '280px', border: aiControls.maskDetect ? '2px solid #10b981' : '1px solid #e2e8f0', borderRadius: '12px', padding: '15px', backgroundColor: aiControls.maskDetect ? '#ecfdf5' : '#f8fafc', transition: 'all 0.3s' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '15px' }}>
                    <div>
                      <h4 style={{ margin: '0 0 5px 0', color: '#1e293b', display: 'flex', alignItems: 'center', gap: '6px' }}><Camera size={16}/> Cams 4,5,6</h4>
                      <span style={{ fontSize: '12px', color: '#64748b', fontWeight: 'bold' }}>📍 Theaters & Labs</span>
                    </div>
                    <button onClick={() => toggleAI('maskDetect')} style={{ padding: '6px 14px', borderRadius: '20px', border: 'none', backgroundColor: aiControls.maskDetect ? '#10b981' : '#cbd5e1', color: 'white', fontWeight: 'bold', cursor: 'pointer' }}>
                      {aiControls.maskDetect ? 'ON' : 'OFF'}
                    </button>
                  </div>
                  <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                    <UserCog size={32} color={aiControls.maskDetect ? '#10b981' : '#94a3b8'} />
                    <div>
                      <div style={{ fontSize: '14px', fontWeight: 'bold', color: aiControls.maskDetect ? '#10b981' : '#475569' }}>Mask Detection</div>
                      <div style={{ fontSize: '11px', color: '#64748b', marginTop: '4px', lineHeight: '1.4' }}>Alerts if staff enters without a mask.</div>
                    </div>
                  </div>
                </div>

                <div style={{ flex: 1, minWidth: '280px', border: aiControls.fireDetect ? '2px solid #ef4444' : '1px solid #e2e8f0', borderRadius: '12px', padding: '15px', backgroundColor: aiControls.fireDetect ? '#fef2f2' : '#f8fafc', transition: 'all 0.3s' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '15px' }}>
                    <div>
                      <h4 style={{ margin: '0 0 5px 0', color: '#1e293b', display: 'flex', alignItems: 'center', gap: '6px' }}><Camera size={16}/> Cams 7,8,9</h4>
                      <span style={{ fontSize: '12px', color: '#64748b', fontWeight: 'bold' }}>📍 Dangerous Zones</span>
                    </div>
                    <button onClick={() => toggleAI('fireDetect')} style={{ padding: '6px 14px', borderRadius: '20px', border: 'none', backgroundColor: aiControls.fireDetect ? '#ef4444' : '#cbd5e1', color: 'white', fontWeight: 'bold', cursor: 'pointer' }}>
                      {aiControls.fireDetect ? 'ON' : 'OFF'}
                    </button>
                  </div>
                  <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                    <Flame size={32} color={aiControls.fireDetect ? '#ef4444' : '#94a3b8'} />
                    <div>
                      <div style={{ fontSize: '14px', fontWeight: 'bold', color: aiControls.fireDetect ? '#ef4444' : '#475569' }}>Fire & Smoke Detection</div>
                      <div style={{ fontSize: '11px', color: '#64748b', marginTop: '4px', lineHeight: '1.4' }}>Alerts if fire or smoke is detected.</div>
                    </div>
                  </div>
                </div>
              </div>
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

        {/* CCTV TAB */}
        {activeTab === 'cctv' && (
          <div className="cctv-wrapper card-box">
            <div className="header">
              <h1>Live CCTV Feeds</h1>
              <p>Real-time hospital monitoring across 9 zones</p>
            </div>
            <div className="cctv-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '15px', marginTop: '20px' }}>
              
              {[1, 2, 3].map(cam => (
                cameraIps[String(cam)] ? (
                  <div key={cam} className="cctv-box" style={{ padding: 0, overflow: 'hidden', position: 'relative', height: '250px', borderRadius: '12px', border: '1px solid #444', backgroundColor: '#000' }}>
                    <div className="cctv-top-bar" style={{ position: 'absolute', top: '10px', left: '10px', right: '10px', zIndex: 2 }}>
                      <div className="cam-name" style={{ backgroundColor: 'rgba(0,0,0,0.6)', color: 'white', border: 'none', display: 'flex', alignItems: 'center', padding: '4px 10px', borderRadius: '6px', fontSize: '12px' }}>
                        <LiveDot /> Cam 0{cam}: Patient Detection
                      </div>
                    </div>
                    <img src={`http://localhost:5000/video_feed/${cam}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt={`Cam ${cam}`} />
                    
                    <button onClick={toggleFullScreen} style={{ position: 'absolute', bottom: '10px', right: '10px', zIndex: 10, background: 'rgba(0,0,0,0.6)', color: 'white', border: 'none', padding: '6px', borderRadius: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Maximize size={14} />
                    </button>
                  </div>
                ) : <NoSignalBox key={cam} camName={`Cam 0${cam}: Patient Detection`} />
              ))}

              {[4, 5, 6].map(cam => (
                cameraIps[String(cam)] ? (
                  <div key={cam} className="cctv-box" style={{ padding: 0, overflow: 'hidden', position: 'relative', height: '250px', borderRadius: '12px', border: '1px solid #444', backgroundColor: '#000' }}>
                    <div className="cctv-top-bar" style={{ position: 'absolute', top: '10px', left: '10px', right: '10px', zIndex: 2 }}>
                      <div className="cam-name" style={{ backgroundColor: 'rgba(0,0,0,0.6)', color: 'white', border: 'none', display: 'flex', alignItems: 'center', padding: '4px 10px', borderRadius: '6px', fontSize: '12px' }}>
                        <LiveDot /> Cam 0{cam}: Mask Detection
                      </div>
                    </div>
                    <img src={`http://localhost:5000/video_feed/${cam}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt={`Cam ${cam}`} />
                    
                    <button onClick={toggleFullScreen} style={{ position: 'absolute', bottom: '10px', right: '10px', zIndex: 10, background: 'rgba(0,0,0,0.6)', color: 'white', border: 'none', padding: '6px', borderRadius: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Maximize size={14} />
                    </button>
                  </div>
                ) : <NoSignalBox key={cam} camName={`Cam 0${cam}: Mask Detection`} />
              ))}

              {[7, 8, 9].map(cam => (
                cameraIps[String(cam)] ? (
                  <div key={cam} className="cctv-box" style={{ padding: 0, overflow: 'hidden', position: 'relative', height: '250px', borderRadius: '12px', border: '1px solid #444', backgroundColor: '#000' }}>
                    <div className="cctv-top-bar" style={{ position: 'absolute', top: '10px', left: '10px', right: '10px', zIndex: 2 }}>
                      <div className="cam-name" style={{ backgroundColor: 'rgba(0,0,0,0.6)', color: 'white', border: 'none', display: 'flex', alignItems: 'center', padding: '4px 10px', borderRadius: '6px', fontSize: '12px' }}>
                        <LiveDot /> Cam 0{cam}: Fire Detection
                      </div>
                    </div>
                    <img src={`http://localhost:5000/video_feed/${cam}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt={`Cam ${cam}`} />
                    
                    <button onClick={toggleFullScreen} style={{ position: 'absolute', bottom: '10px', right: '10px', zIndex: 10, background: 'rgba(0,0,0,0.6)', color: 'white', border: 'none', padding: '6px', borderRadius: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Maximize size={14} />
                    </button>
                  </div>
                ) : <NoSignalBox key={cam} camName={`Cam 0${cam}: Fire Detection`} />
              ))}

            </div>
          </div>
        )}

        {/* PATIENT TAB */}
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
                <div style={{ display: 'flex', gap: '20px', marginBottom: '20px' }}>
                  <div className="stat-card flex-between" style={{ flex: 1, margin: 0 }}>
                    <div><h4>Total Patients</h4><h2>{patientsList.length}</h2></div>
                    <div className="icon-circle blue-circle">!</div>
                  </div>
                  <div className="stat-card flex-between" style={{ flex: 1, margin: 0 }}>
                    <div><h4>High Risk</h4><h2>{patientsList.filter(p => p.risk_level === 'High').length}</h2></div>
                    <div className="icon-circle red-circle">!</div>
                  </div>
                </div>
                
                <div className="table-container card-box">
                  <h3>Registered Patients</h3>
                  <input 
                    type="text" 
                    className="search-bar" 
                    placeholder="Search Patients by Name or ID..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
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
                      {filteredPatients.length === 0 ? (
                        <tr><td colSpan="5" style={{textAlign: 'center', padding: '20px', color: '#666'}}>No matching patients found.</td></tr>
                      ) : (
                        filteredPatients.map((patient, index) => (
                          <tr 
                            key={index} 
                            style={searchQuery ? { backgroundColor: '#e0f2fe', transition: '0.3s' } : {}}
                          >
                            <td><strong>{patient.name}</strong> <span style={{fontSize: '12px', color: '#666'}}>({patient.patient_id})</span></td>
                            <td>{patient.ward || 'N/A'}</td>
                            <td className={patient.risk_level === 'High' ? 'text-red font-bold' : patient.risk_level === 'Medium' ? 'text-orange font-bold' : 'text-green font-bold'}>
                              {patient.risk_level}
                            </td>
                            <td>{patient.registered_date}</td>
                            <td>
                              <span 
                                className="action-delete" 
                                style={{cursor: 'pointer', color: '#ef4444', fontWeight: 'bold'}}
                                onClick={() => handleDeletePatient(patient.patient_id)}
                              >
                                Delete
                              </span>
                            </td>
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

        {/* ACCESS TAB - 🔥 Confidence අයින් කරලා තියෙන්නේ 🔥 */}
        {activeTab === 'access' && (
          <div className="access-wrapper">
             <div className="header">
              <h1>Mask Detection</h1>
              <p>Real-time hospital monitoring and security status</p>
            </div>
            <div className="stats-grid">
              <div className="stat-card"><div className="flex-between align-start"><div><h4>Total Access Attempts</h4><h2>{totalAccess > 0 ? totalAccess : 0}</h2><p className="stat-sub">Real-time stats</p></div><div className="outline-icon-box border-blue"><Users size={20} /></div></div></div>
              <div className="stat-card"><div className="flex-between align-start"><div><h4>Access Granted</h4><h2>{grantedAccess}</h2><p className="stat-sub">{totalAccess > 0 ? ((grantedAccess / totalAccess) * 100).toFixed(1) : 0}% compliance</p></div><div className="outline-icon-box border-green"><ShieldAlert size={20} /></div></div></div>
              <div className="stat-card"><div className="flex-between align-start"><div><h4>Access Denied</h4><h2>{deniedAccess}</h2><p className="stat-sub">{totalAccess > 0 ? ((deniedAccess / totalAccess) * 100).toFixed(1) : 0}% violations</p></div><div className="outline-icon-box border-red"><AlertTriangle size={20} /></div></div></div>
              <div className="stat-card"><div className="flex-between align-start"><div><h4>Active Cameras</h4><h2>{activeCamCount}</h2><p className="stat-sub">All operational</p></div><div className="outline-icon-box border-yellow"><Camera size={20} /></div></div></div>
            </div>
            <div className="table-container card-box mt-4">
              <h3 className="mb-4">Access Control Logs</h3>
              <table className="data-table">
                <thead>
                  <tr><th>Camera ID</th><th>Mask Detected</th><th>Access Result</th><th>Timestamp</th></tr>
                </thead>
                <tbody>
                  {accessLogs.length === 0 ? (
                     <tr><td colSpan="4" style={{textAlign: 'center', padding: '20px', color: '#666'}}>No access logs available yet. Wait for AI detection.</td></tr>
                  ) : (
                    accessLogs.map((log, index) => (
                      <tr key={index}>
                        <td>{log.camera_id}</td>
                        <td className={log.mask_detected === 'Yes' ? 'text-green font-bold' : 'text-red font-bold'}>{log.mask_detected}</td>
                        <td className={log.access_result === 'Granted' ? 'text-green font-bold' : 'text-red font-bold'}>{log.access_result}</td>
                        <td>{log.timestamp}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* FIRE TAB - 🔥 Confidence අයින් කරලා තියෙන්නේ 🔥 */}
        {activeTab === 'fire' && (
          <div className="fire-wrapper">
            <div className="header">
              <h1>Fire & Smoke Detection</h1>
              <p>Real-time fire and smoke monitoring system</p>
            </div>
            <div className="stats-grid">
              <div className="stat-card"><div className="flex-between align-start"><div><h4>Active Alerts</h4><h2>{activeFireAlerts.length}</h2><p className="stat-sub">Requires action</p></div><div className="outline-icon-box border-red"><AlertTriangle size={20} /></div></div></div>
              <div className="stat-card"><div className="flex-between align-start"><div><h4>Total Events</h4><h2>{fireLogs.length}</h2><p className="stat-sub">Recorded logs</p></div><div className="outline-icon-box border-orange"><Flame size={20} /></div></div></div>
              <div className="stat-card"><div className="flex-between align-start"><div><h4>Resolved Events</h4><h2>{resolvedFireAlerts.length}</h2><p className="stat-sub">Handled events</p></div><div className="outline-icon-box border-green"><ShieldAlert size={20} /></div></div></div>
              <div className="stat-card"><div className="flex-between align-start"><div><h4>Monitoring Cameras</h4><h2>{activeFireCamsCount}</h2><p className="stat-sub">Cams 7, 8, 9 Active</p></div><div className="outline-icon-box border-yellow"><Camera size={20} /></div></div></div>
            </div>

            {latestActiveFire ? (
              <div className="fire-alert-banner">
                <h3 className="alert-title" style={{display: 'flex', alignItems: 'center', gap: '8px'}}><Flame size={20} /> Active Fire/Smoke Alert</h3>
                <div className="alert-details-grid">
                  <div><div className="detail-label">Location</div><div className="detail-value">{latestActiveFire.camera_id}</div></div>
                  <div><div className="detail-label">Event Type</div><div className="detail-value">{latestActiveFire.event_type}</div></div>
                  <div><div className="detail-label">Detection Time</div><div className="detail-value">{latestActiveFire.timestamp}</div></div>
                </div>
                <div className="alert-actions">
                  <button className="btn-notify" onClick={() => handleNotifyEmergency(latestActiveFire.camera_id)} style={{display: 'flex', alignItems: 'center', gap: '6px'}}><BellRing size={16} /> Notify Emergency Service</button>
                  <button className="btn-resolve" onClick={() => handleResolveFireAlert(latestActiveFire.id)}>Mark as Resolved</button>
                </div>
              </div>
            ) : (
              <div className="fire-alert-banner" style={{backgroundColor: '#ecfdf5', borderColor: '#a7f3d0'}}>
                <h3 className="alert-title" style={{color: '#064e3b', display: 'flex', alignItems: 'center', gap: '8px'}}>✅ All Clear</h3>
                <p style={{color: '#064e3b', margin: 0}}>No active fire or smoke alerts at the moment. Monitoring is active.</p>
              </div>
            )}

            <div className="table-container card-box mt-4">
              <h3 className="mb-4">Fire & Smoke Event Logs</h3>
              <table className="data-table">
                <thead><tr><th>Event Type</th><th>Camera</th><th>Severity</th><th>Status</th><th>Timestamp</th></tr></thead>
                <tbody>
                  {fireLogs.length === 0 ? (
                     <tr><td colSpan="5" style={{textAlign: 'center', padding: '20px', color: '#666'}}>No fire/smoke logs available.</td></tr>
                  ) : (
                    fireLogs.map((log, index) => (
                      <tr key={index}>
                        <td>{log.event_type}</td>
                        <td>{log.camera_id}</td>
                        <td className={log.severity === 'Critical' ? 'text-orange font-bold' : log.severity === 'High' ? 'text-red font-bold' : 'text-yellow font-bold'}>{log.severity}</td>
                        <td className={log.status === 'Active' ? 'text-red font-bold' : 'text-green font-bold'}>{log.status}</td>
                        <td>{log.timestamp}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ALERTS TAB */}
        {activeTab === 'alerts' && (
          <div className="alerts-wrapper">
            <div className="header">
              <h1>Alert Management</h1>
              <p>Monitor and manage system alerts and notifications</p>
            </div>
            <div className="stats-grid">
              <div className="stat-card"><h4>Total Alerts</h4><h2>{totalSystemAlerts}</h2></div>
              <div className="stat-card"><h4>High Priority</h4><h2 className="text-red">{highPrioritySystemAlertsCount}</h2></div>
              <div className="stat-card"><h4>Pending</h4><h2 className="text-orange">{pendingSystemAlerts.length}</h2></div>
              <div className="stat-card"><h4>Resolved</h4><h2 className="text-green">{resolvedSystemAlertsCount}</h2></div>
            </div>
            <div className="table-container card-box mt-4">
              <h3 style={{marginBottom: '5px'}}>Alert Feed</h3>
              <p className="detail-label" style={{marginBottom: '20px'}}>Filter alerts by type and manage responses</p>
              <div className="alert-list">
                {pendingSystemAlerts.length === 0 ? (
                  <p style={{textAlign: 'center', padding: '20px', color: '#666'}}>No pending alerts. Everything is secure. ✅</p>
                ) : (
                  pendingSystemAlerts.map((alert) => (
                    <div className="alert-feed-item" key={alert.id}>
                      <div className="alert-icon-box bg-red">
                        {alert.alert_type === 'Fire' && <Flame size={20} color="white" />}
                        {alert.alert_type === 'Patient Wandering' && <User size={20} color="white" />}
                        {alert.alert_type === 'Mask Violation' && <ShieldAlert size={20} color="white" />}
                      </div>
                      <div className="alert-details">
                        <h4 className="alert-item-title">{alert.alert_type}</h4>
                        <p className="alert-item-desc">{alert.description}</p>
                        <p className="alert-item-meta">Camera: {alert.camera_id} | {alert.timestamp}</p>
                      </div>
                      <button className="btn-resolve-green" onClick={() => handleResolveSystemAlert(alert.id)}>Mark as Resolved</button>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {/* REPORTS TAB */}
        {activeTab === 'reports' && (
          <div className="reports-wrapper">
            
            <style>
              {`
                @media print {
                  @page { margin: 10mm; size: landscape; }
                  .sidebar, .reports-filter-card { display: none !important; }
                  .main-content { margin-left: 0 !important; width: 100% !important; background-color: white !important; padding: 0 !important; }
                  .dashboard-container { display: block !important; background-color: white !important; }
                  .card-box { border: 1px solid #ccc !important; box-shadow: none !important; page-break-inside: avoid; margin-bottom: 20px !important; }
                  .report-stat-card { border: 1px solid #ccc !important; }
                  body { -webkit-print-color-adjust: exact; print-color-adjust: exact; background-color: white !important; }
                }
              `}
            </style>

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
                <input 
                  type="date" 
                  className="form-input" 
                  value={reportDate}
                  onChange={(e) => setReportDate(e.target.value)}
                />
              </div>
              <div className="filter-action">
                <button className="btn-download-pdf" onClick={handlePrintPDF} style={{display: 'flex', alignItems: 'center', gap: '8px'}}><Download size={16} /> Download PDF</button>
              </div>
            </div>
            
            <div className="reports-stats-grid">
              <div className="report-stat-card"><h2 className="text-black">{filteredReports.length}</h2><p>Total Alerts</p></div>
              <div className="report-stat-card"><h2 className="text-red">{fireLogs.length}</h2><p>Fire Events</p></div>
              <div className="report-stat-card"><h2 className="text-orange">{systemAlerts.filter(a => a.alert_type === 'Patient Wandering').length}</h2><p>Patient Exits</p></div>
              <div className="report-stat-card"><h2 className="text-blue">{accessLogs.length}</h2><p>Access Logs</p></div>
            </div>
            
            <div className="table-container card-box mt-4">
              <h3 className="mb-4">Alert Details {reportDate && `(${reportDate})`}</h3>
              <table className="data-table">
                <thead><tr><th>Time</th><th>Type</th><th>Message</th><th>Priority</th><th>Status</th></tr></thead>
                <tbody>
                  {filteredReports.length === 0 ? (
                    <tr><td colSpan="5" className="empty-state-text">No alerts for selected date</td></tr>
                  ) : (
                    filteredReports.map((alert) => (
                      <tr key={alert.id}>
                        <td>{alert.timestamp}</td>
                        <td><strong>{alert.alert_type}</strong></td>
                        <td>{alert.description}</td>
                        <td className={alert.priority === 'High' ? 'text-red font-bold' : 'text-orange font-bold'}>{alert.priority}</td>
                        <td className={alert.status === 'Active' || alert.status === 'Pending' ? 'text-red font-bold' : 'text-green font-bold'}>{alert.status}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* USER TAB */}
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
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* SETTINGS TAB */}
        {activeTab === 'setting' && (
          <div className="setting-wrapper">
            <div className="header">
              <h1>System Setting</h1>
              <p>Configure 9 cameras across 3 AI security zones</p>
            </div>

            <div className="card-box mt-4">
              
              <div className="camera-header-wrap mb-4">
                <h3 style={{display: 'flex', alignItems: 'center', gap: '8px', margin: '0 0 5px 0', color: '#0D6EFD'}}>
                  <Users size={20} /> Patient Detection Configuration (Cams 1, 2, 3)
                </h3>
              </div>
              {[1, 2, 3].map(cam => (
                <div key={cam} style={{ display: 'flex', alignItems: 'center', marginBottom: '15px', backgroundColor: '#eff6ff', padding: '10px 15px', borderRadius: '8px', border: '1px solid #bfdbfe' }}>
                  <span style={{ fontWeight: 'bold', width: '120px', color: '#1e3a8a' }}>Camera 0{cam} IP :</span>
                  <input type="text" value={inputIps[String(cam)]} onChange={(e) => setInputIps({...inputIps, [String(cam)]: e.target.value})} placeholder="Enter video URL" className="form-input" style={{ flex: 1, marginRight: '15px' }} />
                  <button onClick={() => handleSaveCamera(String(cam))} style={{ padding: '8px 20px', backgroundColor: '#0D6EFD', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', marginRight: '10px' }}>Add</button>
                  <button onClick={() => handleRemoveCamera(String(cam))} style={{ padding: '8px 20px', backgroundColor: '#ef4444', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Remove</button>
                </div>
              ))}

              <div className="camera-header-wrap mb-4" style={{marginTop: '30px'}}>
                <h3 style={{display: 'flex', alignItems: 'center', gap: '8px', margin: '0 0 5px 0', color: '#10b981'}}>
                  <UserCog size={20} /> Mask Detection Configuration (Cams 4, 5, 6)
                </h3>
              </div>
              {[4, 5, 6].map(cam => (
                <div key={cam} style={{ display: 'flex', alignItems: 'center', marginBottom: '15px', backgroundColor: '#ecfdf5', padding: '10px 15px', borderRadius: '8px', border: '1px solid #a7f3d0' }}>
                  <span style={{ fontWeight: 'bold', width: '120px', color: '#064e3b' }}>Camera 0{cam} IP :</span>
                  <input type="text" value={inputIps[String(cam)]} onChange={(e) => setInputIps({...inputIps, [String(cam)]: e.target.value})} placeholder="Enter video URL" className="form-input" style={{ flex: 1, marginRight: '15px' }} />
                  <button onClick={() => handleSaveCamera(String(cam))} style={{ padding: '8px 20px', backgroundColor: '#10b981', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', marginRight: '10px' }}>Add</button>
                  <button onClick={() => handleRemoveCamera(String(cam))} style={{ padding: '8px 20px', backgroundColor: '#ef4444', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Remove</button>
                </div>
              ))}

              <div className="camera-header-wrap mb-4" style={{marginTop: '30px'}}>
                <h3 style={{display: 'flex', alignItems: 'center', gap: '8px', margin: '0 0 5px 0', color: '#ef4444'}}>
                  <Flame size={20} /> Fire Detection Configuration (Cams 7, 8, 9)
                </h3>
              </div>
              {[7, 8, 9].map(cam => (
                <div key={cam} style={{ display: 'flex', alignItems: 'center', marginBottom: '15px', backgroundColor: '#fef2f2', padding: '10px 15px', borderRadius: '8px', border: '1px solid #fecaca' }}>
                  <span style={{ fontWeight: 'bold', width: '120px', color: '#7f1d1d' }}>Camera 0{cam} IP :</span>
                  <input type="text" value={inputIps[String(cam)]} onChange={(e) => setInputIps({...inputIps, [String(cam)]: e.target.value})} placeholder="Enter video URL" className="form-input" style={{ flex: 1, marginRight: '15px' }} />
                  <button onClick={() => handleSaveCamera(String(cam))} style={{ padding: '8px 20px', backgroundColor: '#ef4444', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', marginRight: '10px' }}>Add</button>
                  <button onClick={() => handleRemoveCamera(String(cam))} style={{ padding: '8px 20px', backgroundColor: '#b91c1c', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Remove</button>
                </div>
              ))}

            </div>

            <div className="card-box mt-4">
              <h3 className="mb-4">Contact Support</h3>
              <div className="support-btn-container">
                <button className="support-phone-btn" style={{display: 'flex', alignItems: 'center', gap: '6px'}}><Phone size={14} /> +94765293838</button>
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