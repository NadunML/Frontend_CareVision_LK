import React, { useState } from 'react';
import { signInWithEmailAndPassword, signInWithPopup, OAuthProvider } from 'firebase/auth';
import { auth } from '../firebase';
import './LoginPage.css';

const LoginPage = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Sends the authenticated user's email to the backend login history API.
  const saveLoginHistory = async (userEmail) => {
    try {
      await fetch(`${import.meta.env.VITE_API_URL}/api/login-history`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: userEmail })
      });
    } catch (err) {
      console.error('Failed to save login history:', err);
    }
  };

  // Email/Password Login
  const handleEmailLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      await saveLoginHistory(userCredential.user.email);
      // App.jsx handles domain validation after auth state changes.
    } catch (err) {
      setError('Invalid email or password. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Microsoft Login
  const handleMicrosoftLogin = async () => {
    setLoading(true);
    setError('');
    try {
      const provider = new OAuthProvider('microsoft.com');
      // Hint to Microsoft that we want the university email
      provider.setCustomParameters({
        tenant: import.meta.env.VITE_MICROSOFT_TENANT_ID,
        prompt: 'consent',
        login_hint: 'user@ms.sab.ac.lk'
      });

      const result = await signInWithPopup(auth, provider);
      await saveLoginHistory(result.user.email);
      // App.jsx handles domain validation after auth state changes.
    } catch (err) {
      setError('Microsoft sign-in failed. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">

        <div className="login-header">
          <div className="logo-box-large">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
            </svg>
          </div>
          <h2>CareVision LK</h2>
          <p>Hospital Security AI System</p>
        </div>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleEmailLogin} className="login-form">
          <div className="input-group">
            <label>Email Address</label>
            <input
              type="email"
              placeholder="admin@hospital.lk"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="input-group">
            <label>Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        <div className="divider"><span>OR</span></div>

        {/* Microsoft Sign-In Button */}
        <button onClick={handleMicrosoftLogin} className="microsoft-btn" disabled={loading}>
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 21 21" className="microsoft-svg-icon">
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