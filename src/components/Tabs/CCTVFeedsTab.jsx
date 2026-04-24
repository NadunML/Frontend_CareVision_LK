import React from 'react';
import { Camera, AlertTriangle, Maximize } from 'lucide-react';

const CCTVFeedsTab = ({ cameraIps, toggleFullScreen }) => {
  const LiveDot = () => <span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#ef4444', marginRight: '6px' }}></span>;
  const NoSignalBox = ({ camName }) => (
    <div className="cctv-box" style={{ padding: 0, overflow: 'hidden', backgroundColor: '#111', display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', position: 'relative', height: '250px', borderRadius: '12px', border: '1px solid #444' }}>
      <div className="cctv-top-bar" style={{ position: 'absolute', top: '10px', left: '10px', right: '10px', zIndex: 2 }}><div className="cam-name" style={{ backgroundColor: 'rgba(255,255,255,0.1)', color: '#aaa', border: '1px solid #444', display: 'flex', alignItems: 'center', padding: '4px 10px', borderRadius: '6px', fontSize: '12px' }}><Camera size={12} style={{ marginRight: '6px' }} /> {camName}</div></div>
      <div style={{ textAlign: 'center', color: '#555', display: 'flex', flexDirection: 'column', alignItems: 'center' }}><AlertTriangle size={32} color="#555" style={{ marginBottom: '10px' }} /><div style={{ fontSize: '16px', fontWeight: 'bold', letterSpacing: '2px' }}>NO SIGNAL</div></div>
    </div>
  );

  return (
    <div className="cctv-wrapper card-box">
      <div className="header"><h1>Live CCTV Feeds</h1><p>Real-time hospital monitoring across 9 zones</p></div>
      <div className="cctv-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '15px', marginTop: '20px' }}>
        {[1, 2, 3].map(cam => (
          cameraIps[String(cam)] ? (
            <div key={cam} className="cctv-box" style={{ padding: 0, overflow: 'hidden', position: 'relative', height: '250px', borderRadius: '12px', border: '1px solid #444', backgroundColor: '#000' }}>
              <div className="cctv-top-bar" style={{ position: 'absolute', top: '10px', left: '10px', right: '10px', zIndex: 2 }}><div className="cam-name" style={{ backgroundColor: 'rgba(0,0,0,0.6)', color: 'white', border: 'none', display: 'flex', alignItems: 'center', padding: '4px 10px', borderRadius: '6px', fontSize: '12px' }}><LiveDot /> Cam 0{cam}: Patient Detection</div></div>
              <img src={`http://localhost:5000/video_feed/${cam}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt={`Cam ${cam}`} />
              <button onClick={toggleFullScreen} style={{ position: 'absolute', bottom: '10px', right: '10px', zIndex: 10, background: 'rgba(0,0,0,0.6)', color: 'white', border: 'none', padding: '6px', borderRadius: '4px', cursor: 'pointer' }}><Maximize size={14} /></button>
            </div>
          ) : <NoSignalBox key={cam} camName={`Cam 0${cam}: Patient Detection`} />
        ))}
        {[4, 5, 6].map(cam => (
          cameraIps[String(cam)] ? (
            <div key={cam} className="cctv-box" style={{ padding: 0, overflow: 'hidden', position: 'relative', height: '250px', borderRadius: '12px', border: '1px solid #444', backgroundColor: '#000' }}>
              <div className="cctv-top-bar" style={{ position: 'absolute', top: '10px', left: '10px', right: '10px', zIndex: 2 }}><div className="cam-name" style={{ backgroundColor: 'rgba(0,0,0,0.6)', color: 'white', border: 'none', display: 'flex', alignItems: 'center', padding: '4px 10px', borderRadius: '6px', fontSize: '12px' }}><LiveDot /> Cam 0{cam}: Mask Detection</div></div>
              <img src={`http://localhost:5000/video_feed/${cam}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt={`Cam ${cam}`} />
              <button onClick={toggleFullScreen} style={{ position: 'absolute', bottom: '10px', right: '10px', zIndex: 10, background: 'rgba(0,0,0,0.6)', color: 'white', border: 'none', padding: '6px', borderRadius: '4px', cursor: 'pointer' }}><Maximize size={14} /></button>
            </div>
          ) : <NoSignalBox key={cam} camName={`Cam 0${cam}: Mask Detection`} />
        ))}
        {[7, 8, 9].map(cam => (
          cameraIps[String(cam)] ? (
            <div key={cam} className="cctv-box" style={{ padding: 0, overflow: 'hidden', position: 'relative', height: '250px', borderRadius: '12px', border: '1px solid #444', backgroundColor: '#000' }}>
              <div className="cctv-top-bar" style={{ position: 'absolute', top: '10px', left: '10px', right: '10px', zIndex: 2 }}><div className="cam-name" style={{ backgroundColor: 'rgba(0,0,0,0.6)', color: 'white', border: 'none', display: 'flex', alignItems: 'center', padding: '4px 10px', borderRadius: '6px', fontSize: '12px' }}><LiveDot /> Cam 0{cam}: Fire Detection</div></div>
              <img src={`http://localhost:5000/video_feed/${cam}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt={`Cam ${cam}`} />
              <button onClick={toggleFullScreen} style={{ position: 'absolute', bottom: '10px', right: '10px', zIndex: 10, background: 'rgba(0,0,0,0.6)', color: 'white', border: 'none', padding: '6px', borderRadius: '4px', cursor: 'pointer' }}><Maximize size={14} /></button>
            </div>
          ) : <NoSignalBox key={cam} camName={`Cam 0${cam}: Fire Detection`} />
        ))}
      </div>
    </div>
  );
};
export default CCTVFeedsTab;