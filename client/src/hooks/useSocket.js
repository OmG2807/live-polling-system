import { useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import io from 'socket.io-client';
import {
  setCurrentPoll,
  updatePollResults,
  updateTimeRemaining,
  endPoll,
  setPastPolls,
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
    const serverUrl = process.env.NODE_ENV === 'production'
      ? process.env.REACT_APP_SERVER_URL
      : 'http://localhost:5000';

    // If production and no server URL configured, surface a clear error
    if (process.env.NODE_ENV === 'production' && !serverUrl) {
      console.error('REACT_APP_SERVER_URL is not set. Unable to connect to server.');
    }

    socketRef.current = io(serverUrl, {
      transports: ['websocket', 'polling'],
      withCredentials: true,
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      timeout: 20000,
    });

    const socket = socketRef.current;

    // Connection event handler
    socket.on('connect', () => {
      console.log('Socket connected:', socket.id);
      if (userType === 'teacher') {
        dispatch(setTeacherConnected(true));
      } else {
        dispatch(setStudentConnected(true));
      }
    });

    socket.on('disconnect', () => {
      console.log('Socket disconnected');
      if (userType === 'teacher') {
        dispatch(setTeacherConnected(false));
      } else {
        dispatch(setStudentConnected(false));
      }
    });

    socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
      if (userType === 'teacher') {
        dispatch(setTeacherError('Failed to connect to server'));
        dispatch(setTeacherConnected(false));
      } else {
        dispatch(setStudentError('Failed to connect to server'));
        dispatch(setStudentConnected(false));
      }
    });

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
