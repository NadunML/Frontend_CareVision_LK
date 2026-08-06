import React, { useState, useEffect } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from './firebase'; 

import LoginPage from './components/LoginPage'; 
import DashboardLayout from './components/DashboardLayout';

function App() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [authError, setAuthError] = useState('');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        // --- The Ultimate Security Check ---
        // Only allows emails matching the pattern: 2 numbers + 'cis' + 4 numbers + '@ms.sab.ac.lk'
        // Example allowed: 22cis0263@ms.sab.ac.lk
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
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#f8fafc', fontFamily: 'Inter, sans-serif' }}>
        <div style={{ textAlign: 'center' }}>
          <h2 style={{ color: '#0D6EFD', marginBottom: '8px' }}>Initializing CareVision LK...</h2>
          <p style={{ color: '#64748b', fontSize: '14px', margin: 0 }}>Securing connection to edge servers</p>
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
            <div style={{ backgroundColor: '#fef2f2', borderBottom: '1px solid #fecaca', color: '#dc2626', padding: '12px', textAlign: 'center', fontSize: '14px', fontWeight: '600', fontFamily: 'Inter, sans-serif' }}>
              ⚠️ {authError}
            </div>
          )}
          <LoginPage onLoginSuccess={() => {}} />
        </>
      )}
    </div>
  );
}

export default App;