import React, { useState } from 'react';
import { BellRing, Flame, ShieldAlert, User, Camera, Users, AlertTriangle, ShieldX, CheckCircle, UserSearch, Shield, Activity, ChevronLeft, ChevronRight, Lock } from 'lucide-react';
import './OverviewTab.css';

const ALERTS_PER_PAGE = 10;

const OverviewTab = ({
  patientsCount,
  pendingAlertsCount,
  highPriorityCount,
  deniedAccessCount,
  pendingSystemAlerts = [],
  handleResolveSystemAlert,
  cameraAiConfigs = {},
  cameraIps = {},
  isEmergencyLockdown = false
}) => {

  const [alertPage, setAlertPage] = useState(0);

  // Derive which cameras are active for each AI module (online cameras only)
  const getCamerasForModule = (moduleKey) => {
    return [1, 2, 3, 4, 5].filter(
      (cam) => cameraAiConfigs[cam]?.[moduleKey] === true && cameraIps && cameraIps[String(cam)]
    );
  };

  const patientCams = getCamerasForModule('patient');
  const maskCams = getCamerasForModule('mask');
  const fireCams = getCamerasForModule('fire');

  const aiModules = [
    {
      key: 'patient',
      label: 'Patient Identification',
      desc: 'Tracks registered patients across zones and detects wandering into unauthorized areas.',
      Icon: UserSearch,
      activeCams: patientCams,
      color: '#0D6EFD',
      colorBg: '#eff6ff',
      colorBorder: '#bfdbfe',
      colorMuted: '#93c5fd',
      badgeClass: 'ai-module-badge--blue',
      cardClass: 'ai-module-card--blue',
      nameClass: 'ai-module-name--blue',
    },
    {
      key: 'mask',
      label: 'Mask Detection',
      desc: 'Monitors PPE compliance and flags personnel who enter zones without proper face coverings.',
      Icon: Shield,
      activeCams: maskCams,
      color: '#10b981',
      colorBg: '#f0fdf4',
      colorBorder: '#a7f3d0',
      colorMuted: '#6ee7b7',
      badgeClass: 'ai-module-badge--green',
      cardClass: 'ai-module-card--green',
      nameClass: 'ai-module-name--green',
    },
    {
      key: 'fire',
      label: 'Fire Detection',
      desc: 'Real-time flame and smoke analysis with immediate alert dispatch on detection.',
      Icon: Flame,
      activeCams: fireCams,
      color: '#ef4444',
      colorBg: '#fff1f2',
      colorBorder: '#fecaca',
      colorMuted: '#fca5a5',
      badgeClass: 'ai-module-badge--red',
      cardClass: 'ai-module-card--red',
      nameClass: 'ai-module-name--red',
    },
  ];

  const getPriorityClass = (priority) => {
    if (priority === 'High') return 'priority-badge priority-high';
    if (priority === 'Medium') return 'priority-badge priority-medium';
    return 'priority-badge priority-low';
  };

  const stats = [
    {
      label: 'Total Cameras',
      value: 9,
      sub: 'Optimized Nodes',
      icon: <Camera size={20} color="#0D6EFD" />,
      iconBg: '#eff6ff',
      accent: '#0D6EFD',
    },
    {
      label: 'Registered Patients',
      value: patientsCount,
      sub: 'Total Base',
      icon: <Users size={20} color="#10b981" />,
      iconBg: '#f0fdf4',
      accent: '#10b981',
    },
    {
      label: "Today's Alerts",
      value: pendingAlertsCount,
      sub: `${highPriorityCount} critical`,
      icon: <AlertTriangle size={20} color="#f97316" />,
      iconBg: '#fff7ed',
      accent: '#f97316',
    },
    {
      label: 'Mask Violations',
      value: deniedAccessCount,
      sub: 'From access control',
      icon: <ShieldX size={20} color="#ef4444" />,
      iconBg: '#fff1f2',
      accent: '#ef4444',
    },
  ];

  // Helper to determine active cameras count for the header badge
  const getTotalActiveCameras = () => {
    if (isEmergencyLockdown) {
      // In lockdown, only count cameras running Fire Detection
      return new Set([...fireCams]).size;
    }
    return new Set([...patientCams, ...maskCams, ...fireCams]).size;
  };

  const totalActiveCamsCount = getTotalActiveCameras();

  return (
    <>
      <div className="header">
        <h1>Dashboard Overview</h1>
        <p>Real-time hospital monitoring and security status</p>
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

      {/* ── AI Models Status (read-only) ── */}
      <div className="card-box ai-status-card">
        <div className="ai-status-header">

          <div className="ai-status-header-inner">
            <div className="ai-status-icon-box">
              <Activity size={20} />
            </div>
            <div className="ai-status-text-group">
              <h3 className="ai-status-heading-lg">
                AI Models Status
              </h3>
              <p className="ai-status-subtext">
                Live view — manage AI modules from Live CCTV Feeds
              </p>
            </div>
          </div>

          <span className={`ai-status-badge ${isEmergencyLockdown ? 'emergency-badge' : ''}`} style={isEmergencyLockdown ? { backgroundColor: '#fee2e2', color: '#ef4444', borderColor: '#fca5a5' } : {}}>
            {totalActiveCamsCount > 0
              ? `${totalActiveCamsCount} Camera(s) Active`
              : 'All Modules Off'}
          </span>
        </div>

        <div className="ai-status-grid">
          {aiModules.map((mod) => {
            // Check if this module is disabled due to lockdown
            const isPausedByLockdown = isEmergencyLockdown && mod.key !== 'fire';
            const isOn = mod.activeCams.length > 0 && !isPausedByLockdown;
            const isIdle = mod.activeCams.length === 0 && !isPausedByLockdown;

            return (
              <div
                key={mod.key}
                className={`ai-status-module-card ${isOn ? 'ai-status-module-card--on' : isPausedByLockdown ? 'ai-status-module-card--locked' : 'ai-status-module-card--off'}`}
                style={isOn ? {
                  background: `linear-gradient(135deg, ${mod.colorBg} 0%, #ffffff 100%)`,
                  borderColor: mod.colorBorder,
                  boxShadow: `0 2px 12px ${mod.colorBorder}88`,
                } : isPausedByLockdown ? {
                  background: '#f8fafc',
                  borderColor: '#cbd5e1',
                } : {}}
              >
                {/* Icon + status badge row */}
                <div className="ai-status-module-top">
                  <div
                    className="ai-status-module-icon"
                    style={isOn
                      ? { backgroundColor: mod.color, color: '#fff' }
                      : isPausedByLockdown
                        ? { backgroundColor: '#e2e8f0', color: '#94a3b8' }
                        : { backgroundColor: '#f1f5f9', color: '#94a3b8' }}
                  >
                    {isPausedByLockdown ? <Lock size={20} /> : <mod.Icon size={20} />}
                  </div>

                  <span
                    className={`ai-status-pill ${isOn ? 'ai-status-pill--on' : isPausedByLockdown ? 'ai-status-pill--locked' : 'ai-status-pill--off'}`}
                    style={
                      isOn
                        ? { backgroundColor: `${mod.color}1a`, color: mod.color, borderColor: `${mod.color}40` }
                        : isPausedByLockdown
                          ? { backgroundColor: '#fee2e2', color: '#ef4444', borderColor: '#fca5a5' }
                          : {}
                    }
                  >
                    {!isPausedByLockdown && (
                      <span
                        className="ai-status-dot"
                        style={isOn ? { backgroundColor: mod.color } : {}}
                      />
                    )}
                    {isOn ? 'Running' : isPausedByLockdown ? 'Paused (Lockdown)' : 'OFF'}
                  </span>
                </div>

                {/* Module name */}
                <h4
                  className="ai-status-module-name"
                  style={{ color: isOn ? mod.color : '#94a3b8' }}
                >
                  {mod.label}
                </h4>

                {/* Description */}
                <p className="ai-status-module-desc">{mod.desc}</p>

                {/* Active camera chips OR idle/locked message */}
                {isOn ? (
                  <div className="ai-status-cam-chips">
                    {mod.activeCams.map((camId) => (
                      <span
                        key={camId}
                        className="ai-status-cam-chip"
                        style={{ backgroundColor: `${mod.color}15`, color: mod.color, borderColor: `${mod.color}30` }}
                      >
                        <Camera size={11} />
                        Cam 0{camId}
                      </span>
                    ))}
                  </div>
                ) : isPausedByLockdown ? (
                  <div className="ai-status-idle">
                    <span className="ai-status-idle-text ai-status-idle-text--lockdown">Auto-disabled during fire emergency</span>
                  </div>
                ) : (
                  <div className="ai-status-idle">
                    <span className="ai-status-idle-text">Not active on any camera</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Alert notifications feed — paginated */}
      {(() => {
        const totalAlertPages = Math.max(1, Math.ceil(pendingSystemAlerts.length / ALERTS_PER_PAGE));
        const safePage = Math.min(alertPage, totalAlertPages - 1);
        const pageAlerts = pendingSystemAlerts.slice(safePage * ALERTS_PER_PAGE, (safePage + 1) * ALERTS_PER_PAGE);
        const startRow = pendingSystemAlerts.length === 0 ? 0 : safePage * ALERTS_PER_PAGE + 1;
        const endRow = Math.min((safePage + 1) * ALERTS_PER_PAGE, pendingSystemAlerts.length);

        const getPageNums = () => {
          if (totalAlertPages <= 5) return Array.from({ length: totalAlertPages }, (_, i) => i);
          if (safePage <= 2) return [0, 1, 2, 3, 4];
          if (safePage >= totalAlertPages - 3) return [totalAlertPages - 5, totalAlertPages - 4, totalAlertPages - 3, totalAlertPages - 2, totalAlertPages - 1];
          return [safePage - 2, safePage - 1, safePage, safePage + 1, safePage + 2];
        };

        return (
          <div className="card-box alert-feed-table-card">
            <div className="alert-feed-table-header">
              <div className="alert-feed-table-title">
                <div className="feed-section-icon-wrap">
                  <BellRing size={17} color="#ef4444" />
                </div>
                <div>
                  <h3 className="feed-section-heading">Alert Notifications Feed</h3>
                  <p className="feed-section-subtitle">Live pending alerts</p>
                </div>
              </div>
              <div className="alert-feed-header-right">
                {pendingSystemAlerts.length > 0 && (
                  <span className="alert-pag-info">
                    {startRow}–{endRow} of {pendingSystemAlerts.length}
                  </span>
                )}
                <span className="alert-feed-badge">{pendingSystemAlerts.length} Pending</span>
              </div>
            </div>

            {pendingSystemAlerts.length === 0 ? (
              <div className="alert-feed-empty">
                <div className="alert-feed-empty-icon">
                  <CheckCircle size={32} color="#10b981" />
                </div>
                <p>No pending alerts. All systems are secure.</p>
              </div>
            ) : (
              <>
                <div className="alert-list">
                  {pageAlerts.map((alert) => (
                    <div className="alert-feed-item" key={alert.id}>
                      <div className={`alert-icon-box ${alert.alert_type === 'Fire' ? 'bg-fire' :
                        alert.alert_type.startsWith('Patient Wandering') ? 'bg-patient' :
                          'bg-mask'
                        }`}>
                        {alert.alert_type === 'Fire' && <Flame size={20} color="#ffffff" />}
                        {alert.alert_type.startsWith('Patient Wandering') && <User size={20} color="#ffffff" />}
                        {alert.alert_type === 'Mask Violation' && <ShieldAlert size={20} color="#ffffff" />}
                      </div>

                      <div className="alert-details">
                        <div className="alert-feed-row-top">
                          <h4 className="alert-item-title">{alert.alert_type}</h4>
                          {!alert.alert_type.startsWith('Patient Wandering') && alert.alert_type !== 'Mask Violation' && (
                            <span className={getPriorityClass(alert.priority)}>
                              {alert.priority || 'Low'}
                            </span>
                          )}
                        </div>
                        <p className="alert-item-desc">{alert.description}</p>
                        <p className="alert-item-meta">
                          Camera {alert.camera_id}&nbsp;&nbsp;|&nbsp;&nbsp;{alert.timestamp}
                        </p>
                      </div>

                      <button
                        className="btn-resolve-green"
                        onClick={() => handleResolveSystemAlert && handleResolveSystemAlert(alert.id)}
                      >
                        Noted
                      </button>
                    </div>
                  ))}
                </div>

                {/* Pagination bar */}
                <div className="pag-bar">
                  <button
                    className={`pag-btn pag-btn--nav ${safePage === 0 ? 'pag-btn--disabled' : ''}`}
                    onClick={() => setAlertPage(p => Math.max(0, p - 1))}
                    disabled={safePage === 0}
                  >
                    <ChevronLeft size={16} /> Previous
                  </button>

                  <div className="pag-pages">
                    {getPageNums().map((n) => (
                      <button
                        key={n}
                        className={`pag-btn pag-btn--num ${n === safePage ? 'pag-btn--active' : ''}`}
                        onClick={() => setAlertPage(n)}
                      >
                        {n + 1}
                      </button>
                    ))}
                  </div>

                  <button
                    className={`pag-btn pag-btn--nav ${safePage === totalAlertPages - 1 ? 'pag-btn--disabled' : ''}`}
                    onClick={() => setAlertPage(p => Math.min(totalAlertPages - 1, p + 1))}
                    disabled={safePage === totalAlertPages - 1}
                  >
                    Next <ChevronRight size={16} />
                  </button>
                </div>
              </>
            )}
          </div>
        );
      })()}
    </>
  );
};

export default OverviewTab;