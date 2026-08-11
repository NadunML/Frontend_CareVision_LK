import React, { useState, useEffect, useRef, useCallback } from 'react';
import { auth } from '../firebase';
import { Home, Camera, Users, ShieldAlert, Flame, FileText, UserCog, Settings, LogOut, User, Info, ExternalLink } from 'lucide-react';
import './Dashboard.css';
import ToastNotification from './ToastNotification';

const API_URL = import.meta.env.VITE_API_URL;

import OverviewTab from './Tabs/OverviewTab';
import CCTVFeedsTab from './Tabs/CCTVFeedsTab';
import PatientManagementTab from './Tabs/PatientManagementTab';
import MaskDetectionTab from './Tabs/MaskDetectionTab';
import FireMonitoringTab from './Tabs/FireMonitoringTab';

import ReportsTab from './Tabs/ReportsTab';
import UserManagementTab from './Tabs/UserManagementTab';
import SettingsTab from './Tabs/SettingsTab';
import AboutTab from './Tabs/AboutTab';

const DashboardLayout = ({ onLogout }) => {
  const user = auth.currentUser;

  const [activeTab, setActiveTab] = useState('dashboard');
  const [showRegisterForm, setShowRegisterForm] = useState(false);

  const [patientData, setPatientData] = useState({ patientId: '', name: '', ward: '', wardId: '' });
  const [imageFile, setImageFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [patientsList, setPatientsList] = useState([]);

  const [accessLogs, setAccessLogs] = useState([]);
  const [fireLogs, setFireLogs] = useState([]);
  const [systemAlerts, setSystemAlerts] = useState([]);

  const [searchQuery, setSearchQuery] = useState('');
  const [reportDate, setReportDate] = useState('');
  const [bannerDismissed, setBannerDismissed] = useState(false);

  // ── Toast notification system ──────────────────────────────────────────────
  // Replaces the old single inline banner with a proper fixed-overlay stack.
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((type, text) => {
    const id = crypto.randomUUID();
    setToasts(prev => [...prev, { id, type, text }]);
  }, []);

  const dismissToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);
  // ────────────────────────────────────────────────────────────────────────────

  const [aiControls, setAiControls] = useState({
    patientIdent: false,
    maskDetect: false,
    fireDetect: false
  });

  const [cameraAiConfigs, setCameraAiConfigs] = useState({
    1: { patient: false, mask: false, fire: false },
    2: { patient: false, mask: false, fire: false },
    3: { patient: false, mask: false, fire: false },
    4: { patient: false, mask: false, fire: false },
    5: { patient: false, mask: false, fire: false },
  });

  const [cameraIps, setCameraIps] = useState({ '1': '', '2': '', '3': '', '4': '', '5': '', '6': '', '7': '', '8': '', '9': '' });
  const [inputIps, setInputIps] = useState({ '1': '', '2': '', '3': '', '4': '', '5': '', '6': '', '7': '', '8': '', '9': '' });

  const handleToggleCameraAI = async (camId, type) => {
    const newStatus = !cameraAiConfigs[camId][type];

    setCameraAiConfigs(prevConfigs => ({
      ...prevConfigs,
      [camId]: {
        ...prevConfigs[camId],
        [type]: newStatus
      }
    }));

    try {
      await fetch(`${API_URL}/api/set_camera_ai`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ camId: String(camId), module: type, status: newStatus })
      });
    } catch (error) {
      console.error("Failed to update AI config on backend", error);
    }
  };

  useEffect(() => {
    const fetchCurrentModes = async () => {
      try {
        const response = await fetch(`${API_URL}/api/get_modes`);
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
    const fetchCameraAiConfigs = async () => {
      try {
        const response = await fetch(`${API_URL}/api/get_camera_ai`);
        if (response.ok) {
          const data = await response.json();
          const formattedData = {};
          Object.keys(data).forEach(key => {
            formattedData[Number(key)] = data[key];
          });
          setCameraAiConfigs(formattedData);
        }
      } catch (error) {
        console.error("Error fetching camera AI configurations:", error);
      }
    };
    fetchCameraAiConfigs();
    const interval = setInterval(fetchCameraAiConfigs, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    fetch(`${API_URL}/api/get_cameras`)
      .then(res => res.json())
      .then(data => {
        setCameraIps(prev => ({ ...prev, ...data }));
        setInputIps(prev => ({ ...prev, ...data }));
      })
      .catch(err => console.error("Error fetching camera list:", err));
  }, []);

  const handleTabChange = (tabName) => {
    setActiveTab(tabName);
    setShowRegisterForm(false);
    setSearchQuery('');
    setReportDate('');
  };

  const fetchPatients = async () => {
    try {
      const response = await fetch(`${API_URL}/api/patients`);
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
      const response = await fetch(`${API_URL}/api/access_logs`);
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
      const response = await fetch(`${API_URL}/api/fire_logs`);
      const data = await response.json();
      if (response.ok && Array.isArray(data)) setFireLogs(data);
    } catch (error) {
      console.error("Error fetching fire logs:", error);
    }
  };

  useEffect(() => {
    fetchFireLogs();
    const interval = setInterval(fetchFireLogs, 1000);
    return () => clearInterval(interval);
  }, []);

  const fetchSystemAlerts = async () => {
    try {
      const response = await fetch(`${API_URL}/api/system_alerts`);
      const data = await response.json();
      if (response.ok && Array.isArray(data)) setSystemAlerts(data);
    } catch (error) {
      console.error("Error fetching system alerts:", error);
    }
  };

  useEffect(() => {
    fetchSystemAlerts();
    const interval = setInterval(fetchSystemAlerts, 1000);
    return () => clearInterval(interval);
  }, []);

  // ── Fire Emergency: one-shot disable when fire appears; resets when all clear ──
  const didDisableRef = useRef(false);
  useEffect(() => {
    const hasActiveFire = fireLogs.some(log => log.status === 'Active');
    if (hasActiveFire && !didDisableRef.current) {
      // First time fire detected this session — disable patient+mask globally
      didDisableRef.current = true;
      setBannerDismissed(false); // always show banner when new fire appears
      fetch(`${API_URL}/api/disable_non_fire`, { method: 'POST' })
        .then(res => res.json())
        .then(data => {
          if (data.status === 'success') {
            const formatted = {};
            Object.keys(data.configs).forEach(k => { formatted[Number(k)] = data.configs[k]; });
            setCameraAiConfigs(formatted);
          }
        })
        .catch(() => { });
    }
    if (!hasActiveFire) {
      // All fires resolved — reset so next fire re-triggers
      didDisableRef.current = false;
    }
  }, [fireLogs]);

  const handleResolveFireAlert = async (logId) => {
    try {
      const response = await fetch(`${API_URL}/api/resolve_fire_alert/${logId}`, { method: 'POST' });
      if (response.ok) fetchFireLogs();
    } catch (error) { console.error("Error resolving alert:", error); }
  };

  const handleResolveSystemAlert = async (alertId) => {
    try {
      const response = await fetch(`${API_URL}/api/resolve_system_alert/${alertId}`, { method: 'POST' });
      if (response.ok) fetchSystemAlerts();
    } catch (error) { console.error("Error resolving system alert:", error); }
  };

  const handleNotifyEmergency = (location) => {
    // Display toast notification instead of blocking native alert dialog
    showToast('emergency', `🚨 URGENT: Emergency Services have been notified for ${location}!`);
  };

  const handleImageChange = (e) => {
    if (e.target.files[0]) setImageFile(e.target.files[0]);
  };

  const handleRegisterPatient = async (e) => {
    e.preventDefault();
    if (!patientData.patientId || !patientData.name || !imageFile) {
      showToast('error', 'Please fill all required fields and select an image.');
      return;
    }
    setIsUploading(true);
    const formData = new FormData();
    formData.append('patientId', patientData.patientId);
    formData.append('name', patientData.name);
    formData.append('ward', patientData.ward);
    formData.append('wardId', patientData.wardId);

    formData.append('image', imageFile);

    try {
      const response = await fetch(`${API_URL}/api/register-patient`, {
        method: 'POST',
        body: formData,
      });
      const result = await response.json();
      if (response.ok) {
        showToast('success', 'Patient registered successfully.');
        setPatientData({ patientId: '', name: '', ward: '', wardId: '' });
        setImageFile(null);
        setShowRegisterForm(false);
        fetchPatients();
      } else {
        showToast('error', `Registration failed: ${result.error}`);
      }
    } catch (error) {
      console.error("Error saving patient: ", error);
      showToast('error', 'Server connection failed. Is the Python backend running?');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeletePatient = async (patientId) => {
    // Inline confirmation is handled in the UI; proceed directly with deletion
    try {
      const response = await fetch(`${API_URL}/api/delete-patient/${patientId}`, { method: 'DELETE' });
      const result = await response.json();
      if (response.ok && result.status === 'success') {
        showToast('success', 'Patient record deleted successfully.');
        fetchPatients();
      } else {
        showToast('error', `Delete failed: ${result.message}`);
      }
    } catch (err) {
      console.error("Delete patient error:", err);
      showToast('error', 'Failed to delete patient. Check server connection.');
    }
  };

  const toggleAI = async (feature) => {
    try {
      const response = await fetch(`${API_URL}/toggle_mode/${feature}`, { method: 'POST' });
      if (response.ok) {
        const data = await response.json();
        if (data.status === 'success') setAiControls(data.modes);
      }
    } catch (err) {
      console.error("AI Server error:", err);
      showToast('error', 'AI Server connection failed. Ensure the Python backend is running.');
    }
  };

  const handleSaveCamera = async (camId) => {
    const url = inputIps[camId];
    const formData = new FormData();
    formData.append('cam_id', camId);
    formData.append('url', url);

    try {
      const response = await fetch(`${API_URL}/api/update_camera`, { method: 'POST', body: formData });
      if (response.ok) {
        setCameraIps(prev => ({ ...prev, [camId]: url }));
        showToast('success', `Camera 0${camId} connected successfully.`);
      }
    } catch (err) {
      console.error("Save camera error:", err);
      showToast('error', 'Failed to save camera configuration. Check server connection.');
    }
  };

  const handleRemoveCamera = async (camId) => {
    const formData = new FormData();
    formData.append('cam_id', camId);
    formData.append('url', '');
    try {
      const response = await fetch(`${API_URL}/api/update_camera`, { method: 'POST', body: formData });
      if (response.ok) {
        setCameraIps(prev => ({ ...prev, [camId]: '' }));
        setInputIps(prev => ({ ...prev, [camId]: '' }));
      }
    } catch (err) {
      console.error("Remove camera error:", err);
      showToast('error', 'Failed to remove camera. Check server connection.');
    }
  };

  const toggleFullScreen = (e) => {
    const elem = e.currentTarget.parentElement.parentElement;
    if (!document.fullscreenElement) {
      if (elem.requestFullscreen) elem.requestFullscreen();
      else if (elem.webkitRequestFullscreen) elem.webkitRequestFullscreen();
      else if (elem.msRequestFullscreen) elem.msRequestFullscreen();
    } else {
      if (document.exitFullscreen) document.exitFullscreen();
    }
  };

  const handlePrintPDF = () => window.print();

  const totalAccess = accessLogs.length;
  const grantedAccess = accessLogs.filter(log => log.access_result === 'Granted').length;
  const deniedAccess = accessLogs.filter(log => log.access_result === 'Denied').length;
  const activeCamCount = Object.values(cameraIps).filter(ip => ip !== '').length;

  const activeFireAlerts = fireLogs.filter(log => log.status === 'Active');
  const resolvedFireAlerts = fireLogs.filter(log => log.status === 'Resolved');
  const activeFireCamsCount = ['7', '8', '9'].filter(cam => cameraIps[cam] !== '').length;
  const latestActiveFire = activeFireAlerts.length > 0 ? activeFireAlerts[0] : null;

  // IMPORTANT: Calculate the isEmergencyLockdown state based on active fires
  const isEmergencyLockdown = activeFireAlerts.length > 0;

  const showFireBanner = activeFireAlerts.length > 0 && !bannerDismissed;

  const totalSystemAlerts = systemAlerts.length;
  const pendingSystemAlerts = systemAlerts.filter(a => a.status === 'Pending');
  const resolvedSystemAlertsCount = systemAlerts.filter(a => a.status === 'Resolved').length;
  const highPrioritySystemAlertsCount = systemAlerts.filter(a => a.priority === 'High' && a.status === 'Pending').length;

  const filteredReports = Array.isArray(systemAlerts) ? systemAlerts.filter(alert => {
    if (!reportDate) return true;
    const ts = alert.timestamp ? String(alert.timestamp) : '';
    return ts.startsWith(reportDate);
  }) : [];

  return (
    <>
    <div className="dashboard-container">
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
          <li className={activeTab === 'dashboard' ? 'active' : ''} onClick={() => handleTabChange('dashboard')}><Home size={18} /> Dashboard</li>
          <li className={activeTab === 'cctv' ? 'active' : ''} onClick={() => handleTabChange('cctv')}><Camera size={18} /> Live CCTV Feeds</li>
          <li className={activeTab === 'patient' ? 'active' : ''} onClick={() => handleTabChange('patient')}><Users size={18} /> Patient Management</li>
          <li className={activeTab === 'access' ? 'active' : ''} onClick={() => handleTabChange('access')}><ShieldAlert size={18} /> Mask Detection</li>
          <li className={activeTab === 'fire' ? 'active' : ''} onClick={() => handleTabChange('fire')}><Flame size={18} /> Fire Monitoring</li>

          <li className={activeTab === 'reports' ? 'active' : ''} onClick={() => handleTabChange('reports')}><FileText size={18} /> Reports & Logs</li>
          <li className={activeTab === 'user' ? 'active' : ''} onClick={() => handleTabChange('user')}><UserCog size={18} /> User Management</li>
          <li className={activeTab === 'setting' ? 'active' : ''} onClick={() => handleTabChange('setting')}><Settings size={18} /> Setting</li>
          <li className={activeTab === 'about' ? 'active' : ''} onClick={() => handleTabChange('about')}><Info size={18} /> About</li>
        </ul>

        <div className="sidebar-footer">
          <div className="user-profile-card">
            <div className="user-avatar">
              <User size={20} />
            </div>
            <div className="user-info">
              <span className="user-name">
                {user?.displayName || 'Admin User'}
              </span>
              <span className="user-email">
                {user?.email || 'admin@carevision.lk'}
              </span>
            </div>
          </div>
          <button className="logout-btn" onClick={onLogout}>
            <LogOut size={16} /> Logout
          </button>
        </div>
      </div>

      <div className="main-content">


    
        {activeTab === 'dashboard' && <OverviewTab patientsCount={patientsList.length} pendingAlertsCount={pendingSystemAlerts.length} highPriorityCount={highPrioritySystemAlertsCount} deniedAccessCount={deniedAccess} aiControls={aiControls} toggleAI={toggleAI} pendingSystemAlerts={pendingSystemAlerts} handleResolveSystemAlert={handleResolveSystemAlert} cameraAiConfigs={cameraAiConfigs} cameraIps={cameraIps} isEmergencyLockdown={isEmergencyLockdown} />}

        {activeTab === 'cctv' && (
          <CCTVFeedsTab
            cameraIps={cameraIps}
            toggleFullScreen={toggleFullScreen}
            aiConfigs={cameraAiConfigs}
            onToggleAI={handleToggleCameraAI}
            isEmergencyLockdown={isEmergencyLockdown}
          />
        )}

        {activeTab === 'patient' && <PatientManagementTab showRegisterForm={showRegisterForm} setShowRegisterForm={setShowRegisterForm} patientData={patientData} setPatientData={setPatientData} handleImageChange={handleImageChange} imageFile={imageFile} handleRegisterPatient={handleRegisterPatient} isUploading={isUploading} patientsList={patientsList} searchQuery={searchQuery} setSearchQuery={setSearchQuery} handleDeletePatient={handleDeletePatient} isEmergencyLockdown={isEmergencyLockdown} />}

        {activeTab === 'access' && <MaskDetectionTab totalAccess={totalAccess} grantedAccess={grantedAccess} deniedAccess={deniedAccess} activeCamCount={activeCamCount} accessLogs={accessLogs} />}

        {activeTab === 'fire' && <FireMonitoringTab activeFireAlerts={activeFireAlerts} fireLogs={fireLogs} resolvedFireAlerts={resolvedFireAlerts} activeFireCamsCount={activeFireCamsCount} latestActiveFire={latestActiveFire} handleNotifyEmergency={handleNotifyEmergency} handleResolveFireAlert={handleResolveFireAlert} />}

        {activeTab === 'reports' && <ReportsTab reportDate={reportDate} setReportDate={setReportDate} filteredReports={filteredReports} fireLogs={fireLogs} systemAlerts={systemAlerts} accessLogs={accessLogs} />}
        {activeTab === 'user' && <UserManagementTab />}

        {activeTab === 'setting' && <SettingsTab inputIps={inputIps} setInputIps={setInputIps} handleSaveCamera={handleSaveCamera} handleRemoveCamera={handleRemoveCamera} cameraIps={cameraIps} isEmergencyLockdown={isEmergencyLockdown} />}

        {activeTab === 'about' && <AboutTab />}
      </div>
    </div>

      {/* Emergency fire overlay — position:fixed, floats above all content */}
      {showFireBanner && (
        <div className="emergency-alert-banner">
          <Flame className="emergency-icon" size={22} />
          <div className="emergency-alert-text">
            <strong>CRITICAL EMERGENCY:</strong> Active fire or smoke hazard detected
            {activeFireAlerts.length > 0
              ? ` on ${activeFireAlerts.map(a => a.camera_id).join(', ')}`
              : ''}!
            &nbsp;AI modules auto-disabled.
          </div>
          <div className="emergency-banner-actions">
            {/* View: navigate to CCTV tab — banner stays visible */}
            <button
              className="emergency-banner-view"
              onClick={() => handleTabChange('cctv')}
              title="Go to Live CCTV Feeds"
            >
              <ExternalLink size={13} />
              View
            </button>
            {/* Resolve: navigate to Fire Monitoring tab — banner dismissed */}
            <button
              className="emergency-banner-resolve"
              onClick={() => {
                handleTabChange('fire');
                setBannerDismissed(true);
              }}
              title="Go to Fire Monitoring and resolve"
            >
              <Flame size={13} />
              Resolve
            </button>
          </div>
        </div>
      )}

      {/* Toast notification overlay — position:fixed, hidden on About tab */}
      {activeTab !== 'about' && (
        <ToastNotification toasts={toasts} onDismiss={dismissToast} />
      )}
    </>
  );
};

export default DashboardLayout;