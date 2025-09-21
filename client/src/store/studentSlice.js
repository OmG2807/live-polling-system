import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  name: '',
  isConnected: false,
  hasAnswered: false,
  currentAnswer: null,
  loading: false,
  error: null,
};

const studentSlice = createSlice({
  name: 'student',
  initialState,
  reducers: {
    setName: (state, action) => {
      state.name = action.payload;
    },
    setConnected: (state, action) => {
      state.isConnected = action.payload;
    },
    setHasAnswered: (state, action) => {
      state.hasAnswered = action.payload;
    },
    setCurrentAnswer: (state, action) => {
      state.currentAnswer = action.payload;
    },
    resetStudent: (state) => {
      state.hasAnswered = false;
      state.currentAnswer = null;
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
  setName,
  setConnected,
  setHasAnswered,
  setCurrentAnswer,
  resetStudent,
  setLoading,
  setError,
  clearError,
} = studentSlice.actions;

export default studentSlice.reducer;
