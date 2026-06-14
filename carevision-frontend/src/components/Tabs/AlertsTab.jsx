import React, { useState } from 'react';
import { Flame, ShieldAlert, User, BellRing, CheckCircle, Clock } from 'lucide-react';
import './AlertsTab.css';
import './OverviewTab.css';

const AlertsTab = ({ totalSystemAlerts, highPrioritySystemAlertsCount, pendingSystemAlerts, resolvedSystemAlertsCount, handleResolveSystemAlert }) => {
  const [activeView, setActiveView] = useState('feed'); // 'feed' | 'all'

  const allAlerts = [
    ...(pendingSystemAlerts || []),
  ];

  const getTypeIcon = (type) => {
    if (type === 'Fire') return <Flame size={16} />;
    if (type === 'Patient Wandering') return <User size={16} />;
    return <ShieldAlert size={16} />;
  };

  const getPriorityClass = (priority) => {
    if (priority === 'High') return 'priority-badge priority-high';
    if (priority === 'Medium') return 'priority-badge priority-medium';
    return 'priority-badge priority-low';
  };

  return (
    <div className="alerts-wrapper">
      <div className="header">
        <h1>Alert Management</h1>
        <p>Monitor and manage system alerts and notifications</p>
      </div>

      {/* Stats Row */}
      <div className="stats-grid">
        <div className="stat-card">
          <h4>Total Alerts</h4>
          <h2>{totalSystemAlerts}</h2>
          <p className="stat-sub">All time</p>
        </div>
        <div className="stat-card">
          <h4>High Priority</h4>
          <h2 className="text-red">{highPrioritySystemAlertsCount}</h2>
          <p className="stat-sub">Needs immediate action</p>
        </div>
        <div className="stat-card">
          <h4>Pending</h4>
          <h2 className="text-orange">{pendingSystemAlerts.length}</h2>
          <p className="stat-sub">Awaiting resolution</p>
        </div>
        <div className="stat-card">
          <h4>Resolved</h4>
          <h2 className="text-green">{resolvedSystemAlertsCount}</h2>
          <p className="stat-sub">Cleared</p>
        </div>
      </div>

      {/* Alert Feed Card */}
      <div className="table-container card-box mt-4">
        <div className="alerts-tab-header">
          <div className="alerts-tab-title">
            <BellRing size={18} color="#ef4444" />
            <h3 className="alert-feed-header">Alert Notifications Feed</h3>
          </div>
          <div className="alerts-view-toggle">
            <button
              className={`toggle-btn ${activeView === 'feed' ? 'toggle-btn--active' : ''}`}
              onClick={() => setActiveView('feed')}
            >
              <Clock size={14} /> Pending
            </button>
            <button
              className={`toggle-btn ${activeView === 'all' ? 'toggle-btn--active' : ''}`}
              onClick={() => setActiveView('all')}
            >
              <CheckCircle size={14} /> All Alerts Table
            </button>
          </div>
        </div>

        {/* Feed View — Card style for pending alerts */}
        {activeView === 'feed' && (
          <div className="alert-list">
            {pendingSystemAlerts.length === 0 ? (
              <div className="alerts-empty-state">
                <div style={{ fontSize: '40px', marginBottom: '10px' }}>✅</div>
                <p className="alerts-empty-msg">No pending alerts. Everything is secure.</p>
              </div>
            ) : (
              pendingSystemAlerts.map((alert) => (
                <div className="alert-feed-item" key={alert.id}>
                  <div className={`alert-icon-box ${alert.alert_type === 'Fire' ? 'bg-fire' : alert.alert_type === 'Patient Wandering' ? 'bg-patient' : 'bg-mask'}`}>
                    {alert.alert_type === 'Fire' && <Flame size={20} color="white" />}
                    {alert.alert_type === 'Patient Wandering' && <User size={20} color="white" />}
                    {alert.alert_type === 'Mask Violation' && <ShieldAlert size={20} color="white" />}
                  </div>
                  <div className="alert-details">
                    <div className="alert-feed-row-top">
                      <h4 className="alert-item-title">{alert.alert_type}</h4>
                      <span className={getPriorityClass(alert.priority)}>{alert.priority || 'Low'}</span>
                    </div>
                    <p className="alert-item-desc">{alert.description}</p>
                    <p className="alert-item-meta">
                      📷 Camera {alert.camera_id} &nbsp;|&nbsp; 🕐 {alert.timestamp}
                    </p>
                  </div>
                  <button className="btn-resolve-green" onClick={() => handleResolveSystemAlert(alert.id)}>
                    ✓ Resolve
                  </button>
                </div>
              ))
            )}
          </div>
        )}

        {/* Table View — All alerts */}
        {activeView === 'all' && (
          <div className="alert-table-scroll">
            {(totalSystemAlerts === 0) ? (
              <div className="alerts-empty-state">
                <div style={{ fontSize: '40px', marginBottom: '10px' }}>📭</div>
                <p className="alerts-empty-msg">No alerts have been recorded yet.</p>
              </div>
            ) : (
              <table className="data-table alert-feed-data-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Date &amp; Time</th>
                    <th>Type</th>
                    <th>Description</th>
                    <th>Camera</th>
                    <th>Priority</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {pendingSystemAlerts.slice().reverse().map((alert, idx) => (
                    <tr key={alert.id} className="row-pending">
                      <td>{idx + 1}</td>
                      <td className="alert-table-date">{alert.timestamp || '—'}</td>
                      <td>
                        <span className="alert-type-cell">
                          {getTypeIcon(alert.alert_type)} {alert.alert_type}
                        </span>
                      </td>
                      <td className="alert-table-desc">{alert.description || '—'}</td>
                      <td>Cam {alert.camera_id || '—'}</td>
                      <td><span className={getPriorityClass(alert.priority)}>{alert.priority || 'Low'}</span></td>
                      <td><span className="status-badge status-pending">Pending</span></td>
                      <td>
                        <button
                          className="btn-resolve-sm"
                          onClick={() => handleResolveSystemAlert(alert.id)}
                        >
                          Resolve
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AlertsTab;