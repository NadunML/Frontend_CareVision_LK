import React, { useState } from 'react';
import {
  Flame, ShieldAlert, User, BellRing, CheckCircle, Clock,
  AlertTriangle, Activity, TrendingUp, Inbox
} from 'lucide-react';
import './AlertsTab.css';
import './OverviewTab.css';

const AlertsTab = ({
  totalSystemAlerts,
  highPrioritySystemAlertsCount,
  pendingSystemAlerts,
  resolvedSystemAlertsCount,
  handleResolveSystemAlert,
}) => {
  const [activeView, setActiveView] = useState('feed');

  const getTypeIcon = (type) => {
    if (type === 'Fire')              return <Flame      size={16} />;
    if (type === 'Patient Wandering') return <User       size={16} />;
    return                                   <ShieldAlert size={16} />;
  };

  const getPriorityClass = (priority) => {
    if (priority === 'High')   return 'priority-badge priority-high';
    if (priority === 'Medium') return 'priority-badge priority-medium';
    return 'priority-badge priority-low';
  };

  const stats = [
    {
      label: 'Total Alerts',
      value: totalSystemAlerts ?? 0,
      sub: 'All time',
      icon: <Activity size={20} color="#0D6EFD" />,
      iconBg: '#eff6ff',
      accent: '#0D6EFD',
    },
    {
      label: 'High Priority',
      value: highPrioritySystemAlertsCount ?? 0,
      sub: 'Immediate action needed',
      icon: <AlertTriangle size={20} color="#ef4444" />,
      iconBg: '#fff1f2',
      accent: '#ef4444',
    },
    {
      label: 'Pending',
      value: (pendingSystemAlerts || []).length,
      sub: 'Awaiting resolution',
      icon: <Clock size={20} color="#f97316" />,
      iconBg: '#fff7ed',
      accent: '#f97316',
    },
    {
      label: 'Resolved',
      value: resolvedSystemAlertsCount ?? 0,
      sub: 'Successfully cleared',
      icon: <CheckCircle size={20} color="#10b981" />,
      iconBg: '#f0fdf4',
      accent: '#10b981',
    },
  ];

  return (
    <div className="alerts-wrapper">

      <div className="header">
        <h1>Alert Management</h1>
        <p>Monitor and manage system alerts and notifications in real time</p>
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
            <p className="stat-sub">{s.sub}</p>
          </div>
        ))}
      </div>

      {/* Alert feed card */}
      <div className="table-container card-box mt-4">

        {/* Card header with toggle buttons */}
        <div className="alerts-tab-header">
          <div className="alerts-tab-title">
            <div className="feed-section-icon-wrap">
              <BellRing size={18} color="#ef4444" />
            </div>
            <div>
              <h3 className="alert-feed-header">Alert Notifications Feed</h3>
              <p className="feed-section-subtitle">
                {(pendingSystemAlerts || []).length} pending alert{(pendingSystemAlerts || []).length !== 1 ? 's' : ''}
              </p>
            </div>
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
              <TrendingUp size={14} /> All Alerts
            </button>
          </div>
        </div>

        {/* Feed view — pending alert cards */}
        {activeView === 'feed' && (
          <div className="alert-list">
            {(pendingSystemAlerts || []).length === 0 ? (
              <div className="alerts-empty-state">
                <CheckCircle size={44} color="#10b981" className="alerts-empty-icon-svg" />
                <p className="empty-state-title">All Clear!</p>
                <p className="alerts-empty-msg">No pending alerts. System is operating normally.</p>
              </div>
            ) : (
              pendingSystemAlerts.map((alert) => (
                <div className="alert-feed-item" key={alert.id}>

                  <div className={`alert-icon-box ${
                    alert.alert_type === 'Fire'              ? 'bg-fire'    :
                    alert.alert_type === 'Patient Wandering' ? 'bg-patient' :
                    'bg-mask'
                  }`}>
                    {alert.alert_type === 'Fire'              && <Flame       size={20} color="#ffffff" />}
                    {alert.alert_type === 'Patient Wandering' && <User        size={20} color="#ffffff" />}
                    {alert.alert_type === 'Mask Violation'    && <ShieldAlert  size={20} color="#ffffff" />}
                  </div>

                  <div className="alert-details">
                    <div className="alert-feed-row-top">
                      <h4 className="alert-item-title">{alert.alert_type}</h4>
                      <span className={getPriorityClass(alert.priority)}>
                        {alert.priority || 'Low'}
                      </span>
                    </div>
                    <p className="alert-item-desc">{alert.description}</p>
                    <p className="alert-item-meta">
                      Camera {alert.camera_id}&nbsp;|&nbsp;{alert.timestamp}
                    </p>
                  </div>

                  <button
                    className="btn-resolve-green"
                    onClick={() => handleResolveSystemAlert(alert.id)}
                  >
                    Resolve
                  </button>
                </div>
              ))
            )}
          </div>
        )}

        {/* Table view — all alerts */}
        {activeView === 'all' && (
          <div className="alert-table-scroll">
            {totalSystemAlerts === 0 ? (
              <div className="alerts-empty-state">
                <Inbox size={40} color="#cbd5e1" className="alerts-empty-icon-svg" />
                <p className="empty-state-title">No Records Yet</p>
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
                  {(pendingSystemAlerts || []).slice().reverse().map((alert, idx) => (
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