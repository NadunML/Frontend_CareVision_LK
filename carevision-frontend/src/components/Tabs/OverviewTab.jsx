import React from 'react';
import { Camera, Users, UserCog, Flame, Cpu, AlertTriangle } from 'lucide-react';

const OverviewTab = ({ patientsCount, pendingAlertsCount, highPriorityCount, deniedAccessCount }) => {
  return (
    <>
      <div className="header">
        <h1>Dashboard Overview</h1>
        <p>Real-time hospital monitoring and security status</p>
      </div>
      
      <div className="stats-grid">
        <div className="stat-card">
          <h4>Total Cameras</h4>
          <h2>5</h2>
          <p className="stat-sub">Optimized Nodes</p>
        </div>
        <div className="stat-card">
          <h4>Registered Patients</h4>
          <h2>{patientsCount}</h2>
          <p className="stat-sub">Total Base</p>
        </div>
        <div className="stat-card">
          <h4>Today's Alerts</h4>
          <h2>{pendingAlertsCount}</h2>
          <p className="stat-sub">{highPriorityCount} critical</p>
        </div>
        <div className="stat-card">
          <h4>Mask Violations</h4>
          <h2>{deniedAccessCount}</h2>
          <p className="stat-sub">From access control</p>
        </div>
      </div>

      <div className="card-box" style={{ marginTop: '20px', marginBottom: '20px', backgroundColor: '#fff', border: '1px solid #e2e8f0' }}>
        <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px', color: '#1e293b' }}>
          <Cpu size={22} color="#0D6EFD" /> AI Security Modules Overview
        </h3>
        <p style={{ color: '#64748b', fontSize: '14px', marginBottom: '20px' }}>
          The system utilizes advanced deep learning models capable of running concurrently across all 5 active camera nodes. Individual module toggles are available in the Live CCTV Feeds tab.
        </p>
        
        <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
          
          {/* Patient Identification Module Info */}
          <div style={{ flex: 1, minWidth: '280px', border: '1px solid #bfdbfe', borderRadius: '12px', padding: '15px', backgroundColor: '#f8fafc' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '15px' }}>
              <div>
                <h4 style={{ margin: '0 0 5px 0', color: '#1e293b', display: 'flex', alignItems: 'center', gap: '6px' }}><Camera size={16}/> Available on Cams 1-5</h4>
                <span style={{ fontSize: '12px', color: '#0D6EFD', fontWeight: 'bold', backgroundColor: '#e0f2fe', padding: '4px 8px', borderRadius: '4px' }}>OpenCV + Deep Learning</span>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <Users size={32} color="#0D6EFD" />
              <div>
                <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#0D6EFD' }}>Patient Identification</div>
                <div style={{ fontSize: '12px', color: '#64748b', marginTop: '4px', lineHeight: '1.4' }}>Cross-references live feeds with the database to detect wandering high-risk patients.</div>
              </div>
            </div>
          </div>

          {/* Mask Detection Module Info */}
          <div style={{ flex: 1, minWidth: '280px', border: '1px solid #a7f3d0', borderRadius: '12px', padding: '15px', backgroundColor: '#f8fafc' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '15px' }}>
              <div>
                <h4 style={{ margin: '0 0 5px 0', color: '#1e293b', display: 'flex', alignItems: 'center', gap: '6px' }}><Camera size={16}/> Available on Cams 1-5</h4>
                <span style={{ fontSize: '12px', color: '#10b981', fontWeight: 'bold', backgroundColor: '#d1fae5', padding: '4px 8px', borderRadius: '4px' }}>MobileNetV2 Architecture</span>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <UserCog size={32} color="#10b981" />
              <div>
                <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#10b981' }}>Mask Detection</div>
                <div style={{ fontSize: '12px', color: '#64748b', marginTop: '4px', lineHeight: '1.4' }}>Analyzes facial regions to enforce hospital safety protocols and restrict access.</div>
              </div>
            </div>
          </div>

          {/* Fire Detection Module Info */}
          <div style={{ flex: 1, minWidth: '280px', border: '1px solid #fecaca', borderRadius: '12px', padding: '15px', backgroundColor: '#f8fafc' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '15px' }}>
              <div>
                <h4 style={{ margin: '0 0 5px 0', color: '#1e293b', display: 'flex', alignItems: 'center', gap: '6px' }}><Camera size={16}/> Available on Cams 1-5</h4>
                <span style={{ fontSize: '12px', color: '#ef4444', fontWeight: 'bold', backgroundColor: '#fee2e2', padding: '4px 8px', borderRadius: '4px' }}>YOLOv8 Nano Model</span>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <Flame size={32} color="#ef4444" />
              <div>
                <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#ef4444' }}>Fire & Smoke Detection</div>
                <div style={{ fontSize: '12px', color: '#64748b', marginTop: '4px', lineHeight: '1.4' }}>Real-time hazard monitoring utilizing high-speed bounding box processing.</div>
              </div>
            </div>
          </div>

        </div>
      </div>
      
      {/* Active Alerts & Chart Section */}
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