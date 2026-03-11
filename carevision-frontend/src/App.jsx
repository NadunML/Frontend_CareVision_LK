import React, { useState } from 'react';
import LoginPage from './components/LoginPage';
import Dashboard from './components/Dashboard';

function App() {
  // ලොග් වෙලාද නැද්ද කියලා මතක තියාගන්න state එක
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // ලොග් වෙන function එක
  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  // ලොග් අවුට් වෙන function එක
  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  return (
    <div>
      {/* isLoggedIn true නම් Dashboard එක පෙන්වනවා, නැත්නම් LoginPage එක පෙන්වනවා */}
      {isLoggedIn ? (
        <Dashboard onLogout={handleLogout} />
      ) : (
        <LoginPage onLogin={handleLogin} />
      )}
    </div>
  );
}

export default App;