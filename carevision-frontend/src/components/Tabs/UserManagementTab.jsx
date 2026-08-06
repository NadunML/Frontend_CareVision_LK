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

    // Backend එකෙන් Login History ඩේටා ටික ගෙනෙන Function එක
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

      {/* අලුතින් එකතු කරපු Login History Table එක */}
      <div className="table-container card-box border-blue-wrap" style={{ marginTop: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h3 style={{ margin: 0 }}>Recent Login Activity</h3>
          {currentUser && (
            <span style={{ fontSize: '0.875rem', color: '#10b981', backgroundColor: '#f0fdf4', padding: '0.25rem 0.75rem', borderRadius: '9999px', fontWeight: 'bold' }}>
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
                  <td className="user-td" style={{ fontWeight: 'bold', color: '#6b7280' }}>#{record.id}</td>
                  <td className="user-td">{record.email}</td>
                  <td className="user-td">{new Date(record.login_time).toLocaleString()}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className="user-td" style={{ textAlign: 'center', padding: '1rem', color: '#6b7280' }}>
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