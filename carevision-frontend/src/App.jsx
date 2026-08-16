import React, { useState, useEffect } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from './firebase';
import './App.css';

import LoginPage from './components/LoginPage'; 
import DashboardLayout from './components/DashboardLayout';

function App() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [authError, setAuthError] = useState('');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        // Email domain restriction: only allows university CIS staff accounts.
        // Pattern: 2 digits + 'cis' + 4 digits + '@ms.sab.ac.lk' (e.g. 22cis0263@ms.sab.ac.lk)
        const staffEmailPattern = /^\d{2}cis\d{4}@ms\.sab\.ac\.lk$/i;

        if (staffEmailPattern.test(currentUser.email)) {
          setUser(currentUser); 
          setAuthError('');
        } else {
          // If the email doesn't match the pattern, force logout
          await signOut(auth);
          setUser(null);
          setAuthError('Access Denied: Only Sabaragamuwa University CIS students can access this system.');
        }
      } else {
        setUser(null);
      }
      setIsLoading(false); 
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth); 
    } catch (error) {
      console.error("Authentication Error (Logout):", error);
    }
  };

  if (isLoading) {
    return (
      <div className="app-loading-screen">
        <div className="app-loading-inner">
          <h2 className="app-loading-title">Initializing CareVision LK...</h2>
          <p className="app-loading-sub">Securing connection to edge servers</p>
        </div>
      </div>
    );
  }

  return (
    <div className="app-container">
      {user ? (
        <DashboardLayout onLogout={handleLogout} />
      ) : (
        <>
          {/* Unauthorized access alert banner */}
          {authError && (
            <div className="auth-error-banner">
              {authError}
            </div>
          )}
          <LoginPage onLoginSuccess={() => {}} />
        </>
      )}
    </div>
  );
}

export default App;