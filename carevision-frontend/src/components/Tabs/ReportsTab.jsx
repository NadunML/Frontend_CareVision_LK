import React from 'react';
import { Download } from 'lucide-react';

const ReportsTab = ({ reportDate, setReportDate, handlePrintPDF, filteredReports, fireLogs, systemAlerts, accessLogs }) => {
  return (
    <div className="reports-wrapper">
      <style>{`@media print { @page { margin: 10mm; size: landscape; } .sidebar, .reports-filter-card { display: none !important; } .main-content { margin-left: 0 !important; width: 100% !important; background-color: white !important; padding: 0 !important; } .dashboard-container { display: block !important; background-color: white !important; } .card-box { border: 1px solid #ccc !important; box-shadow: none !important; page-break-inside: avoid; margin-bottom: 20px !important; } body { -webkit-print-color-adjust: exact; print-color-adjust: exact; background-color: white !important; } }`}</style>
      <div className="header"><h1>Reports & Logs</h1><p>Generate and download detailed system reports</p></div>
      <div className="reports-filter-card card-box">
        <div className="filter-group"><label>Report Type</label><select className="form-input select-input"><option>Daily Alert Report</option><option>Weekly Summary</option><option>Monthly Overview</option></select></div>
        <div className="filter-group"><label>Select Date</label><input type="date" className="form-input" value={reportDate} onChange={(e) => setReportDate(e.target.value)} /></div>
        <div className="filter-action"><button className="btn-download-pdf" onClick={handlePrintPDF} style={{display: 'flex', alignItems: 'center', gap: '8px'}}><Download size={16} /> Download PDF</button></div>
      </div>
      <div className="reports-stats-grid">
        <div className="report-stat-card"><h2 className="text-black">{filteredReports.length}</h2><p>Total Alerts</p></div>
        <div className="report-stat-card"><h2 className="text-red">{fireLogs.length}</h2><p>Fire Events</p></div>
        <div className="report-stat-card"><h2 className="text-orange">{systemAlerts.filter(a => a.alert_type === 'Patient Wandering').length}</h2><p>Patient Exits</p></div>
        <div className="report-stat-card"><h2 className="text-blue">{accessLogs.length}</h2><p>Access Logs</p></div>
      </div>
      <div className="table-container card-box mt-4">
        <h3 className="mb-4">Alert Details {reportDate && `(${reportDate})`}</h3>
        <table className="data-table">
          <thead><tr><th>Time</th><th>Type</th><th>Message</th><th>Priority</th><th>Status</th></tr></thead>
          <tbody>
            {filteredReports.length === 0 ? (<tr><td colSpan="5" className="empty-state-text">No alerts for selected date</td></tr>) : (
              filteredReports.map((alert) => (
                <tr key={alert.id}><td>{alert.timestamp}</td><td><strong>{alert.alert_type}</strong></td><td>{alert.description}</td><td className={alert.priority === 'High' ? 'text-red font-bold' : 'text-orange font-bold'}>{alert.priority}</td><td className={alert.status === 'Active' || alert.status === 'Pending' ? 'text-red font-bold' : 'text-green font-bold'}>{alert.status}</td></tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
export default ReportsTab;