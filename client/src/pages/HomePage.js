import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { openChat } from '../store/chatSlice';

const HomePage = ({ onRoleSelect }) => {
  const dispatch = useDispatch();
  const [selectedRole, setSelectedRole] = useState('');

  const handleRoleSelect = (role) => {
    setSelectedRole(role);
    onRoleSelect(role);
  };

  const handleOpenChat = () => {
    dispatch(openChat());
  };

  return (
    <div className="home-page">
      <div className="hero-section">
        <h1>Live Polling System</h1>
        <p>Interactive polling platform for teachers and students</p>
      </div>

      <div className="role-selection">
        <h2>Choose Your Role</h2>
        <div className="role-cards">
          <div 
            className={`role-card ${selectedRole === 'teacher' ? 'selected' : ''}`}
            onClick={() => handleRoleSelect('teacher')}
          >
            <div className="role-icon">👨‍🏫</div>
            <h3>Teacher</h3>
            <p>Create polls, view live results, and manage students</p>
            <ul>
              <li>Create interactive polls</li>
              <li>View real-time results</li>
              <li>Manage student participation</li>
              <li>Access past poll history</li>
            </ul>
          </div>

          <div 
            className={`role-card ${selectedRole === 'student' ? 'selected' : ''}`}
            onClick={() => handleRoleSelect('student')}
          >
            <div className="role-icon">👨‍🎓</div>
            <h3>Student</h3>
            <p>Join polls, submit answers, and view results</p>
            <ul>
              <li>Join polling sessions</li>
              <li>Submit answers in real-time</li>
              <li>View live poll results</li>
              <li>Chat with teacher and peers</li>
            </ul>
          </div>
        </div>

        {selectedRole && (
          <div className="role-confirmation">
            <p>You selected: <strong>{selectedRole === 'teacher' ? 'Teacher' : 'Student'}</strong></p>
            <button 
              className="btn btn-primary"
              onClick={() => handleRoleSelect(selectedRole)}
            >
              Continue as {selectedRole === 'teacher' ? 'Teacher' : 'Student'}
            </button>
          </div>
        )}
      </div>

      <div className="features-section">
        <h2>Features</h2>
        <div className="features-grid">
          <div className="feature-item">
            <div className="feature-icon">⚡</div>
            <h4>Real-time Updates</h4>
            <p>Live polling results update instantly as students respond</p>
          </div>
          <div className="feature-item">
            <div className="feature-icon">⏱️</div>
            <h4>Time Management</h4>
            <p>Configurable time limits with automatic result display</p>
          </div>
          <div className="feature-item">
            <div className="feature-icon">💬</div>
            <h4>Interactive Chat</h4>
            <p>Built-in chat for teacher-student communication</p>
          </div>
          <div className="feature-item">
            <div className="feature-icon">📊</div>
            <h4>Analytics</h4>
            <p>View past poll results and participation statistics</p>
          </div>
        </div>
      </div>

      <div className="chat-toggle">
        <button 
          className="btn btn-secondary"
          onClick={handleOpenChat}
        >
          💬 Open Chat
        </button>
      </div>
    </div>
  );
};

export default HomePage;
