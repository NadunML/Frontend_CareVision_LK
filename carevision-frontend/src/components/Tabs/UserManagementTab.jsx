import React from 'react';

const UserManagementTab = () => {
  return (
    <div className="user-wrapper">
      <div className="header"><h1>User Management</h1><p>Manage staff accounts and system access</p></div>
      <div className="patient-stats-grid">
        <div className="stat-card flex-between"><div><h4>Total Staff</h4><h2>5</h2></div><div className="icon-circle blue-circle">!</div></div>
        <div className="stat-card flex-between"><div><h4>Active Users</h4><h2>2</h2></div><div className="icon-circle red-circle">!</div></div>
        <div className="stat-card flex-between"><div><h4>Inactive Users</h4><h2>3</h2></div><div className="icon-circle orange-circle">!</div></div>
      </div>
      <div className="table-container card-box mt-4 border-blue-wrap">
        <h3 className="mb-4">Staff Accounts</h3>
        <table className="data-table">
          <thead><tr><th>Username</th><th>Email</th><th>Status</th><th>Created</th></tr></thead>
          <tbody>
            <tr><td>admin</td><td>admin@hospital.lk</td><td className="text-green font-bold">Active</td><td>2024-02-24</td></tr>
            <tr><td>sjohnson</td><td>sarah.j@hospital.lk</td><td className="text-green font-bold">Active</td><td>2024-02-24</td></tr>
            <tr><td>mikesmith</td><td>mike.s@hospital.lk</td><td className="text-green font-bold">Active</td><td>2024-02-24</td></tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};
export default UserManagementTab;