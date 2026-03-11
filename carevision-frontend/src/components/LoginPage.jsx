import React from 'react';
import './LoginPage.css';

const LoginPage = ({ onLogin }) => {
  return (
    <div className="login-container">
      <div className="login-card">
        
        <div className="logo-container">
          <div className="logo-box">
            {/* Heartbeat Icon */}
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
            </svg>
          </div>
        </div>
        
        <h2>CareVision LK</h2>
        <p className="subtitle">Hospital Security Management System</p>

        <div className="input-group">
          <label>Username</label>
          <div className="input-wrapper">
            <span className="icon">👤</span>
            <input type="text" placeholder="Enter your username" />
          </div>
        </div>

        <div className="input-group">
          <label>Password</label>
          <div className="input-wrapper">
            <span className="icon">🔒</span>
            <input type="password" placeholder="Enter your password" />
          </div>
        </div>

        <div className="forgot-password">
          <a href="#">Forgot Password?</a>
        </div>

        <button className="sign-in-btn" onClick={onLogin}>
  <span className="icon">🔑</span> Sign In
</button>

        <button className="google-sign-in-btn">
          <img src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg" alt="Google" />
          Sign in with Google
        </button>

      </div>
    </div>
  );
};

export default LoginPage;