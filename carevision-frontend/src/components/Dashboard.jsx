import React, { useState } from 'react';
import './Dashboard.css';

const Dashboard = ({ onLogout }) => {
  // State to keep track of the active tab in the sidebar
  const [activeTab, setActiveTab] = useState('dashboard');
  
  // State to toggle the patient registration form visibility
  const [showRegisterForm, setShowRegisterForm] = useState(false);

  // Function to handle tab switching and hiding the form
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
          <li><span>🛡️</span> Access Control</li>
          <li><span>🔥</span> Fire Monitoring</li>
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
                {/* CSS Mockup of a Bar Chart */}
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
              
              {/* Show the 'Register Patient' button only if the form is NOT visible */}
              {!showRegisterForm && (
                <button className="primary-btn" onClick={() => setShowRegisterForm(true)}>
                  + Register Patient
                </button>
              )}
            </div>

            {/* Patient Registration Form Section */}
            {showRegisterForm ? (
              <div className="register-form-card card-box">
                
                <div className="form-row">
                  <label>Patient ID :</label>
                  <input type="text" className="form-input" />
                </div>
                
                <div className="form-row">
                  <label>Patient Name :</label>
                  <input type="text" className="form-input" />
                </div>
                
                <div className="form-row">
                  <label>Ward :</label>
                  <input type="text" className="form-input" />
                </div>
                
                <div className="form-row">
                  <label>Ward ID :</label>
                  <input type="text" className="form-input" />
                </div>
                
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
                      {/* CSS-based placeholder for image upload */}
                      <div className="square"></div>
                      <div className="plus">+</div>
                    </div>
                  </div>
                </div>

                <div className="form-actions">
                  <button className="btn-register">Register Patient</button>
                  <button className="btn-cancel" onClick={() => setShowRegisterForm(false)}>Cancel</button>
                </div>

              </div>
            ) : (
              /* Default Patient Management Table View */
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

      </div>
    </div>
  );
};

export default Dashboard;