import { configureStore } from '@reduxjs/toolkit';
import pollReducer from './pollSlice';
import studentReducer from './studentSlice';
import teacherReducer from './teacherSlice';
import chatReducer from './chatSlice';

export const store = configureStore({
  reducer: {
    poll: pollReducer,
    student: studentReducer,
    teacher: teacherReducer,
    chat: chatReducer,
  },
});

export default store;
