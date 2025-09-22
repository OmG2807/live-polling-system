const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');

const app = express();
const server = http.createServer(app);

// Allow CORS from environment-provided origin (e.g., Netlify) or localhost by default
const ALLOWED_ORIGIN = process.env.CLIENT_ORIGIN || 'http://localhost:3000';

const io = socketIo(server, {
  cors: {
    origin: ALLOWED_ORIGIN,
    methods: ["GET", "POST"],
    credentials: true,
  }
});

app.use(cors({ origin: ALLOWED_ORIGIN, methods: ["GET", "POST"], credentials: true }));
app.use(express.json());

// In-memory storage (for demo purposes)
let polls = new Map();
let students = new Map();
let currentPoll = null;
let pollTimer = null;

// Helper function to get poll results
const getPollResults = (pollId) => {
  const poll = polls.get(pollId);
  if (!poll) return null;

  const results = {};
  poll.options.forEach(option => {
    results[option] = 0;
  });

  poll.responses.forEach(response => {
    if (results[response.answer] !== undefined) {
      results[response.answer]++;
    }
  });

  return {
    question: poll.question,
    options: poll.options,
    results,
    totalResponses: poll.responses.length,
    timeLimit: poll.timeLimit,
    timeRemaining: poll.timeRemaining
  };
};

// Socket.io connection handling
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // Teacher joins
  socket.on('teacher-join', () => {
    socket.join('teachers');
    socket.emit('teacher-connected');
    
    // Send current poll state if exists
    if (currentPoll) {
      socket.emit('poll-update', getPollResults(currentPoll.id));
    }
  });

  // Student joins
  socket.on('student-join', (studentName) => {
    if (!studentName || studentName.trim() === '') {
      socket.emit('error', 'Name is required');
      return;
    }

    // Check if name is already taken in this session
    const existingStudent = Array.from(students.values()).find(s => s.name === studentName.trim());
    if (existingStudent && existingStudent.socketId !== socket.id) {
      socket.emit('error', 'Name already taken');
      return;
    }

    const student = {
      id: socket.id,
      name: studentName.trim(),
      socketId: socket.id,
      hasAnswered: false
    };

    students.set(socket.id, student);
    socket.join('students');
    socket.emit('student-connected', student);

    // Send current poll if exists
    if (currentPoll) {
      socket.emit('poll-question', {
        id: currentPoll.id,
        question: currentPoll.question,
        options: currentPoll.options,
        timeRemaining: currentPoll.timeRemaining
      });
    }

    // Notify teachers about new student
    io.to('teachers').emit('student-joined', {
      id: student.id,
      name: student.name
    });
  });

  // Teacher creates a new poll
  socket.on('create-poll', (pollData) => {
    const { question, options, timeLimit = 60 } = pollData;

    // Validation: Check if teacher can ask a new question
    if (currentPoll) {
      const allStudentsAnswered = Array.from(students.values()).every(student => student.hasAnswered);
      if (!allStudentsAnswered) {
        socket.emit('error', 'Cannot create new poll until all students have answered the current one');
        return;
      }
    }

    // Reset student answer status
    students.forEach(student => {
      student.hasAnswered = false;
    });

    const pollId = uuidv4();
    const poll = {
      id: pollId,
      question,
      options,
      timeLimit: timeLimit * 1000, // Convert to milliseconds
      timeRemaining: timeLimit,
      responses: [],
      createdAt: new Date()
    };

    polls.set(pollId, poll);
    currentPoll = poll;

    // Start timer
    if (pollTimer) {
      clearInterval(pollTimer);
    }

    pollTimer = setInterval(() => {
      currentPoll.timeRemaining--;
      
      // Broadcast time update
      io.emit('time-update', currentPoll.timeRemaining);

      if (currentPoll.timeRemaining <= 0) {
        clearInterval(pollTimer);
        pollTimer = null;
        
        // Show results to everyone
        io.emit('poll-results', getPollResults(pollId));
        io.emit('poll-ended');
      }
    }, 1000);

    // Broadcast new poll to all students
    io.to('students').emit('poll-question', {
      id: pollId,
      question,
      options,
      timeRemaining: timeLimit
    });

    // Notify teachers
    io.to('teachers').emit('poll-created', getPollResults(pollId));
  });

  // Student submits answer
  socket.on('submit-answer', (data) => {
    const { pollId, answer } = data;
    const student = students.get(socket.id);

    if (!student) {
      socket.emit('error', 'Student not found');
      return;
    }

    if (!currentPoll || currentPoll.id !== pollId) {
      socket.emit('error', 'No active poll');
      return;
    }

    if (currentPoll.timeRemaining <= 0) {
      socket.emit('error', 'Poll time has expired');
      return;
    }

    if (student.hasAnswered) {
      socket.emit('error', 'You have already answered this poll');
      return;
    }

    // Validate answer
    if (!currentPoll.options.includes(answer)) {
      socket.emit('error', 'Invalid answer option');
      return;
    }

    // Record response
    currentPoll.responses.push({
      studentId: socket.id,
      studentName: student.name,
      answer,
      timestamp: new Date()
    });

    student.hasAnswered = true;

    // Broadcast updated results
    const results = getPollResults(pollId);
    io.emit('poll-update', results);

    // Check if all students have answered
    const allStudentsAnswered = Array.from(students.values()).every(s => s.hasAnswered);
    if (allStudentsAnswered) {
      clearInterval(pollTimer);
      pollTimer = null;
      io.emit('poll-results', results);
      io.emit('poll-ended');
    }

    socket.emit('answer-submitted', { success: true });
  });

  // Teacher removes a student
  socket.on('remove-student', (studentId) => {
    const student = students.get(studentId);
    if (student) {
      students.delete(studentId);
      io.to(studentId).emit('removed-by-teacher');
      io.to('teachers').emit('student-removed', { id: studentId, name: student.name });
    }
  });

  // Chat functionality
  socket.on('send-message', (messageData) => {
    const { message, senderType, senderName } = messageData;
    const chatMessage = {
      id: uuidv4(),
      message,
      senderType, // 'teacher' or 'student'
      senderName,
      timestamp: new Date()
    };

    io.emit('new-message', chatMessage);
  });

  // Get past poll results
  socket.on('get-past-results', () => {
    const pastResults = Array.from(polls.values()).map(poll => ({
      id: poll.id,
      question: poll.question,
      options: poll.options,
      totalResponses: poll.responses.length,
      createdAt: poll.createdAt,
      results: getPollResults(poll.id).results
    }));

    socket.emit('past-results', pastResults);
  });

  // Disconnect handling
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
    
    const student = students.get(socket.id);
    if (student) {
      students.delete(socket.id);
      io.to('teachers').emit('student-left', { id: socket.id, name: student.name });
    }
  });
});

// API Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Live Polling System Server' });
});

app.get('/api/stats', (req, res) => {
  res.json({
    activeStudents: students.size,
    totalPolls: polls.size,
    currentPoll: currentPoll ? {
      id: currentPoll.id,
      question: currentPoll.question,
      timeRemaining: currentPoll.timeRemaining
    } : null
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
