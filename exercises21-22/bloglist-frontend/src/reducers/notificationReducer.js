import { createSlice } from '@reduxjs/toolkit';

const initialState = null;

const notificationSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    createNotification(state, action) {
      return action.payload;
    },
    clearNotification(state) {
      return null;
    },
  },
});

export const { createNotification, clearNotification } =
  notificationSlice.actions;
export default notificationSlice.reducer;

export const setNotification = (message, secondsToShow) => {
  return async (dispatch) => {
    dispatch(createNotification(message));
    setTimeout(() => {
      dispatch(clearNotification());
    }, secondsToShow * 1000);
  };
};
