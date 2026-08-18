import React, { useState, useEffect } from 'react';
import { auth } from '../../firebase';
import { Users, ShieldCheck, Clock } from 'lucide-react';
import './UserManagementTab.css';

// Authorized admin emails are managed via the VITE_AUTHORIZED_ADMIN_EMAILS env variable
const AUTHORIZED_ADMIN_EMAILS = import.meta.env.VITE_AUTHORIZED_ADMIN_EMAILS
  ? import.meta.env.VITE_AUTHORIZED_ADMIN_EMAILS.split(',').map((e) => e.trim())
  : [];

const UserManagementTab = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loginHistory, setLoginHistory] = useState([]);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user && AUTHORIZED_ADMIN_EMAILS.includes(user.email)) {
        setCurrentUser(user);
      } else {
        setCurrentUser(null);
      }
    });

    // Fetches login history records from the backend API.
    const fetchLoginHistory = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/login-history`);
        const data = await res.json();
        setLoginHistory(data);
      } catch (error) {
        console.error('Failed to fetch login history', error);
      }
    };

    fetchLoginHistory();

    return () => unsubscribe();
  }, []);

  const stats = [
    {
      label: 'Total Authorized',
      value: AUTHORIZED_ADMIN_EMAILS.length,
      icon: <Users size={20} color="#0D6EFD" />,
      iconBg: '#eff6ff',
      accent: '#0D6EFD',
    },
    {
      label: 'Admin Accounts',
      value: AUTHORIZED_ADMIN_EMAILS.length,
      icon: <ShieldCheck size={20} color="#10b981" />,
      iconBg: '#f0fdf4',
      accent: '#10b981',
    },
    {
      label: 'Pending Requests',
      value: 0,
      icon: <Clock size={20} color="#f97316" />,
      iconBg: '#fff7ed',
      accent: '#f97316',
    },
  ];

  return (
    <div className="user-wrapper">
      <div className="header">
        <h1>User Management</h1>
        <p>Manage authorized staff accounts and system access</p>
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

      <div className="table-container card-box border-blue-wrap login-history-card">
        <div className="login-history-header">
          <h3 className="login-history-title">Recent Login Activity</h3>
          {currentUser && (
            <span className="active-user-badge">
              Currently active as: {currentUser.email}
            </span>
          )}
        </div>
        <table className="data-table">
          <thead className="user-table-head">
            <tr>
              <th className="user-th">Log ID</th>
              <th className="user-th">Email Address</th>
              <th className="user-th">Login Time</th>
            </tr>
          </thead>
          <tbody>
            {loginHistory.length > 0 ? (
              loginHistory.map((record) => (
                <tr key={record.id} className="user-row user-row--default">
                  <td className="user-td log-id-cell">#{record.id}</td>
                  <td className="user-td">{record.email}</td>
                  <td className="user-td">{new Date(record.login_time).toLocaleString()}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className="user-td empty-activity-cell">
                  No recent login activity found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

    </div>
  );
};

export default UserManagementTab;