import React, { useState, useEffect } from 'react';
import { auth } from '../../firebase';
import './UserManagementTab.css';

const AUTHORIZED_ADMIN_EMAILS = [
  'liyanage2021@gmail.com',
  'mlndliyanage9@gmail.com',
  '22cis0263@ms.sab.ac.lk'
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

  const displayUsers = AUTHORIZED_ADMIN_EMAILS.map(email => {
    const isCurrent = currentUser && currentUser.email === email;
    return {
      username: isCurrent && currentUser.displayName ? currentUser.displayName : email.split('@')[0],
      email: email,
      role: email.includes('sab.ac.lk') ? 'System Admin / Lead' : 'System Admin',
      status: 'Active',
      created: isCurrent && currentUser.metadata?.creationTime
        ? new Date(currentUser.metadata.creationTime).toISOString().split('T')[0]
        : '2024-01-10',
      isCurrent: isCurrent
    };
  }).sort((a, b) => (b.isCurrent ? 1 : 0) - (a.isCurrent ? 1 : 0));

  return (
    <div className="user-wrapper">
      <div className="header">
        <h1>User Management</h1>
        <p>Manage authorized staff accounts and system access</p>
      </div>

      <div className="user-stats-row">
        <div className="stat-card flex-between user-stat-card">
          <div><h4>Total Authorized</h4><h2>{AUTHORIZED_ADMIN_EMAILS.length}</h2></div>
          <div className="icon-circle blue-circle">✓</div>
        </div>
        <div className="stat-card flex-between user-stat-card">
          <div><h4>Admin Accounts</h4><h2>{AUTHORIZED_ADMIN_EMAILS.length}</h2></div>
          <div className="icon-circle red-circle">!</div>
        </div>
        <div className="stat-card flex-between user-stat-card">
          <div><h4>Pending Requests</h4><h2>0</h2></div>
          <div className="icon-circle orange-circle">!</div>
        </div>
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
              <tr key={index} className={`user-row ${user.isCurrent ? 'user-row--current' : 'user-row--default'}`}>
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