# Live Polling System - Intervue.io SDE Intern Assignment

A real-time polling system built with React, Express.js, and Socket.io for interactive classroom polling sessions.

## Features

### Teacher Features
- ✅ Create new polls with custom questions and options
- ✅ View live polling results in real-time
- ✅ Manage student participation
- ✅ Configure poll time limits (10-300 seconds)
- ✅ Remove students from sessions
- ✅ View past poll results
- ✅ Chat with students

### Student Features
- ✅ Enter unique name on first visit
- ✅ Submit answers to active polls
- ✅ View live polling results after submission
- ✅ 60-second default time limit with countdown
- ✅ Chat with teacher and peers

### Technical Features
- ✅ Real-time updates using Socket.io
- ✅ Redux state management
- ✅ Responsive design
- ✅ Modern UI with gradient themes
- ✅ Error handling and validation

## Technology Stack

- **Frontend**: React 18, Redux Toolkit, Socket.io Client
- **Backend**: Express.js, Socket.io, Node.js
- **Styling**: CSS3 with modern design patterns
- **Real-time**: WebSocket connections via Socket.io

## Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Quick Start

1. **Clone and Install Dependencies**
   ```bash
   git clone <repository-url>
   cd live-polling-system
   npm run install-all
   ```

2. **Start Development Servers**
   ```bash
   npm run dev
   ```
   This will start both the backend server (port 5000) and frontend development server (port 3000).

3. **Access the Application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

### Manual Setup

If you prefer to run servers separately:

**Backend Server:**
```bash
cd server
npm install
npm run dev
```

**Frontend Client:**
```bash
cd client
npm install
npm start
```

## Usage Instructions

### For Teachers
1. Open the application in your browser
2. Select "Teacher" role
3. Create a new poll with your question and options
4. Set the time limit (default: 60 seconds)
5. Monitor live results as students respond
6. Use the student list to manage participants
7. Access past poll results for analytics
8. Use the chat feature to communicate with students

### For Students
1. Open the application in a new tab/window
2. Select "Student" role
3. Enter your name (must be unique per session)
4. Wait for the teacher to start a poll
5. Answer the poll question within the time limit
6. View live results after submission
7. Use the chat feature to communicate

## API Endpoints

### REST API
- `GET /api/health` - Server health check
- `GET /api/stats` - Current session statistics

### Socket.io Events

#### Teacher Events
- `teacher-join` - Join as teacher
- `create-poll` - Create new poll
- `remove-student` - Remove student from session
- `get-past-results` - Retrieve past poll results
- `send-message` - Send chat message

#### Student Events
- `student-join` - Join as student with name
- `submit-answer` - Submit poll answer
- `send-message` - Send chat message

#### Server Events
- `poll-question` - New poll question broadcast
- `poll-update` - Live results update
- `poll-results` - Final poll results
- `time-update` - Timer countdown
- `new-message` - New chat message

## Project Structure

```
live-polling-system/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── pages/         # Page components
│   │   ├── store/         # Redux store and slices
│   │   ├── hooks/         # Custom hooks
│   │   └── utils/         # Utility functions
│   └── package.json
├── server/                # Express.js backend
│   ├── index.js          # Main server file
│   └── package.json
├── package.json          # Root package.json
└── README.md
```

## Key Components

### Frontend Components
- `HomePage` - Role selection and landing page
- `TeacherDashboard` - Teacher interface with poll creation and management
- `StudentDashboard` - Student interface with poll participation
- `CreatePollForm` - Form for creating new polls
- `PollQuestion` - Poll question display with timer
- `PollResults` - Live and final results display
- `StudentList` - Student management for teachers
- `Chat` - Real-time chat component
- `PastResults` - Historical poll results

### Backend Features
- Real-time Socket.io server
- In-memory data storage (for demo purposes)
- Poll validation and management
- Student session management
- Timer functionality
- Chat message handling

## Deployment

### One-click GitHub CI Deploys (Recommended)

#### Frontend (Netlify)
1. Push this repo to GitHub.
2. In Netlify, New site from Git → pick this repo.
3. Build settings:
   - Base directory: `client`
   - Build command: `npm install && npm run build`
   - Publish directory: `build`
4. Environment variables (Site settings → Build & deploy → Environment):
   - `REACT_APP_SERVER_URL=https://<your-server-hostname>`
5. Deploy; note the site URL (e.g., `https://live-polling-system-intervue.netlify.app`).

#### Backend (Render)
1. In Render, Create new → Web Service → From GitHub → pick this repo.
2. Service settings:
   - Root Directory: `server`
   - Build Command: `npm install`
   - Start Command: `node index.js`
   - Environment: `Node`
3. Environment variables:
   - `CLIENT_ORIGINS=https://<your-netlify-site>,http://localhost:3000`
   - `NODE_VERSION=18`
4. Deploy; copy the server URL (e.g., `https://your-app.onrender.com`).
5. Back in Netlify, set `REACT_APP_SERVER_URL` to that server URL and redeploy.

### Backend Deployment (Alternative: Railway/Fly/Heroku)
Follow similar steps: deploy `server/`, set `CLIENT_ORIGINS`, and use the resulting URL for `REACT_APP_SERVER_URL` in Netlify.

### Environment Variables
```bash
PORT=5000                         # Backend server port
NODE_ENV=production               # Environment mode
# Server CORS/Socket.IO allowed origins (comma-separated)
CLIENT_ORIGINS=http://localhost:3000,https://live-polling-system-intervue.netlify.app
# Client build-time server URL (Netlify Site settings)
REACT_APP_SERVER_URL=https://your-server-hostname
```

## Testing the Application

1. **Start the servers** using `npm run dev`
2. **Open multiple browser tabs** to simulate teacher and students
3. **Test teacher flow**:
   - Create a poll
   - Monitor live results
   - Remove students
   - View past results
4. **Test student flow**:
   - Join with different names
   - Answer polls
   - View results
   - Use chat
5. **Test real-time features**:
   - Verify live updates
   - Test timer functionality
   - Check chat messages

## Assignment Requirements Compliance

### Must-Have Requirements ✅
- [x] Functional system with all core features working
- [x] Hosting capability for both frontend and backend
- [x] Teacher can create polls and students can answer them
- [x] Both teacher and student can view poll results
- [x] UI follows modern design principles

### Good-to-Have Features ✅
- [x] Configurable poll time limit by teacher (10-300 seconds)
- [x] Option for teacher to remove a student
- [x] Well-designed user interface with modern styling

### Bonus Features ✅
- [x] Chat popup for interaction between students and teachers
- [x] Teacher can view past poll results (stored in memory for session)

## Browser Compatibility

- Chrome 80+
- Firefox 75+
- Safari 13+
- Edge 80+

## Contributing

This is an assignment submission for Intervue.io SDE Intern position. For questions or issues, please contact the development team.

## License

This project is created for educational and assessment purposes as part of the Intervue.io SDE Intern application process.
