import React from 'react';
import { Flame, ShieldAlert, User } from 'lucide-react';

const AlertsTab = ({ totalSystemAlerts, highPrioritySystemAlertsCount, pendingSystemAlerts, resolvedSystemAlertsCount, handleResolveSystemAlert }) => {
  return (
    <div className="alerts-wrapper">
      <div className="header"><h1>Alert Management</h1><p>Monitor and manage system alerts and notifications</p></div>
      <div className="stats-grid">
        <div className="stat-card"><h4>Total Alerts</h4><h2>{totalSystemAlerts}</h2></div>
        <div className="stat-card"><h4>High Priority</h4><h2 className="text-red">{highPrioritySystemAlertsCount}</h2></div>
        <div className="stat-card"><h4>Pending</h4><h2 className="text-orange">{pendingSystemAlerts.length}</h2></div>
        <div className="stat-card"><h4>Resolved</h4><h2 className="text-green">{resolvedSystemAlertsCount}</h2></div>
      </div>
      <div className="table-container card-box mt-4">
        <h3 style={{marginBottom: '5px'}}>Alert Feed</h3>
        <div className="alert-list">
          {pendingSystemAlerts.length === 0 ? (<p style={{textAlign: 'center', padding: '20px', color: '#666'}}>No pending alerts. Everything is secure. ✅</p>) : (
            pendingSystemAlerts.map((alert) => (
              <div className="alert-feed-item" key={alert.id}>
                <div className="alert-icon-box bg-red">{alert.alert_type === 'Fire' && <Flame size={20} color="white" />}{alert.alert_type === 'Patient Wandering' && <User size={20} color="white" />}{alert.alert_type === 'Mask Violation' && <ShieldAlert size={20} color="white" />}</div>
                <div className="alert-details"><h4 className="alert-item-title">{alert.alert_type}</h4><p className="alert-item-desc">{alert.description}</p><p className="alert-item-meta">Camera: {alert.camera_id} | {alert.timestamp}</p></div>
                <button className="btn-resolve-green" onClick={() => handleResolveSystemAlert(alert.id)}>Mark as Resolved</button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
export default AlertsTab;