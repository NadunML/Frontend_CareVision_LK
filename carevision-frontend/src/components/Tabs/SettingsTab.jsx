import React from 'react';
import { Users, UserCog, Flame, Phone } from 'lucide-react';

const SettingsTab = ({ inputIps, setInputIps, handleSaveCamera, handleRemoveCamera }) => {
  return (
    <div className="setting-wrapper">
      <div className="header"><h1>System Setting</h1><p>Configure 9 cameras across 3 AI security zones</p></div>
      <div className="card-box mt-4">
        <div className="camera-header-wrap mb-4"><h3 style={{display: 'flex', alignItems: 'center', gap: '8px', margin: '0 0 5px 0', color: '#0D6EFD'}}><Users size={20} /> Patient Detection Configuration (Cams 1, 2, 3)</h3></div>
        {[1, 2, 3].map(cam => (
          <div key={cam} style={{ display: 'flex', alignItems: 'center', marginBottom: '15px', backgroundColor: '#eff6ff', padding: '10px 15px', borderRadius: '8px', border: '1px solid #bfdbfe' }}>
            <span style={{ fontWeight: 'bold', width: '120px', color: '#1e3a8a' }}>Camera 0{cam} IP :</span>
            <input type="text" value={inputIps[String(cam)]} onChange={(e) => setInputIps({...inputIps, [String(cam)]: e.target.value})} placeholder="Enter video URL" className="form-input" style={{ flex: 1, marginRight: '15px' }} />
            <button onClick={() => handleSaveCamera(String(cam))} style={{ padding: '8px 20px', backgroundColor: '#0D6EFD', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', marginRight: '10px' }}>Add</button>
            <button onClick={() => handleRemoveCamera(String(cam))} style={{ padding: '8px 20px', backgroundColor: '#ef4444', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Remove</button>
          </div>
        ))}
        <div className="camera-header-wrap mb-4" style={{marginTop: '30px'}}><h3 style={{display: 'flex', alignItems: 'center', gap: '8px', margin: '0 0 5px 0', color: '#10b981'}}><UserCog size={20} /> Mask Detection Configuration (Cams 4, 5, 6)</h3></div>
        {[4, 5, 6].map(cam => (
          <div key={cam} style={{ display: 'flex', alignItems: 'center', marginBottom: '15px', backgroundColor: '#ecfdf5', padding: '10px 15px', borderRadius: '8px', border: '1px solid #a7f3d0' }}>
            <span style={{ fontWeight: 'bold', width: '120px', color: '#064e3b' }}>Camera 0{cam} IP :</span>
            <input type="text" value={inputIps[String(cam)]} onChange={(e) => setInputIps({...inputIps, [String(cam)]: e.target.value})} placeholder="Enter video URL" className="form-input" style={{ flex: 1, marginRight: '15px' }} />
            <button onClick={() => handleSaveCamera(String(cam))} style={{ padding: '8px 20px', backgroundColor: '#10b981', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', marginRight: '10px' }}>Add</button>
            <button onClick={() => handleRemoveCamera(String(cam))} style={{ padding: '8px 20px', backgroundColor: '#ef4444', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Remove</button>
          </div>
        ))}
        <div className="camera-header-wrap mb-4" style={{marginTop: '30px'}}><h3 style={{display: 'flex', alignItems: 'center', gap: '8px', margin: '0 0 5px 0', color: '#ef4444'}}><Flame size={20} /> Fire Detection Configuration (Cams 7, 8, 9)</h3></div>
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
  );
};
export default SettingsTab;