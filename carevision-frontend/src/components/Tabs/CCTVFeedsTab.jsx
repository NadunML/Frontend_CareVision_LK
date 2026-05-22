import React, { useState } from 'react';
import { Camera, AlertTriangle, Maximize, UserSearch, Shield, Flame } from 'lucide-react';

const CCTVFeedsTab = ({ cameraIps, toggleFullScreen, aiConfigs, onToggleAI }) => {
  // අපි ආයෙත් React State එක පාවිච්චි කරනවා, හැබැයි මේ පාර Lag වෙන්නෙ නැති වෙන්න
  const [hoveredCam, setHoveredCam] = useState(null);

  const LiveDot = () => <span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#ef4444', marginRight: '6px' }}></span>;

  const NoSignalBox = ({ camId }) => (
    <div style={{ backgroundColor: '#111', display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', height: '250px', borderRadius: '12px', border: '1px solid #444', position: 'relative' }}>
      <div style={{ position: 'absolute', top: '10px', left: '10px', right: '10px', zIndex: 2 }}>
        <div style={{ backgroundColor: 'rgba(255,255,255,0.1)', color: '#aaa', border: '1px solid #444', display: 'flex', alignItems: 'center', padding: '4px 10px', borderRadius: '6px', fontSize: '12px', width: 'fit-content' }}>
          <Camera size={12} style={{ marginRight: '6px' }} /> Cam 0{camId}
        </div>
      </div>
      <div style={{ textAlign: 'center', color: '#555', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <AlertTriangle size={32} color="#555" style={{ marginBottom: '10px' }} />
        <div style={{ fontSize: '16px', fontWeight: 'bold', letterSpacing: '2px' }}>NO SIGNAL</div>
      </div>
    </div>
  );

  const AIToggleBtn = ({ camId, type, icon: Icon, label, isActive, activeColor }) => (
    <button
      onClick={(e) => {
        e.stopPropagation(); // බටන් එක එබුවම වෙන දේවල් ක්ලික් වෙන එක නවත්තනවා
        onToggleAI(camId, type);
      }}
      style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px',
        padding: '8px 10px', borderRadius: '6px', border: 'none', cursor: 'pointer',
        fontSize: '11px', fontWeight: 'bold', transition: 'all 0.2s', flex: 1,
        backgroundColor: isActive ? activeColor : 'rgba(255, 255, 255, 0.2)', 
        color: isActive ? 'white' : '#ddd',
        backdropFilter: 'blur(5px)' // පොඩි වීදුරු ගතියක් එන්න
      }}
    >
      <Icon size={14} /> {label}
    </button>
  );

  return (
    <div className="card-box" style={{ width: '100%' }}>
      <div style={{ marginBottom: '20px' }}>
        <h1 style={{ margin: '0 0 5px 0' }}>Live CCTV Feeds</h1>
        <p style={{ margin: 0, color: '#aaa' }}>Real-time hospital monitoring across 5 optimized zones with AI controls</p>
      </div>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
        {[1, 2, 3, 4, 5].map(cam => (
          <div 
            key={cam} 
            style={{ 
              position: 'relative', 
              height: '250px', 
              borderRadius: '12px', 
              overflow: 'hidden', 
              border: '1px solid #444', 
              backgroundColor: '#000' 
            }}
            // මේකෙන් තමයි Hover වෙන එක අල්ලගන්නේ
            onMouseEnter={() => setHoveredCam(cam)}
            onMouseLeave={() => setHoveredCam(null)}
          >
            
            {cameraIps && cameraIps[String(cam)] ? (
              <>
                {/* Top Bar: Camera Name & Maximize */}
                <div style={{ position: 'absolute', top: '10px', left: '10px', right: '10px', zIndex: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div style={{ backgroundColor: 'rgba(0,0,0,0.6)', color: 'white', display: 'flex', alignItems: 'center', padding: '4px 10px', borderRadius: '6px', fontSize: '12px', backdropFilter: 'blur(4px)' }}>
                    <LiveDot /> Cam 0{cam}
                  </div>
                  <button onClick={toggleFullScreen} style={{ background: 'rgba(0,0,0,0.6)', color: 'white', border: 'none', padding: '6px', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(4px)' }}>
                    <Maximize size={14} />
                  </button>
                </div>

                {/* Video Feed */}
                <img src={`http://localhost:5000/video_feed/${cam}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt={`Cam ${cam}`} />
                
                {/* Overlay AI Control Buttons (Pop-up වෙන කෑල්ල) */}
                <div 
                  style={{ 
                    position: 'absolute', 
                    bottom: '0', 
                    left: '0', 
                    right: '0', 
                    padding: '40px 10px 15px', 
                    background: 'linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.5) 60%, rgba(0,0,0,0) 100%)',
                    display: 'flex', 
                    gap: '10px', 
                    zIndex: 20,
                    // Hover එකට අනුව මේක උඩට එනවා / පල්ලෙහාට යනවා
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    transform: hoveredCam === cam ? 'translateY(0)' : 'translateY(100%)',
                    opacity: hoveredCam === cam ? 1 : 0,
                  }}
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