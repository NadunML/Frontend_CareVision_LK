import React, { useState } from 'react';
import { Camera, AlertTriangle, Maximize, UserSearch, Shield, Flame } from 'lucide-react';
import './CCTVFeedsTab.css';

const CCTVFeedsTab = ({ cameraIps, toggleFullScreen, aiConfigs, onToggleAI }) => {
  const [hoveredCam, setHoveredCam] = useState(null);

  const LiveDot = () => <span className="live-dot"></span>;

  const NoSignalBox = ({ camId }) => (
    <div className="no-signal-box">
      <div className="no-signal-top">
        <div className="no-signal-cam-badge">
          <Camera size={12} /> Cam 0{camId}
        </div>
      </div>
      <div className="no-signal-content">
        <AlertTriangle size={32} color="#555" className="no-signal-icon" />
        <div className="no-signal-text">NO SIGNAL</div>
      </div>
    </div>
  );

  // eslint-disable-next-line no-unused-vars
  const AIToggleBtn = ({ camId, type, icon: Icon, label, isActive, activeColor }) => (
    <button
      onClick={(e) => {
        e.stopPropagation();
        onToggleAI(camId, type);
      }}
      className={`ai-toggle-btn${isActive ? ' ai-toggle-btn--active' : ''}`}
      style={{ backgroundColor: isActive ? activeColor : 'rgba(255, 255, 255, 0.2)' }}
    >
      <Icon size={14} /> {label}
    </button>
  );

  return (
    <div className="card-box">
      <div className="cctv-tab-header">
        <h1>Live CCTV Feeds</h1>
        <p>Real-time hospital monitoring across 5 optimized zones with AI controls</p>
      </div>
      
      <div className="cctv-camera-grid">
        {[1, 2, 3, 4, 5].map(cam => (
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
                  <button onClick={toggleFullScreen} className="cam-fullscreen-btn">
                    <Maximize size={14} />
                  </button>
                </div>

                <img src={`http://localhost:5000/video_feed/${cam}`} className="cam-video-feed" alt={`Cam ${cam}`} />
                
                <div 
                  className={`cam-ai-controls ${hoveredCam === cam ? 'cam-ai-controls--visible' : 'cam-ai-controls--hidden'}`}
                >
                  <AIToggleBtn camId={cam} type="patient" icon={UserSearch} label="Patient ID" isActive={aiConfigs?.[cam]?.patient} activeColor="#0D6EFD" />
                  <AIToggleBtn camId={cam} type="mask" icon={Shield} label="Mask" isActive={aiConfigs?.[cam]?.mask} activeColor="#198754" />
                  <AIToggleBtn camId={cam} type="fire" icon={Flame} label="Fire" isActive={aiConfigs?.[cam]?.fire} activeColor="#DC3545" />
                </div>
              </>
            ) : <NoSignalBox camId={cam} />}

          </div>
        ))}
      </div>
    </div>
  );
};

export default CCTVFeedsTab;
