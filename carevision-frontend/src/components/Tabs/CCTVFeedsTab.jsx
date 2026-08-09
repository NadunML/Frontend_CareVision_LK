import React, { useState, useRef, useEffect } from 'react';
import {
  Camera, Maximize, Minimize, UserSearch,
  Shield, Flame, Video, Wifi, WifiOff, Activity, Lock
} from 'lucide-react';
import './CCTVFeedsTab.css';

const API_URL = import.meta.env.VITE_API_URL;

const ALL_CAMS = [1, 2, 3, 4, 5, 6, 7, 8, 9];

const CCTVFeedsTab = ({ cameraIps, toggleFullScreen, aiConfigs, onToggleAI, isEmergencyLockdown = false }) => {
  const [hoveredCam, setHoveredCam] = useState(null);
  const [isGridFullscreen, setIsGridFullscreen] = useState(false);
  const gridRef = useRef(null);

  // Keep toggle icon in sync when user exits fullscreen via Escape key
  useEffect(() => {
    const handleFsChange = () => {
      setIsGridFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFsChange);
    return () => document.removeEventListener('fullscreenchange', handleFsChange);
  }, []);

  const handleGridFullscreen = () => {
    if (!document.fullscreenElement) {
      gridRef.current?.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };

  // Count how many cameras have an IP configured (out of 9)
  const configuredCameras = ALL_CAMS.filter(
    (cam) => cameraIps && cameraIps[String(cam)]
  ).length;

  const LiveDot = () => <span className="live-dot" />;

  const NoSignalBox = ({ camId }) => (
    <div className="no-signal-box">
      <div className="no-signal-top">
        <div className="no-signal-cam-badge">
          <Camera size={12} /> Cam {String(camId).padStart(2, '0')}
        </div>
      </div>
      <div className="no-signal-content">
        <div className="no-signal-icon-wrap">
          <WifiOff size={22} color="#555" />
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
      {/* Compact header */}
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
            {ALL_CAMS.length - configuredCameras} Offline
          </span>
          <button
            className="cctv-fullscreen-btn"
            onClick={handleGridFullscreen}
            title={isGridFullscreen ? 'Exit fullscreen grid' : 'Fullscreen grid'}
          >
            {isGridFullscreen
              ? <Minimize size={13} />
              : <Maximize size={13} />}
            {isGridFullscreen ? 'Exit' : 'Fullscreen'}
          </button>
        </div>
      </div>

      {/* 3×3 camera grid — fills all remaining vertical space */}
      <div className="cctv-camera-grid" ref={gridRef}>
        {ALL_CAMS.map((cam) => (
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
                    <LiveDot /> Cam {String(cam).padStart(2, '0')}
                  </div>
                  <button onClick={toggleFullScreen} className="cam-fullscreen-btn" title="Toggle fullscreen">
                    <Maximize size={14} />
                  </button>
                </div>

                <img
                  src={`${API_URL}/video_feed/${cam}`}
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
  );
};

export default CCTVFeedsTab;