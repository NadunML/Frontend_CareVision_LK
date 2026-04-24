import React, { useState, useEffect } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from './firebase'; 

import LoginPage from './components/LoginPage'; 
import Dashboard from './components/Dashboard';

/**
 * System Access Control List (ACL)
 * Only these predefined administrative email addresses are granted access 
 * to the CareVision Edge AI Dashboard.
 */
const AUTHORIZED_ADMIN_EMAILS = [
  'liyanage2021@gmail.com', 
  'mlndliyanage9@gmail.com',
  'lakshanikaveesha2003@gmail.com'
];

function App() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [authError, setAuthError] = useState('');

  useEffect(() => {
    // Listen to Firebase authentication state changes
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        // Verify if the authenticated user has administrative privileges
        if (AUTHORIZED_ADMIN_EMAILS.includes(currentUser.email)) {
          setUser(currentUser); 
          setAuthError('');
        } else {
          // Revoke access for unauthorized users immediately to ensure system security
          await signOut(auth);
          setUser(null);
          setAuthError('Access Denied: Your account is not authorized to access the CareVision system.');
        }
      } else {
        setUser(null);
      }
      setIsLoading(false); 
    });

    // Cleanup subscription on component unmount
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth); 
    } catch (error) {
      console.error("Authentication Error (Logout):", error);
    }
  };

  // Enterprise-grade loading state UI
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
        <Dashboard onLogout={handleLogout} />
      ) : (
        <>
          {/* Unauthorized access alert banner */}
          {authError && (
            <div style={{ backgroundColor: '#fef2f2', borderBottom: '1px solid #fecaca', color: '#dc2626', padding: '12px', textAlign: 'center', fontSize: '14px', fontWeight: '600', fontFamily: 'Inter, sans-serif' }}>
              ⚠️ {authError}
            </div>
          )}
          <LoginPage onLoginSuccess={() => console.log("Authentication attempt registered")} />
        </>
      )}
    </div>
  );
}

export default App;