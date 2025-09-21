import { useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import io from 'socket.io-client';
import {
  setCurrentPoll,
  updatePollResults,
  updateTimeRemaining,
  endPoll,
  setPastPolls,
  setError,
} from '../store/pollSlice';
import {
  setConnected as setStudentConnected,
  setHasAnswered,
  setError as setStudentError,
} from '../store/studentSlice';
import {
  setConnected as setTeacherConnected,
  addStudent,
  removeStudent,
  setError as setTeacherError,
} from '../store/teacherSlice';
import {
  addMessage,
} from '../store/chatSlice';

const useSocket = (userType) => {
  const socketRef = useRef(null);
  const dispatch = useDispatch();

  useEffect(() => {
    // Initialize socket connection
    socketRef.current = io('http://localhost:5000');

    const socket = socketRef.current;

    // Common event handlers
    socket.on('error', (error) => {
      console.error('Socket error:', error);
      if (userType === 'teacher') {
        dispatch(setTeacherError(error));
      } else {
        dispatch(setStudentError(error));
      }
    });

    // Poll-related events
    socket.on('poll-question', (pollData) => {
      dispatch(setCurrentPoll(pollData));
    });

    socket.on('poll-update', (results) => {
      dispatch(updatePollResults(results));
    });

    socket.on('poll-results', (results) => {
      dispatch(updatePollResults(results));
      dispatch(endPoll());
    });

    socket.on('poll-ended', () => {
      dispatch(endPoll());
    });

    socket.on('time-update', (timeRemaining) => {
      dispatch(updateTimeRemaining(timeRemaining));
    });

    // Chat events
    socket.on('new-message', (message) => {
      dispatch(addMessage(message));
    });

    // Past results
    socket.on('past-results', (results) => {
      dispatch(setPastPolls(results));
    });

    // Teacher-specific events
    if (userType === 'teacher') {
      socket.on('teacher-connected', () => {
        dispatch(setTeacherConnected(true));
      });

      socket.on('student-joined', (student) => {
        dispatch(addStudent(student));
      });

      socket.on('student-left', (student) => {
        dispatch(removeStudent(student));
      });

      socket.on('student-removed', (student) => {
        dispatch(removeStudent(student));
      });

      socket.on('poll-created', (results) => {
        dispatch(updatePollResults(results));
      });
    }

    // Student-specific events
    if (userType === 'student') {
      socket.on('student-connected', () => {
        dispatch(setStudentConnected(true));
      });

      socket.on('answer-submitted', (data) => {
        if (data.success) {
          dispatch(setHasAnswered(true));
        }
      });

      socket.on('removed-by-teacher', () => {
        dispatch(setStudentError('You have been removed by the teacher'));
      });
    }

    // Cleanup on unmount
    return () => {
      socket.disconnect();
    };
  }, [dispatch, userType]);

  return socketRef.current;
};

export default useSocket;
