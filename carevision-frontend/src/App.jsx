import React, { useState, useEffect } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from './firebase'; 

import LoginPage from './components/LoginPage'; 
import Dashboard from './components/Dashboard';

// 1. මෙන්න මේක තමයි අපේ VIP ලිස්ට් එක (Whitelisted Emails)
// මේකට ඔයාගේ ඇත්තම Gmail එකයි, ඇතුළට ගන්න ඕනේ අයගේ ඊමේල් ටිකයි දාන්න
const ALLOWED_EMAILS = [
  'liyanage2021@gmail.com', // ඔයාගේ Super Admin එක මෙතනට දාන්න
  'mlndliyanage9@gmail.com',
  '22cis0263@ms.sab.ac.lk'
];

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // අවසර නැති කෙනෙක් ආවොත් එරර් එකක් පෙන්නන්න State එකක්
  const [authError, setAuthError] = useState('');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        // 2. ලොග් වුණ කෙනාගේ ඊමේල් එක අර VIP ලිස්ට් එකේ තියෙනවද බලනවා
        if (ALLOWED_EMAILS.includes(currentUser.email)) {
          setUser(currentUser); // අවසර තියෙනවා නම් ඇතුළට ගන්නවා
          setAuthError('');
        } else {
          // අවසර නැත්නම් එවේලේම එළියට විසි කරනවා (Sign Out)
          await signOut(auth);
          setUser(null);
          setAuthError('Access Denied: Your account is not authorized to access this system.');
        }
      } else {
        setUser(null);
      }
      setLoading(false); 
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth); 
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  if (loading) {
    return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', fontFamily: 'sans-serif' }}><h2>Loading CareVision...</h2></div>;
  }

  return (
    <div>
      {user ? (
        <Dashboard onLogout={handleLogout} />
      ) : (
        <>
          {/* අවසර නැති කෙනෙක්ට එරර් එකක් පෙන්නන්න පොඩි UI කෑල්ලක් */}
          {authError && (
            <div style={{ backgroundColor: '#fee2e2', color: '#dc2626', padding: '15px', textAlign: 'center', fontWeight: 'bold', fontFamily: 'sans-serif' }}>
              {authError}
            </div>
          )}
          <LoginPage onLoginSuccess={() => console.log("Login Attempted")} />
        </>
      )}
    </div>
  );
}

export default App;