import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  message: '',
  notificationClass: 'notification',
  timeoutID: undefined
}

const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    newNotification(state, action) {
      clearTimeout(state.timeoutID)
      const notification = action.payload
      return notification
    },
    clearNotification() {
      return {
        message: '',
        notificationClass: 'notification',
        timeoutID: undefined
      }
    }
  }
})

export const setNotification = (message, timeout) => {
  return async (dispatch) => {
    const timeoutID = setTimeout(() => {
      dispatch(clearNotification())
    }, timeout * 1000)
    dispatch(
      newNotification({ message, notificationClass: 'notification', timeoutID })
    )
  }
}

export const setError = (message, timeout) => {
  return async (dispatch) => {
    const timeoutID = setTimeout(() => {
      dispatch(clearNotification())
    }, timeout * 1000)
    dispatch(
      newNotification({ message, notificationClass: 'error', timeoutID })
    )
  }
}

export const { newNotification, clearNotification } = notificationSlice.actions
export default notificationSlice.reducer
