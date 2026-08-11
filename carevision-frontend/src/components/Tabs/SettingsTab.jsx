import React, { useState } from 'react';
import { Camera, Phone, Settings2, Wifi, CheckCircle } from 'lucide-react';
import './SettingsTab.css';

const SettingsTab = ({ inputIps, setInputIps, handleSaveCamera, handleRemoveCamera, cameraIps, isEmergencyLockdown = false }) => {
  const [loadingAdd, setLoadingAdd] = useState({});
  const [loadingRemove, setLoadingRemove] = useState({});

  const onAddCamera = async (camId) => {
    setLoadingAdd(prev => ({ ...prev, [camId]: true }));
    try {
      await handleSaveCamera(camId);
    } finally {
      setLoadingAdd(prev => ({ ...prev, [camId]: false }));
    }
  };

  const onRemoveCamera = async (camId) => {
    setLoadingRemove(prev => ({ ...prev, [camId]: true }));
    try {
      await handleRemoveCamera(camId);
    } finally {
      setLoadingRemove(prev => ({ ...prev, [camId]: false }));
    }
  };

  const configuredCount = [1, 2, 3, 4, 5, 6, 7, 8, 9].filter(cam => !!cameraIps[String(cam)]).length;

  return (
    <div className="setting-wrapper">
      <div className="header">
        <h1>System Settings</h1>
        <p>Configure 9 optimized cameras with integrated AI features</p>
      </div>

      <div className="stats-grid">
        {[
          { label: 'Total Camera Slots', value: 9, icon: <Camera size={20} color="#0D6EFD" />, iconBg: '#eff6ff', accent: '#0D6EFD' },
          { label: 'Configured Cameras', value: configuredCount, icon: <Wifi size={20} color="#10b981" />, iconBg: '#f0fdf4', accent: '#10b981' },
          { label: 'Available Slots', value: 9 - configuredCount, icon: <CheckCircle size={20} color="#f97316" />, iconBg: '#fff7ed', accent: '#f97316' },
        ].map((s, i) => (
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

      <div className="card-box mt-4">
        <div className="camera-header-wrap mb-4">
          <h3 className="camera-section-title">
            <Settings2 size={20} /> Centralized Camera Configuration
          </h3>
        </div>

        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(cam => {
          const camId = String(cam);
          const currentInput = inputIps[camId] || '';
          const savedUrl = cameraIps[camId] || '';
          const isAdded = savedUrl !== '' && currentInput === savedUrl;
          const hasSavedConfig = savedUrl !== '';

          const isAddLoading = !!loadingAdd[camId];
          const isRemoveLoading = !!loadingRemove[camId];
          const isAnyLoading = isAddLoading || isRemoveLoading;

          let addBtnText = 'Add';
          if (isEmergencyLockdown) {
            addBtnText = 'Disabled 🚨';
          } else if (isAddLoading) {
            addBtnText = 'Adding...';
          } else if (isAdded) {
            addBtnText = 'Added ✓';
          }

          let removeBtnText = 'Remove';
          if (isEmergencyLockdown) {
            removeBtnText = 'Disabled 🚨';
          } else if (isRemoveLoading) {
            removeBtnText = 'Removing...';
          }

          const isInputEmpty = currentInput.trim() === '';
          const isAddDisabled = isAnyLoading || isAdded || isInputEmpty || isEmergencyLockdown;
          const isRemoveDisabled = isAnyLoading || !hasSavedConfig || isEmergencyLockdown;

          return (
            <div key={cam} className="camera-config-row">
              <span className="camera-config-label">
                <Camera size={14} /> Camera 0{cam} :
              </span>

              <input
                type="text"
                value={currentInput}
                onChange={(e) => setInputIps({ ...inputIps, [camId]: e.target.value })}
                placeholder="Enter video URL (e.g., http://192.168.1.100:8080/video)"
                className="form-input camera-url-input"
                disabled={isAnyLoading || isEmergencyLockdown}
              />

              <button
                onClick={() => onAddCamera(camId)}
                className={`camera-action-btn camera-add-btn${isAdded && !isEmergencyLockdown ? ' camera-add-btn--added' : ''}`}
                disabled={isAddDisabled}
              >
                {addBtnText}
              </button>
              <button
                onClick={() => onRemoveCamera(camId)}
                className="camera-action-btn camera-remove-btn"
                disabled={isRemoveDisabled}
              >
                {removeBtnText}
              </button>
            </div>
          );
        })}
      </div>

      <div className="card-box mt-4">
        <h3 className="mb-4 support-section-title">Contact Support</h3>
        <div className="support-btn-container support-btn-container--settings">
          <button className="support-phone-btn--settings">
            <Phone size={16} color="#0D6EFD" /> +94765293838
          </button>
          <button className="support-phone-btn--settings">
            <Phone size={16} color="#0D6EFD" /> +94766486769
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsTab;