import React from 'react';

const PastResults = ({ polls }) => {
  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleString();
  };

  const getTotalResponses = (results) => {
    return Object.values(results).reduce((sum, count) => sum + count, 0);
  };

  const getPercentage = (count, total) => {
    if (total === 0) return 0;
    return Math.round((count / total) * 100);
  };

  const getMaxVotes = (results) => {
    return Math.max(...Object.values(results));
  };

  if (!polls || polls.length === 0) {
    return (
      <div className="past-results">
        <p>No past polls available</p>
      </div>
    );
  }

  return (
    <div className="past-results">
      <div className="polls-list">
        {polls.map((poll) => {
          const totalResponses = getTotalResponses(poll.results);
          const maxVotes = getMaxVotes(poll.results);

          return (
            <div key={poll.id} className="past-poll-item">
              <div className="poll-header">
                <h4>{poll.question}</h4>
                <div className="poll-meta">
                  <span className="poll-date">{formatDate(poll.createdAt)}</span>
                  <span className="poll-responses">
                    {totalResponses} response{totalResponses !== 1 ? 's' : ''}
                  </span>
                </div>
              </div>

              <div className="poll-options">
                {poll.options.map((option, index) => {
                  const count = poll.results[option] || 0;
                  const percentage = getPercentage(count, totalResponses);
                  const isLeading = count === maxVotes && count > 0;

                  return (
                    <div key={index} className={`option-result ${isLeading ? 'leading' : ''}`}>
                      <div className="option-header">
                        <span className="option-text">{option}</span>
                        <span className="option-stats">
                          {count} ({percentage}%)
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
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PastResults;
