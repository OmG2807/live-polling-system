import React, { useState } from 'react';

const CreatePollForm = ({ onCreatePoll, canCreatePoll }) => {
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState(['', '']);
  const [timeLimit, setTimeLimit] = useState(60);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleOptionChange = (index, value) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const addOption = () => {
    if (options.length < 6) {
      setOptions([...options, '']);
    }
  };

  const removeOption = (index) => {
    if (options.length > 2) {
      const newOptions = options.filter((_, i) => i !== index);
      setOptions(newOptions);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!question.trim()) {
      alert('Please enter a question');
      return;
    }

    const validOptions = options.filter(opt => opt.trim() !== '');
    if (validOptions.length < 2) {
      alert('Please provide at least 2 options');
      return;
    }

    setIsSubmitting(true);
    
    try {
      await onCreatePoll({
        question: question.trim(),
        options: validOptions,
        timeLimit,
      });
      
      // Reset form
      setQuestion('');
      setOptions(['', '']);
      setTimeLimit(60);
    } catch (error) {
      console.error('Error creating poll:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="create-poll-form">
      <h2>Create New Poll</h2>
      
      {!canCreatePoll && (
        <div className="warning-message">
          <p>⚠️ Cannot create new poll until all students have answered the current question.</p>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="question">Question:</label>
          <textarea
            id="question"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Enter your poll question..."
            rows="3"
            required
            disabled={!canCreatePoll || isSubmitting}
          />
        </div>

        <div className="form-group">
          <label>Options:</label>
          {options.map((option, index) => (
            <div key={index} className="option-input">
              <input
                type="text"
                value={option}
                onChange={(e) => handleOptionChange(index, e.target.value)}
                placeholder={`Option ${index + 1}`}
                required
                disabled={!canCreatePoll || isSubmitting}
              />
              {options.length > 2 && (
                <button
                  type="button"
                  onClick={() => removeOption(index)}
                  className="remove-option-btn"
                  disabled={!canCreatePoll || isSubmitting}
                >
                  ×
                </button>
              )}
            </div>
          ))}
          
          {options.length < 6 && (
            <button
              type="button"
              onClick={addOption}
              className="add-option-btn"
              disabled={!canCreatePoll || isSubmitting}
            >
              + Add Option
            </button>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="timeLimit">Time Limit (seconds):</label>
          <input
            id="timeLimit"
            type="number"
            value={timeLimit}
            onChange={(e) => setTimeLimit(Math.max(10, Math.min(300, parseInt(e.target.value) || 60)))}
            min="10"
            max="300"
            disabled={!canCreatePoll || isSubmitting}
          />
        </div>

        <button
          type="submit"
          className="btn btn-primary"
          disabled={!canCreatePoll || isSubmitting}
        >
          {isSubmitting ? 'Creating...' : 'Create Poll'}
        </button>
      </form>
    </div>
  );
};

export default CreatePollForm;
