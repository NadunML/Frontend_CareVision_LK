import React from 'react';
import { BellRing, Flame, ShieldAlert, User } from 'lucide-react';
import './OverviewTab.css';

const OverviewTab = ({
  patientsCount,
  pendingAlertsCount,
  highPriorityCount,
  deniedAccessCount,
  pendingSystemAlerts = [],
  handleResolveSystemAlert,
}) => {

  const getPriorityClass = (priority) => {
    if (priority === 'High') return 'priority-badge priority-high';
    if (priority === 'Medium') return 'priority-badge priority-medium';
    return 'priority-badge priority-low';
  };

  return (
    <>
      <div className="header">
        <h1>Dashboard Overview</h1>
        <p>Real-time hospital monitoring and security status</p>
      </div>

      {/* Stats Row */}
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


      {/* ─── Alert Notifications Feed ─── */}
      <div className="card-box alert-feed-table-card">
        <div className="alert-feed-table-header">
          <div className="alert-feed-table-title">
            <BellRing size={18} color="#ef4444" />
            <h3 className="alert-feed-header">Alert Notifications Feed</h3>
          </div>
          <span className="alert-feed-badge">{pendingSystemAlerts.length} Pending</span>
        </div>

        {pendingSystemAlerts.length === 0 ? (
          <div className="alert-feed-empty">
            <div className="alert-feed-empty-icon">✅</div>
            <p>No pending alerts. All systems are secure.</p>
          </div>
        ) : (
          <div className="alert-list">
            {pendingSystemAlerts.map((alert) => (
              <div className="alert-feed-item" key={alert.id}>
                <div className={`alert-icon-box ${
                  alert.alert_type === 'Fire' ? 'bg-fire' :
                  alert.alert_type === 'Patient Wandering' ? 'bg-patient' : 'bg-mask'
                }`}>
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
                    📷 Camera {alert.camera_id}&nbsp;&nbsp;|&nbsp;&nbsp;🕐 {alert.timestamp}
                  </p>
                </div>

                <button
                  className="btn-resolve-green"
                  onClick={() => handleResolveSystemAlert && handleResolveSystemAlert(alert.id)}
                >
                  ✓ Resolve
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default OverviewTab;
