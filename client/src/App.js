import React, { useState } from 'react';
import { Provider } from 'react-redux';
import { store } from './store';
import HomePage from './pages/HomePage';
import TeacherDashboard from './components/TeacherDashboard';
import StudentDashboard from './components/StudentDashboard';
import Chat from './components/Chat';
import { useSelector } from 'react-redux';
import './App.css';

function AppContent() {
  const [userRole, setUserRole] = useState(null);
  const { isOpen: chatOpen } = useSelector((state) => state.chat);

  const handleRoleSelect = (role) => {
    setUserRole(role);
  };

  const handleBackToHome = () => {
    setUserRole(null);
  };

  if (!userRole) {
    return <HomePage onRoleSelect={handleRoleSelect} />;
  }

  return (
    <div className="app">
      <div className="app-header">
        <button 
          className="back-btn"
          onClick={handleBackToHome}
        >
          ← Back to Home
        </button>
        <h1>Live Polling System</h1>
        <div className="user-role">
          {userRole === 'teacher' ? '👨‍🏫 Teacher' : '👨‍🎓 Student'}
        </div>
      </div>

      <div className="app-content">
        {userRole === 'teacher' ? (
          <TeacherDashboard />
        ) : (
          <StudentDashboard />
        )}
      </div>

      {chatOpen && (
        <Chat
          onSendMessage={() => {}}
          userType={userRole}
        />
      )}
    </div>
  );
}

function App() {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
}

export default App;
