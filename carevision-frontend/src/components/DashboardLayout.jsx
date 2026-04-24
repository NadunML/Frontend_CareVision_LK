import React, { useState, useEffect } from 'react';
import { auth } from '../firebase';
import { Home, Camera, Users, ShieldAlert, Flame, BellRing, FileText, UserCog, Settings, LogOut, User } from 'lucide-react';
import './Dashboard.css';

// Import All Tabs (කැපිටල් T අකුරෙන්)
import OverviewTab from './Tabs/OverviewTab';
import CCTVFeedsTab from './Tabs/CCTVFeedsTab';
import PatientManagementTab from './Tabs/PatientManagementTab';
import MaskDetectionTab from './Tabs/MaskDetectionTab';
import FireMonitoringTab from './Tabs/FireMonitoringTab';
import AlertsTab from './Tabs/AlertsTab';
import ReportsTab from './Tabs/ReportsTab';
import UserManagementTab from './Tabs/UserManagementTab';
import SettingsTab from './Tabs/SettingsTab';

const DashboardLayout = ({ onLogout }) => {
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
        setCameraIps(prev => ({ ...prev, ...data }));
        setInputIps(prev => ({ ...prev, ...data }));
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
    if (activeTab === 'patient') fetchPatients();
  }, [activeTab]);

  const fetchAccessLogs = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/access_logs');
      const data = await response.json();
      if (response.ok && Array.isArray(data)) setAccessLogs(data);
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
      if (response.ok && Array.isArray(data)) setFireLogs(data);
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
      if (response.ok && Array.isArray(data)) setSystemAlerts(data);
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
      const response = await fetch(`http://localhost:5000/api/resolve_fire_alert/${logId}`, { method: 'POST' });
      if (response.ok) fetchFireLogs();
    } catch (error) { console.error("Error resolving alert:", error); }
  };

  const handleResolveSystemAlert = async (alertId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/resolve_system_alert/${alertId}`, { method: 'POST' });
      if (response.ok) fetchSystemAlerts();
    } catch (error) { console.error("Error resolving system alert:", error); }
  };

  const handleNotifyEmergency = (location) => {
    alert(`🚨 URGENT: Emergency Services have been notified for ${location}!`);
  };

  const handleImageChange = (e) => {
    if (e.target.files[0]) setImageFile(e.target.files[0]);
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
        const response = await fetch(`http://localhost:5000/api/delete-patient/${patientId}`, { method: 'DELETE' });
        const result = await response.json();
        if (response.ok && result.status === 'success') {
          alert("Patient deleted successfully!");
          fetchPatients();
        } else {
          alert("Error: " + result.message);
        }
      } catch (error) {
        alert("Failed to delete patient. Check server.");
      }
    }
  };

  const toggleAI = async (feature) => {
    try {
      const response = await fetch(`http://localhost:5000/toggle_mode/${feature}`, { method: 'POST' });
      if (response.ok) {
        const data = await response.json();
        if (data.status === 'success') setAiControls(data.modes);
      }
    } catch (error) {
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
      if (elem.requestFullscreen) elem.requestFullscreen();
      else if (elem.webkitRequestFullscreen) elem.webkitRequestFullscreen();
      else if (elem.msRequestFullscreen) elem.msRequestFullscreen();
    } else {
      if (document.exitFullscreen) document.exitFullscreen();
    }
  };

  const handlePrintPDF = () => window.print();

  // Helper variables
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

  const filteredReports = Array.isArray(systemAlerts) ? systemAlerts.filter(alert => {
    if (!reportDate) return true;
    const alertDate = alert.timestamp ? alert.timestamp.split(' ')[0] : '';
    return alertDate === reportDate;
  }) : [];

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
          <li className={activeTab === 'dashboard' ? 'active' : ''} onClick={() => handleTabChange('dashboard')}><Home size={18} style={{ marginRight: '12px' }} /> Dashboard</li>
          <li className={activeTab === 'cctv' ? 'active' : ''} onClick={() => handleTabChange('cctv')}><Camera size={18} style={{ marginRight: '12px' }} /> Live CCTV Feeds</li>
          <li className={activeTab === 'patient' ? 'active' : ''} onClick={() => handleTabChange('patient')}><Users size={18} style={{ marginRight: '12px' }} /> Patient Management</li>
          <li className={activeTab === 'access' ? 'active' : ''} onClick={() => handleTabChange('access')}><ShieldAlert size={18} style={{ marginRight: '12px' }} /> Mask Detection</li>
          <li className={activeTab === 'fire' ? 'active' : ''} onClick={() => handleTabChange('fire')}><Flame size={18} style={{ marginRight: '12px' }} /> Fire Monitoring</li>
          <li className={activeTab === 'alerts' ? 'active' : ''} onClick={() => handleTabChange('alerts')}><BellRing size={18} style={{ marginRight: '12px' }} /> Alerts</li>
          <li className={activeTab === 'reports' ? 'active' : ''} onClick={() => handleTabChange('reports')}><FileText size={18} style={{ marginRight: '12px' }} /> Reports & Logs</li>
          <li className={activeTab === 'user' ? 'active' : ''} onClick={() => handleTabChange('user')}><UserCog size={18} style={{ marginRight: '12px' }} /> User Management</li>
          <li className={activeTab === 'setting' ? 'active' : ''} onClick={() => handleTabChange('setting')}><Settings size={18} style={{ marginRight: '12px' }} /> Setting</li>
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
          <button className="logout-btn" onClick={onLogout} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
            <LogOut size={16} /> Logout
          </button>
        </div>
      </div>

      <div className="main-content">
        {activeTab === 'dashboard' && <OverviewTab patientsCount={patientsList.length} pendingAlertsCount={pendingSystemAlerts.length} highPriorityCount={highPrioritySystemAlertsCount} deniedAccessCount={deniedAccess} aiControls={aiControls} toggleAI={toggleAI} />}
        {activeTab === 'cctv' && <CCTVFeedsTab cameraIps={cameraIps} toggleFullScreen={toggleFullScreen} />}
        {activeTab === 'patient' && <PatientManagementTab showRegisterForm={showRegisterForm} setShowRegisterForm={setShowRegisterForm} patientData={patientData} setPatientData={setPatientData} handleImageChange={handleImageChange} imageFile={imageFile} handleRegisterPatient={handleRegisterPatient} isUploading={isUploading} patientsList={patientsList} searchQuery={searchQuery} setSearchQuery={setSearchQuery} handleDeletePatient={handleDeletePatient} />}
        {activeTab === 'access' && <MaskDetectionTab totalAccess={totalAccess} grantedAccess={grantedAccess} deniedAccess={deniedAccess} activeCamCount={activeCamCount} accessLogs={accessLogs} />}
        {activeTab === 'fire' && <FireMonitoringTab activeFireAlerts={activeFireAlerts} fireLogs={fireLogs} resolvedFireAlerts={resolvedFireAlerts} activeFireCamsCount={activeFireCamsCount} latestActiveFire={latestActiveFire} handleNotifyEmergency={handleNotifyEmergency} handleResolveFireAlert={handleResolveFireAlert} />}
        {activeTab === 'alerts' && <AlertsTab totalSystemAlerts={totalSystemAlerts} highPrioritySystemAlertsCount={highPrioritySystemAlertsCount} pendingSystemAlerts={pendingSystemAlerts} resolvedSystemAlertsCount={resolvedSystemAlertsCount} handleResolveSystemAlert={handleResolveSystemAlert} />}
        {activeTab === 'reports' && <ReportsTab reportDate={reportDate} setReportDate={setReportDate} handlePrintPDF={handlePrintPDF} filteredReports={filteredReports} fireLogs={fireLogs} systemAlerts={systemAlerts} accessLogs={accessLogs} />}
        {activeTab === 'user' && <UserManagementTab />}
        {activeTab === 'setting' && <SettingsTab inputIps={inputIps} setInputIps={setInputIps} handleSaveCamera={handleSaveCamera} handleRemoveCamera={handleRemoveCamera} />}
      </div>
    </div>
  );
};

export default DashboardLayout;