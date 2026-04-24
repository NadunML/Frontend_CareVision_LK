import React from 'react';
import { Camera, Users, UserCog, Flame, Cpu, AlertTriangle } from 'lucide-react';

const OverviewTab = ({ patientsCount, pendingAlertsCount, highPriorityCount, deniedAccessCount, aiControls, toggleAI }) => {
  return (
    <>
      <div className="header">
        <h1>Dashboard Overview</h1>
        <p>Real-time hospital monitoring and security status</p>
      </div>
      
      <div className="stats-grid">
        <div className="stat-card"><h4>Total Cameras</h4><h2>9</h2><p className="stat-sub">Enterprise Mode</p></div>
        <div className="stat-card"><h4>Registered Patients</h4><h2>{patientsCount}</h2><p className="stat-sub">Total Base</p></div>
        <div className="stat-card"><h4>Today's Alerts</h4><h2>{pendingAlertsCount}</h2><p className="stat-sub">{highPriorityCount} critical</p></div>
        <div className="stat-card"><h4>Mask Violations</h4><h2>{deniedAccessCount}</h2><p className="stat-sub">From access control</p></div>
      </div>

      <div className="card-box" style={{ marginTop: '20px', marginBottom: '20px', backgroundColor: '#fff', border: '1px solid #e2e8f0' }}>
        <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px', color: '#1e293b' }}>
          <Cpu size={22} color="#0D6EFD" /> AI Security Modules Configuration
        </h3>
        
        <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: '280px', border: aiControls.patientIdent ? '2px solid #0D6EFD' : '1px solid #e2e8f0', borderRadius: '12px', padding: '15px', backgroundColor: aiControls.patientIdent ? '#eff6ff' : '#f8fafc', transition: 'all 0.3s' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '15px' }}>
              <div>
                <h4 style={{ margin: '0 0 5px 0', color: '#1e293b', display: 'flex', alignItems: 'center', gap: '6px' }}><Camera size={16}/> Cams 1,2,3</h4>
                <span style={{ fontSize: '12px', color: '#64748b', fontWeight: 'bold' }}>📍 Wards Monitoring</span>
              </div>
              <button onClick={() => toggleAI('patientIdent')} style={{ padding: '6px 14px', borderRadius: '20px', border: 'none', backgroundColor: aiControls.patientIdent ? '#0D6EFD' : '#cbd5e1', color: 'white', fontWeight: 'bold', cursor: 'pointer' }}>
                {aiControls.patientIdent ? 'ON' : 'OFF'}
              </button>
            </div>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <Users size={32} color={aiControls.patientIdent ? '#0D6EFD' : '#94a3b8'} />
              <div>
                <div style={{ fontSize: '14px', fontWeight: 'bold', color: aiControls.patientIdent ? '#0D6EFD' : '#475569' }}>Patient Identification</div>
                <div style={{ fontSize: '11px', color: '#64748b', marginTop: '4px', lineHeight: '1.4' }}>Alerts if a registered patient attempts to leave.</div>
              </div>
            </div>
          </div>

          <div style={{ flex: 1, minWidth: '280px', border: aiControls.maskDetect ? '2px solid #10b981' : '1px solid #e2e8f0', borderRadius: '12px', padding: '15px', backgroundColor: aiControls.maskDetect ? '#ecfdf5' : '#f8fafc', transition: 'all 0.3s' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '15px' }}>
              <div>
                <h4 style={{ margin: '0 0 5px 0', color: '#1e293b', display: 'flex', alignItems: 'center', gap: '6px' }}><Camera size={16}/> Cams 4,5,6</h4>
                <span style={{ fontSize: '12px', color: '#64748b', fontWeight: 'bold' }}>📍 Theaters & Labs</span>
              </div>
              <button onClick={() => toggleAI('maskDetect')} style={{ padding: '6px 14px', borderRadius: '20px', border: 'none', backgroundColor: aiControls.maskDetect ? '#10b981' : '#cbd5e1', color: 'white', fontWeight: 'bold', cursor: 'pointer' }}>
                {aiControls.maskDetect ? 'ON' : 'OFF'}
              </button>
            </div>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <UserCog size={32} color={aiControls.maskDetect ? '#10b981' : '#94a3b8'} />
              <div>
                <div style={{ fontSize: '14px', fontWeight: 'bold', color: aiControls.maskDetect ? '#10b981' : '#475569' }}>Mask Detection</div>
                <div style={{ fontSize: '11px', color: '#64748b', marginTop: '4px', lineHeight: '1.4' }}>Alerts if staff enters without a mask.</div>
              </div>
            </div>
          </div>

          <div style={{ flex: 1, minWidth: '280px', border: aiControls.fireDetect ? '2px solid #ef4444' : '1px solid #e2e8f0', borderRadius: '12px', padding: '15px', backgroundColor: aiControls.fireDetect ? '#fef2f2' : '#f8fafc', transition: 'all 0.3s' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '15px' }}>
              <div>
                <h4 style={{ margin: '0 0 5px 0', color: '#1e293b', display: 'flex', alignItems: 'center', gap: '6px' }}><Camera size={16}/> Cams 7,8,9</h4>
                <span style={{ fontSize: '12px', color: '#64748b', fontWeight: 'bold' }}>📍 Dangerous Zones</span>
              </div>
              <button onClick={() => toggleAI('fireDetect')} style={{ padding: '6px 14px', borderRadius: '20px', border: 'none', backgroundColor: aiControls.fireDetect ? '#ef4444' : '#cbd5e1', color: 'white', fontWeight: 'bold', cursor: 'pointer' }}>
                {aiControls.fireDetect ? 'ON' : 'OFF'}
              </button>
            </div>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <Flame size={32} color={aiControls.fireDetect ? '#ef4444' : '#94a3b8'} />
              <div>
                <div style={{ fontSize: '14px', fontWeight: 'bold', color: aiControls.fireDetect ? '#ef4444' : '#475569' }}>Fire & Smoke Detection</div>
                <div style={{ fontSize: '11px', color: '#64748b', marginTop: '4px', lineHeight: '1.4' }}>Alerts if fire or smoke is detected.</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* ඔන්න ඔරිජිනල් තිබ්බ විදිහටම Active Alerts කොටස ආයෙත් දැම්මා! */}
      <div className="bottom-grid">
        <div className="alerts-section card-box">
          <h3 style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
            <AlertTriangle size={18} color="#ef4444" /> Active Alerts
          </h3>
          <div className="alert-item"><span className="dot red-dot"></span> Fire</div>
          <div className="alert-item"><span className="dot orange-dot"></span> Patient Wandering</div>
          <div className="alert-item"><span className="dot yellow-dot"></span> Mask Violation</div>
          <div className="alert-item"><span className="dot orange-dot"></span> Unauthorized Access</div>
        </div>
        
        <div className="chart-section card-box">
          <h3>Weekly Alerts Overview</h3>
          <div className="mock-chart">
            <div className="bar-group"><div className="bar grey" style={{height: '50%'}}></div><div className="bar orange" style={{height: '30%'}}></div><div className="bar red" style={{height: '60%'}}></div><span>Mon</span></div>
            <div className="bar-group"><div className="bar grey" style={{height: '30%'}}></div><div className="bar orange" style={{height: '70%'}}></div><div className="bar red" style={{height: '50%'}}></div><span>Tue</span></div>
            <div className="bar-group"><div className="bar grey" style={{height: '50%'}}></div><div className="bar orange" style={{height: '60%'}}></div><div className="bar red" style={{height: '20%'}}></div><span>Wed</span></div>
            <div className="bar-group"><div className="bar grey" style={{height: '60%'}}></div><div className="bar orange" style={{height: '75%'}}></div><div className="bar red" style={{height: '45%'}}></div><span>Thu</span></div>
            <div className="bar-group"><div className="bar grey" style={{height: '85%'}}></div><div className="bar orange" style={{height: '45%'}}></div><div className="bar red" style={{height: '60%'}}></div><span>Fri</span></div>
            <div className="bar-group"><div className="bar grey" style={{height: '40%'}}></div><div className="bar orange" style={{height: '85%'}}></div><div className="bar red" style={{height: '20%'}}></div><span>Sat</span></div>
            <div className="bar-group"><div className="bar grey" style={{height: '40%'}}></div><div className="bar orange" style={{height: '40%'}}></div><div className="bar red" style={{height: '60%'}}></div><span>Sun</span></div>
          </div>
        </div>
      </div>
    </>
  );
};

export default OverviewTab;