import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import useSocket from '../hooks/useSocket';
import StudentNameForm from './StudentNameForm';
import PollQuestion from './PollQuestion';
import PollResults from './PollResults';
import Chat from './Chat';
import {
  setName,
  setCurrentAnswer,
  resetStudent,
} from '../store/studentSlice';

const StudentDashboard = () => {
  const dispatch = useDispatch();
  const socket = useSocket('student');
  const { name, isConnected, hasAnswered, currentAnswer } = useSelector((state) => state.student);
  const { currentPoll, pollResults, timeRemaining } = useSelector((state) => state.poll);
  const { isOpen: chatOpen } = useSelector((state) => state.chat);

  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    if (socket && name) {
      socket.emit('student-join', name);
    }
  }, [socket, name]);

  useEffect(() => {
    if (currentPoll && timeRemaining <= 0) {
      setShowResults(true);
    }
  }, [timeRemaining, currentPoll]);

  const handleNameSubmit = (studentName) => {
    dispatch(setName(studentName));
  };

  const handleAnswerSubmit = (answer) => {
    if (socket && currentPoll) {
      socket.emit('submit-answer', {
        pollId: currentPoll.id,
        answer,
      });
      dispatch(setCurrentAnswer(answer));
    }
  };

  const handleSendMessage = (message) => {
    if (socket) {
      socket.emit('send-message', {
        message,
        senderType: 'student',
        senderName: name,
      });
    }
  };

  // Reset student state when new poll starts
  useEffect(() => {
    if (currentPoll && !hasAnswered) {
      dispatch(resetStudent());
      setShowResults(false);
    }
  }, [currentPoll, hasAnswered, dispatch]);

  if (!name) {
    return <StudentNameForm onSubmit={handleNameSubmit} />;
  }

  if (!isConnected) {
    return (
      <div className="student-dashboard">
        <div className="loading">
          <h2>Connecting to server...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="student-dashboard">
      <header className="dashboard-header">
        <h1>Student Dashboard</h1>
        <div className="student-info">
          <span>Welcome, {name}!</span>
        </div>
      </header>

      <div className="dashboard-content">
        {currentPoll && !showResults && (
          <div className="poll-section">
            <PollQuestion
              poll={currentPoll}
              timeRemaining={timeRemaining}
              onAnswerSubmit={handleAnswerSubmit}
              hasAnswered={hasAnswered}
              currentAnswer={currentAnswer}
            />
          </div>
        )}

        {(showResults || (currentPoll && timeRemaining <= 0)) && pollResults && (
          <div className="results-section">
            <PollResults results={pollResults} isLive={false} />
          </div>
        )}

        {!currentPoll && (
          <div className="waiting-section">
            <h2>Waiting for Poll</h2>
            <p>Your teacher will start a poll soon. Stay tuned!</p>
          </div>
        )}
      </div>

      {chatOpen && (
        <Chat
          onSendMessage={handleSendMessage}
          userType="student"
        />
      )}
    </div>
  );
};

export default StudentDashboard;
