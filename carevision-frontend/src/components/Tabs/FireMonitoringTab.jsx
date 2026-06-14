import React from 'react';
import { AlertTriangle, Flame, ShieldAlert, Camera, BellRing } from 'lucide-react';
import './FireMonitoringTab.css';

const FireMonitoringTab = ({ activeFireAlerts, fireLogs, resolvedFireAlerts, activeFireCamsCount, latestActiveFire, handleNotifyEmergency, handleResolveFireAlert }) => {
  return (
    <div className="fire-wrapper">
      <div className="header"><h1>Fire & Smoke Detection</h1><p>Real-time fire and smoke monitoring system</p></div>
      <div className="stats-grid">
        <div className="stat-card"><div className="flex-between align-start"><div><h4>Active Alerts</h4><h2>{activeFireAlerts.length}</h2></div><div className="outline-icon-box border-red"><AlertTriangle size={20} /></div></div></div>
        <div className="stat-card"><div className="flex-between align-start"><div><h4>Total Events</h4><h2>{fireLogs.length}</h2></div><div className="outline-icon-box border-orange"><Flame size={20} /></div></div></div>
        <div className="stat-card"><div className="flex-between align-start"><div><h4>Resolved Events</h4><h2>{resolvedFireAlerts.length}</h2></div><div className="outline-icon-box border-green"><ShieldAlert size={20} /></div></div></div>
        <div className="stat-card"><div className="flex-between align-start"><div><h4>Monitoring Cameras</h4><h2>{activeFireCamsCount}</h2></div><div className="outline-icon-box border-yellow"><Camera size={20} /></div></div></div>
      </div>
      {latestActiveFire ? (
        <div className="fire-alert-banner">
          <h3 className="alert-title fire-alert-title"><Flame size={20} /> Active Fire/Smoke Alert</h3>
          <div className="alert-details-grid">
            <div><div className="detail-label">Location</div><div className="detail-value">{latestActiveFire.camera_id}</div></div>
            <div><div className="detail-label">Event Type</div><div className="detail-value">{latestActiveFire.event_type}</div></div>
            <div><div className="detail-label">Detection Time</div><div className="detail-value">{latestActiveFire.timestamp}</div></div>
          </div>
          <div className="alert-actions">
            <button className="btn-notify btn-notify--flex" onClick={() => handleNotifyEmergency(latestActiveFire.camera_id)}><BellRing size={16} /> Notify Emergency Service</button>
            <button className="btn-resolve" onClick={() => handleResolveFireAlert(latestActiveFire.id)}>Mark as Resolved</button>
          </div>
        </div>
      ) : (
        <div className="fire-alert-banner fire-alert-banner--clear">
          <h3 className="alert-title fire-alert-title--clear">✅ All Clear</h3>
          <p className="fire-all-clear-msg">No active fire or smoke alerts at the moment.</p>
        </div>
      )}
      <div className="table-container card-box mt-4">
        <h3 className="mb-4">Fire & Smoke Event Logs</h3>
        <table className="data-table">
          <thead><tr><th>Event Type</th><th>Camera</th><th>Severity</th><th>Status</th><th>Timestamp</th></tr></thead>
          <tbody>
            {fireLogs.length === 0 ? (<tr><td colSpan="5" className="fire-empty-cell">No fire/smoke logs available.</td></tr>) : (
              fireLogs.map((log, index) => (
                <tr key={index}>
                  <td>{log.event_type}</td>
                  <td>{log.camera_id}</td>
                  <td className={log.severity === 'Critical' ? 'text-orange font-bold' : log.severity === 'High' ? 'text-red font-bold' : 'text-yellow font-bold'}>{log.severity}</td>
                  <td className={log.status === 'Active' ? 'text-red font-bold' : 'text-green font-bold'}>{log.status}</td>
                  <td>{log.timestamp}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default FireMonitoringTab;