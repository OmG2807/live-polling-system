import React, { useState } from 'react';

const StudentNameForm = ({ onSubmit }) => {
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!name.trim()) {
      setError('Please enter your name');
      return;
    }

    if (name.trim().length < 2) {
      setError('Name must be at least 2 characters long');
      return;
    }

    if (name.trim().length > 20) {
      setError('Name must be less than 20 characters');
      return;
    }

    setError('');
    onSubmit(name.trim());
  };

  return (
    <div className="student-name-form">
      <div className="form-container">
        <h1>Join Live Polling Session</h1>
        <p>Enter your name to join the polling session</p>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="studentName">Your Name:</label>
            <input
              id="studentName"
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setError('');
              }}
              placeholder="Enter your name"
              maxLength="20"
              required
              autoFocus
            />
            {error && <span className="error-message">{error}</span>}
          </div>
          
          <button type="submit" className="btn btn-primary">
            Join Session
          </button>
        </form>
      </div>
    </div>
  );
};

export default StudentNameForm;
