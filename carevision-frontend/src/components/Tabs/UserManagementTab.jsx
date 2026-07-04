import React, { useState, useEffect } from 'react';
import { auth } from '../../firebase';
import { Users, ShieldCheck, Clock } from 'lucide-react';
import './UserManagementTab.css';

const AUTHORIZED_ADMIN_EMAILS = [
  'liyanage2021@gmail.com',
  'mlndliyanage9@gmail.com',
  '22cis0263@ms.sab.ac.lk',
];

const UserManagementTab = () => {
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user && AUTHORIZED_ADMIN_EMAILS.includes(user.email)) {
        setCurrentUser(user);
      } else {
        setCurrentUser(null);
      }
    });
    return () => unsubscribe();
  }, []);

  const displayUsers = AUTHORIZED_ADMIN_EMAILS.map((email) => {
    const isCurrent = currentUser && currentUser.email === email;
    return {
      username: isCurrent && currentUser.displayName
        ? currentUser.displayName
        : email.split('@')[0],
      email,
      role: email.includes('sab.ac.lk') ? 'System Admin / Lead' : 'System Admin',
      status: 'Active',
      created: isCurrent && currentUser.metadata?.creationTime
        ? new Date(currentUser.metadata.creationTime).toISOString().split('T')[0]
        : '2024-01-10',
      isCurrent,
    };
  }).sort((a, b) => (b.isCurrent ? 1 : 0) - (a.isCurrent ? 1 : 0));

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

      <div className="table-container card-box mt-4 border-blue-wrap">
        <h3 className="mb-4">Authorized Login Accounts</h3>
        <table className="data-table">
          <thead className="user-table-head">
            <tr>
              <th className="user-th">Username</th>
              <th className="user-th">Email</th>
              <th className="user-th">Access Role</th>
              <th className="user-th">Status</th>
              <th className="user-th">Access Granted</th>
            </tr>
          </thead>
          <tbody>
            {displayUsers.map((user, index) => (
              <tr
                key={index}
                className={`user-row ${user.isCurrent ? 'user-row--current' : 'user-row--default'}`}
              >
                <td className="user-td">
                  <strong>{user.username}</strong>
                  {user.isCurrent && <span className="you-badge">You</span>}
                </td>
                <td className="user-td">{user.email}</td>
                <td className="user-td">
                  <span className="role-badge">{user.role}</span>
                </td>
                <td className="user-td text-green font-bold">{user.status}</td>
                <td className="user-td">{user.created}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserManagementTab;