import React, { useState } from 'react';
import { Download, ChevronLeft, ChevronRight, FileText, Flame, User, ShieldAlert, Activity } from 'lucide-react';
import './ReportsTab.css';

const ROWS_PER_PAGE = 10;

const ReportsTab = ({ reportDate, setReportDate, filteredReports, fireLogs, systemAlerts, accessLogs }) => {
  const [currentPage, setCurrentPage] = useState(0);
  const [isTodayActive, setIsTodayActive] = useState(false);

  const today = new Date();
  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

  const handleTodayToggle = () => {
    if (isTodayActive) {
      setIsTodayActive(false);
      setReportDate('');
      setCurrentPage(0);
    } else {
      setIsTodayActive(true);
      setReportDate(todayStr);
      setCurrentPage(0);
    }
  };

  const handleDateChange = (e) => {
    setReportDate(e.target.value);
    setIsTodayActive(false);
    setCurrentPage(0);
  };

  const totalPages = Math.max(1, Math.ceil(filteredReports.length / ROWS_PER_PAGE));
  const safePage   = Math.min(currentPage, totalPages - 1);
  const displayedReports = filteredReports.slice(safePage * ROWS_PER_PAGE, (safePage + 1) * ROWS_PER_PAGE);

  const handleNext = () => { if (safePage < totalPages - 1) setCurrentPage(p => p + 1); };
  const handlePrev = () => { if (safePage > 0) setCurrentPage(p => p - 1); };
  const handlePage = (n)  => setCurrentPage(n);

  const getPageNumbers = () => {
    if (totalPages <= 5) return Array.from({ length: totalPages }, (_, i) => i);
    if (safePage <= 2) return [0, 1, 2, 3, 4];
    if (safePage >= totalPages - 3) return [totalPages - 5, totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1];
    return [safePage - 2, safePage - 1, safePage, safePage + 1, safePage + 2];
  };

  const startRow = filteredReports.length === 0 ? 0 : safePage * ROWS_PER_PAGE + 1;
  const endRow   = Math.min((safePage + 1) * ROWS_PER_PAGE, filteredReports.length);

  const handleDownloadPDF = () => {
    // Silently return if no data — the UI stat cards already communicate the empty state
    if (filteredReports.length === 0) {
      return;
    }

    const dateLabel    = reportDate ? ` — ${reportDate}` : '';
    const generatedAt  = new Date().toLocaleString('en-GB');

    const rows = filteredReports.map((alert, i) => `
      <tr class="${i % 2 === 0 ? 'even' : 'odd'}">
        <td>${alert.timestamp || '—'}</td>
        <td><strong>${alert.alert_type || '—'}</strong></td>
        <td>${alert.description || '—'}</td>
        <td class="${alert.status === 'Pending' || alert.status === 'Active' ? 'status-pending' : 'status-resolved'}">
          ${alert.status || '—'}
        </td>
      </tr>`).join('');

    const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>CareVision LK — Alert Report${dateLabel}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Segoe UI', Arial, sans-serif; font-size: 13px; color: #1e293b; background: #fff; padding: 32px 40px; }
    .report-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 28px; padding-bottom: 16px; border-bottom: 2px solid #0D6EFD; }
    .report-logo { display: flex; align-items: center; gap: 10px; }
    .logo-box { width: 36px; height: 36px; background: #0D6EFD; border-radius: 8px; display: flex; align-items: center; justify-content: center; }
    .logo-box svg { width: 20px; height: 20px; }
    .brand-name { font-size: 18px; font-weight: 800; color: #0D6EFD; }
    .brand-sub  { font-size: 11px; color: #64748b; margin-top: 2px; }
    .report-meta { text-align: right; }
    .report-title { font-size: 16px; font-weight: 700; color: #1e293b; }
    .report-date  { font-size: 12px; color: #64748b; margin-top: 4px; }
    .summary-row { display: flex; gap: 16px; margin-bottom: 24px; }
    .chip { flex: 1; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 12px 16px; text-align: center; }
    .chip-num  { font-size: 22px; font-weight: 800; color: #0D6EFD; }
    .chip-label{ font-size: 11px; color: #64748b; margin-top: 2px; }
    .section-title { font-size: 14px; font-weight: 700; color: #1e293b; margin-bottom: 10px; }
    table { width: 100%; border-collapse: collapse; font-size: 12px; }
    thead tr { background: #0D6EFD; color: white; }
    thead th { padding: 10px 14px; text-align: left; font-weight: 700; letter-spacing: 0.03em; font-size: 11px; text-transform: uppercase; }
    tbody tr.even { background: #f8fafc; }
    tbody tr.odd  { background: #ffffff; }
    tbody td { padding: 9px 14px; border-bottom: 1px solid #e2e8f0; vertical-align: middle; }
    .status-pending  { color: #ea580c; font-weight: 700; }
    .status-resolved { color: #16a34a; font-weight: 700; }
    .report-footer { margin-top: 24px; padding-top: 12px; border-top: 1px solid #e2e8f0; font-size: 11px; color: #94a3b8; display: flex; justify-content: space-between; }
    @media print { body { padding: 16px 24px; } }
  </style>
</head>
<body>
  <div class="report-header">
    <div class="report-logo">
      <div class="logo-box">
        <svg viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
        </svg>
      </div>
      <div>
        <div class="brand-name">CareVision LK</div>
        <div class="brand-sub">Hospital Edge AI Security Platform</div>
      </div>
    </div>
    <div class="report-meta">
      <div class="report-title">Alert Report${dateLabel}</div>
      <div class="report-date">Generated: ${generatedAt}</div>
    </div>
  </div>
  <div class="summary-row">
    <div class="chip"><div class="chip-num">${filteredReports.length}</div><div class="chip-label">Total Alerts</div></div>
    <div class="chip"><div class="chip-num">${filteredReports.filter(a => a.status === 'Pending' || a.status === 'Active').length}</div><div class="chip-label">Pending</div></div>
    <div class="chip"><div class="chip-num">${filteredReports.filter(a => a.status === 'Resolved').length}</div><div class="chip-label">Resolved</div></div>
    <div class="chip"><div class="chip-num">${filteredReports.filter(a => a.alert_type === 'Fire').length}</div><div class="chip-label">Fire Events</div></div>
  </div>
  <div class="section-title">Alert Details — ${filteredReports.length} record${filteredReports.length !== 1 ? 's' : ''}</div>
  <table>
    <thead><tr><th>Date &amp; Time</th><th>Alert Type</th><th>Description</th><th>Status</th></tr></thead>
    <tbody>${rows}</tbody>
  </table>
  <div class="report-footer">
    <span>CareVision LK &nbsp;·&nbsp; Confidential</span>
    <span>Total ${filteredReports.length} records exported</span>
  </div>
  <script>window.onload = function() { window.print(); }</script>
</body>
</html>`;

    const printWindow = window.open('', '_blank', 'width=900,height=700');
    printWindow.document.write(html);
    printWindow.document.close();
  };

  const stats = [
    {
      label: 'Total Alerts',
      value: filteredReports.length,
      icon: <Activity size={20} color="#0D6EFD" />,
      iconBg: '#eff6ff',
      accent: '#0D6EFD',
    },
    {
      label: 'Fire Events',
      value: fireLogs.length,
      icon: <Flame size={20} color="#ef4444" />,
      iconBg: '#fff1f2',
      accent: '#ef4444',
    },
    {
      label: 'Patient Exits',
      value: systemAlerts.filter(a => a.alert_type.startsWith('Patient Wandering')).length,
      icon: <User size={20} color="#f97316" />,
      iconBg: '#fff7ed',
      accent: '#f97316',
    },
    {
      label: 'Access Logs',
      value: accessLogs.length,
      icon: <ShieldAlert size={20} color="#10b981" />,
      iconBg: '#f0fdf4',
      accent: '#10b981',
    },
  ];

  return (
    <div className="reports-wrapper">
      <div className="header">
        <h1>Reports &amp; Logs</h1>
        <p>Generate and download detailed system reports</p>
      </div>

      {/* Date filter card */}
      <div className="reports-filter-card card-box">
        <div className="filter-group">
          <label>Select Date</label>
          <div className="date-input-row">
            <input
              type="date"
              className="form-input"
              value={reportDate}
              onChange={handleDateChange}
            />
            <button
              className={`date-quick-btn${isTodayActive ? ' date-quick-btn--active' : ''}`}
              onClick={handleTodayToggle}
              title={isTodayActive ? 'Click to show all records' : 'Click to filter by today'}
            >
              {isTodayActive ? 'Today (active)' : 'Today'}
            </button>
          </div>
        </div>
        <div className="filter-action">
          <button className="btn-download-pdf btn-download-pdf--flex" onClick={handleDownloadPDF}>
            <Download size={16} /> Download PDF
          </button>
        </div>
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

      {/* Paginated alert log table */}
      <div className="table-container card-box mt-4">
        <div className="pag-table-topbar">
          <h3>Alert Details {reportDate && `(${reportDate})`}</h3>
          <span className="pag-record-info">
            {filteredReports.length === 0
              ? 'No records'
              : `Showing ${startRow}–${endRow} of ${filteredReports.length} records`}
          </span>
        </div>

        <table className="data-table">
          <thead>
            <tr>
              <th>Time</th>
              <th>Type</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredReports.length === 0 ? (
              <tr>
                <td colSpan="3" className="empty-state-text">No alerts for selected date</td>
              </tr>
            ) : (
              displayedReports.map((alert) => (
                <tr key={alert.id}>
                  <td>{alert.timestamp}</td>
                  <td><strong>{alert.alert_type}</strong></td>
                  <td className={
                    alert.status === 'Active' || alert.status === 'Pending'
                      ? 'text-red font-bold'
                      : 'text-green font-bold'
                  }>
                    {alert.status}
                  </td>
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

export default ReportsTab;