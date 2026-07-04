import React, { useState } from 'react';
import { Users, AlertTriangle, Camera, ChevronLeft, ChevronRight, ShieldCheck } from 'lucide-react';
import './MaskDetectionTab.css';

const ROWS_PER_PAGE = 10;

const MaskDetectionTab = ({ totalAccess, grantedAccess, deniedAccess, activeCamCount, accessLogs }) => {
  const [currentPage, setCurrentPage] = useState(0);

  const totalPages = Math.max(1, Math.ceil(accessLogs.length / ROWS_PER_PAGE));
  const displayedLogs = accessLogs.slice(currentPage * ROWS_PER_PAGE, (currentPage + 1) * ROWS_PER_PAGE);

  const handleNext = () => { if (currentPage < totalPages - 1) setCurrentPage(p => p + 1); };
  const handlePrev = () => { if (currentPage > 0) setCurrentPage(p => p - 1); };
  const handlePage = (n) => setCurrentPage(n);

  const getPageNumbers = () => {
    if (totalPages <= 5) return Array.from({ length: totalPages }, (_, i) => i);
    if (currentPage <= 2) return [0, 1, 2, 3, 4];
    if (currentPage >= totalPages - 3) return [totalPages - 5, totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1];
    return [currentPage - 2, currentPage - 1, currentPage, currentPage + 1, currentPage + 2];
  };

  const startRow = accessLogs.length === 0 ? 0 : currentPage * ROWS_PER_PAGE + 1;
  const endRow   = Math.min((currentPage + 1) * ROWS_PER_PAGE, accessLogs.length);

  const stats = [
    {
      label: 'Total Access Attempts',
      value: totalAccess > 0 ? totalAccess : 0,
      icon: <Users size={20} color="#0D6EFD" />,
      iconBg: '#eff6ff',
      accent: '#0D6EFD',
    },
    {
      label: 'Access Granted',
      value: grantedAccess,
      icon: <ShieldCheck size={20} color="#10b981" />,
      iconBg: '#f0fdf4',
      accent: '#10b981',
    },
    {
      label: 'Access Denied',
      value: deniedAccess,
      icon: <AlertTriangle size={20} color="#ef4444" />,
      iconBg: '#fff1f2',
      accent: '#ef4444',
    },
    {
      label: 'Active Cameras',
      value: activeCamCount,
      icon: <Camera size={20} color="#f59e0b" />,
      iconBg: '#fffbeb',
      accent: '#f59e0b',
    },
  ];

  return (
    <div className="access-wrapper">
      <div className="header">
        <h1>Mask Detection</h1>
        <p>Real-time PPE compliance monitoring and access control</p>
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

      <div className="table-container card-box mt-4">
        <div className="pag-table-topbar">
          <h3>Access Control Logs</h3>
          <span className="pag-record-info">
            {accessLogs.length === 0
              ? 'No records'
              : `Showing ${startRow}–${endRow} of ${accessLogs.length} records`}
          </span>
        </div>

        <div className="mask-table-wrapper">
          <table className="data-table">
            <thead className="mask-table-head">
              <tr>
                <th className="col-camera-id">Camera ID</th>
                <th className="col-mask">Mask Detected</th>
                <th className="col-access">Access Result</th>
                <th className="col-timestamp">Timestamp</th>
              </tr>
            </thead>
            <tbody>
              {displayedLogs.length === 0 ? (
                <tr><td colSpan="4" className="mask-empty-cell">No access logs available yet.</td></tr>
              ) : (
                displayedLogs.map((log, index) => (
                  <tr key={index} className="mask-row">
                    <td className="mask-td">{log.camera_id}</td>
                    <td className={`mask-td ${log.mask_detected === 'Yes' ? 'text-green font-bold' : 'text-red font-bold'}`}>{log.mask_detected}</td>
                    <td className={`mask-td ${log.access_result === 'Granted' ? 'text-green font-bold' : 'text-red font-bold'}`}>{log.access_result}</td>
                    <td className="mask-td">{log.timestamp}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination controls */}
        <div className="pag-bar">
          <button
            className={`pag-btn pag-btn--nav ${currentPage === 0 ? 'pag-btn--disabled' : ''}`}
            onClick={handlePrev}
            disabled={currentPage === 0}
          >
            <ChevronLeft size={16} /> Previous
          </button>

          <div className="pag-pages">
            {getPageNumbers().map((n) => (
              <button
                key={n}
                className={`pag-btn pag-btn--num ${n === currentPage ? 'pag-btn--active' : ''}`}
                onClick={() => handlePage(n)}
              >
                {n + 1}
              </button>
            ))}
          </div>

          <button
            className={`pag-btn pag-btn--nav ${currentPage === totalPages - 1 ? 'pag-btn--disabled' : ''}`}
            onClick={handleNext}
            disabled={currentPage === totalPages - 1}
          >
            Next <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default MaskDetectionTab;