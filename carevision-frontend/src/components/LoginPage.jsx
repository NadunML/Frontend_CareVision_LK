import React, { useState } from 'react';
import { signInWithEmailAndPassword, signInWithPopup, OAuthProvider } from 'firebase/auth';
import { auth } from '../firebase';
import './LoginPage.css';

const LoginPage = ({ onLoginSuccess }) => {
  // Authentication State Management
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  /**
   * Records the authentication event to the backend login history API.
   * @param {string} userEmail - The email of the successfully authenticated user.
   */
  const recordUserAccess = async (userEmail) => {
    try {
      await fetch(`${import.meta.env.VITE_API_URL}/api/login-history`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: userEmail })
      });
    } catch (err) {
      console.error('Failed to log access record:', err);
    }
  };

  /**
   * Handles standard Email and Password authentication via Firebase.
   */
  const processStandardLogin = async (e) => {
    e.preventDefault();
    setIsProcessing(true);
    setAuthError('');
    
    try {
      const userCredential = await signInWithEmailAndPassword(auth, authEmail, authPassword);
      await recordUserAccess(userCredential.user.email);
      // Domain validation is handled globally in App.jsx upon auth state change
    } catch (err) {
      setAuthError('Authentication failed. Please check your credentials and try again.');
      console.error('Standard Login Error:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  /**
   * Handles Single Sign-On (SSO) via Microsoft OAuth Provider.
   */
  const processSSOLogin = async () => {
    setIsProcessing(true);
    setAuthError('');
    
    try {
      const msProvider = new OAuthProvider('microsoft.com');
      // Configuration for university tenant
      msProvider.setCustomParameters({
        tenant: import.meta.env.VITE_MICROSOFT_TENANT_ID,
        prompt: 'consent',
        login_hint: 'user@ms.sab.ac.lk'
      });

      const result = await signInWithPopup(auth, msProvider);
      await recordUserAccess(result.user.email);
      // Domain validation is handled globally in App.jsx
    } catch (err) {
      setAuthError('Microsoft SSO initialization failed. Please try again.');
      console.error('SSO Login Error:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="cv-auth-layout">
      <div className="cv-login-card">

        <header className="cv-login-heading">
          <div className="cv-brand-icon">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
            </svg>
          </div>
          <h2>CareVision LK</h2>
          <p>Hospital Security AI System</p>
        </header>

        {authError && <div className="cv-alert-danger">{authError}</div>}

        <form onSubmit={processStandardLogin} className="cv-login-form">
          <div className="cv-input-field">
            <label>Email Address</label>
            <input
              type="email"
              placeholder="admin@ms.sab.ac.lk"
              value={authEmail}
              onChange={(e) => setAuthEmail(e.target.value)}
              required
            />
          </div>
          
          <div className="cv-input-field">
            <label>Password</label>
            <input
              type="password"
              placeholder="Enter your secure password"
              value={authPassword}
              onChange={(e) => setAuthPassword(e.target.value)}
              required
            />
          </div>
          
          <button type="submit" className="cv-primary-btn" disabled={isProcessing}>
            {isProcessing ? 'Authenticating...' : 'Secure Sign In'}
          </button>
        </form>

        <div className="cv-divider"><span>OR</span></div>

        {/* Enterprise SSO Button */}
        <button onClick={processSSOLogin} className="cv-ms-auth-btn" disabled={isProcessing}>
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 21 21" className="cv-ms-icon">
            <rect x="1" y="1" width="9" height="9" fill="#f25022" />
            <rect x="11" y="1" width="9" height="9" fill="#7fba00" />
            <rect x="1" y="11" width="9" height="9" fill="#00a4ef" />
            <rect x="11" y="11" width="9" height="9" fill="#ffb900" />
          </svg>
          Sign in with Microsoft
        </button>

      </div>
    </div>
  );
};

export default LoginPage;