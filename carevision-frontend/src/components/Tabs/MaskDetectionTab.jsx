import React from 'react';
import { Users, ShieldAlert, AlertTriangle, Camera } from 'lucide-react';

const MaskDetectionTab = ({ totalAccess, grantedAccess, deniedAccess, activeCamCount, accessLogs }) => {
  return (
    <div className="access-wrapper">
      <div className="header"><h1>Mask Detection</h1><p>Real-time hospital monitoring and security status</p></div>
      <div className="stats-grid">
        <div className="stat-card"><div className="flex-between align-start"><div><h4>Total Access Attempts</h4><h2>{totalAccess > 0 ? totalAccess : 0}</h2></div><div className="outline-icon-box border-blue"><Users size={20} /></div></div></div>
        <div className="stat-card"><div className="flex-between align-start"><div><h4>Access Granted</h4><h2>{grantedAccess}</h2></div><div className="outline-icon-box border-green"><ShieldAlert size={20} /></div></div></div>
        <div className="stat-card"><div className="flex-between align-start"><div><h4>Access Denied</h4><h2>{deniedAccess}</h2></div><div className="outline-icon-box border-red"><AlertTriangle size={20} /></div></div></div>
        <div className="stat-card"><div className="flex-between align-start"><div><h4>Active Cameras</h4><h2>{activeCamCount}</h2></div><div className="outline-icon-box border-yellow"><Camera size={20} /></div></div></div>
      </div>
      <div className="table-container card-box mt-4">
        <h3 className="mb-4">Access Control Logs</h3>
        <table className="data-table">
          <thead><tr><th>Camera ID</th><th>Mask Detected</th><th>Access Result</th><th>Timestamp</th></tr></thead>
          <tbody>
            {accessLogs.length === 0 ? (<tr><td colSpan="4" style={{textAlign: 'center', padding: '20px', color: '#666'}}>No access logs available yet.</td></tr>) : (
              accessLogs.map((log, index) => (
                <tr key={index}><td>{log.camera_id}</td><td className={log.mask_detected === 'Yes' ? 'text-green font-bold' : 'text-red font-bold'}>{log.mask_detected}</td><td className={log.access_result === 'Granted' ? 'text-green font-bold' : 'text-red font-bold'}>{log.access_result}</td><td>{log.timestamp}</td></tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
export default MaskDetectionTab;