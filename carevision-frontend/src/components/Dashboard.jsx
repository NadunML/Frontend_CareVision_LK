import React, { useState } from 'react';
import './Dashboard.css';

const Dashboard = ({ onLogout }) => {
  // State to track the currently active tab
  const [activeTab, setActiveTab] = useState('dashboard');
  
  // State to toggle the patient registration form visibility
  const [showRegisterForm, setShowRegisterForm] = useState(false);

  // Function to switch tabs and hide the registration form
  const handleTabChange = (tabName) => {
    setActiveTab(tabName);
    setShowRegisterForm(false);
  };

  return (
    <div className="dashboard-container">
      
      {/* Left Sidebar Navigation */}
      <div className="sidebar">
        <div className="sidebar-header">
          <div className="logo-box">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
            </svg>
          </div>
          <div>
            <h3 className="sidebar-brand">CareVision LK</h3>
            <p className="sidebar-subtitle">Hospital Security AI</p>
          </div>
        </div>

        <ul className="sidebar-menu">
          <li className={activeTab === 'dashboard' ? 'active' : ''} onClick={() => handleTabChange('dashboard')}>
            <span>🏠</span> Dashboard
          </li>
          <li className={activeTab === 'cctv' ? 'active' : ''} onClick={() => handleTabChange('cctv')}>
            <span>📷</span> Live CCTV Feeds
          </li>
          <li className={activeTab === 'patient' ? 'active' : ''} onClick={() => handleTabChange('patient')}>
            <span>👥</span> Patient Management
          </li>
          <li className={activeTab === 'access' ? 'active' : ''} onClick={() => handleTabChange('access')}>
            <span>🛡️</span> Access Control
          </li>
          <li className={activeTab === 'fire' ? 'active' : ''} onClick={() => handleTabChange('fire')}>
            <span>🔥</span> Fire Monitoring
          </li>
          <li><span>🔔</span> Alerts</li>
          <li><span>📄</span> Reports & Logs</li>
          <li><span>👤</span> User Management</li>
          <li><span>⚙️</span> Setting</li>
        </ul>

        <div className="sidebar-footer">
          <div className="admin-badge">Admin</div>
          <button className="logout-btn" onClick={onLogout}>
            <span>🚪</span> Logout
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="main-content">
        
        {/* ========================================= */}
        {/* 1. Dashboard Tab Content */}
        {/* ========================================= */}
        {activeTab === 'dashboard' && (
          <>
            <div className="header">
              <h1>Dashboard Overview</h1>
              <p>Real-time hospital monitoring and security status</p>
            </div>
            
            <div className="stats-grid">
              <div className="stat-card"><h4>Total Cameras</h4><h2>24</h2><p className="stat-sub">+2 this week</p></div>
              <div className="stat-card"><h4>Registered Patients</h4><h2>156</h2><p className="stat-sub">+12 today</p></div>
              <div className="stat-card"><h4>Today's Alerts</h4><h2>8</h2><p className="stat-sub">3 critical</p></div>
              <div className="stat-card"><h4>Mask Violations</h4><h2>3</h2><p className="stat-sub">-2 from yesterday</p></div>
            </div>
            
            <div className="bottom-grid">
              <div className="alerts-section card-box">
                <h3>⚠️ Active Alerts</h3>
                <div className="alert-item"><span className="dot red-dot"></span> Fire</div>
                <div className="alert-item"><span className="dot orange-dot"></span> Patient Wandering</div>
                <div className="alert-item"><span className="dot yellow-dot"></span> Mask Violation</div>
                <div className="alert-item"><span className="dot orange-dot"></span> Unauthorized Access</div>
              </div>
              
              <div className="chart-section card-box">
                <h3>Weekly Alerts Overview</h3>
                <div className="mock-chart">
                  <div className="bar-group"><div className="bar grey" style={{height: '50%'}}></div><div className="bar orange" style={{height: '30%'}}></div><div className="bar red" style={{height: '60%'}}></div><span>Mon</span></div>
                  <div className="bar-group"><div className="bar grey" style={{height: '30%'}}></div><div className="bar orange" style={{height: '70%'}}></div><div className="bar red" style={{height: '50%'}}></div><span>Tue</span></div>
                  <div className="bar-group"><div className="bar grey" style={{height: '50%'}}></div><div className="bar orange" style={{height: '60%'}}></div><div className="bar red" style={{height: '20%'}}></div><span>Wed</span></div>
                  <div className="bar-group"><div className="bar grey" style={{height: '60%'}}></div><div className="bar orange" style={{height: '75%'}}></div><div className="bar red" style={{height: '45%'}}></div><span>Thu</span></div>
                  <div className="bar-group"><div className="bar grey" style={{height: '85%'}}></div><div className="bar orange" style={{height: '45%'}}></div><div className="bar red" style={{height: '60%'}}></div><span>Fri</span></div>
                  <div className="bar-group"><div className="bar grey" style={{height: '40%'}}></div><div className="bar orange" style={{height: '85%'}}></div><div className="bar red" style={{height: '20%'}}></div><span>Sat</span></div>
                  <div className="bar-group"><div className="bar grey" style={{height: '40%'}}></div><div className="bar orange" style={{height: '40%'}}></div><div className="bar red" style={{height: '60%'}}></div><span>Sun</span></div>
                </div>
              </div>
            </div>
          </>
        )}

        {/* ========================================= */}
        {/* 2. Live CCTV Tab Content */}
        {/* ========================================= */}
        {activeTab === 'cctv' && (
          <div className="cctv-wrapper card-box">
            <div className="header">
              <h1>Live CCTV Feeds</h1>
              <p>Real-time hospital monitoring and security status</p>
            </div>
            <div className="cctv-grid">
              <div className="cctv-box"><div className="cctv-top-bar"><div className="cam-name">📷 Camera 01</div><div className="cam-time">4:50:36 PM</div></div><div className="cctv-bottom-bar"><span className="expand-icon">↗</span></div></div>
              <div className="cctv-box"><div className="cctv-top-bar"><div className="cam-name">📷 Camera 02</div><div className="cam-time">4:50:36 PM</div></div><div className="cctv-bottom-bar"><span className="expand-icon">↗</span></div></div>
              <div className="cctv-box"><div className="cctv-top-bar"><div className="cam-name">📷 Camera 03</div><div className="cam-time">4:50:36 PM</div></div><div className="cctv-bottom-bar"><span className="expand-icon">↗</span></div></div>
              <div className="cctv-box"><div className="cctv-top-bar"><div className="cam-name">📷 Camera 04</div><div className="cam-time">4:50:36 PM</div></div><div className="cctv-bottom-bar"><span className="expand-icon">↗</span></div></div>
            </div>
          </div>
        )}

        {/* ========================================= */}
        {/* 3. Patient Management Tab Content */}
        {/* ========================================= */}
        {activeTab === 'patient' && (
          <div className="patient-wrapper">
            
            <div className="page-header-flex">
              <div className="header">
                <h1>Patient Management</h1>
                <p>Register and monitor high-risk patients</p>
              </div>
              
              {!showRegisterForm && (
                <button className="primary-btn" onClick={() => setShowRegisterForm(true)}>
                  + Register Patient
                </button>
              )}
            </div>

            {showRegisterForm ? (
              <div className="register-form-card card-box">
                <div className="form-row"><label>Patient ID :</label><input type="text" className="form-input" /></div>
                <div className="form-row"><label>Patient Name :</label><input type="text" className="form-input" /></div>
                <div className="form-row"><label>Ward :</label><input type="text" className="form-input" /></div>
                <div className="form-row"><label>Ward ID :</label><input type="text" className="form-input" /></div>
                
                <div className="form-row">
                  <label>Risk Level :</label>
                  <div className="radio-group">
                    <label><input type="radio" name="risk" value="High" /> High</label>
                    <label><input type="radio" name="risk" value="Medium" /> Medium</label>
                    <label><input type="radio" name="risk" value="Low" /> Low</label>
                  </div>
                </div>
                
                <div className="form-row align-start">
                  <label className="mt-2">Add Image :</label>
                  <div className="image-upload-box">
                    <div className="upload-icon">
                      <div className="square"></div><div className="plus">+</div>
                    </div>
                  </div>
                </div>

                <div className="form-actions">
                  <button className="btn-register">Register Patient</button>
                  <button className="btn-cancel" onClick={() => setShowRegisterForm(false)}>Cancel</button>
                </div>
              </div>
            ) : (
              <>
                <div className="patient-stats-grid">
                  <div className="stat-card flex-between">
                    <div><h4>Total Patients</h4><h2>5</h2></div>
                    <div className="icon-circle blue-circle">!</div>
                  </div>
                  <div className="stat-card flex-between">
                    <div><h4>High Risk</h4><h2>2</h2></div>
                    <div className="icon-circle red-circle">!</div>
                  </div>
                  <div className="stat-card flex-between">
                    <div><h4>Exit Alerts Today</h4><h2>3</h2></div>
                    <div className="icon-circle orange-circle">!</div>
                  </div>
                </div>

                <div className="table-container card-box">
                  <h3>Registered Patients</h3>
                  <input type="text" className="search-bar" placeholder="Search Patients..." />
                  <table className="data-table">
                    <thead>
                      <tr><th>Ward</th><th>Risk Level</th><th>Registered Date</th><th>Actions</th></tr>
                    </thead>
                    <tbody>
                      <tr><td>Ward 3</td><td className="text-orange font-bold">medium</td><td>2024-02-20</td><td><span className="action-edit">Edit</span> / <span className="action-delete">Delete</span></td></tr>
                      <tr><td>ICU</td><td className="text-red font-bold">High</td><td>2024-02-21</td><td><span className="action-edit">Edit</span> / <span className="action-delete">Delete</span></td></tr>
                      <tr><td>Ward 5</td><td className="text-green font-bold">Low</td><td>2024-02-22</td><td><span className="action-edit">Edit</span> / <span className="action-delete">Delete</span></td></tr>
                    </tbody>
                  </table>
                </div>
              </>
            )}

          </div>
        )}

        {/* ========================================= */}
        {/* 4. Access Control Tab Content (RESTORED FULLY) */}
        {/* ========================================= */}
        {activeTab === 'access' && (
          <div className="access-wrapper">
            
            <div className="header">
              <h1>Access Control</h1>
              <p>Real-time hospital monitoring and security status</p>
            </div>

            {/* Top statistics cards */}
            <div className="stats-grid">
              <div className="stat-card">
                <div className="flex-between align-start">
                  <div>
                    <h4>Total Access Attempts</h4>
                    <h2>234</h2>
                    <p className="stat-sub">+28 this week</p>
                  </div>
                  <div className="outline-icon-box border-blue">👤</div>
                </div>
              </div>
              <div className="stat-card">
                <div className="flex-between align-start">
                  <div>
                    <h4>Access Granted</h4>
                    <h2>198</h2>
                    <p className="stat-sub">84.6% compliance</p>
                  </div>
                  <div className="outline-icon-box border-green">🛡️</div>
                </div>
              </div>
              <div className="stat-card">
                <div className="flex-between align-start">
                  <div>
                    <h4>Access Denied</h4>
                    <h2>36</h2>
                    <p className="stat-sub">15.4% violations</p>
                  </div>
                  <div className="outline-icon-box border-red">🛑</div>
                </div>
              </div>
              <div className="stat-card">
                <div className="flex-between align-start">
                  <div>
                    <h4>Active Cameras</h4>
                    <h2>4</h2>
                    <p className="stat-sub">All operational</p>
                  </div>
                  <div className="outline-icon-box border-yellow">📷</div>
                </div>
              </div>
            </div>

            {/* Access Control Logs Table */}
            <div className="table-container card-box mt-4">
              <h3 className="mb-4">Access Control Logs</h3>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Camera ID</th>
                    <th>Mask Detected</th>
                    <th>Confidence</th>
                    <th>Access Result</th>
                    <th>Timestamp</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Lab Entry - Cam 08</td>
                    <td className="text-green font-bold">Yes</td>
                    <td>98%</td>
                    <td className="text-green font-bold">Granted</td>
                    <td>2024-02-24 14:45:30</td>
                  </tr>
                  <tr>
                    <td>ICU Entry - Cam 12</td>
                    <td className="text-red font-bold">No</td>
                    <td>95%</td>
                    <td className="text-red font-bold">Denied</td>
                    <td>2024-02-24 14:30:15</td>
                  </tr>
                  <tr>
                    <td>Lab Entry - Cam 08</td>
                    <td className="text-green font-bold">Yes</td>
                    <td>92%</td>
                    <td className="text-green font-bold">Granted</td>
                    <td>2024-02-24 14:15:20</td>
                  </tr>
                  <tr>
                    <td>Lab Entry - Cam 08</td>
                    <td className="text-green font-bold">Yes</td>
                    <td>96%</td>
                    <td className="text-green font-bold">Granted</td>
                    <td>2024-02-24 13:50:10</td>
                  </tr>
                  <tr>
                    <td>ICU Entry - Cam 12</td>
                    <td className="text-red font-bold">No</td>
                    <td>97%</td>
                    <td className="text-red font-bold">Denied</td>
                    <td>2024-02-24 13:20:45</td>
                  </tr>
                </tbody>
              </table>
            </div>

          </div>
        )}

        {/* ========================================= */}
        {/* 5. Fire Monitoring Tab Content */}
        {/* ========================================= */}
        {activeTab === 'fire' && (
          <div className="fire-wrapper">
            
            <div className="header">
              <h1>Fire & Smoke Detection</h1>
              <p>Real-time fire and smoke monitoring system</p>
            </div>

            {/* Top statistics cards */}
            <div className="stats-grid">
              <div className="stat-card">
                <div className="flex-between align-start">
                  <div>
                    <h4>Active Alerts</h4>
                    <h2>1</h2>
                    <p className="stat-sub">+28 this week</p>
                  </div>
                  <div className="outline-icon-box border-red">⚠️</div>
                </div>
              </div>

              <div className="stat-card">
                <div className="flex-between align-start">
                  <div>
                    <h4>Total Events (24h)</h4>
                    <h2>4</h2>
                    <p className="stat-sub">84.6% compliance</p>
                  </div>
                  <div className="outline-icon-box border-orange">🔥</div>
                </div>
              </div>

              <div className="stat-card">
                <div className="flex-between align-start">
                  <div>
                    <h4>Resolved Events</h4>
                    <h2>3</h2>
                    <p className="stat-sub">15.4% violations</p>
                  </div>
                  <div className="outline-icon-box border-green">✅</div>
                </div>
              </div>

              <div className="stat-card">
                <div className="flex-between align-start">
                  <div>
                    <h4>Monitoring Cameras</h4>
                    <h2>6</h2>
                    <p className="stat-sub">All operational</p>
                  </div>
                  <div className="outline-icon-box border-yellow">📷</div>
                </div>
              </div>
            </div>

            {/* Active Fire/Smoke Alert Banner */}
            <div className="fire-alert-banner">
              <h3 className="alert-title">🔥 Active Fire/Smoke Alert</h3>
              
              <div className="alert-details-grid">
                <div>
                  <div className="detail-label">Location</div>
                  <div className="detail-value">ICU - Camera 12</div>
                </div>
                <div>
                  <div className="detail-label">Confidence Level</div>
                  <div className="detail-value">95%</div>
                </div>
                <div>
                  <div className="detail-label">Event Type</div>
                  <div className="detail-value">Smoke Detected</div>
                </div>
                <div>
                  <div className="detail-label">Detection Time</div>
                  <div className="detail-value">2024-02-24 14:30:25</div>
                </div>
              </div>

              <div className="alert-actions">
                <button className="btn-notify">🔔 Notify Emergency Service</button>
                <button className="btn-resolve">Mark as Resolved</button>
              </div>
            </div>

            {/* Fire & Smoke Event Logs Table */}
            <div className="table-container card-box mt-4">
              <h3 className="mb-4">Fire & Smoke Event Logs</h3>
              
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Event Type</th>
                    <th>Confidence</th>
                    <th>Severity</th>
                    <th>Status</th>
                    <th>Timestamp</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Smoke Detected</td>
                    <td>95%</td>
                    <td className="text-red font-bold">High</td>
                    <td className="text-red font-bold">Active</td>
                    <td>2024-02-24 14:45:30</td>
                  </tr>
                  <tr>
                    <td>Fire Detected</td>
                    <td>88%</td>
                    <td className="text-orange font-bold">Critical</td>
                    <td className="text-green font-bold">Resolved</td>
                    <td>2024-02-24 14:30:15</td>
                  </tr>
                  <tr>
                    <td>Smoke Detected</td>
                    <td>76%</td>
                    <td className="text-yellow font-bold">Medium</td>
                    <td className="text-green font-bold">Resolved</td>
                    <td>2024-02-24 14:15:20</td>
                  </tr>
                  <tr>
                    <td>Smoke Detected</td>
                    <td>82%</td>
                    <td className="text-yellow font-bold">Medium</td>
                    <td className="text-green font-bold">Resolved</td>
                    <td>2024-02-24 13:50:10</td>
                  </tr>
                </tbody>
              </table>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};

export default Dashboard;