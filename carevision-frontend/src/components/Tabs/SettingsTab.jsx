import React from 'react';
import { Camera, Phone, Settings2 } from 'lucide-react';

const SettingsTab = ({ inputIps, setInputIps, handleSaveCamera, handleRemoveCamera }) => {
  return (
    <div className="setting-wrapper">
      <div className="header" style={{ marginBottom: '20px' }}>
        <h1 style={{ margin: '0 0 5px 0' }}>System Settings</h1>
        <p style={{ margin: 0, color: '#aaa' }}>Configure 5 optimized cameras with integrated AI features</p>
      </div>
      
      <div className="card-box mt-4">
        <div className="camera-header-wrap mb-4">
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', margin: '0 0 15px 0', color: '#333' }}>
            <Settings2 size={20} /> Centralized Camera Configuration
          </h3>
        </div>
        
        {/* Render only 5 cameras uniformly, as each now handles all AI modes */}
        {[1, 2, 3, 4, 5].map(cam => (
          <div key={cam} style={{ display: 'flex', alignItems: 'center', marginBottom: '15px', backgroundColor: '#f8f9fa', padding: '10px 15px', borderRadius: '8px', border: '1px solid #e9ecef' }}>
            <span style={{ fontWeight: 'bold', width: '120px', color: '#495057', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Camera size={14} /> Camera 0{cam} :
            </span>
            
            <input 
              type="text" 
              value={inputIps[String(cam)] || ''} 
              onChange={(e) => setInputIps({...inputIps, [String(cam)]: e.target.value})} 
              placeholder="Enter video URL (e.g., http://192.168.1.100:8080/video)" 
              className="form-input" 
              style={{ flex: 1, marginRight: '15px', padding: '8px 12px', border: '1px solid #ced4da', borderRadius: '4px' }} 
            />
            
            <button 
              onClick={() => handleSaveCamera(String(cam))} 
              style={{ padding: '8px 20px', backgroundColor: '#0D6EFD', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', marginRight: '10px', fontWeight: 'bold' }}
            >
              Add
            </button>
            <button 
              onClick={() => handleRemoveCamera(String(cam))} 
              style={{ padding: '8px 20px', backgroundColor: '#ef4444', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
            >
              Remove
            </button>
          </div>
        ))}
      </div>

      <div className="card-box mt-4">
        <h3 className="mb-4" style={{ marginTop: '20px', marginBottom: '15px', color: '#333' }}>Contact Support</h3>
        <div className="support-btn-container" style={{ display: 'flex', gap: '15px' }}>
          <button className="support-phone-btn" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', border: '1px solid #dee2e6', borderRadius: '6px', background: '#fff', cursor: 'pointer', fontWeight: 'bold', color: '#495057' }}>
            <Phone size={16} color="#0D6EFD" /> +94765293838
          </button>
          <button className="support-phone-btn" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', border: '1px solid #dee2e6', borderRadius: '6px', background: '#fff', cursor: 'pointer', fontWeight: 'bold', color: '#495057' }}>
            <Phone size={16} color="#0D6EFD" /> +94766486769
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsTab;