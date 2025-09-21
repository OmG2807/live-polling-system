import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import useSocket from '../hooks/useSocket';
import CreatePollForm from './CreatePollForm';
import PollResults from './PollResults';
import StudentList from './StudentList';
import Chat from './Chat';
import PastResults from './PastResults';
// Redux imports removed as they're handled by useSocket hook

const TeacherDashboard = () => {
  const socket = useSocket('teacher');
  const { isConnected, students } = useSelector((state) => state.teacher);
  const { currentPoll, pollResults, pastPolls } = useSelector((state) => state.poll);
  const { isOpen: chatOpen } = useSelector((state) => state.chat);

  const [showPastResults, setShowPastResults] = useState(false);

  useEffect(() => {
    if (socket) {
      socket.emit('teacher-join');
    }
  }, [socket]);

  const handleCreatePoll = (pollData) => {
    if (socket) {
      socket.emit('create-poll', pollData);
    }
  };

  const handleRemoveStudent = (studentId) => {
    if (socket) {
      socket.emit('remove-student', studentId);
    }
  };

  const handleGetPastResults = () => {
    if (socket) {
      socket.emit('get-past-results');
    }
  };

  const handleSendMessage = (message) => {
    if (socket) {
      socket.emit('send-message', {
        message,
        senderType: 'teacher',
        senderName: 'Teacher',
      });
    }
  };

  if (!isConnected) {
    return (
      <div className="teacher-dashboard">
        <div className="loading">
          <h2>Connecting to server...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="teacher-dashboard">
      <header className="dashboard-header">
        <h1>Teacher Dashboard</h1>
        <div className="header-actions">
          <button
            className="btn btn-secondary"
            onClick={() => setShowPastResults(!showPastResults)}
          >
            {showPastResults ? 'Hide' : 'Show'} Past Results
          </button>
          <button
            className="btn btn-secondary"
            onClick={handleGetPastResults}
          >
            Refresh Past Results
          </button>
        </div>
      </header>

      <div className="dashboard-content">
        <div className="main-panel">
          <div className="poll-section">
            <CreatePollForm
              onCreatePoll={handleCreatePoll}
              canCreatePoll={!currentPoll || students.every(s => s.hasAnswered)}
            />
          </div>

          <div className="results-section">
            {pollResults && (
              <PollResults
                results={pollResults}
                isLive={currentPoll && currentPoll.timeRemaining > 0}
              />
            )}
          </div>
        </div>

        <div className="sidebar">
          <StudentList
            students={students}
            onRemoveStudent={handleRemoveStudent}
            currentPoll={currentPoll}
          />
        </div>
      </div>

      {showPastResults && (
        <div className="past-results-modal">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Past Poll Results</h2>
              <button
                className="close-btn"
                onClick={() => setShowPastResults(false)}
              >
                ×
              </button>
            </div>
            <PastResults polls={pastPolls} />
          </div>
        </div>
      )}

      {chatOpen && (
        <Chat
          onSendMessage={handleSendMessage}
          userType="teacher"
          userName="Teacher"
        />
      )}
    </div>
  );
};

export default TeacherDashboard;
