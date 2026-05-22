import React, { useState } from 'react';
import { Users, ShieldAlert, AlertTriangle, Camera, ChevronUp, ChevronDown } from 'lucide-react';

const MaskDetectionTab = ({ totalAccess, grantedAccess, deniedAccess, activeCamCount, accessLogs }) => {
  const [currentPage, setCurrentPage] = useState(0);
  const rowsPerPage = 10;
  
  const totalPages = Math.ceil(accessLogs.length / rowsPerPage);
  const displayedLogs = accessLogs.slice(currentPage * rowsPerPage, (currentPage + 1) * rowsPerPage);

  const handleNext = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrev = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div className="access-wrapper">
      <div className="header">
        <h1>Mask Detection</h1>
        <p>Real-time hospital monitoring and security status</p>
      </div>
      
      <div className="stats-grid">
        <div className="stat-card">
          <div className="flex-between align-start">
            <div><h4>Total Access Attempts</h4><h2>{totalAccess > 0 ? totalAccess : 0}</h2></div>
            <div className="outline-icon-box border-blue"><Users size={20} /></div>
          </div>
        </div>
        <div className="stat-card">
          <div className="flex-between align-start">
            <div><h4>Access Granted</h4><h2>{grantedAccess}</h2></div>
            <div className="outline-icon-box border-green"><ShieldAlert size={20} /></div>
          </div>
        </div>
        <div className="stat-card">
          <div className="flex-between align-start">
            <div><h4>Access Denied</h4><h2>{deniedAccess}</h2></div>
            <div className="outline-icon-box border-red"><AlertTriangle size={20} /></div>
          </div>
        </div>
        <div className="stat-card">
          <div className="flex-between align-start">
            <div><h4>Active Cameras</h4><h2>{activeCamCount}</h2></div>
            <div className="outline-icon-box border-yellow"><Camera size={20} /></div>
          </div>
        </div>
      </div>

      <div className="table-container card-box mt-4">
        <h3 className="mb-4">Access Control Logs</h3>
        
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '15px' }}>
          
          <div style={{ flex: 1, minHeight: '520px' }}>
            <table className="data-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead style={{ backgroundColor: '#f8fafc', borderBottom: '2px solid #e2e8f0' }}>
                <tr>
                  <th style={{ padding: '12px 15px', textAlign: 'left', width: '20%' }}>Camera ID</th>
                  <th style={{ padding: '12px 15px', textAlign: 'left', width: '25%' }}>Mask Detected</th>
                  <th style={{ padding: '12px 15px', textAlign: 'left', width: '25%' }}>Access Result</th>
                  <th style={{ padding: '12px 15px', textAlign: 'left', width: '30%' }}>Timestamp</th>
                </tr>
              </thead>
              <tbody>
                {displayedLogs.length === 0 ? (
                  <tr>
                    <td colSpan="4" style={{ textAlign: 'center', padding: '30px', color: '#64748b' }}>
                      No access logs available yet.
                    </td>
                  </tr>
                ) : (
                  displayedLogs.map((log, index) => (
                    <tr key={index} style={{ borderBottom: '1px solid #e2e8f0' }}>
                      <td style={{ padding: '12px 15px' }}>{log.camera_id}</td>
                      <td style={{ padding: '12px 15px' }} className={log.mask_detected === 'Yes' ? 'text-green font-bold' : 'text-red font-bold'}>
                        {log.mask_detected}
                      </td>
                      <td style={{ padding: '12px 15px' }} className={log.access_result === 'Granted' ? 'text-green font-bold' : 'text-red font-bold'}>
                        {log.access_result}
                      </td>
                      <td style={{ padding: '12px 15px' }}>{log.timestamp}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '15px', marginTop: '50px', padding: '10px', backgroundColor: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
              <button 
                onClick={handlePrev} 
                disabled={currentPage === 0}
                style={{ padding: '8px', cursor: currentPage === 0 ? 'not-allowed' : 'pointer', backgroundColor: currentPage === 0 ? '#f1f5f9' : '#0D6EFD', color: currentPage === 0 ? '#cbd5e1' : 'white', border: 'none', borderRadius: '8px', transition: '0.3s' }}
                title="Previous 10 Rows"
              >
                <ChevronUp size={24} />
              </button>

              <span style={{ fontSize: '13px', fontWeight: 'bold', color: '#64748b' }}>
                {currentPage + 1} / {totalPages}
              </span>

              <button 
                onClick={handleNext} 
                disabled={currentPage === totalPages - 1}
                style={{ padding: '8px', cursor: currentPage === totalPages - 1 ? 'not-allowed' : 'pointer', backgroundColor: currentPage === totalPages - 1 ? '#f1f5f9' : '#0D6EFD', color: currentPage === totalPages - 1 ? '#cbd5e1' : 'white', border: 'none', borderRadius: '8px', transition: '0.3s' }}
                title="Next 10 Rows"
              >
                <ChevronDown size={24} />
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default MaskDetectionTab;