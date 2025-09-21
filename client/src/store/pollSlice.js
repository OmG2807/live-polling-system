import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  currentPoll: null,
  pollResults: null,
  timeRemaining: 0,
  isPollActive: false,
  pastPolls: [],
  loading: false,
  error: null,
};

const pollSlice = createSlice({
  name: 'poll',
  initialState,
  reducers: {
    setCurrentPoll: (state, action) => {
      state.currentPoll = action.payload;
      state.isPollActive = true;
      state.timeRemaining = action.payload?.timeRemaining || 0;
    },
    updatePollResults: (state, action) => {
      state.pollResults = action.payload;
    },
    updateTimeRemaining: (state, action) => {
      state.timeRemaining = action.payload;
    },
    endPoll: (state) => {
      state.isPollActive = false;
      state.currentPoll = null;
      state.timeRemaining = 0;
    },
    setPastPolls: (state, action) => {
      state.pastPolls = action.payload;
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
  setCurrentPoll,
  updatePollResults,
  updateTimeRemaining,
  endPoll,
  setPastPolls,
  setLoading,
  setError,
  clearError,
} = pollSlice.actions;

export default pollSlice.reducer;
