import React, { useState } from 'react';
import {
  Camera, AlertTriangle, Maximize, UserSearch,
  Shield, Flame, Video, Wifi, WifiOff, Activity, Lock
} from 'lucide-react';
import './CCTVFeedsTab.css';

const CCTVFeedsTab = ({ cameraIps, toggleFullScreen, aiConfigs, onToggleAI, isEmergencyLockdown = false }) => {
  const [hoveredCam, setHoveredCam] = useState(null);

  // Count how many cameras have an IP configured
  const configuredCameras = [1, 2, 3, 4, 5].filter(
    (cam) => cameraIps && cameraIps[String(cam)]
  ).length;

  // Count how many AI modules are currently active across all cameras
  const activeAiCount = [1, 2, 3, 4, 5].reduce((total, cam) => {
    if (!cameraIps || !cameraIps[String(cam)]) return total;
    const cfg = aiConfigs?.[cam] || {};
    // If in lockdown, ONLY fire counts as active!
    if (isEmergencyLockdown) {
      return total + (cfg.fire ? 1 : 0);
    }
    return total + (cfg.patient ? 1 : 0) + (cfg.mask ? 1 : 0) + (cfg.fire ? 1 : 0);
  }, 0);

  const stats = [
    {
      label: 'Total Cameras',
      value: 5,
      icon: <Video size={20} color="#0D6EFD" />,
      iconBg: '#eff6ff',
      accent: '#0D6EFD',
    },
    {
      label: 'Online Feeds',
      value: configuredCameras,
      icon: <Wifi size={20} color="#10b981" />,
      iconBg: '#f0fdf4',
      accent: '#10b981',
    },
    {
      label: 'Offline / No Signal',
      value: 5 - configuredCameras,
      icon: <WifiOff size={20} color="#ef4444" />,
      iconBg: '#fff1f2',
      accent: '#ef4444',
    },
    {
      label: 'Active AI Modules',
      value: activeAiCount,
      icon: <Activity size={20} color="#f59e0b" />,
      iconBg: '#fffbeb',
      accent: '#f59e0b',
    },
  ];

  const LiveDot = () => <span className="live-dot" />;

  const NoSignalBox = ({ camId }) => (
    <div className="no-signal-box">
      <div className="no-signal-top">
        <div className="no-signal-cam-badge">
          <Camera size={12} /> Cam 0{camId}
        </div>
      </div>
      <div className="no-signal-content">
        <div className="no-signal-icon-wrap">
          <WifiOff size={28} color="#555" />
        </div>
        <div className="no-signal-text">NO SIGNAL</div>
        <div className="no-signal-sub">No stream URL configured</div>
      </div>
    </div>
  );

  // Custom AI Toggle Button with Emergency Lockdown Logic
  const AIToggleBtn = ({ camId, type, icon: Icon, label, isActive, isEmergencyDisabled }) => {
    return (
      <button
        onClick={(e) => {
          e.stopPropagation();
          if (!isEmergencyDisabled) {
            onToggleAI(camId, type);
          }
        }}
        className={`ai-toggle-btn ai-toggle-btn--${type} ${isActive && !isEmergencyDisabled ? 'ai-toggle-btn--active' : ''} ${isEmergencyDisabled ? 'ai-toggle-btn--disabled' : ''}`}
        disabled={isEmergencyDisabled}
        title={isEmergencyDisabled ? 'Disabled during Fire Emergency' : `${isActive ? 'Disable' : 'Enable'} ${label}`}
      >
        {isEmergencyDisabled ? <Lock size={12} className="ai-btn-icon" /> : <Icon size={12} className="ai-btn-icon" />}
        <span className="ai-btn-label">{isEmergencyDisabled ? 'Locked' : label}</span>
        <span className="ai-status-indicator" />
      </button>
    );
  };

  return (
    <div className="cctv-wrapper-pro">
      <div className="header">
        <h1>Live CCTV Feeds</h1>
        <p>Real-time hospital monitoring across 5 optimized zones with AI module controls</p>
      </div>

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

      <div className="cctv-feeds-card card-box">
        <div className="cctv-grid-header">
          <div className="cctv-grid-title">
            <div className="cctv-grid-title-icon">
              <Camera size={16} color="#0D6EFD" />
            </div>
            <div>
              <h3>Camera Grid</h3>
              <p className="cctv-grid-subtitle">Hover over a feed to toggle AI modules</p>
            </div>
          </div>
          <div className="cctv-status-chips">
            <span className="cctv-chip cctv-chip--online">
              <span className="cctv-chip-dot cctv-chip-dot--green" />
              {configuredCameras} Online
            </span>
            <span className="cctv-chip cctv-chip--offline">
              <span className="cctv-chip-dot cctv-chip-dot--red" />
              {5 - configuredCameras} Offline
            </span>
          </div>
        </div>

        <div className="cctv-camera-grid">
          {[1, 2, 3, 4, 5].map((cam) => (
            <div
              key={cam}
              className="camera-wrapper"
              onMouseEnter={() => setHoveredCam(cam)}
              onMouseLeave={() => setHoveredCam(null)}
            >
              {cameraIps && cameraIps[String(cam)] ? (
                <>
                  <div className="cam-overlay-top">
                    <div className="cam-label-badge">
                      <LiveDot /> Cam 0{cam}
                    </div>
                    <button onClick={toggleFullScreen} className="cam-fullscreen-btn" title="Toggle fullscreen">
                      <Maximize size={14} />
                    </button>
                  </div>

                  <img
                    src={`http://localhost:5000/video_feed/${cam}`}
                    className="cam-video-feed"
                    alt={`Camera ${cam} live feed`}
                  />

                  {/* AI controls overlay */}
                  <div className={`cam-ai-controls ${hoveredCam === cam ? 'cam-ai-controls--visible' : 'cam-ai-controls--hidden'}`}>
                    <AIToggleBtn
                      camId={cam}
                      type="patient"
                      icon={UserSearch}
                      label="Patient ID"
                      isActive={aiConfigs?.[cam]?.patient}
                      isEmergencyDisabled={isEmergencyLockdown}
                    />
                    <AIToggleBtn
                      camId={cam}
                      type="mask"
                      icon={Shield}
                      label="Mask"
                      isActive={aiConfigs?.[cam]?.mask}
                      isEmergencyDisabled={isEmergencyLockdown}
                    />
                    <AIToggleBtn
                      camId={cam}
                      type="fire"
                      icon={Flame}
                      label="Fire"
                      isActive={aiConfigs?.[cam]?.fire}
                      isEmergencyDisabled={false} // Fire button NEVER disables!
                    />
                  </div>
                </>
              ) : (
                <NoSignalBox camId={cam} />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CCTVFeedsTab;