import React, { useState, useEffect } from 'react';

const PollQuestion = ({ poll, timeRemaining, onAnswerSubmit, hasAnswered, currentAnswer }) => {
  const [selectedAnswer, setSelectedAnswer] = useState(currentAnswer || '');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (currentAnswer) {
      setSelectedAnswer(currentAnswer);
    }
  }, [currentAnswer]);

  const handleAnswerSelect = (answer) => {
    if (!hasAnswered && timeRemaining > 0) {
      setSelectedAnswer(answer);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedAnswer) {
      alert('Please select an answer');
      return;
    }

    if (hasAnswered) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      await onAnswerSubmit(selectedAnswer);
    } catch (error) {
      console.error('Error submitting answer:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getTimeColor = () => {
    if (timeRemaining <= 10) return '#f44336';
    if (timeRemaining <= 30) return '#ff9800';
    return '#4caf50';
  };

  return (
    <div className="poll-question">
      <div className="question-header">
        <h2>Poll Question</h2>
        <div className="timer" style={{ color: getTimeColor() }}>
          <span className="timer-icon">⏱️</span>
          <span className="timer-text">{formatTime(timeRemaining)}</span>
        </div>
      </div>

      <div className="question-content">
        <h3>{poll.question}</h3>
        
        <form onSubmit={handleSubmit}>
          <div className="options-list">
            {poll.options.map((option, index) => (
              <div
                key={index}
                className={`option-item ${
                  selectedAnswer === option ? 'selected' : ''
                } ${hasAnswered ? 'disabled' : ''}`}
                onClick={() => handleAnswerSelect(option)}
              >
                <input
                  type="radio"
                  id={`option-${index}`}
                  name="poll-answer"
                  value={option}
                  checked={selectedAnswer === option}
                  onChange={() => handleAnswerSelect(option)}
                  disabled={hasAnswered || timeRemaining <= 0}
                />
                <label htmlFor={`option-${index}`}>
                  {option}
                </label>
              </div>
            ))}
          </div>

          <div className="submit-section">
            {hasAnswered ? (
              <div className="answered-message">
                <p>✅ You have answered: <strong>{selectedAnswer}</strong></p>
                <p>Waiting for other students to finish...</p>
              </div>
            ) : timeRemaining <= 0 ? (
              <div className="time-up-message">
                <p>⏰ Time's up! Results will be shown shortly.</p>
              </div>
            ) : (
              <button
                type="submit"
                className="btn btn-primary"
                disabled={!selectedAnswer || isSubmitting}
              >
                {isSubmitting ? 'Submitting...' : 'Submit Answer'}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default PollQuestion;
