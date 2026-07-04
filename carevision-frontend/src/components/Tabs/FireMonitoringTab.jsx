import React from 'react';
import { AlertTriangle, Flame, Camera, BellRing, CheckCircle, ShieldCheck } from 'lucide-react';
import './FireMonitoringTab.css';

const FireMonitoringTab = ({
  activeFireAlerts,
  fireLogs,
  resolvedFireAlerts,
  activeFireCamsCount,
  latestActiveFire,
  handleNotifyEmergency,
  handleResolveFireAlert,
}) => {

  const stats = [
    {
      label: 'Active Alerts',
      value: activeFireAlerts.length,
      icon: <AlertTriangle size={20} color="#ef4444" />,
      iconBg: '#fff1f2',
      accent: '#ef4444',
    },
    {
      label: 'Total Events',
      value: fireLogs.length,
      icon: <Flame size={20} color="#f97316" />,
      iconBg: '#fff7ed',
      accent: '#f97316',
    },
    {
      label: 'Resolved Events',
      value: resolvedFireAlerts.length,
      icon: <ShieldCheck size={20} color="#10b981" />,
      iconBg: '#f0fdf4',
      accent: '#10b981',
    },
    {
      label: 'Monitoring Cameras',
      value: activeFireCamsCount,
      icon: <Camera size={20} color="#f59e0b" />,
      iconBg: '#fffbeb',
      accent: '#f59e0b',
    },
  ];

  return (
    <div className="fire-wrapper">
      <div className="header">
        <h1>Fire &amp; Smoke Detection</h1>
        <p>Real-time fire and smoke monitoring system</p>
      </div>

      {/* Stat summary row */}
      <div className="stats-grid">
        {stats.map((s, i) => (
          <div
            className="stat-card"
            key={i}
            style={{ '--icon-bg': s.iconBg, '--stat-accent': s.accent }}
          >
            <div className="stat-card-icon-corner">{s.icon}</div>
            <h4 className="stat-card-label">{s.label}</h4>
            <h2 className="stat-card-value">{s.value}</h2>
          </div>
        ))}
      </div>

      {/* Active alert banner or all-clear state */}
      {latestActiveFire ? (
        <div className="fire-alert-banner">
          <h3 className="alert-title fire-alert-title">
            <Flame size={20} /> Active Fire/Smoke Alert
          </h3>
          <div className="alert-details-grid">
            <div>
              <div className="detail-label">Location</div>
              <div className="detail-value">{latestActiveFire.camera_id}</div>
            </div>
            <div>
              <div className="detail-label">Event Type</div>
              <div className="detail-value">{latestActiveFire.event_type}</div>
            </div>
            <div>
              <div className="detail-label">Detection Time</div>
              <div className="detail-value">{latestActiveFire.timestamp}</div>
            </div>
          </div>
          <div className="alert-actions">
            <button
              className="btn-notify btn-notify--flex"
              onClick={() => handleNotifyEmergency(latestActiveFire.camera_id)}
            >
              <BellRing size={16} /> Notify Emergency Service
            </button>
            <button className="btn-resolve" onClick={() => handleResolveFireAlert(latestActiveFire.id)}>
              Mark as Resolved
            </button>
          </div>
        </div>
      ) : (
        <div className="fire-alert-banner fire-alert-banner--clear">
          <h3 className="alert-title fire-alert-title--clear">
            <CheckCircle size={20} color="#059669" /> All Clear
          </h3>
          <p className="fire-all-clear-msg">No active fire or smoke alerts at the moment.</p>
        </div>
      )}

      {/* Event log table */}
      <div className="table-container card-box mt-4">
        <h3 className="mb-4">Fire &amp; Smoke Event Logs</h3>
        <table className="data-table">
          <thead>
            <tr>
              <th>Event Type</th>
              <th>Camera</th>
              <th>Severity</th>
              <th>Status</th>
              <th>Timestamp</th>
            </tr>
          </thead>
          <tbody>
            {fireLogs.length === 0 ? (
              <tr>
                <td colSpan="5" className="fire-empty-cell">No fire/smoke logs available.</td>
              </tr>
            ) : (
              fireLogs.map((log, index) => (
                <tr key={index}>
                  <td>{log.event_type}</td>
                  <td>{log.camera_id}</td>
                  <td className={
                    log.severity === 'Critical' ? 'text-orange font-bold' :
                    log.severity === 'High'     ? 'text-red font-bold'    :
                    'text-yellow font-bold'
                  }>
                    {log.severity}
                  </td>
                  <td className={log.status === 'Active' ? 'text-red font-bold' : 'text-green font-bold'}>
                    {log.status}
                  </td>
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