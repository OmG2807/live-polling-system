import React from 'react';

const PollResults = ({ results, isLive = false }) => {
  if (!results) {
    return (
      <div className="poll-results">
        <h2>Poll Results</h2>
        <p>No poll results available</p>
      </div>
    );
  }

  const { question, options, results: voteCounts, totalResponses, timeRemaining } = results;

  const getPercentage = (count) => {
    if (totalResponses === 0) return 0;
    return Math.round((count / totalResponses) * 100);
  };

  const getMaxVotes = () => {
    return Math.max(...Object.values(voteCounts));
  };

  const maxVotes = getMaxVotes();

  return (
    <div className="poll-results">
      <div className="results-header">
        <h2>Poll Results</h2>
        {isLive && timeRemaining > 0 && (
          <div className="live-indicator">
            <span className="live-dot"></span>
            <span>LIVE - {timeRemaining}s remaining</span>
          </div>
        )}
      </div>

      <div className="question">
        <h3>{question}</h3>
      </div>

      <div className="results-stats">
        <p>Total Responses: {totalResponses}</p>
      </div>

      <div className="results-list">
        {options.map((option, index) => {
          const count = voteCounts[option] || 0;
          const percentage = getPercentage(count);
          const isLeading = count === maxVotes && count > 0;

          return (
            <div key={index} className={`result-item ${isLeading ? 'leading' : ''}`}>
              <div className="option-header">
                <span className="option-text">{option}</span>
                <span className="vote-count">
                  {count} vote{count !== 1 ? 's' : ''} ({percentage}%)
                </span>
              </div>
              <div className="progress-bar">
                <div
                  className="progress-fill"
                  style={{ width: `${percentage}%` }}
                ></div>
              </div>
            </div>
          );
        })}
      </div>

      {totalResponses === 0 && (
        <div className="no-responses">
          <p>No responses yet. Waiting for students to answer...</p>
        </div>
      )}
    </div>
  );
};

export default PollResults;
