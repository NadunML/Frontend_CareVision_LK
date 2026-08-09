import React, { useState } from 'react';
import { AlertTriangle, Flame, Camera, BellRing, CheckCircle, ShieldCheck, ChevronLeft, ChevronRight } from 'lucide-react';
import './FireMonitoringTab.css';

const ROWS_PER_PAGE = 10;

const FireMonitoringTab = ({
  activeFireAlerts,
  fireLogs,
  resolvedFireAlerts,
  activeFireCamsCount,
  latestActiveFire,
  handleNotifyEmergency,
  handleResolveFireAlert,
}) => {
  const [currentPage, setCurrentPage] = useState(0);

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

  // Pagination calculations
  const totalPages     = Math.max(1, Math.ceil(fireLogs.length / ROWS_PER_PAGE));
  const safePage       = Math.min(currentPage, totalPages - 1);
  const paginatedLogs  = fireLogs.slice(safePage * ROWS_PER_PAGE, (safePage + 1) * ROWS_PER_PAGE);

  const handleNext = () => { if (safePage < totalPages - 1) setCurrentPage(p => p + 1); };
  const handlePrev = () => { if (safePage > 0) setCurrentPage(p => p - 1); };
  const handlePage = (n) => setCurrentPage(n);

  const getPageNumbers = () => {
    if (totalPages <= 5) return Array.from({ length: totalPages }, (_, i) => i);
    if (safePage <= 2) return [0, 1, 2, 3, 4];
    if (safePage >= totalPages - 3) return [totalPages - 5, totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1];
    return [safePage - 2, safePage - 1, safePage, safePage + 1, safePage + 2];
  };

  const startRow = fireLogs.length === 0 ? 0 : safePage * ROWS_PER_PAGE + 1;
  const endRow   = Math.min((safePage + 1) * ROWS_PER_PAGE, fireLogs.length);

  return (
    <div className="fire-wrapper">
      <div className="header">
        <h1>Fire Detection</h1>
        <p>Real-time fire monitoring system</p>
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
            <Flame size={20} /> Active Fire Alert
          </h3>
          <div className="alert-details-grid">
            <div>
              <div className="detail-label">Location</div>
              <div className="detail-value">{latestActiveFire.camera_id}</div>
            </div>
            <div>
              <div className="detail-label">Event Type</div>
              <div className="detail-value">Fire Alert</div>
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
          <p className="fire-all-clear-msg">No active fire alerts at the moment.</p>
        </div>
      )}

      {/* Event log table */}
      <div className="table-container card-box mt-4">
        <div className="pag-table-topbar">
          <h3>Fire Event Logs</h3>
          <span className="pag-record-info">
            {fireLogs.length === 0
              ? 'No records'
              : `Showing ${startRow}\u2013${endRow} of ${fireLogs.length} records`}
          </span>
        </div>

        <table className="data-table">
          <thead>
            <tr>
              <th>Event Type</th>
              <th>Camera</th>
              <th>Status</th>
              <th>Timestamp</th>
            </tr>
          </thead>
          <tbody>
            {fireLogs.length === 0 ? (
              <tr>
                <td colSpan="4" className="fire-empty-cell">No fire logs available.</td>
              </tr>
            ) : (
              paginatedLogs.map((log, index) => (
                <tr key={index}>
                  <td className="font-semibold text-red-500">Fire Detected</td>
                  <td>{log.camera_id}</td>
                  <td className={log.status === 'Active' ? 'text-red font-bold' : 'text-green font-bold'}>
                    {log.status}
                  </td>
                  <td>{log.timestamp}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* Pagination controls */}
        <div className="pag-bar">
          <button
            className={`pag-btn pag-btn--nav ${safePage === 0 ? 'pag-btn--disabled' : ''}`}
            onClick={handlePrev}
            disabled={safePage === 0}
          >
            <ChevronLeft size={16} /> Previous
          </button>

          <div className="pag-pages">
            {getPageNumbers().map((n) => (
              <button
                key={n}
                className={`pag-btn pag-btn--num ${n === safePage ? 'pag-btn--active' : ''}`}
                onClick={() => handlePage(n)}
              >
                {n + 1}
              </button>
            ))}
          </div>

          <button
            className={`pag-btn pag-btn--nav ${safePage === totalPages - 1 ? 'pag-btn--disabled' : ''}`}
            onClick={handleNext}
            disabled={safePage === totalPages - 1}
          >
            Next <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default FireMonitoringTab;