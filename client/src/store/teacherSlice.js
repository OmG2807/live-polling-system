import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isConnected: false,
  students: [],
  loading: false,
  error: null,
};

const teacherSlice = createSlice({
  name: 'teacher',
  initialState,
  reducers: {
    setConnected: (state, action) => {
      state.isConnected = action.payload;
    },
    addStudent: (state, action) => {
      const existingIndex = state.students.findIndex(s => s.id === action.payload.id);
      if (existingIndex === -1) {
        state.students.push(action.payload);
      }
    },
    removeStudent: (state, action) => {
      state.students = state.students.filter(s => s.id !== action.payload.id);
    },
    updateStudents: (state, action) => {
      state.students = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const {
  setConnected,
  addStudent,
  removeStudent,
  updateStudents,
  setLoading,
  setError,
  clearError,
} = teacherSlice.actions;

export default teacherSlice.reducer;
