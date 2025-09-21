import React from 'react';

const StudentList = ({ students, onRemoveStudent, currentPoll }) => {
  const getStudentStatus = (student) => {
    if (!currentPoll) return 'waiting';
    if (student.hasAnswered) return 'answered';
    return 'answering';
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'answered': return '#4CAF50';
      case 'answering': return '#FF9800';
      default: return '#9E9E9E';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'answered': return 'Answered';
      case 'answering': return 'Answering...';
      default: return 'Waiting';
    }
  };

  return (
    <div className="student-list">
      <h3>Students ({students.length})</h3>
      
      {students.length === 0 ? (
        <p className="no-students">No students connected</p>
      ) : (
        <div className="students-container">
          {students.map((student) => {
            const status = getStudentStatus(student);
            return (
              <div key={student.id} className="student-item">
                <div className="student-info">
                  <span className="student-name">{student.name}</span>
                  <span
                    className="student-status"
                    style={{ color: getStatusColor(status) }}
                  >
                    {getStatusText(status)}
                  </span>
                </div>
                <button
                  className="remove-student-btn"
                  onClick={() => onRemoveStudent(student.id)}
                  title="Remove student"
                >
                  ×
                </button>
              </div>
            );
          })}
        </div>
      )}

      {currentPoll && (
        <div className="poll-progress">
          <div className="progress-info">
            <span>
              {students.filter(s => s.hasAnswered).length} / {students.length} answered
            </span>
          </div>
          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{
                width: `${students.length > 0 ? (students.filter(s => s.hasAnswered).length / students.length) * 100 : 0}%`
              }}
            ></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentList;
